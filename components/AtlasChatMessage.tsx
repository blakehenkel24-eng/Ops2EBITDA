"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
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
    <div className="mb-5 group/msg">
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
        <div className="relative max-w-[88%]">
          <div className="text-sm leading-7 text-ink/85 font-geist">
            <MarkdownContent content={content} />
            {isStreaming && <StreamingCursor />}
          </div>
          {!isStreaming && content.length > 20 && <CopyButton text={content} />}
        </div>
      )}
      {onCommand && !isStreaming && (
        <div className="mt-2.5">
          <AtlasCommandBar onCommand={onCommand} compact />
        </div>
      )}
    </div>
  );
}

/** Blinking cursor at end of streaming text */
function StreamingCursor() {
  return (
    <span className="inline-block w-0.5 h-4 bg-accent/60 ml-0.5 -mb-0.5 animate-pulse" />
  );
}

/** Copy button — appears on hover */
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
      className="absolute -top-1 right-0 opacity-0 group-hover/msg:opacity-100 transition-opacity p-1.5 rounded hover:bg-bone text-stone/50 hover:text-stone"
      title="Copy response"
    >
      {copied ? (
        <Check size={13} strokeWidth={2} className="text-teal" />
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
      <Tag key={key++} className={`space-y-1.5 my-2.5 ${ordered ? "list-decimal" : "list-disc"} ml-5`}>
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
      elements.push(<hr key={key++} className="border-line/30 my-5" />);
      continue;
    }

    // Headings
    if (trimmed.startsWith("#### ")) {
      flushList();
      elements.push(
        <h5 key={key++} className="font-mono-label text-accent text-[10px] mt-4 mb-1">
          {trimmed.replace("#### ", "")}
        </h5>
      );
      continue;
    }
    if (trimmed.startsWith("### ")) {
      flushList();
      elements.push(
        <h4 key={key++} className="font-newsreader text-[15px] text-ink font-medium mt-5 mb-1.5">
          {trimmed.replace("### ", "")}
        </h4>
      );
      continue;
    }
    if (trimmed.startsWith("## ")) {
      flushList();
      elements.push(
        <h3 key={key++} className="font-newsreader text-base text-ink font-medium mt-6 mb-2">
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
      <p key={key++} className="mb-2 max-w-[65ch] leading-relaxed">
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
            <code key={i} className="px-1 py-0.5 bg-bone rounded text-[13px] font-jetbrains text-accent/80">
              {part.slice(1, -1)}
            </code>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
