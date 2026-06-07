"use client";

import { useState } from "react";
import { Landmark, Building2, ArrowRight, X } from "lucide-react";

export function AtlasWelcome({
  onStartResearch,
}: {
  onStartResearch: (mode: string, query: string) => void;
}) {
  const [expandedCard, setExpandedCard] = useState<"market" | "company" | null>(null);
  const [marketQuery, setMarketQuery] = useState("");
  const [companyQuery, setCompanyQuery] = useState("");

  const handleMarketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (marketQuery.trim()) onStartResearch("market", marketQuery.trim());
  };

  const handleCompanySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (companyQuery.trim()) onStartResearch("company", companyQuery.trim());
  };

  return (
    <div className="flex flex-col items-center px-4 pt-10 pb-6">
      <p className="font-mono-label text-stone mb-2 text-xs tracking-wider">
        PROPRIETARY AI RESEARCH SYSTEM
      </p>
      <h1 className="font-newsreader text-3xl text-ink mb-1">Atlas IQ</h1>
      <p className="text-stone text-sm mb-8 text-center max-w-sm">
        Ask anything below, or generate a full report.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
        {/* Market Report Card */}
        <div
          className={`bg-paper border transition-all ${
            expandedCard === "market"
              ? "border-accent/50 shadow-sm"
              : "border-line/80"
          }`}
        >
          <button
            type="button"
            onClick={() => {
              setExpandedCard(expandedCard === "market" ? null : "market");
              setMarketQuery("");
            }}
            className="w-full text-left p-4 flex items-start justify-between gap-3"
          >
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Landmark size={15} strokeWidth={1.5} className="text-accent" />
                <span className="font-mono-label text-accent text-xs">MARKET REPORT</span>
              </div>
              <p className="text-sm text-stone leading-relaxed">
                Sector analysis — market size, fragmentation, M&A activity, sponsor thesis.
              </p>
            </div>
            {expandedCard === "market" && (
              <X size={14} className="text-stone mt-0.5 shrink-0" />
            )}
          </button>

          {expandedCard === "market" && (
            <form onSubmit={handleMarketSubmit} className="px-4 pb-4 pt-0">
              <label className="block text-xs font-mono-label text-stone mb-1.5">
                SECTOR OR INDUSTRY
              </label>
              <div className="flex gap-2">
                <input
                  autoFocus
                  value={marketQuery}
                  onChange={(e) => setMarketQuery(e.target.value)}
                  placeholder="e.g., Commercial landscaping services"
                  className="flex-1 bg-bone border border-line/80 rounded px-3 py-2 text-sm text-ink placeholder:text-stone/60 focus:outline-none focus:border-accent/50 transition-colors font-geist"
                />
                <button
                  type="submit"
                  disabled={!marketQuery.trim()}
                  className="bg-accent text-white px-3 py-2 rounded flex items-center gap-1.5 font-mono-label text-xs disabled:opacity-40 transition-opacity whitespace-nowrap"
                >
                  Generate
                  <ArrowRight size={12} strokeWidth={1.5} />
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Company Report Card */}
        <div
          className={`bg-paper border transition-all ${
            expandedCard === "company"
              ? "border-accent/50 shadow-sm"
              : "border-line/80"
          }`}
        >
          <button
            type="button"
            onClick={() => {
              setExpandedCard(expandedCard === "company" ? null : "company");
              setCompanyQuery("");
            }}
            className="w-full text-left p-4 flex items-start justify-between gap-3"
          >
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Building2 size={15} strokeWidth={1.5} className="text-accent" />
                <span className="font-mono-label text-accent text-xs">COMPANY REPORT</span>
              </div>
              <p className="text-sm text-stone leading-relaxed">
                Target evaluation — business overview, sponsor fit, red flags, platform potential.
              </p>
            </div>
            {expandedCard === "company" && (
              <X size={14} className="text-stone mt-0.5 shrink-0" />
            )}
          </button>

          {expandedCard === "company" && (
            <form onSubmit={handleCompanySubmit} className="px-4 pb-4 pt-0">
              <label className="block text-xs font-mono-label text-stone mb-1.5">
                COMPANY NAME
              </label>
              <div className="flex gap-2">
                <input
                  autoFocus
                  value={companyQuery}
                  onChange={(e) => setCompanyQuery(e.target.value)}
                  placeholder="e.g., ServiceMaster Holdings"
                  className="flex-1 bg-bone border border-line/80 rounded px-3 py-2 text-sm text-ink placeholder:text-stone/60 focus:outline-none focus:border-accent/50 transition-colors font-geist"
                />
                <button
                  type="submit"
                  disabled={!companyQuery.trim()}
                  className="bg-accent text-white px-3 py-2 rounded flex items-center gap-1.5 font-mono-label text-xs disabled:opacity-40 transition-opacity whitespace-nowrap"
                >
                  Generate
                  <ArrowRight size={12} strokeWidth={1.5} />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
