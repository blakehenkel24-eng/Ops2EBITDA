import { beforeEach, expect, test, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createDeal: vi.fn(),
  deleteDeal: vi.fn(),
  deleteStorageObjects: vi.fn(),
  getMandate: vi.fn(),
  insertDocument: vi.fn(),
  listDealDocuments: vi.fn(),
  listDeals: vi.fn(),
  setDocumentDigest: vi.fn(),
  updateDeal: vi.fn(),
  uploadToStorage: vi.fn(),
  extractPdfText: vi.fn(),
  digestDocumentText: vi.fn(),
}));

vi.mock("@/lib/atlas/deal", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/atlas/deal")>()),
  ...mocks,
}));
vi.mock("@/lib/atlas/digest", () => ({
  extractPdfText: mocks.extractPdfText,
  digestDocumentText: mocks.digestDocumentText,
}));

import { MAX_PDF_BYTES, POST as uploadDocument } from "@/app/api/atlas/deal-document/route";
import { GET as getDeals, POST as postDeal } from "@/app/api/atlas/deals/route";
import { DELETE as deleteDealRoute, PATCH as patchDeal } from "@/app/api/atlas/deals/[id]/route";

const DEAL_ID = "123e4567-e89b-42d3-a456-426614174000";

beforeEach(() => {
  vi.clearAllMocks();
  mocks.deleteStorageObjects.mockResolvedValue(true);
  mocks.uploadToStorage.mockResolvedValue(true);
});

test("deal document listing rejects non-UUID filters", async () => {
  const response = await getDeals(new Request("http://localhost/api/atlas/deals?documentsFor=1%26select%3D*"));
  expect(response.status).toBe(400);
  expect(mocks.listDealDocuments).not.toHaveBeenCalled();
});

test("deal creation rejects oversized names", async () => {
  const response = await postDeal(new Request("http://localhost/api/atlas/deals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "x".repeat(201) }),
  }));
  expect(response.status).toBe(400);
  expect(mocks.createDeal).not.toHaveBeenCalled();
});

test("deal patch rejects invalid enum values", async () => {
  const response = await patchDeal(new Request("http://localhost", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ stage: "invented" }),
  }), { params: Promise.resolve({ id: DEAL_ID }) });
  expect(response.status).toBe(400);
  expect(mocks.updateDeal).not.toHaveBeenCalled();
});

test("deal deletion returns 404 when no row was deleted", async () => {
  mocks.deleteDeal.mockResolvedValue(false);
  const response = await deleteDealRoute(new Request("http://localhost", { method: "DELETE" }), {
    params: Promise.resolve({ id: DEAL_ID }),
  });
  expect(response.status).toBe(404);
});

test("PDF upload rejects spoofed MIME content", async () => {
  const form = new FormData();
  form.set("dealId", DEAL_ID);
  form.set("file", new File(["not a pdf"], "memo.pdf", { type: "application/pdf" }));
  const response = await uploadDocument(new Request("http://localhost", { method: "POST", body: form }));
  expect(response.status).toBe(400);
  expect(mocks.uploadToStorage).not.toHaveBeenCalled();
});

test("PDF upload rejects files over the size limit before reading them", async () => {
  const form = new FormData();
  form.set("dealId", DEAL_ID);
  form.set("file", new File([new Uint8Array(MAX_PDF_BYTES + 1)], "large.pdf", { type: "application/pdf" }));
  const response = await uploadDocument(new Request("http://localhost", { method: "POST", body: form }));
  expect(response.status).toBe(413);
  expect(mocks.uploadToStorage).not.toHaveBeenCalled();
});

test("document insert failure removes uploaded object and sanitizes filename", async () => {
  mocks.insertDocument.mockRejectedValue(new Error("database unavailable"));
  const form = new FormData();
  form.set("dealId", DEAL_ID);
  form.set("file", new File(["%PDF-1.4\n"], "../secret?.pdf", { type: "application/pdf" }));
  const response = await uploadDocument(new Request("http://localhost", { method: "POST", body: form }));
  expect(response.status).toBe(500);
  expect(mocks.insertDocument).toHaveBeenCalledWith(expect.objectContaining({ filename: "secret_.pdf" }));
  const uploadedPath = mocks.uploadToStorage.mock.calls[0][0] as string;
  expect(uploadedPath).toMatch(new RegExp(`^${DEAL_ID}/[0-9a-f-]+-secret_\\.pdf$`));
  expect(mocks.deleteStorageObjects).toHaveBeenCalledWith([uploadedPath]);
});
