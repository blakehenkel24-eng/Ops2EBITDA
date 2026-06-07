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
      <div className="flex justify-end mb-4">
        <div className="max-w-[75%] bg-accent text-white px-4 py-2.5 rounded-2xl rounded-br-sm text-sm leading-relaxed">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
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
        <div className="max-w-[88%] atlas-response text-sm leading-7 text-ink/85 font-geist">
          <MarkdownContent content={content} />
        </div>
      )}
      {onCommand && !isStreaming && (
        <div className="mt-2">
          <AtlasCommandBar onCommand={onCommand} compact />
        </div>
      )}
    </div>
  );
}

/** Inline markdown renderer: handles headings, bold, bullets, rules, paragraphs */
function MarkdownContent({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let listBuffer: string[] = [];
  let key = 0;

  const flushList = () => {
    if (listBuffer.length === 0) return;
    elements.push(
      <ul key={key++} className="space-y-1 my-2 ml-4">
        {listBuffer.map((item, i) => (
          <li key={i} className="list-disc text-ink/80 pl-0.5">
            <InlineMarkdown text={item} />
          </li>
        ))}
      </ul>
    );
    listBuffer = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();

    // Horizontal rule
    if (trimmed === "---" || trimmed === "***" || trimmed === "___") {
      flushList();
      elements.push(<hr key={key++} className="border-line/40 my-4" />);
      continue;
    }

    // Headings
    if (trimmed.startsWith("### ")) {
      flushList();
      elements.push(
        <h4 key={key++} className="font-newsreader text-[15px] text-ink font-medium mt-4 mb-1.5">
          {trimmed.replace("### ", "")}
        </h4>
      );
      continue;
    }
    if (trimmed.startsWith("## ")) {
      flushList();
      elements.push(
        <h3 key={key++} className="font-newsreader text-base text-ink font-medium mt-5 mb-2">
          {trimmed.replace("## ", "")}
        </h3>
      );
      continue;
    }
    if (trimmed.startsWith("#### ")) {
      flushList();
      elements.push(
        <h5 key={key++} className="font-mono-label text-accent mt-3 mb-1">
          {trimmed.replace("#### ", "")}
        </h5>
      );
      continue;
    }

    // Bullet points
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ") || /^\d+\.\s/.test(trimmed)) {
      const text = trimmed.replace(/^[-*]\s/, "").replace(/^\d+\.\s/, "");
      listBuffer.push(text);
      continue;
    }

    // Empty line
    if (!trimmed) {
      flushList();
      continue;
    }

    // Paragraph
    flushList();
    elements.push(
      <p key={key++} className="mb-2 max-w-[65ch]">
        <InlineMarkdown text={trimmed} />
      </p>
    );
  }

  flushList();
  return <>{elements}</>;
}

/** Handles inline **bold** and *italic* */
function InlineMarkdown({ text }: { text: string }) {
  // Split on **bold** and *italic* patterns
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold text-ink">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith("*") && part.endsWith("*")) {
          return <em key={i}>{part.slice(1, -1)}</em>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
