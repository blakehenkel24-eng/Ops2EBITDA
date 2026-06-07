"use client";

export function AtlasResearchProgress({
  stage,
  visible,
}: {
  stage: string;
  visible: boolean;
}) {
  if (!visible) return null;

  return (
    <div className="flex items-start gap-3 mb-4 animate-in fade-in duration-300">
      <div className="flex items-center gap-1 pt-1.5">
        <span className="w-1.5 h-1.5 bg-accent/70 rounded-full animate-bounce [animation-delay:0ms]" />
        <span className="w-1.5 h-1.5 bg-accent/70 rounded-full animate-bounce [animation-delay:150ms]" />
        <span className="w-1.5 h-1.5 bg-accent/70 rounded-full animate-bounce [animation-delay:300ms]" />
      </div>
      <span className="text-xs text-stone/70 font-geist">{stage}</span>
    </div>
  );
}
