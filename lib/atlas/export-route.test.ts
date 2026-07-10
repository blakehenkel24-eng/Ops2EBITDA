import { describe, expect, it } from "vitest";
import { POST } from "@/app/api/atlas/export/route";
import type { ResearchMemo } from "./types";

const memo: ResearchMemo = {
  mode: "chat",
  query: "Jewelry Retail. Geography: North America.",
  markdown: "# PE Market Research Memo\n\n## Summary\nFragmented market.",
  sources: [],
  confidence: "medium",
  createdAt: "Jul 4, 2026",
  scores: {},
};

describe("Atlas IQ export route", () => {
  it.each([
    {
      format: "pdf",
      contentType: "application/pdf",
      extension: ".pdf",
      signature: "25504446",
    },
    {
      format: "docx",
      contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      extension: ".docx",
      signature: "504b0304",
    },
  ])("returns a valid $format attachment", async ({ format, contentType, extension, signature }) => {
    const response = await POST(new Request(`http://localhost/api/atlas/export?format=${format}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(memo),
    }));

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe(contentType);
    expect(response.headers.get("Content-Disposition")).toMatch(new RegExp(`atlas-iq-chat-\\d+\\${extension}`));

    const body = Buffer.from(await response.arrayBuffer());
    expect(body.subarray(0, 4).toString("hex")).toBe(signature);
    expect(body.byteLength).toBeGreaterThan(1_000);
  });
});
