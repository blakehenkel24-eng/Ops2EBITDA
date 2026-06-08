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
      <div className="mb-6 animate-in fade-in duration-300">
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
