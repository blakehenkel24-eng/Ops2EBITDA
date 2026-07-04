"use client";

import { useCallback, useEffect, useState } from "react";
import { Layers, X, Upload, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import type { Deal, DealDocument, DealStage, DealType, ValueLever } from "@/lib/atlas/deal-types";

const STAGES: DealStage[] = ["sourced", "screening", "ioi", "loi", "diligence", "ic", "closed", "passed"];
const TYPES: DealType[] = ["platform", "bolt_on", "tuck_in", "carve_out", "other"];
const LEVERS: { id: ValueLever; label: string }[] = [
  { id: "organic_growth", label: "Organic growth" },
  { id: "margin_expansion", label: "Margin expansion" },
  { id: "buy_and_build", label: "Buy-and-build" },
  { id: "multiple_expansion", label: "Multiple exp." },
  { id: "deleveraging", label: "Deleveraging" },
];

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

  return (
    <aside className={`deal-workspace-panel ${open ? "is-open" : ""}`} aria-hidden={!open} inert={!open}>
      <div className="flex h-14 items-center justify-between border-b border-line/45 px-4">
        <div className="flex items-center gap-2">
          <Layers size={15} strokeWidth={1.7} className="text-accent" />
          <span className="font-mono-label text-[0.68rem] text-ink">Deal workspace</span>
        </div>
        <button type="button" onClick={onClose} aria-label="Close deal workspace" className="text-stone/70">
          <X size={15} strokeWidth={1.8} />
        </button>
      </div>

      <div className="border-b border-line/35 p-3">
        <select
          className="deal-workspace-field"
          value={active?.id ?? ""}
          onChange={(e) => (e.target.value === "__new" ? newDeal() : onActiveDealChange(e.target.value))}
        >
          {deals.length === 0 && <option value="">No deals yet</option>}
          {deals.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          <option value="__new">+ New deal</option>
        </select>
      </div>

      {active ? (
        <div className="flex flex-col gap-5 p-4">
          <section className="flex flex-col gap-2">
            <Label>Basics</Label>
            <input className="deal-workspace-field" placeholder="Deal name" value={active.name}
              onChange={(e) => patchActive({ name: e.target.value })} />
            <input className="deal-workspace-field" placeholder="Target company" value={active.target ?? ""}
              onChange={(e) => patchActive({ target: e.target.value })} />
            <input className="deal-workspace-field" placeholder="Sector" value={active.sector ?? ""}
              onChange={(e) => patchActive({ sector: e.target.value })} />
            <div className="flex gap-2">
              <select className="deal-workspace-field" value={active.stage ?? ""}
                onChange={(e) => patchActive({ stage: (e.target.value || null) as DealStage })}>
                <option value="">Stage…</option>
                {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <select className="deal-workspace-field" value={active.deal_type ?? ""}
                onChange={(e) => patchActive({ deal_type: (e.target.value || null) as DealType })}>
                <option value="">Type…</option>
                {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </section>

          <section className="flex flex-col gap-2">
            <Label>Documents</Label>
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center gap-2 rounded-lg border border-line/40 px-3 py-2 text-xs">
                <span className="flex-1 truncate">{doc.filename}</span>
                <DocStatusBadge status={doc.status} />
              </div>
            ))}
            <label className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-line/60 px-3 py-2 text-xs text-stone/70 cursor-pointer">
              {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
              Upload CIM, QoE, deck…
              <input type="file" accept="application/pdf" className="hidden" disabled={uploading}
                onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f, inferDocType(f.name)); e.target.value = ""; }} />
            </label>
          </section>

          <section className="flex flex-col gap-2">
            <Label>Thesis &amp; focus</Label>
            <textarea className="deal-workspace-field min-h-[88px] resize-y" placeholder="Investment thesis, focus, risks to watch…"
              value={active.thesis ?? ""} onChange={(e) => patchActive({ thesis: e.target.value })} />
            <div className="flex flex-wrap gap-1.5">
              {LEVERS.map((l) => (
                <button key={l.id} type="button" onClick={() => toggleLever(l.id)}
                  className={`rounded-full px-2.5 py-1 text-[11px] border ${active.levers.includes(l.id) ? "bg-accent/10 text-accent border-accent/30" : "text-stone/70 border-line/40"}`}>
                  {l.label}
                </button>
              ))}
            </div>
          </section>
        </div>
      ) : (
        <div className="p-4 text-sm leading-6 text-stone/65">
          Create a deal to give Atlas persistent context — basics, documents, and your thesis feed every answer.
        </div>
      )}
    </aside>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <span className="font-mono-label text-[0.6rem] uppercase tracking-wide text-stone/55">{children}</span>;
}

function DocStatusBadge({ status }: { status: DealDocument["status"] }) {
  if (status === "ready") return <span className="flex items-center gap-1 text-emerald-600"><CheckCircle2 size={13} />Ready</span>;
  if (status === "failed") return <span className="flex items-center gap-1 text-red-500"><AlertCircle size={13} />Failed</span>;
  return <span className="flex items-center gap-1 text-stone/60"><Loader2 size={13} className="animate-spin" />Reading…</span>;
}

function inferDocType(filename: string): string {
  const f = filename.toLowerCase();
  if (f.includes("cim")) return "cim";
  if (f.includes("qoe") || f.includes("quality")) return "qoe";
  if (f.includes("deck") || f.includes("presentation")) return "mgmt_deck";
  return "other";
}
