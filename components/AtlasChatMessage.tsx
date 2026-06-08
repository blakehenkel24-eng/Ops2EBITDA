"use client";

import { useState } from "react";
import { Check, Copy, RotateCcw } from "lucide-react";
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
      <div className="flex justify-end mb-6">
        <div className="max-w-[75%] bg-[oklch(99.5%_0.002_240)] text-ink px-4 py-3 rounded-2xl rounded-br-md text-[15px] leading-relaxed font-geist shadow-[0_1px_3px_oklch(31%_0.038_248_/_0.08)]">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 group/msg">
      <div className="flex gap-3">
        {/* AI icon */}
        <div className="atlas-ai-icon mt-1 shrink-0">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>

        {/* Message body */}
        <div className="min-w-0 flex-1">
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
            <div className="relative rounded-2xl rounded-tl-sm bg-[oklch(99.5%_0.002_240)] px-5 py-4 shadow-[0_1px_3px_oklch(31%_0.038_248_/_0.07)]">
              <div className="text-[15px] leading-7 text-ink/90 font-geist">
                <MarkdownContent content={content} />
                {isStreaming && <StreamingCursor />}
              </div>
            </div>
          )}

          {/* Hover action bar — sits below card */}
          {!isStreaming && content.length > 20 && (
            <div className="atlas-msg-actions mt-1 flex items-center gap-0.5 pl-1">
              <CopyButton text={content} />
            </div>
          )}

          {/* Command bar */}
          {onCommand && !isStreaming && (
            <div className="mt-2.5 pl-1">
              <AtlasCommandBar onCommand={onCommand} compact />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** Shimmer dot at end of streaming text */
function StreamingCursor() {
  return (
    <span className="inline-flex items-center gap-0.5 ml-1.5 -mb-0.5">
      <span className="atlas-streaming-dot inline-block w-1.5 h-1.5 rounded-full bg-accent/50" />
    </span>
  );
}

/** Copy button */
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex items-center gap-1 rounded-md px-1.5 py-1 text-stone/40 hover:text-stone/70 hover:bg-stone/6 transition-all"
      title="Copy response"
    >
      {copied ? (
        <Check size={13} strokeWidth={2} className="text-accent/70" />
      ) : (
        <Copy size={13} strokeWidth={1.5} />
      )}
    </button>
  );
}

/** Inline markdown renderer: handles headings, bold, bullets, rules, paragraphs */
function MarkdownContent({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let listBuffer: { text: string; ordered: boolean }[] = [];
  let key = 0;

  const flushList = () => {
    if (listBuffer.length === 0) return;
    const ordered = listBuffer[0].ordered;
    const Tag = ordered ? "ol" : "ul";
    elements.push(
      <Tag key={key++} className={`space-y-1.5 my-3 ${ordered ? "list-decimal" : "list-disc"} ml-5`}>
        {listBuffer.map((item, i) => (
          <li key={i} className="text-ink/80 pl-0.5 leading-relaxed">
            <InlineMarkdown text={item.text} />
          </li>
        ))}
      </Tag>
    );
    listBuffer = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();

    // Horizontal rule
    if (trimmed === "---" || trimmed === "***" || trimmed === "___") {
      flushList();
      elements.push(<hr key={key++} className="border-line/20 my-6" />);
      continue;
    }

    // Headings
    if (trimmed.startsWith("#### ")) {
      flushList();
      elements.push(
        <h5 key={key++} className="text-xs font-semibold text-stone/60 uppercase tracking-wide mt-5 mb-1.5 font-geist">
          {trimmed.replace("#### ", "")}
        </h5>
      );
      continue;
    }
    if (trimmed.startsWith("### ")) {
      flushList();
      elements.push(
        <h4 key={key++} className="font-newsreader text-[16px] text-ink font-medium mt-6 mb-2">
          {trimmed.replace("### ", "")}
        </h4>
      );
      continue;
    }
    if (trimmed.startsWith("## ")) {
      flushList();
      elements.push(
        <h3 key={key++} className="font-newsreader text-lg text-ink font-medium mt-7 mb-2">
          {trimmed.replace("## ", "")}
        </h3>
      );
      continue;
    }

    // Numbered list
    const numberedMatch = trimmed.match(/^(\d+)\.\s(.+)/);
    if (numberedMatch) {
      listBuffer.push({ text: numberedMatch[2], ordered: true });
      continue;
    }

    // Bullet points
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      listBuffer.push({ text: trimmed.slice(2), ordered: false });
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
      <p key={key++} className="mb-2.5 max-w-[65ch] leading-relaxed">
        <InlineMarkdown text={trimmed} />
      </p>
    );
  }

  flushList();
  return <>{elements}</>;
}

/** Handles inline **bold**, *italic*, and `code` */
function InlineMarkdown({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
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
        if (part.startsWith("*") && part.endsWith("*") && !part.startsWith("**")) {
          return <em key={i} className="italic">{part.slice(1, -1)}</em>;
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code key={i} className="px-1.5 py-0.5 bg-[oklch(95%_0.006_240)] rounded-md text-[13px] font-jetbrains text-ink/75">
              {part.slice(1, -1)}
            </code>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
