"use client";

import { useState, useEffect } from "react";

interface AtlasResearchProgressProps {
  visible: boolean;
  mode?: string;
}

const CHAT_STAGES = ["Thinking..."];

const REPORT_STAGES = [
  "Running targeted web searches...",
  "Gathering and ranking sources...",
  "Extracting page content...",
  "Cross-referencing operating library...",
  "Building source digest...",
  "Writing source-backed memo...",
];

export function AtlasResearchProgress({ visible, mode }: AtlasResearchProgressProps) {
  const isReport = mode === "market" || mode === "company";
  const stages = isReport ? REPORT_STAGES : CHAT_STAGES;
  const [stageIdx, setStageIdx] = useState(0);

  // Cycle through stages for reports
  useEffect(() => {
    if (!visible) {
      setStageIdx(0);
      return;
    }
    if (!isReport) return;

    const interval = setInterval(() => {
      setStageIdx((i) => (i < stages.length - 1 ? i + 1 : i));
    }, 3500);

    return () => clearInterval(interval);
  }, [visible, isReport, stages.length]);

  if (!visible) return null;

  const currentStage = stages[stageIdx];

  if (isReport) {
    return (
      <div className="mb-5 animate-in fade-in duration-300">
        <div className="max-w-md">
          {/* Stage indicators */}
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

          {/* Stage list */}
          <div className="space-y-1.5 pl-1">
            {stages.map((stage, i) => (
              <div
                key={stage}
                className={`flex items-center gap-2 text-xs font-geist transition-all duration-500 ${
                  i < stageIdx
                    ? "text-stone/40"
                    : i === stageIdx
                      ? "text-ink/80"
                      : "text-stone/20"
                }`}
              >
                <span className="w-3.5 flex justify-center shrink-0">
                  {i < stageIdx ? (
                    <CheckMark />
                  ) : i === stageIdx ? (
                    <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                  ) : (
                    <span className="w-1 h-1 bg-stone/20 rounded-full" />
                  )}
                </span>
                {stage}
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="mt-3 h-0.5 bg-bone rounded-full overflow-hidden">
            <div
              className="h-full bg-accent/40 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${((stageIdx + 1) / stages.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Simple chat loading
  return (
    <div className="flex items-start gap-3 mb-4 animate-in fade-in duration-300">
      <div className="flex items-center gap-1 pt-1.5">
        <span className="w-1.5 h-1.5 bg-accent/70 rounded-full animate-bounce [animation-delay:0ms]" />
        <span className="w-1.5 h-1.5 bg-accent/70 rounded-full animate-bounce [animation-delay:150ms]" />
        <span className="w-1.5 h-1.5 bg-accent/70 rounded-full animate-bounce [animation-delay:300ms]" />
      </div>
      <span className="text-xs text-stone/70 font-geist">{currentStage}</span>
    </div>
  );
}

function CheckMark() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="text-accent/50">
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
