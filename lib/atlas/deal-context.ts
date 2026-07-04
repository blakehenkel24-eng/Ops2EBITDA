import type { DealContextData, DealStage, DealType, ValueLever } from "@/lib/atlas/deal-types";

const STAGE_LABEL: Record<DealStage, string> = {
  sourced: "Sourced", screening: "Screening", ioi: "IOI", loi: "LOI",
  diligence: "Diligence", ic: "IC", closed: "Closed", passed: "Passed",
};

const TYPE_LABEL: Record<DealType, string> = {
  platform: "Platform", bolt_on: "Bolt-on", tuck_in: "Tuck-in",
  carve_out: "Carve-out", other: "Other",
};

const LEVER_LABEL: Record<ValueLever, string> = {
  organic_growth: "Organic growth", margin_expansion: "Margin expansion",
  buy_and_build: "Buy-and-build", multiple_expansion: "Multiple expansion",
  deleveraging: "Deleveraging",
};

export function buildDealContextString(data: DealContextData | null): string {
  if (!data) return "";
  const { deal, documents, mandate } = data;

  const lines: string[] = ["Active deal context (private — do not cite as a source):"];

  const title = deal.target ? `${deal.name} — target ${deal.target}` : deal.name;
  lines.push(`Deal: ${title}`);

  const meta: string[] = [];
  if (deal.sector) meta.push(deal.sector);
  if (deal.stage) meta.push(`Stage: ${STAGE_LABEL[deal.stage]}`);
  if (deal.deal_type) meta.push(`Type: ${TYPE_LABEL[deal.deal_type]}`);
  if (meta.length) lines.push(meta.join(" · "));

  if (deal.thesis) lines.push(`Thesis: ${deal.thesis}`);
  if (deal.levers.length) {
    lines.push(`Value levers: ${deal.levers.map((l) => LEVER_LABEL[l]).join(", ")}`);
  }

  if (mandate) {
    const m: string[] = [];
    if (mandate.sectors) m.push(mandate.sectors);
    if (mandate.ev_band) m.push(`${mandate.ev_band} EV`);
    if (mandate.ebitda_band) m.push(`${mandate.ebitda_band} EBITDA`);
    if (mandate.geography) m.push(mandate.geography);
    if (mandate.return_target) m.push(mandate.return_target);
    if (m.length) lines.push(`Fund mandate: ${m.join(", ")}`);
  }

  const ready = documents.filter((d) => d.status === "ready" && d.digest);
  if (ready.length) {
    lines.push("", "Document context:");
    for (const doc of ready) {
      const tag = (doc.doc_type || "doc").toUpperCase();
      lines.push(`[${tag}] ${doc.digest}`);
    }
  }

  lines.push("", "Use this as authoritative deal context. Prefer it over generic assumptions.");
  return lines.join("\n");
}
