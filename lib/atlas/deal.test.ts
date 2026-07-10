import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { DealServiceError, deleteDeal, listDeals, createDeal, getDealContextData } from "@/lib/atlas/deal";

const DEAL_ID = "123e4567-e89b-42d3-a456-426614174000";

beforeEach(() => {
  process.env.SUPABASE_URL = "https://x.supabase.co";
  process.env.SUPABASE_SERVICE_KEY = "svc";
});
afterEach(() => vi.restoreAllMocks());

function mockFetchOnce(body: unknown, ok = true) {
  return vi.spyOn(globalThis, "fetch").mockResolvedValue({
    ok, json: async () => body, text: async () => JSON.stringify(body),
  } as Response);
}

test("listDeals calls PostgREST and returns rows", async () => {
  const spy = mockFetchOnce([{ id: "1", name: "Project Cedar", levers: [] }]);
  const deals = await listDeals();
  expect(deals).toHaveLength(1);
  const url = String(spy.mock.calls[0][0]);
  expect(url).toContain("/rest/v1/deals");
  expect(url).toContain("order=updated_at.desc");
});

test("createDeal posts a name and returns the created row", async () => {
  const spy = mockFetchOnce([{ id: "2", name: "Project Birch", levers: [] }]);
  const deal = await createDeal({ name: "Project Birch" });
  expect(deal?.name).toBe("Project Birch");
  const init = spy.mock.calls[0][1] as RequestInit;
  expect(init.method).toBe("POST");
  expect(String(init.body)).toContain("Project Birch");
});

test("getDealContextData returns null when env is missing", async () => {
  delete process.env.SUPABASE_URL;
  expect(await getDealContextData("1")).toBeNull();
});

test("getDealContextData assembles deal, documents, and mandate", async () => {
  const fetchSpy = vi.spyOn(globalThis, "fetch")
    .mockResolvedValueOnce({ ok: true, json: async () => [{ id: DEAL_ID, name: "Cedar", levers: [] }] } as Response)
    .mockResolvedValueOnce({ ok: true, json: async () => [{ doc_type: "cim", filename: "C.pdf", digest: "d", status: "ready" }] } as Response)
    .mockResolvedValueOnce({ ok: true, json: async () => [{ id: "m", deal_types: [] }] } as Response);
  const data = await getDealContextData(DEAL_ID);
  expect(data?.deal.name).toBe("Cedar");
  expect(data?.documents).toHaveLength(1);
  expect(data?.mandate?.id).toBe("m");
  expect(fetchSpy).toHaveBeenCalledTimes(3);
});

test("PostgREST failures surface as service errors", async () => {
  vi.spyOn(globalThis, "fetch").mockResolvedValue({ ok: false, status: 503 } as Response);
  await expect(listDeals()).rejects.toEqual(expect.objectContaining({
    name: "DealServiceError",
    message: "Deal data service request failed (503)",
  } satisfies Partial<DealServiceError>));
});

test("deleteDeal reports missing rows instead of claiming success", async () => {
  const fetchSpy = vi.spyOn(globalThis, "fetch")
    .mockResolvedValueOnce({ ok: true, json: async () => [] } as Response)
    .mockResolvedValueOnce({ ok: true, json: async () => [] } as Response);
  await expect(deleteDeal(DEAL_ID)).resolves.toBe(false);
  expect(fetchSpy).toHaveBeenCalledTimes(2);
});

test("deleteDeal removes document storage after deleting database row", async () => {
  const fetchSpy = vi.spyOn(globalThis, "fetch")
    .mockResolvedValueOnce({ ok: true, json: async () => [{ storage_path: `${DEAL_ID}/memo.pdf` }] } as Response)
    .mockResolvedValueOnce({ ok: true, json: async () => [{ id: DEAL_ID }] } as Response)
    .mockResolvedValueOnce({ ok: true, json: async () => ({}) } as Response);
  await expect(deleteDeal(DEAL_ID)).resolves.toBe(true);
  const storageCall = fetchSpy.mock.calls[2];
  expect(String(storageCall[0])).toContain("/storage/v1/object/deal-documents");
  expect(storageCall[1]).toEqual(expect.objectContaining({
    method: "DELETE",
    body: JSON.stringify({ prefixes: [`${DEAL_ID}/memo.pdf`] }),
  }));
});
