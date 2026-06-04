export function AtlasResearchProgress({
  stage,
  visible,
}: {
  stage: string;
  visible: boolean;
}) {
  if (!visible) return null;

  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
      <span className="font-mono-label text-stone">{stage}</span>
    </div>
  );
}
