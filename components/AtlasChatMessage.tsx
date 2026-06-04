"use client";

import type { ResearchSource } from "@/lib/atlas/types";
import { AtlasMemoCard } from "./AtlasMemoCard";
import { AtlasCommandBar } from "./AtlasCommandBar";

interface AtlasChatMessageProps {
  role: "user" | "assistant";
  content: string;
  sources?: ResearchSource[];
  memo?: { mode: string; query: string; confidence: string; createdAt: string };
  onCommand?: (command: string) => void;
  isStreaming?: boolean;
}

export function AtlasChatMessage({
  role,
  content,
  sources,
  memo,
  onCommand,
  isStreaming,
}: AtlasChatMessageProps) {
  if (role === "user") {
    return (
      <div className="flex justify-end mb-5">
        <div className="max-w-[70%] bg-accent text-white px-4 py-3 rounded-xl rounded-br-sm text-sm leading-relaxed">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-5">
      {memo && sources ? (
        <AtlasMemoCard
          mode={memo.mode}
          query={memo.query}
          content={content}
          sources={sources}
          confidence={memo.confidence}
          createdAt={memo.createdAt}
        />
      ) : (
        <div className="max-w-[85%] bg-paper border border-line/80 px-5 py-4 rounded-sm rounded-tl-xl text-sm leading-7 text-stone font-geist">
          <MemoContentInline content={content} />
        </div>
      )}
      {onCommand && !isStreaming && (
        <AtlasCommandBar onCommand={onCommand} compact />
      )}
    </div>
  );
}

function MemoContentInline({ content }: { content: string }) {
  const lines = content.split("\n");
  return (
    <>
      {lines.map((line, i) => {
        if (line.startsWith("## ")) {
          return (
            <h4 key={i} className="font-newsreader text-base text-ink mt-3 mb-1">
              {line.replace("## ", "")}
            </h4>
          );
        }
        if (line.startsWith("- ")) {
          return (
            <li key={i} className="ml-4 list-disc text-stone">
              {line.replace("- ", "")}
            </li>
          );
        }
        if (line.trim()) {
          return <p key={i} className="mb-1.5">{line}</p>;
        }
        return null;
      })}
    </>
  );
}
