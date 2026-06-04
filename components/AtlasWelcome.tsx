"use client";

import { Landmark, Building2, MessageCircle } from "lucide-react";

export function AtlasWelcome({
  onStartResearch,
}: {
  onStartResearch: (mode: string, query: string) => void;
}) {
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

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <p className="font-mono-label text-stone mb-3">PROPRIETARY AI RESEARCH SYSTEM</p>
      <h1 className="font-newsreader text-4xl text-ink mb-2">Atlas IQ</h1>
      <p className="text-stone text-sm mb-10 text-center max-w-md">
        Sponsor-ready market research and company analysis, powered by PE-specific intelligence.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
        {modes.map(({ mode, label, icon: Icon, description, placeholder }) => (
          <button
            key={mode}
            type="button"
            onClick={() => {
              const query = prompt(placeholder) || "";
              if (query.trim()) onStartResearch(mode, query);
            }}
            className="group text-left bg-paper border border-line/80 p-5 hover:border-accent/45 transition-colors"
          >
            <div className="flex items-center gap-2 mb-3">
              <Icon size={16} strokeWidth={1.5} className="text-accent" />
              <span className="font-mono-label text-accent">{label}</span>
            </div>
            <p className="text-sm text-stone leading-relaxed">{description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
