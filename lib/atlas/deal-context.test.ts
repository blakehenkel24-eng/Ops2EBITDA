import { expect, test } from "vitest";
import { buildDealContextString } from "@/lib/atlas/deal-context";
import type { DealContextData } from "@/lib/atlas/deal-types";

const base: DealContextData = {
  deal: {
    id: "1", name: "Project Cedar", target: "Apex Facility Services",
    sector: "Industrial services", stage: "screening", deal_type: "platform",
    thesis: "Fragmented roll-up; expand margin via route density.",
    levers: ["buy_and_build", "margin_expansion"],
    created_at: "", updated_at: "",
  },
  documents: [
    { doc_type: "cim", filename: "CIM.pdf", digest: "Revenue $48M, EBITDA $9.2M.", status: "ready" },
    { doc_type: "qoe", filename: "QoE.pdf", digest: null, status: "reading" },
  ],
  mandate: {
    id: "m", sectors: "B2B services", ev_band: "$25-100M", ebitda_band: "$5-15M",
    deal_types: ["platform", "bolt_on"], geography: "US", return_target: "2.5x / 25% IRR",
    updated_at: "",
  },
};

test("includes deal basics, thesis, levers, mandate, and ready digests", () => {
  const out = buildDealContextString(base);
  expect(out).toContain("Project Cedar");
  expect(out).toContain("Apex Facility Services");
  expect(out).toContain("Screening");
  expect(out).toContain("Platform");
  expect(out).toContain("Buy-and-build");
  expect(out).toContain("Fragmented roll-up");
  expect(out).toContain("B2B services");
  expect(out).toContain("[CIM] Revenue $48M");
});

test("omits documents that are not ready", () => {
  const out = buildDealContextString(base);
  expect(out).not.toContain("QoE.pdf");
});

test("returns empty string when there is no deal", () => {
  expect(buildDealContextString(null)).toBe("");
});

test("renders a deal with no documents or mandate without throwing", () => {
  const out = buildDealContextString({
    deal: { ...base.deal, thesis: null, levers: [] },
    documents: [],
    mandate: null,
  });
  expect(out).toContain("Project Cedar");
  expect(out).not.toContain("Document context");
  expect(out).not.toContain("Fund mandate");
});
