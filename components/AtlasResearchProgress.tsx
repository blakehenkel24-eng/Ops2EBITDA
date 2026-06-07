"use client";

import type { ProgressStage } from "./AtlasChat";

interface AtlasResearchProgressProps {
  visible: boolean;
  mode?: string;
  stages?: ProgressStage[];
}

export function AtlasResearchProgress({
  visible,
  mode,
  stages,
}: AtlasResearchProgressProps) {
  if (!visible) return null;

  const isReport = mode === "market" || mode === "company";

  // Live stages from server
  if (isReport && stages && stages.length > 0) {
    const doneCount = stages.filter((s) => s.status === "done").length;
    const total = stages.length;
    const pct = Math.round((doneCount / Math.max(total, 1)) * 100);

    return (
      <div className="mb-5 animate-in fade-in duration-300">
        <div className="max-w-md">
          {/* Header */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-accent/70 rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-1.5 h-1.5 bg-accent/70 rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-1.5 h-1.5 bg-accent/70 rounded-full animate-bounce [animation-delay:300ms]" />
            </div>
            <span className="font-mono-label text-[10px] text-accent">
              {mode === "market" ? "MARKET REPORT" : "COMPANY REPORT"}
            </span>
          </div>

          {/* Live stage list */}
          <div className="space-y-1.5 pl-1">
            {stages.map((stage) => (
              <div
                key={stage.id}
                className={`flex items-center gap-2 text-xs font-geist transition-all duration-300 ${
                  stage.status === "done"
                    ? "text-stone/50"
                    : "text-ink/80"
                }`}
              >
                <span className="w-3.5 flex justify-center shrink-0">
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
          <div className="mt-3 h-0.5 bg-bone rounded-full overflow-hidden">
            <div
              className="h-full bg-accent/40 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Report mode waiting for first event
  if (isReport) {
    return (
      <div className="mb-5 animate-in fade-in duration-300">
        <div className="max-w-md">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-accent/70 rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-1.5 h-1.5 bg-accent/70 rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-1.5 h-1.5 bg-accent/70 rounded-full animate-bounce [animation-delay:300ms]" />
            </div>
            <span className="font-mono-label text-[10px] text-accent">
              {mode === "market" ? "MARKET REPORT" : "COMPANY REPORT"}
            </span>
          </div>
          <div className="flex items-center gap-2 pl-1 text-xs font-geist text-ink/80">
            <span className="w-3.5 flex justify-center shrink-0">
              <Spinner />
            </span>
            Initializing research pipeline...
          </div>
          <div className="mt-3 h-0.5 bg-bone rounded-full overflow-hidden">
            <div className="h-full bg-accent/20 rounded-full w-[5%]" />
          </div>
        </div>
      </div>
    );
  }

  // Chat mode: simple dots
  return (
    <div className="flex items-start gap-3 mb-4 animate-in fade-in duration-300">
      <div className="flex items-center gap-1 pt-1.5">
        <span className="w-1.5 h-1.5 bg-accent/70 rounded-full animate-bounce [animation-delay:0ms]" />
        <span className="w-1.5 h-1.5 bg-accent/70 rounded-full animate-bounce [animation-delay:150ms]" />
        <span className="w-1.5 h-1.5 bg-accent/70 rounded-full animate-bounce [animation-delay:300ms]" />
      </div>
      <span className="text-xs text-stone/70 font-geist">Thinking...</span>
    </div>
  );
}

function CheckMark() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="text-accent/60">
      <path
        d="M2 5.5L4 7.5L8 3"
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
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      className="text-accent animate-spin"
    >
      <circle
        cx="5"
        cy="5"
        r="3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="16"
        strokeDashoffset="4"
        strokeLinecap="round"
      />
    </svg>
  );
}
