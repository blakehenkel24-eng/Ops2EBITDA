import type { ResearchSource } from "@/lib/atlas/types";

export function AtlasSourceTags({ sources }: { sources: ResearchSource[] }) {
  const visible = sources.filter((s) => s.type !== "placeholder").slice(0, 5);
  const remaining = sources.filter((s) => s.type !== "placeholder").length - visible.length;

  if (visible.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-line/40">
      {visible.map((source) => (
        <a
          key={source.url || source.title}
          href={source.url || undefined}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono-label text-stone bg-bone px-2 py-0.5 hover:text-accent hover:bg-accent-soft transition-colors"
        >
          {source.title.slice(0, 30)}
        </a>
      ))}
      {remaining > 0 && (
        <span className="font-mono-label text-stone bg-bone px-2 py-0.5">
          +{remaining} more
        </span>
      )}
    </div>
  );
}
