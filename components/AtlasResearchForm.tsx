"use client";

import { useState } from "react";
import { ArrowRight, X } from "lucide-react";

interface AtlasResearchFormProps {
  mode: "market" | "company";
  onSubmit: (query: string) => void;
  onClose: () => void;
}

export function AtlasResearchForm({ mode, onSubmit, onClose }: AtlasResearchFormProps) {
  const [sector, setSector] = useState("");
  const [geography, setGeography] = useState("");
  const [company, setCompany] = useState("");
  const [focus, setFocus] = useState("");

  const isValid = mode === "market" ? sector.trim().length > 0 : company.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    let query = "";
    if (mode === "market") {
      query = sector.trim();
      if (geography.trim()) query += ` in ${geography.trim()}`;
      if (focus.trim()) query += ` — focus on ${focus.trim()}`;
    } else {
      query = company.trim();
      if (sector.trim()) query += ` (${sector.trim()})`;
      if (focus.trim()) query += ` — ${focus.trim()}`;
    }
    onSubmit(query);
  };

  return (
    <div className="mb-3 rounded-2xl border border-line/40 bg-[oklch(99.5%_0.002_240)] p-4 shadow-[0_2px_12px_oklch(31%_0.038_248_/_0.08)] animate-in fade-in slide-in-from-bottom-2 duration-200">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <span className="text-[13px] font-medium text-ink font-geist">
          {mode === "market" ? "Deep Market Research" : "Deep Company Research"}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-1 text-stone/40 hover:text-stone/70 hover:bg-stone/8 transition-all"
          aria-label="Close form"
        >
          <X size={14} strokeWidth={1.5} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {mode === "market" ? (
          <>
            <Field
              label="Sector or industry"
              required
              placeholder="e.g. HVAC services, waste management, pediatric dental"
              value={sector}
              onChange={setSector}
              autoFocus
            />
            <Field
              label="Geography"
              placeholder="e.g. North America, US Southeast (leave blank for global)"
              value={geography}
              onChange={setGeography}
            />
            <Field
              label="Research focus"
              placeholder="e.g. buy-and-build thesis, fragmentation, exit paths"
              value={focus}
              onChange={setFocus}
            />
          </>
        ) : (
          <>
            <Field
              label="Company name"
              required
              placeholder="e.g. ServiceMaster, ABC Plumbing Services"
              value={company}
              onChange={setCompany}
              autoFocus
            />
            <Field
              label="Industry"
              placeholder="e.g. facilities management, home services"
              value={sector}
              onChange={setSector}
            />
            <Field
              label="Research focus"
              placeholder="e.g. platform fit assessment, red flags, diligence agenda"
              value={focus}
              onChange={setFocus}
            />
          </>
        )}

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={!isValid}
            className="flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-[13px] font-geist text-[oklch(97%_0.004_240)] transition-all hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Run research
            <ArrowRight size={13} strokeWidth={2} />
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  placeholder,
  value,
  onChange,
  required = false,
  autoFocus = false,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  autoFocus?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide text-stone/55 font-geist">
        {label}
        {required && <span className="text-accent/70">*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full rounded-lg border border-line/40 bg-[oklch(97%_0.005_240)] px-3 py-2 text-[14px] font-geist text-ink placeholder:text-stone/35 transition-all focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/20"
      />
    </div>
  );
}
