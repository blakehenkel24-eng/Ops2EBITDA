"use client";

import type { ProgressStage } from "./AtlasChat";

interface AtlasResearchProgressProps {
  visible: boolean;
  mode?: string;
  stages?: ProgressStage[];
  isComposing?: boolean;
  isFadingOut?: boolean;
}

export function AtlasResearchProgress({
  visible,
  mode,
  stages,
  isComposing,
  isFadingOut,
}: AtlasResearchProgressProps) {
  if (!visible) return null;

  const isReport = mode === "market" || mode === "company";

  // Live stages from server
  if (isReport && stages && stages.length > 0) {
    const doneCount = stages.filter((s) => s.status === "done").length;
    const total = stages.length;
    const pct = Math.round((doneCount / Math.max(total, 1)) * 100);

    return (
      <div className={`mb-6 ${isFadingOut ? "atlas-progress-fadeout" : "animate-in fade-in duration-300"}`}>
        <div className="flex gap-3">
          {/* AI icon */}
          <div className="atlas-ai-icon mt-0.5 shrink-0">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>

          <div className="min-w-0 flex-1 max-w-md">
            {/* Live stage list */}
            <div className="space-y-2">
              {stages.map((stage) => (
                <div
                  key={stage.id}
                  className={`flex items-center gap-2.5 text-[13px] font-geist transition-all duration-300 ${
                    stage.status === "done"
                      ? "text-stone/45"
                      : "text-ink/80"
                  }`}
                >
                  <span className="w-4 flex justify-center shrink-0">
                    {stage.status === "done" ? (
                      <CheckMark />
                    ) : (
                      <Spinner />
                    )}
                  </span>
                  {stage.label}
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="mt-3 h-[3px] bg-[oklch(94%_0.006_240)] rounded-full overflow-hidden">
              <div
                className="h-full bg-accent/40 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${pct}%` }}
              />
            </div>

            {/* Document composing skeleton */}
            {isComposing && <DocumentComposingSkeleton />}
          </div>
        </div>
      </div>
    );
  }

  // Report mode waiting for first event
  if (isReport) {
    return (
      <div className="mb-6 animate-in fade-in duration-300">
        <div className="flex gap-3">
          <div className="atlas-ai-icon mt-0.5 shrink-0">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="min-w-0 flex-1 max-w-md">
            <div className="flex items-center gap-2.5 text-[13px] font-geist text-ink/80">
              <span className="w-4 flex justify-center shrink-0">
                <Spinner />
              </span>
              Initializing research pipeline...
            </div>
            <div className="mt-3 h-[3px] bg-[oklch(94%_0.006_240)] rounded-full overflow-hidden">
              <div className="h-full bg-accent/20 rounded-full w-[5%]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Chat mode: shimmer dots
  return (
    <div className="flex gap-3 mb-6 animate-in fade-in duration-300">
      <div className="atlas-ai-icon mt-0.5 shrink-0">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      </div>
      <div className="flex items-center gap-1 pt-1.5">
        <span className="atlas-streaming-dot inline-block w-1.5 h-1.5 rounded-full bg-accent/50" />
        <span className="atlas-streaming-dot inline-block w-1.5 h-1.5 rounded-full bg-accent/50 [animation-delay:200ms]" />
        <span className="atlas-streaming-dot inline-block w-1.5 h-1.5 rounded-full bg-accent/50 [animation-delay:400ms]" />
      </div>
    </div>
  );
}

function CheckMark() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-accent/60">
      <path
        d="M2.5 6.5L5 9L9.5 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Spinner() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      className="text-accent animate-spin"
    >
      <circle
        cx="6"
        cy="6"
        r="4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="18"
        strokeDashoffset="5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DocumentComposingSkeleton() {
  return (
    <div className="mt-5 atlas-doc-skeleton animate-in fade-in duration-500">
      <div className="rounded-xl border border-line/30 bg-[oklch(99.5%_0.002_240)] p-5 shadow-[0_1px_4px_oklch(31%_0.038_248_/_0.06)]">
        {/* Title line */}
        <div className="atlas-skeleton-line h-4 w-3/5 rounded bg-[oklch(92%_0.008_240)] mb-4" />

        {/* Section heading */}
        <div className="atlas-skeleton-line h-3 w-2/5 rounded bg-[oklch(90%_0.012_248)] mb-3" style={{ animationDelay: "0.3s" }} />

        {/* Body lines */}
        <div className="space-y-2 mb-4">
          <div className="atlas-skeleton-line h-2.5 w-full rounded bg-[oklch(94%_0.006_240)]" style={{ animationDelay: "0.5s" }} />
          <div className="atlas-skeleton-line h-2.5 w-11/12 rounded bg-[oklch(94%_0.006_240)]" style={{ animationDelay: "0.7s" }} />
          <div className="atlas-skeleton-line h-2.5 w-4/5 rounded bg-[oklch(94%_0.006_240)]" style={{ animationDelay: "0.9s" }} />
        </div>

        {/* Another section */}
        <div className="atlas-skeleton-line h-3 w-1/3 rounded bg-[oklch(90%_0.012_248)] mb-3" style={{ animationDelay: "1.2s" }} />
        <div className="space-y-2 mb-4">
          <div className="atlas-skeleton-line h-2.5 w-full rounded bg-[oklch(94%_0.006_240)]" style={{ animationDelay: "1.4s" }} />
          <div className="atlas-skeleton-line h-2.5 w-10/12 rounded bg-[oklch(94%_0.006_240)]" style={{ animationDelay: "1.6s" }} />
          <div className="atlas-skeleton-line h-2.5 w-3/4 rounded bg-[oklch(94%_0.006_240)]" style={{ animationDelay: "1.8s" }} />
          <div className="atlas-skeleton-line h-2.5 w-5/6 rounded bg-[oklch(94%_0.006_240)]" style={{ animationDelay: "2.0s" }} />
        </div>

        {/* Table placeholder */}
        <div className="atlas-skeleton-line h-3 w-1/4 rounded bg-[oklch(90%_0.012_248)] mb-2" style={{ animationDelay: "2.3s" }} />
        <div className="rounded-lg border border-line/20 overflow-hidden" style={{ animationDelay: "2.5s" }}>
          <div className="flex gap-2 p-2 bg-[oklch(96%_0.006_240)]">
            <div className="atlas-skeleton-line h-2 w-1/4 rounded bg-[oklch(90%_0.008_242)]" />
            <div className="atlas-skeleton-line h-2 w-1/4 rounded bg-[oklch(90%_0.008_242)]" />
            <div className="atlas-skeleton-line h-2 w-1/4 rounded bg-[oklch(90%_0.008_242)]" />
          </div>
          {[0, 1, 2].map((row) => (
            <div key={row} className="flex gap-2 p-2 border-t border-line/10">
              <div className="atlas-skeleton-line h-2 w-1/4 rounded bg-[oklch(94%_0.005_240)]" style={{ animationDelay: `${2.7 + row * 0.2}s` }} />
              <div className="atlas-skeleton-line h-2 w-1/4 rounded bg-[oklch(94%_0.005_240)]" style={{ animationDelay: `${2.8 + row * 0.2}s` }} />
              <div className="atlas-skeleton-line h-2 w-1/4 rounded bg-[oklch(94%_0.005_240)]" style={{ animationDelay: `${2.9 + row * 0.2}s` }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
