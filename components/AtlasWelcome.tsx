"use client";

import { useState } from "react";
import { Landmark, Building2, ArrowRight, X, ChevronDown, TrendingUp, AlertTriangle, MessageSquareText, BarChart3 } from "lucide-react";

const SUGGESTIONS = [
  {
    icon: TrendingUp,
    text: "Top value creation levers for HVAC roll-ups",
  },
  {
    icon: AlertTriangle,
    text: "Red flags in a facilities management target",
  },
  {
    icon: MessageSquareText,
    text: "What makes a good PE platform in waste services?",
  },
  {
    icon: BarChart3,
    text: "Compare maintenance vs. project revenue quality",
  },
];

interface AtlasWelcomeProps {
  onStartResearch: (mode: string, query: string) => void;
  onSuggestion: (text: string) => void;
}

export function AtlasWelcome({ onStartResearch, onSuggestion }: AtlasWelcomeProps) {
  const [expanded, setExpanded] = useState<"market" | "company" | null>(null);

  return (
    <div className="atlas-chat-welcome">
      {/* Centered content */}
      <div className="flex flex-col items-center">
        {/* AI icon */}
        <div className="atlas-ai-icon mb-5" style={{ width: "3rem", height: "3rem" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>

        <h1 className="font-newsreader text-3xl text-ink md:text-4xl">
          What can I help you research?
        </h1>
        <p className="mt-3 max-w-lg text-[15px] leading-7 text-stone font-geist">
          Market maps, target screens, diligence agendas, and thesis pressure-tests grounded in PE operating patterns.
        </p>
      </div>

      {/* Suggestion grid or expanded form */}
      <div className="mt-8 w-full max-w-2xl mx-auto">
        {expanded === "market" ? (
          <MarketReportForm
            onSubmit={(query) => {
              onStartResearch("market", query);
              setExpanded(null);
            }}
            onCancel={() => setExpanded(null)}
          />
        ) : expanded === "company" ? (
          <CompanyReportForm
            onSubmit={(query) => {
              onStartResearch("company", query);
              setExpanded(null);
            }}
            onCancel={() => setExpanded(null)}
          />
        ) : (
          <>
            {/* Suggestion cards */}
            <div className="grid gap-2.5 sm:grid-cols-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s.text}
                  type="button"
                  onClick={() => onSuggestion(s.text)}
                  className="atlas-welcome-action"
                >
                  <s.icon size={16} strokeWidth={1.5} className="text-stone/50 shrink-0 mt-0.5" />
                  <span className="text-[13px] text-ink/80 font-geist leading-relaxed text-left">
                    {s.text}
                  </span>
                </button>
              ))}
            </div>

            {/* Deep research buttons */}
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setExpanded("market")}
                className="flex items-center gap-2 rounded-full border border-line/40 bg-transparent px-4 py-2 text-xs font-geist text-stone/70 transition-all hover:border-accent/30 hover:text-accent hover:bg-accent/4"
              >
                <Landmark size={13} strokeWidth={1.5} />
                Deep market research
              </button>
              <button
                type="button"
                onClick={() => setExpanded("company")}
                className="flex items-center gap-2 rounded-full border border-line/40 bg-transparent px-4 py-2 text-xs font-geist text-stone/70 transition-all hover:border-accent/30 hover:text-accent hover:bg-accent/4"
              >
                <Building2 size={13} strokeWidth={1.5} />
                Deep company research
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* -- Shared form primitives ---------------------------------------- */

function FormLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[11px] font-medium text-stone/55 mb-1 font-geist">
      {children}
    </label>
  );
}

function FormInput({
  value,
  onChange,
  placeholder,
  autoFocus,
  required,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  autoFocus?: boolean;
  required?: boolean;
}) {
  return (
    <input
      autoFocus={autoFocus}
      required={required}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg bg-[oklch(98%_0.004_240)] border border-line/40 px-3 py-2 text-sm text-ink placeholder:text-stone/30 focus:outline-none focus:border-accent/40 focus:ring-2 focus:ring-accent/8 transition-all font-geist"
    />
  );
}

function FormSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-lg bg-[oklch(98%_0.004_240)] border border-line/40 px-3 py-2 pr-8 text-sm text-ink focus:outline-none focus:border-accent/40 focus:ring-2 focus:ring-accent/8 transition-all font-geist cursor-pointer"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={12}
        strokeWidth={2}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone/40 pointer-events-none"
      />
    </div>
  );
}

function FormTextarea({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={2}
      className="w-full resize-none rounded-lg bg-[oklch(98%_0.004_240)] border border-line/40 px-3 py-2 text-sm text-ink placeholder:text-stone/30 focus:outline-none focus:border-accent/40 focus:ring-2 focus:ring-accent/8 transition-all font-geist leading-relaxed"
    />
  );
}

/* -- Geography + angle options ------------------------------------- */

const GEO_OPTIONS = [
  { value: "north-america", label: "North America" },
  { value: "europe", label: "Europe" },
  { value: "asia-pacific", label: "Asia-Pacific" },
  { value: "latin-america", label: "Latin America" },
  { value: "global", label: "Global" },
];

const MARKET_ANGLE_OPTIONS = [
  { value: "platform-build", label: "Platform build" },
  { value: "add-on-mapping", label: "Add-on mapping" },
  { value: "sector-screen", label: "Sector screen" },
  { value: "general", label: "General research" },
];

const DEAL_CONTEXT_OPTIONS = [
  { value: "platform", label: "Platform acquisition" },
  { value: "add-on", label: "Add-on target" },
  { value: "competitive-intel", label: "Competitive intel" },
  { value: "general", label: "General research" },
];

/* -- Market report form -------------------------------------------- */

function MarketReportForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (query: string) => void;
  onCancel: () => void;
}) {
  const [sector, setSector] = useState("");
  const [geo, setGeo] = useState("north-america");
  const [marketSize, setMarketSize] = useState("");
  const [angle, setAngle] = useState("platform-build");
  const [questions, setQuestions] = useState("");

  const canSubmit = sector.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    const parts: string[] = [sector.trim()];
    const geoLabel = GEO_OPTIONS.find((o) => o.value === geo)?.label;
    if (geoLabel) parts.push(`Geography: ${geoLabel}`);
    if (marketSize.trim()) parts.push(`Estimated market size: ${marketSize.trim()}`);
    const angleLabel = MARKET_ANGLE_OPTIONS.find((o) => o.value === angle)?.label;
    if (angleLabel && angle !== "general") parts.push(`Investment angle: ${angleLabel}`);
    if (questions.trim()) parts.push(`Key questions: ${questions.trim()}`);

    onSubmit(parts.join(". ") + ".");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-2xl border border-line/40 bg-[oklch(99.5%_0.002_240)] p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/10">
            <Landmark size={12} strokeWidth={1.5} className="text-accent" />
          </div>
          <span className="text-sm font-medium text-ink font-geist">Market research</span>
          <button
            type="button"
            onClick={onCancel}
            className="ml-auto rounded-full p-1 text-stone/40 hover:text-stone hover:bg-stone/8 transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="col-span-2 sm:col-span-1">
            <FormLabel>Sector / Industry *</FormLabel>
            <FormInput autoFocus required value={sector} onChange={setSector} placeholder="e.g. commercial landscaping" />
          </div>
          <div>
            <FormLabel>Geography</FormLabel>
            <FormSelect value={geo} onChange={setGeo} options={GEO_OPTIONS} />
          </div>
          <div>
            <FormLabel>Market size estimate</FormLabel>
            <FormInput value={marketSize} onChange={setMarketSize} placeholder="e.g. $5-8B" />
          </div>
          <div>
            <FormLabel>Investment angle</FormLabel>
            <FormSelect value={angle} onChange={setAngle} options={MARKET_ANGLE_OPTIONS} />
          </div>
        </div>

        <div className="mb-4">
          <FormLabel>Key questions or focus areas</FormLabel>
          <FormTextarea
            value={questions}
            onChange={setQuestions}
            placeholder="e.g. fragmentation level, typical margin profiles, regulatory tailwinds"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!canSubmit}
            className="rounded-full bg-accent text-[oklch(98%_0.004_240)] px-5 py-2 flex items-center gap-1.5 text-sm font-medium font-geist disabled:opacity-25 transition-opacity hover:opacity-90"
          >
            Generate report
            <ArrowRight size={14} strokeWidth={2} />
          </button>
        </div>
      </div>
    </form>
  );
}

/* -- Company report form ------------------------------------------- */

function CompanyReportForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (query: string) => void;
  onCancel: () => void;
}) {
  const [company, setCompany] = useState("");
  const [sector, setSector] = useState("");
  const [context, setContext] = useState("platform");
  const [revenue, setRevenue] = useState("");
  const [concerns, setConcerns] = useState("");

  const canSubmit = company.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    const parts: string[] = [company.trim()];
    if (sector.trim()) parts.push(`Sector: ${sector.trim()}`);
    const ctxLabel = DEAL_CONTEXT_OPTIONS.find((o) => o.value === context)?.label;
    if (ctxLabel && context !== "general") parts.push(`Deal context: ${ctxLabel}`);
    if (revenue.trim()) parts.push(`Estimated revenue: ${revenue.trim()}`);
    if (concerns.trim()) parts.push(`Specific concerns: ${concerns.trim()}`);

    onSubmit(parts.join(". ") + ".");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-2xl border border-line/40 bg-[oklch(99.5%_0.002_240)] p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/10">
            <Building2 size={12} strokeWidth={1.5} className="text-accent" />
          </div>
          <span className="text-sm font-medium text-ink font-geist">Company research</span>
          <button
            type="button"
            onClick={onCancel}
            className="ml-auto rounded-full p-1 text-stone/40 hover:text-stone hover:bg-stone/8 transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="col-span-2 sm:col-span-1">
            <FormLabel>Company name *</FormLabel>
            <FormInput autoFocus required value={company} onChange={setCompany} placeholder="e.g. ServiceMaster Holdings" />
          </div>
          <div>
            <FormLabel>Sector / Industry</FormLabel>
            <FormInput value={sector} onChange={setSector} placeholder="e.g. facility services" />
          </div>
          <div>
            <FormLabel>Deal context</FormLabel>
            <FormSelect value={context} onChange={setContext} options={DEAL_CONTEXT_OPTIONS} />
          </div>
          <div>
            <FormLabel>Revenue estimate</FormLabel>
            <FormInput value={revenue} onChange={setRevenue} placeholder="e.g. $20-50M" />
          </div>
        </div>

        <div className="mb-4">
          <FormLabel>Specific concerns or questions</FormLabel>
          <FormTextarea
            value={concerns}
            onChange={setConcerns}
            placeholder="e.g. customer concentration, contract structure, management depth"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!canSubmit}
            className="rounded-full bg-accent text-[oklch(98%_0.004_240)] px-5 py-2 flex items-center gap-1.5 text-sm font-medium font-geist disabled:opacity-25 transition-opacity hover:opacity-90"
          >
            Generate report
            <ArrowRight size={14} strokeWidth={2} />
          </button>
        </div>
      </div>
    </form>
  );
}

/* -- Report buttons (below input, non-fullPage only) --------------- */

export function AtlasReportButtons({
  onStartResearch,
}: {
  onStartResearch: (mode: string, query: string) => void;
}) {
  const [expanded, setExpanded] = useState<"market" | "company" | null>(null);

  if (expanded === "market") {
    return (
      <div className="px-4 md:px-8 pb-2 max-w-3xl mx-auto">
        <MarketReportForm
          onSubmit={(query) => {
            onStartResearch("market", query);
            setExpanded(null);
          }}
          onCancel={() => setExpanded(null)}
        />
      </div>
    );
  }

  if (expanded === "company") {
    return (
      <div className="px-4 md:px-8 pb-2 max-w-3xl mx-auto">
        <CompanyReportForm
          onSubmit={(query) => {
            onStartResearch("company", query);
            setExpanded(null);
          }}
          onCancel={() => setExpanded(null)}
        />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-4 md:px-8 pb-2 max-w-3xl mx-auto">
      <button
        type="button"
        onClick={() => setExpanded("market")}
        className="flex items-center gap-1.5 rounded-full border border-line/40 px-3 py-1.5 text-xs font-geist text-stone/60 hover:border-accent/30 hover:text-accent hover:bg-accent/4 transition-all"
      >
        <Landmark size={11} strokeWidth={1.5} />
        Market Report
      </button>
      <button
        type="button"
        onClick={() => setExpanded("company")}
        className="flex items-center gap-1.5 rounded-full border border-line/40 px-3 py-1.5 text-xs font-geist text-stone/60 hover:border-accent/30 hover:text-accent hover:bg-accent/4 transition-all"
      >
        <Building2 size={11} strokeWidth={1.5} />
        Company Report
      </button>
    </div>
  );
}
