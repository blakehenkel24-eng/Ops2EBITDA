import type { ResearchSource } from "@/lib/atlas/types";
import { AtlasSourceTags } from "./AtlasSourceTags";

export function AtlasMemoCard({
  mode,
  query,
  content,
  sources,
  confidence,
  createdAt,
}: {
  mode: string;
  query: string;
  content: string;
  sources: ResearchSource[];
  confidence: string;
  createdAt: string;
}) {
  return (
    <div className="bg-paper border border-line/80 p-5">
      <div className="border-b border-line/40 pb-3 mb-4">
        <p className="font-mono-label text-stone mb-1.5">
          {mode.toUpperCase()} RESEARCH MEMO
        </p>
        <h3 className="font-newsreader text-xl text-ink">{query}</h3>
        <p className="text-xs text-stone mt-1">
          {sources.length} sources · Confidence: {confidence} · {createdAt}
        </p>
      </div>
      <div className="text-sm leading-7 text-stone font-geist">
        <MemoContent markdown={content} />
      </div>
      <AtlasSourceTags sources={sources} />
    </div>
  );
}

function MemoContent({ markdown }: { markdown: string }) {
  const lines = markdown.split("\n");
  const elements: React.ReactNode[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("## ")) {
      elements.push(
        <h4 key={i} className="font-newsreader text-lg text-ink mt-4 mb-2">
          {line.replace("## ", "")}
        </h4>
      );
    } else if (line.startsWith("# ")) {
      elements.push(
        <h3 key={i} className="font-newsreader text-xl text-ink mt-5 mb-2">
          {line.replace("# ", "")}
        </h3>
      );
    } else if (line.startsWith("- ")) {
      elements.push(
        <li key={i} className="ml-4 list-disc">
          {formatInlineMarkdown(line.replace("- ", ""))}
        </li>
      );
    } else if (line.trim()) {
      elements.push(
        <p key={i} className="mb-2">
          {formatInlineMarkdown(line)}
        </p>
      );
    }
  }

  return <>{elements}</>;
}

function formatInlineMarkdown(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="text-ink">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}
