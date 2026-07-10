import { describe, expect, it } from "vitest";
import { generateMemoPdf } from "./export";
import type { ResearchMemo } from "./types";

function sampleMemo(markdown: string): ResearchMemo {
  return {
    mode: "chat",
    query: "Jewelry Retail. Geography: North America.",
    markdown,
    sources: [],
    confidence: "medium",
    createdAt: "Jul 4, 2026",
    scores: {},
  };
}

describe("Atlas IQ PDF export", () => {
  it("renders markdown structure instead of leaking raw markdown syntax", () => {
    const pdf = generateMemoPdf(sampleMemo([
      "# PE Market Research Memo",
      "> **Executive Read:** Fragmented market with margin pressure.",
      "",
      "## Industry Metrics",
      "| Metric / KPI | Directional Range | Diligence Implication |",
      "|---|---|---|",
      "| Gross margin | **40-85%** | Validate by channel mix |",
      "",
      "### Critical Gaps",
      "- **EBITDA margin:** private benchmark still needed.",
    ].join("\n")));

    const raw = Buffer.from(pdf).toString("latin1");
    expect(raw).toContain("Executive");
    expect(raw).toContain("Read:");
    expect(raw).toContain("Gross margin");
    expect(raw).not.toContain("CHAT MODE");
    expect(raw).not.toContain("CONFIDENCE:");
    expect(raw).not.toContain("0 SOURCES");
    expect(raw).not.toContain("> **Executive Read:**");
    expect(raw).not.toContain("### Critical Gaps");
    expect(raw).not.toContain("|---|---|---|");
    expect(raw).not.toContain("**EBITDA margin:**");
  });
});
