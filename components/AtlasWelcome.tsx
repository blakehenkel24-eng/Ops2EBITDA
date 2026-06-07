"use client";

import { useState } from "react";
import { Landmark, Building2, ArrowRight, X, ChevronDown } from "lucide-react";

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

/* ── Shared form primitives ─────────────────────────────── */

function FormLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block font-mono-label text-[10px] text-stone/60 mb-1">
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
      className="w-full bg-bone/50 border border-line/50 rounded-lg px-3 py-2 text-sm text-ink placeholder:text-stone/35 focus:outline-none focus:border-accent/40 transition-colors font-geist"
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
        className="w-full appearance-none bg-bone/50 border border-line/50 rounded-lg px-3 py-2 pr-8 text-sm text-ink focus:outline-none focus:border-accent/40 transition-colors font-geist cursor-pointer"
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
      className="w-full resize-none bg-bone/50 border border-line/50 rounded-lg px-3 py-2 text-sm text-ink placeholder:text-stone/35 focus:outline-none focus:border-accent/40 transition-colors font-geist leading-relaxed"
    />
  );
}

/* ── Geography + angle options ──────────────────────────── */

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

/* ── Market report form ─────────────────────────────────── */

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
    <form onSubmit={handleSubmit} className="px-4 md:px-8 pb-2 max-w-3xl mx-auto w-full">
      <div className="border border-accent/20 rounded-xl bg-paper/90 p-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <Landmark size={13} strokeWidth={1.5} className="text-accent" />
          <span className="font-mono-label text-accent text-[10px]">MARKET REPORT</span>
          <button
            type="button"
            onClick={onCancel}
            className="ml-auto text-stone/40 hover:text-stone transition-colors p-0.5"
          >
            <X size={13} />
          </button>
        </div>

        {/* Fields */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="col-span-2 sm:col-span-1">
            <FormLabel>Sector / Industry *</FormLabel>
            <FormInput
              autoFocus
              required
              value={sector}
              onChange={setSector}
              placeholder="e.g. commercial landscaping"
            />
          </div>
          <div>
            <FormLabel>Geography</FormLabel>
            <FormSelect value={geo} onChange={setGeo} options={GEO_OPTIONS} />
          </div>
          <div>
            <FormLabel>Market size estimate</FormLabel>
            <FormInput
              value={marketSize}
              onChange={setMarketSize}
              placeholder="e.g. $5-8B"
            />
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

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!canSubmit}
            className="bg-accent text-white px-4 py-2 rounded-lg flex items-center gap-1.5 font-mono-label text-[10px] disabled:opacity-25 transition-opacity hover:opacity-90"
          >
            Generate report
            <ArrowRight size={10} strokeWidth={2} />
          </button>
        </div>
      </div>
    </form>
  );
}

/* ── Company report form ────────────────────────────────── */

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
    <form onSubmit={handleSubmit} className="px-4 md:px-8 pb-2 max-w-3xl mx-auto w-full">
      <div className="border border-accent/20 rounded-xl bg-paper/90 p-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <Building2 size={13} strokeWidth={1.5} className="text-accent" />
          <span className="font-mono-label text-accent text-[10px]">COMPANY REPORT</span>
          <button
            type="button"
            onClick={onCancel}
            className="ml-auto text-stone/40 hover:text-stone transition-colors p-0.5"
          >
            <X size={13} />
          </button>
        </div>

        {/* Fields */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="col-span-2 sm:col-span-1">
            <FormLabel>Company name *</FormLabel>
            <FormInput
              autoFocus
              required
              value={company}
              onChange={setCompany}
              placeholder="e.g. ServiceMaster Holdings"
            />
          </div>
          <div>
            <FormLabel>Sector / Industry</FormLabel>
            <FormInput
              value={sector}
              onChange={setSector}
              placeholder="e.g. facility services"
            />
          </div>
          <div>
            <FormLabel>Deal context</FormLabel>
            <FormSelect value={context} onChange={setContext} options={DEAL_CONTEXT_OPTIONS} />
          </div>
          <div>
            <FormLabel>Revenue estimate</FormLabel>
            <FormInput
              value={revenue}
              onChange={setRevenue}
              placeholder="e.g. $20-50M"
            />
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

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!canSubmit}
            className="bg-accent text-white px-4 py-2 rounded-lg flex items-center gap-1.5 font-mono-label text-[10px] disabled:opacity-25 transition-opacity hover:opacity-90"
          >
            Generate report
            <ArrowRight size={10} strokeWidth={2} />
          </button>
        </div>
      </div>
    </form>
  );
}

/* ── Report buttons (collapsed) + forms (expanded) ──────── */

export function AtlasReportButtons({
  onStartResearch,
}: {
  onStartResearch: (mode: string, query: string) => void;
}) {
  const [expanded, setExpanded] = useState<"market" | "company" | null>(null);

  if (expanded === "market") {
    return (
      <MarketReportForm
        onSubmit={(query) => {
          onStartResearch("market", query);
          setExpanded(null);
        }}
        onCancel={() => setExpanded(null)}
      />
    );
  }

  if (expanded === "company") {
    return (
      <CompanyReportForm
        onSubmit={(query) => {
          onStartResearch("company", query);
          setExpanded(null);
        }}
        onCancel={() => setExpanded(null)}
      />
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
