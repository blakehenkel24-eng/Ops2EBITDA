"use client";

import { useCallback, useEffect, useState } from "react";
import { X, Upload, Loader2, Check, AlertCircle } from "lucide-react";
import type { Deal, DealDocument, DealStage, DealType, ValueLever } from "@/lib/atlas/deal-types";

const STAGES: { id: DealStage; label: string }[] = [
  { id: "sourced", label: "Sourced" },
  { id: "screening", label: "Screening" },
  { id: "ioi", label: "IOI" },
  { id: "loi", label: "LOI" },
  { id: "diligence", label: "Diligence" },
  { id: "ic", label: "IC" },
  { id: "closed", label: "Closed" },
  { id: "passed", label: "Passed" },
];
const TYPES: { id: DealType; label: string }[] = [
  { id: "platform", label: "Platform" },
  { id: "bolt_on", label: "Bolt-on" },
  { id: "tuck_in", label: "Tuck-in" },
  { id: "carve_out", label: "Carve-out" },
  { id: "other", label: "Other" },
];
const LEVERS: { id: ValueLever; label: string }[] = [
  { id: "organic_growth", label: "Organic growth" },
  { id: "margin_expansion", label: "Margin expansion" },
  { id: "buy_and_build", label: "Buy-and-build" },
  { id: "multiple_expansion", label: "Multiple exp." },
  { id: "deleveraging", label: "Deleveraging" },
];
const DOC_TAG: Record<string, string> = {
  cim: "CIM", qoe: "QoE", mgmt_deck: "Deck", teaser: "Teaser", other: "Doc",
};

interface Props {
  open: boolean;
  onClose: () => void;
  activeDealId: string | null;
  onActiveDealChange: (id: string | null) => void;
}

export function DealWorkspacePanel({ open, onClose, activeDealId, onActiveDealChange }: Props) {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [documents, setDocuments] = useState<DealDocument[]>([]);
  const [uploading, setUploading] = useState(false);

  const active = deals.find((d) => d.id === activeDealId) ?? null;

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    const loadDeals = async () => {
      try {
        const res = await fetch("/api/atlas/deals");
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        setDeals(data.deals ?? []);
        if (!activeDealId && data.deals?.[0]) onActiveDealChange(data.deals[0].id);
      } catch {
        // Non-fatal: panel opens empty; user can still create a deal.
      }
    };
    loadDeals();
    return () => { cancelled = true; };
  }, [open, activeDealId, onActiveDealChange]);

  useEffect(() => {
    let cancelled = false;
    const loadDocuments = async () => {
      if (!activeDealId) {
        if (!cancelled) setDocuments([]);
        return;
      }
      try {
        const res = await fetch(`/api/atlas/deals?documentsFor=${activeDealId}`);
        const data = await res.json();
        if (!cancelled) setDocuments(data.documents ?? []);
      } catch {
        // Non-fatal: document list is a convenience; chat still works.
      }
    };
    loadDocuments();
    return () => { cancelled = true; };
  }, [activeDealId]);

  const patchActive = useCallback(async (patch: Partial<Deal>) => {
    if (!active) return;
    setDeals((cur) => cur.map((d) => (d.id === active.id ? { ...d, ...patch } : d)));
    await fetch(`/api/atlas/deals/${active.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patch),
    });
  }, [active]);

  const newDeal = useCallback(async () => {
    const res = await fetch("/api/atlas/deals", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: "New deal" }),
    });
    const data = await res.json();
    if (data.deal) { setDeals((c) => [data.deal, ...c]); onActiveDealChange(data.deal.id); }
  }, [onActiveDealChange]);

  const upload = useCallback(async (file: File, docType: string) => {
    if (!active) return;
    setUploading(true);
    const form = new FormData();
    form.append("file", file); form.append("dealId", active.id); form.append("docType", docType);
    try {
      const res = await fetch("/api/atlas/deal-document", { method: "POST", body: form });
      const data = await res.json();
      if (data.document) setDocuments((c) => [...c, data.document]);
    } finally { setUploading(false); }
  }, [active]);

  const toggleLever = useCallback((lever: ValueLever) => {
    if (!active) return;
    const next = active.levers.includes(lever)
      ? active.levers.filter((l) => l !== lever)
      : [...active.levers, lever];
    patchActive({ levers: next });
  }, [active, patchActive]);

  const onSwitch = useCallback((value: string) => {
    if (value === "__new") newDeal();
    else onActiveDealChange(value);
  }, [newDeal, onActiveDealChange]);

  return (
    <aside className={`deal-workspace-panel ${open ? "is-open" : ""}`} aria-hidden={!open} inert={!open}>
      <header className="shrink-0 px-5 pt-4 pb-3.5 border-b border-line/40">
        <div className="mb-2.5 flex items-center justify-between">
          <span className="dw-overline">Deal dossier</span>
          <div className="flex items-center gap-1">
            {deals.length > 0 && (
              <select
                className="dw-switch"
                value={active?.id ?? ""}
                onChange={(e) => onSwitch(e.target.value)}
                aria-label="Switch deal"
              >
                {deals.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                <option value="__new">+ New deal</option>
              </select>
            )}
            <button type="button" onClick={onClose} aria-label="Close deal workspace" className="dw-iconbtn">
              <X size={15} strokeWidth={1.8} />
            </button>
          </div>
        </div>

        {active && (
          <>
            <input
              className="dw-title"
              value={active.name}
              placeholder="Untitled deal"
              onChange={(e) => patchActive({ name: e.target.value })}
            />
            <input
              className="dw-subtitle"
              value={active.target ?? ""}
              placeholder="Target company"
              onChange={(e) => patchActive({ target: e.target.value })}
            />
          </>
        )}
      </header>

      {active ? (
        <div className="min-h-0 flex-1 overflow-y-auto">
          <section className="px-5 py-3.5">
            <div className="dw-row">
              <span className="dw-label">Sector</span>
              <input className="dw-input" placeholder="Add sector" value={active.sector ?? ""}
                onChange={(e) => patchActive({ sector: e.target.value })} />
            </div>
            <div className="dw-row">
              <span className="dw-label">Stage</span>
              <select className="dw-input" value={active.stage ?? ""}
                onChange={(e) => patchActive({ stage: (e.target.value || null) as DealStage })}>
                <option value="">Not set</option>
                {STAGES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>
            <div className="dw-row">
              <span className="dw-label">Type</span>
              <select className="dw-input" value={active.deal_type ?? ""}
                onChange={(e) => patchActive({ deal_type: (e.target.value || null) as DealType })}>
                <option value="">Not set</option>
                {TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
            </div>
          </section>

          <section className="px-5 py-3.5 border-t border-line/40">
            <div className="dw-overline mb-2.5">Documents</div>
            {documents.map((doc) => (
              <div key={doc.id} className="dw-doc">
                <span className="dw-tag">{DOC_TAG[doc.doc_type ?? "other"] ?? "Doc"}</span>
                <span className="flex-1 truncate text-ink/90">{doc.filename}</span>
                <DocStatusBadge status={doc.status} />
              </div>
            ))}
            <label className="dw-upload">
              {uploading
                ? <Loader2 size={14} strokeWidth={1.9} className="animate-spin" />
                : <Upload size={14} strokeWidth={1.9} />}
              {uploading ? "Reading document…" : "Upload CIM, QoE, or deck"}
              <input type="file" accept="application/pdf" className="hidden" disabled={uploading}
                onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f, inferDocType(f.name)); e.target.value = ""; }} />
            </label>
          </section>

          <section className="px-5 py-3.5 border-t border-line/40">
            <div className="dw-overline mb-2.5">Thesis &amp; focus</div>
            <textarea className="dw-thesis" placeholder="Investment thesis, what Atlas should focus on, risks to watch."
              value={active.thesis ?? ""} onChange={(e) => patchActive({ thesis: e.target.value })} />
            <div className="mt-3 flex flex-wrap gap-1.5">
              {LEVERS.map((l) => (
                <button key={l.id} type="button" className="dw-lever"
                  data-on={active.levers.includes(l.id)} onClick={() => toggleLever(l.id)}>
                  {l.label}
                </button>
              ))}
            </div>
          </section>

          <div className="dw-footnote">
            <span className="dw-pulse" aria-hidden="true" />
            Feeds Atlas on every message in this deal
          </div>
        </div>
      ) : (
        <div className="px-5 py-6">
          <p className="max-w-[26ch] text-[0.82rem] leading-6 text-stone/75">
            No active deal. Open one to give Atlas a standing brief: the basics, your documents, and the thesis all feed every answer.
          </p>
          <button type="button" className="dw-newdeal mt-4" onClick={newDeal}>
            New deal
          </button>
        </div>
      )}
    </aside>
  );
}

function DocStatusBadge({ status }: { status: DealDocument["status"] }) {
  if (status === "ready") {
    return <span className="flex items-center gap-1 text-[0.68rem] text-accent"><Check size={12} strokeWidth={2.4} />Ready</span>;
  }
  if (status === "failed") {
    return <span className="flex items-center gap-1 text-[0.68rem] text-red-500"><AlertCircle size={12} strokeWidth={2} />Failed</span>;
  }
  return <span className="flex items-center gap-1 text-[0.68rem] text-stone/60"><Loader2 size={12} className="animate-spin" />Reading</span>;
}

function inferDocType(filename: string): string {
  const f = filename.toLowerCase();
  if (f.includes("cim")) return "cim";
  if (f.includes("qoe") || f.includes("quality")) return "qoe";
  if (f.includes("deck") || f.includes("presentation")) return "mgmt_deck";
  if (f.includes("teaser")) return "teaser";
  return "other";
}
