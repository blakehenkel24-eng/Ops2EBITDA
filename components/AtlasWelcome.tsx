"use client";

import { useState } from "react";
import { Landmark, Building2, ArrowRight, X } from "lucide-react";

interface AtlasWelcomeProps {
  onStartResearch: (mode: string, query: string) => void;
}

export function AtlasWelcome({ onStartResearch }: AtlasWelcomeProps) {
  return (
    <div className="flex flex-col items-center justify-center pt-12 pb-4 px-4">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center mb-5 ring-1 ring-accent/10">
        <span className="text-accent font-newsreader text-lg font-semibold tracking-tight">IQ</span>
      </div>
      <h1 className="font-newsreader text-2xl text-ink mb-1.5 tracking-tight">Atlas IQ</h1>
      <p className="text-stone/70 text-sm max-w-xs text-center leading-relaxed font-geist">
        Your PE research copilot. Ask a question, generate a report, or explore an operating thesis.
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
      <form onSubmit={handleSubmit} className="px-4 md:px-8 pb-2 max-w-3xl mx-auto w-full">
        <div className="border border-accent/30 rounded-xl bg-paper/80 p-3">
          <div className="flex items-center gap-2 mb-2">
            {expanded === "market" ? (
              <Landmark size={12} strokeWidth={1.5} className="text-accent" />
            ) : (
              <Building2 size={12} strokeWidth={1.5} className="text-accent" />
            )}
            <span className="font-mono-label text-accent text-[10px]">
              {expanded === "market" ? "GENERATE MARKET REPORT" : "GENERATE COMPANY REPORT"}
            </span>
            <button
              type="button"
              onClick={() => { setExpanded(null); setQuery(""); }}
              className="ml-auto text-stone/50 hover:text-stone transition-colors"
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
              className="flex-1 bg-bone/50 border border-line/50 rounded-lg px-3 py-2 text-sm text-ink placeholder:text-stone/40 focus:outline-none focus:border-accent/40 transition-colors font-geist"
            />
            <button
              type="submit"
              disabled={!query.trim()}
              className="bg-accent text-white px-3.5 py-2 rounded-lg flex items-center gap-1.5 font-mono-label text-[10px] disabled:opacity-25 transition-opacity"
            >
              Generate
              <ArrowRight size={10} strokeWidth={2} />
            </button>
          </div>
        </div>
      </form>
    );
  }

  return (
    <div className="flex items-center gap-2 px-4 md:px-8 pb-2 max-w-3xl mx-auto">
      <button
        type="button"
        onClick={() => setExpanded("market")}
        className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono-label text-stone/60 border border-line/40 rounded-full hover:border-accent/30 hover:text-accent hover:bg-accent/4 transition-all duration-150"
      >
        <Landmark size={10} strokeWidth={1.5} />
        Market Report
      </button>
      <button
        type="button"
        onClick={() => setExpanded("company")}
        className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono-label text-stone/60 border border-line/40 rounded-full hover:border-accent/30 hover:text-accent hover:bg-accent/4 transition-all duration-150"
      >
        <Building2 size={10} strokeWidth={1.5} />
        Company Report
      </button>
    </div>
  );
}
