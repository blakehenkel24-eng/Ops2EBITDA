"use client";

import { useState } from "react";
import { Landmark, Building2, MessageCircle, ArrowRight } from "lucide-react";

export function AtlasWelcome({
  onStartResearch,
}: {
  onStartResearch: (mode: string, query: string) => void;
}) {
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const modes = [
    {
      mode: "market",
      label: "Market Mode",
      icon: Landmark,
      description: "Sector analysis — market size, fragmentation, M&A activity, sponsor thesis.",
      placeholder: "e.g., Commercial landscaping services",
    },
    {
      mode: "company",
      label: "Company Mode",
      icon: Building2,
      description: "Target evaluation — business overview, sponsor fit, red flags, platform potential.",
      placeholder: "e.g., ServiceMaster Holdings",
    },
    {
      mode: "chat",
      label: "Chat Mode",
      icon: MessageCircle,
      description: "Conversational research — follow-ups, pressure-test thesis, dig into subsectors.",
      placeholder: "e.g., What KPIs matter for distribution?",
    },
  ];

  const selected = modes.find((m) => m.mode === selectedMode);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMode && query.trim()) {
      onStartResearch(selectedMode, query.trim());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <p className="font-mono-label text-stone mb-3">PROPRIETARY AI RESEARCH SYSTEM</p>
      <h1 className="font-newsreader text-4xl text-ink mb-2">Atlas IQ</h1>
      <p className="text-stone text-sm mb-10 text-center max-w-md">
        Sponsor-ready market research and company analysis, powered by PE-specific intelligence.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
        {modes.map(({ mode, label, icon: Icon, description }) => (
          <button
            key={mode}
            type="button"
            onClick={() => {
              setSelectedMode(mode);
              setQuery("");
            }}
            className={`group text-left bg-paper border p-5 transition-colors ${
              selectedMode === mode
                ? "border-accent/60 bg-accent-soft/30"
                : "border-line/80 hover:border-accent/45"
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <Icon size={16} strokeWidth={1.5} className="text-accent" />
              <span className="font-mono-label text-accent">{label}</span>
            </div>
            <p className="text-sm text-stone leading-relaxed">{description}</p>
          </button>
        ))}
      </div>

      {selected && (
        <form onSubmit={handleSubmit} className="mt-8 w-full max-w-xl flex items-center gap-3">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={selected.placeholder}
            className="flex-1 bg-bone border border-line/80 rounded-lg px-4 py-3 text-sm text-ink placeholder:text-stone focus:outline-none focus:border-accent/50 transition-colors font-geist"
          />
          <button
            type="submit"
            disabled={!query.trim()}
            className="bg-accent text-white px-4 py-3 rounded-lg flex items-center gap-2 font-mono-label text-sm disabled:opacity-40 transition-opacity"
          >
            Go
            <ArrowRight size={14} strokeWidth={1.5} />
          </button>
        </form>
      )}
    </div>
  );
}
