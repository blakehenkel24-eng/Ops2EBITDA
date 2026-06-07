"use client";

import { useChat } from "@ai-sdk/react";
import { TextStreamChatTransport, isTextUIPart, UIMessagePart, UIDataTypes, UITools } from "ai";
import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { AtlasChatMessage } from "./AtlasChatMessage";
import { AtlasResearchProgress } from "./AtlasResearchProgress";
import { AtlasWelcome, AtlasReportButtons } from "./AtlasWelcome";
import { ATLAS_COMMANDS } from "@/lib/atlas/prompts";
import { ArrowUp } from "lucide-react";

function getMessageText(parts: UIMessagePart<UIDataTypes, UITools>[]): string {
  const raw = parts
    .filter(isTextUIPart)
    .map((p) => p.text)
    .join("");
  // Strip [mode:X] prefix injected by report forms
  return raw.replace(/^\[mode:(?:market|company)]\s*/, "");
}

const SUGGESTIONS = [
  "Top value creation levers for HVAC roll-ups",
  "Red flags in a facilities management target",
  "What makes a good PE platform in waste services?",
  "Compare maintenance vs. project revenue quality",
];

export interface ProgressStage {
  id: string;
  label: string;
  status: "active" | "done";
}

const PROGRESS_PREFIX = "§§P";

export function AtlasChat({ fullPage = false }: { fullPage?: boolean }) {
  const [researchMode, setResearchMode] = useState<string>("chat");
  const [progressStages, setProgressStages] = useState<ProgressStage[]>([]);
  const [input, setInput] = useState("");
  const [slashDismissed, setSlashDismissed] = useState(false);
  const [slashIndex, setSlashIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const slashMenuRef = useRef<HTMLDivElement>(null);

  // Ref-based progress updater so custom fetch stays stable
  const progressRef = useRef<(stage: ProgressStage) => void>(() => {});
  progressRef.current = (stage: ProgressStage) => {
    setProgressStages((prev) => {
      const idx = prev.findIndex((s) => s.id === stage.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = stage;
        return updated;
      }
      return [...prev, stage];
    });
  };

  // Custom fetch that intercepts §§P progress lines before they reach the transport
  const customFetch = useMemo(() => {
    const fn: typeof globalThis.fetch = async (reqInput, init) => {
      const res = await globalThis.fetch(reqInput, init);
      if (!res.body) return res;

      const decoder = new TextDecoder();
      const encoder = new TextEncoder();
      let buffer = "";
      let progressDone = false;

      const transform = new TransformStream<Uint8Array, Uint8Array>({
        transform(chunk, controller) {
          // After progress phase, pass through raw bytes
          if (progressDone) {
            controller.enqueue(chunk);
            return;
          }

          buffer += decoder.decode(chunk, { stream: true });

          // Process complete lines
          let nlIdx: number;
          while ((nlIdx = buffer.indexOf("\n")) !== -1) {
            const line = buffer.slice(0, nlIdx);
            buffer = buffer.slice(nlIdx + 1);

            if (line.startsWith(PROGRESS_PREFIX)) {
              try {
                const data = JSON.parse(line.slice(PROGRESS_PREFIX.length));
                progressRef.current({ id: data.stage, label: data.label, status: data.status });
              } catch {
                // malformed progress line, skip
              }
            } else {
              // First non-progress content — flush everything downstream
              progressDone = true;
              const remaining = line + "\n" + buffer;
              buffer = "";
              controller.enqueue(encoder.encode(remaining));
              return;
            }
          }

          // Partial buffer that doesn't look like a progress line
          if (buffer.length > 3 && !buffer.startsWith("§")) {
            progressDone = true;
            controller.enqueue(encoder.encode(buffer));
            buffer = "";
          }
        },
        flush(controller) {
          if (buffer) controller.enqueue(encoder.encode(buffer));
        },
      });

      const filtered = res.body.pipeThrough(transform);

      return new Response(filtered, {
        status: res.status,
        statusText: res.statusText,
        headers: res.headers,
      });
    };
    return fn;
  }, []);

  const transport = useMemo(
    () =>
      new TextStreamChatTransport({
        api: "/api/atlas/chat",
        body: { mode: "chat" },
        fetch: customFetch,
      }),
    [customFetch]
  );

  const { messages, sendMessage, status } = useChat({ transport });

  const isLoading = status === "submitted" || status === "streaming";
  const hasMessages = messages.length > 0;

  // Clear progress only when loading transitions from true -> false
  const wasLoadingRef = useRef(false);
  useEffect(() => {
    if (wasLoadingRef.current && !isLoading) {
      setProgressStages([]);
      setResearchMode("chat");
    }
    wasLoadingRef.current = isLoading;
  }, [isLoading]);

  // Find last assistant message index for command bar
  const lastAssistantIdx = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "assistant") return i;
    }
    return -1;
  }, [messages]);

  const slashCandidate = input === "/" || (input.startsWith("/") && !input.includes(" "));
  const slashFilter = input.startsWith("/") && !input.includes(" ") ? input.slice(1) : "";
  const showSlashMenu = slashCandidate && !slashDismissed;

  // Filtered slash commands
  const filteredCommands = useMemo(() => {
    if (!slashFilter) return ATLAS_COMMANDS;
    return ATLAS_COMMANDS.filter((cmd) =>
      cmd.name.startsWith(slashFilter.toLowerCase())
    );
  }, [slashFilter]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (!hasMessages && !isLoading) return;
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isLoading, hasMessages]);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
  }, [input]);

  // Scroll selected slash command into view
  useEffect(() => {
    if (!showSlashMenu || !slashMenuRef.current) return;
    const items = slashMenuRef.current.children;
    if (items[slashIndex]) {
      items[slashIndex].scrollIntoView({ block: "nearest" });
    }
  }, [slashIndex, showSlashMenu]);

  const handleCommand = useCallback(
    (command: string) => {
      sendMessage({ text: command });
    },
    [sendMessage]
  );

  const handleStartResearch = useCallback(
    (mode: string, query: string) => {
      // Set mode for progress indicator only (not transport)
      setResearchMode(mode);
      // Embed mode in message so server gets it immediately
      // Transport body stays "chat" — mode prefix is the source of truth
      sendMessage({ text: `[mode:${mode}] ${query}` });
    },
    [sendMessage]
  );

  const handleSend = useCallback(() => {
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input.trim() });
    setInput("");
    setSlashDismissed(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [input, isLoading, sendMessage]);

  const handleSlashSelect = useCallback(
    (cmd: string) => {
      sendMessage({ text: `/${cmd}` });
      setInput("");
      setSlashDismissed(false);
    },
    [sendMessage]
  );

  const handleInputChange = useCallback((value: string) => {
    setInput(value);
    setSlashDismissed(false);
    setSlashIndex(0);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (showSlashMenu && filteredCommands.length > 0) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setSlashIndex((i) => Math.min(i + 1, filteredCommands.length - 1));
          return;
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          setSlashIndex((i) => Math.max(i - 1, 0));
          return;
        }
        if (e.key === "Enter") {
          e.preventDefault();
          handleSlashSelect(filteredCommands[slashIndex].name);
          return;
        }
        if (e.key === "Escape") {
          e.preventDefault();
          setSlashDismissed(true);
          return;
        }
        if (e.key === "Tab") {
          e.preventDefault();
          setInput(`/${filteredCommands[slashIndex].name}`);
          setSlashDismissed(false);
          return;
        }
      }

      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend, showSlashMenu, filteredCommands, slashIndex, handleSlashSelect]
  );

  const handleSuggestion = useCallback(
    (suggestion: string) => {
      sendMessage({ text: suggestion });
    },
    [sendMessage]
  );

  const rootClass = fullPage
    ? "atlas-chat-viewport"
    : "flex h-full flex-col";
  const shellClass = fullPage
    ? "atlas-chat-document"
    : "flex h-full flex-col";
  const scrollClass = fullPage
    ? "atlas-chat-scroll"
    : "flex-1 overflow-y-auto px-4 md:px-8 py-6";
  const inputClass = fullPage
    ? "atlas-chat-composer"
    : "border-t border-line/50 bg-paper/80 px-4 md:px-8 py-3";

  return (
    <div className={rootClass}>
      <section className={shellClass}>
        {fullPage && (
          <div className="atlas-chat-document__header">
            <div>
              <p className="font-mono-label text-accent">Atlas IQ</p>
              <h2 className="mt-1 font-newsreader text-2xl text-ink">
                Private equity research workspace
              </h2>
            </div>
            <div className="atlas-chat-status">
              <span />
              <strong>{isLoading ? "Working" : hasMessages ? "Memo thread" : "Ready"}</strong>
            </div>
          </div>
        )}

        <div ref={scrollRef} className={scrollClass}>
          {!hasMessages && <AtlasWelcome onStartResearch={handleStartResearch} />}

          {!hasMessages && !isLoading && (
            <div className="mx-auto mb-7 flex max-w-2xl flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleSuggestion(s)}
                  className="border border-line/55 bg-paper px-3 py-1.5 text-xs text-stone transition-all duration-150 font-geist hover:border-accent/35 hover:bg-accent-soft/45 hover:text-accent"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {messages.map((message, idx) => (
            <AtlasChatMessage
              key={message.id}
              role={message.role as "user" | "assistant"}
              content={getMessageText(message.parts)}
              onCommand={
                message.role === "assistant" && idx === lastAssistantIdx && !isLoading
                  ? handleCommand
                  : undefined
              }
              isStreaming={
                isLoading && message.id === messages[messages.length - 1]?.id
              }
            />
          ))}
          {isLoading && (
            <AtlasResearchProgress
              visible
              mode={researchMode}
              stages={progressStages}
            />
          )}
        </div>

        {!fullPage && !hasMessages && !isLoading && (
          <AtlasReportButtons onStartResearch={handleStartResearch} />
        )}

        <div className={inputClass}>
          <div className="relative mx-auto max-w-3xl">
            {showSlashMenu && filteredCommands.length > 0 && (
              <div className="absolute bottom-full left-0 z-20 mb-2 w-full overflow-hidden border border-line/70 bg-paper shadow-[0_22px_50px_oklch(31%_0.038_248_/_0.16)]">
                <div className="border-b border-line/40 px-3 py-2">
                  <span className="font-mono-label text-[10px] text-stone/50">COMMANDS</span>
                </div>
                <div ref={slashMenuRef} className="max-h-52 overflow-y-auto py-1">
                  {filteredCommands.map((cmd, i) => (
                    <button
                      key={cmd.name}
                      type="button"
                      onClick={() => handleSlashSelect(cmd.name)}
                      className={`w-full text-left px-3 py-2.5 flex items-start gap-3 transition-colors ${
                        i === slashIndex
                          ? "bg-accent-soft/70 text-ink"
                          : "text-stone hover:bg-bone/50"
                      }`}
                    >
                      <span className="font-mono-label text-[11px] text-accent shrink-0 mt-0.5">
                        /{cmd.name}
                      </span>
                      <span className="text-xs text-stone/70 leading-relaxed">
                        {cmd.prompt}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-end gap-2">
              <div className="flex-1">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={hasMessages ? "Follow up, or type / for commands..." : "Ask Atlas IQ anything..."}
                  rows={1}
                  className="w-full resize-none border border-line/70 bg-paper px-4 py-3 text-sm leading-relaxed text-ink placeholder:text-stone/45 transition-all duration-150 font-geist focus:border-accent/45 focus:bg-paper focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center bg-accent text-paper transition-opacity duration-150 disabled:opacity-25"
                aria-label="Send message"
              >
                <ArrowUp size={16} strokeWidth={2} />
              </button>
            </div>
            <p className="mt-2 text-center text-[10px] text-stone/45 font-geist">
              <kbd className="font-mono">Enter</kbd> to send · <kbd className="font-mono">Shift Enter</kbd> for new line · <kbd className="font-mono">/</kbd> for commands
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
