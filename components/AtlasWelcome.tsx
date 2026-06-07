"use client";

import { useState } from "react";
import { Landmark, Building2, ArrowRight, X } from "lucide-react";

interface AtlasWelcomeProps {
  onStartResearch: (mode: string, query: string) => void;
}

export function AtlasWelcome({ onStartResearch }: AtlasWelcomeProps) {
  return (
    <div className="flex flex-col items-center justify-center pt-16 pb-8 px-4">
      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mb-5">
        <span className="text-accent font-newsreader text-lg font-semibold">IQ</span>
      </div>
      <h1 className="font-newsreader text-2xl text-ink mb-1">Atlas IQ</h1>
      <p className="text-stone text-sm max-w-xs text-center leading-relaxed">
        PE research copilot. Ask anything, or generate a structured report.
      </p>
    </div>
  );
}

/** Compact report triggers that sit above the chat input */
export function AtlasReportButtons({
  onStartResearch,
}: {
  onStartResearch: (mode: string, query: string) => void;
}) {
  const [expanded, setExpanded] = useState<"market" | "company" | null>(null);
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expanded || !query.trim()) return;
    onStartResearch(expanded, query.trim());
    setExpanded(null);
    setQuery("");
  };

  if (expanded) {
    return (
      <form onSubmit={handleSubmit} className="px-4 md:px-8 pb-2">
        <div className="flex items-center gap-2 mb-1.5">
          {expanded === "market" ? (
            <Landmark size={12} strokeWidth={1.5} className="text-accent" />
          ) : (
            <Building2 size={12} strokeWidth={1.5} className="text-accent" />
          )}
          <span className="font-mono-label text-accent text-[10px]">
            {expanded === "market" ? "MARKET REPORT" : "COMPANY REPORT"}
          </span>
          <button
            type="button"
            onClick={() => { setExpanded(null); setQuery(""); }}
            className="ml-auto text-stone hover:text-ink transition-colors"
          >
            <X size={12} />
          </button>
        </div>
        <div className="flex gap-2">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              expanded === "market"
                ? "Sector or industry, e.g. commercial landscaping"
                : "Company name, e.g. ServiceMaster Holdings"
            }
            className="flex-1 bg-bone border border-line/80 rounded px-3 py-2 text-sm text-ink placeholder:text-stone/50 focus:outline-none focus:border-accent/50 transition-colors font-geist"
          />
          <button
            type="submit"
            disabled={!query.trim()}
            className="bg-accent text-white px-3 py-2 rounded flex items-center gap-1.5 font-mono-label text-[10px] disabled:opacity-30 transition-opacity"
          >
            Generate
            <ArrowRight size={10} strokeWidth={2} />
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="flex items-center gap-2 px-4 md:px-8 pb-2">
      <button
        type="button"
        onClick={() => setExpanded("market")}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-mono-label text-stone border border-line/60 rounded hover:border-accent/40 hover:text-accent transition-colors bg-paper/50"
      >
        <Landmark size={11} strokeWidth={1.5} />
        Market Report
      </button>
      <button
        type="button"
        onClick={() => setExpanded("company")}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-mono-label text-stone border border-line/60 rounded hover:border-accent/40 hover:text-accent transition-colors bg-paper/50"
      >
        <Building2 size={11} strokeWidth={1.5} />
        Company Report
      </button>
    </div>
  );
}
