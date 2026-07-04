import { expect, test, vi } from "vitest";

vi.mock("unpdf", () => ({
  extractText: vi.fn(async () => ({ text: ["Revenue was $48M. EBITDA $9.2M."] })),
  getDocumentProxy: vi.fn(async () => ({})),
}));
vi.mock("ai", () => ({
  generateText: vi.fn(async () => ({ text: "Industrial services business. Revenue $48M, EBITDA $9.2M." })),
}));
vi.mock("@/lib/atlas/llm", () => ({ getAtlasModel: () => ({}) }));

import { extractPdfText, digestDocumentText } from "@/lib/atlas/digest";

test("extractPdfText joins page text from unpdf", async () => {
  const text = await extractPdfText(new Uint8Array([1, 2, 3]));
  expect(text).toContain("Revenue was $48M");
});

test("digestDocumentText returns the model summary", async () => {
  const digest = await digestDocumentText("cim", "long raw text...");
  expect(digest).toContain("Revenue $48M");
});

test("digestDocumentText truncates very long input before sending", async () => {
  const ai = await import("ai");
  await digestDocumentText("cim", "x".repeat(200_000));
  const callArg = (ai.generateText as ReturnType<typeof vi.fn>).mock.calls[0][0];
  expect(String(callArg.prompt).length).toBeLessThan(130_000);
});
