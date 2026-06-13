"use client";

import { useChat } from "@ai-sdk/react";
import { TextStreamChatTransport, isTextUIPart, UIMessagePart, UIDataTypes, UITools } from "ai";
import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { AtlasChatMessage } from "./AtlasChatMessage";
import { AtlasResearchProgress } from "./AtlasResearchProgress";
import { AtlasWelcome } from "./AtlasWelcome";
import { AtlasResearchForm } from "./AtlasResearchForm";
import { ATLAS_COMMANDS } from "@/lib/atlas/prompts";
import { ArrowUp, Landmark, Building2 } from "lucide-react";

function getMessageText(parts: UIMessagePart<UIDataTypes, UITools>[]): string {
  const raw = parts
    .filter(isTextUIPart)
    .map((p) => p.text)
    .join("");
  return raw.replace(/^\[mode:(?:market|company)]\s*/, "");
}

export interface ProgressStage {
  id: string;
  label: string;
  status: "active" | "done";
}

const PROGRESS_PREFIX = "§§P";

export function AtlasChat({ fullPage = false }: { fullPage?: boolean }) {
  const [researchMode, setResearchMode] = useState<string>("chat");
  const [activeForm, setActiveForm] = useState<"market" | "company" | null>(null);
  const [progressStages, setProgressStages] = useState<ProgressStage[]>([]);
  const [input, setInput] = useState("");
  const [slashDismissed, setSlashDismissed] = useState(false);
  const [slashIndex, setSlashIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const slashMenuRef = useRef<HTMLDivElement>(null);

  const updateProgressStage = useCallback((stage: ProgressStage) => {
    setProgressStages((prev) => {
      const idx = prev.findIndex((s) => s.id === stage.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = stage;
        return updated;
      }
      return [...prev, stage];
    });
  }, []);

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
          if (progressDone) {
            controller.enqueue(chunk);
            return;
          }

          buffer += decoder.decode(chunk, { stream: true });

          let nlIdx: number;
          while ((nlIdx = buffer.indexOf("\n")) !== -1) {
            const line = buffer.slice(0, nlIdx);
            buffer = buffer.slice(nlIdx + 1);

            if (line.startsWith(PROGRESS_PREFIX)) {
              try {
                const data = JSON.parse(line.slice(PROGRESS_PREFIX.length));
                updateProgressStage({ id: data.stage, label: data.label, status: data.status });
              } catch {
                // malformed progress line
              }
            } else {
              progressDone = true;
              const remaining = line + "\n" + buffer;
              buffer = "";
              controller.enqueue(encoder.encode(remaining));
              return;
            }
          }

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
  }, [updateProgressStage]);

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
    ta.style.height = Math.min(ta.scrollHeight, 200) + "px";
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
      setResearchMode(mode);
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
      const command = ATLAS_COMMANDS.find((c) => c.name === cmd);
      if (command?.mode) {
        setActiveForm(command.mode);
        setInput("");
        setSlashDismissed(true);
        return;
      }
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

  const handleResearchFormSubmit = useCallback(
    (query: string) => {
      if (!activeForm) return;
      setResearchMode(activeForm);
      sendMessage({ text: `[mode:${activeForm}] ${query}` });
      setActiveForm(null);
    },
    [activeForm, sendMessage]
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
        <div ref={scrollRef} className={scrollClass}>
          {/* Welcome state — vertically centered, fills scroll area */}
          {!hasMessages && !isLoading && (
            <AtlasWelcome
              onStartResearch={handleStartResearch}
              onSuggestion={handleSuggestion}
            />
          )}

          {/* Message thread */}
          <div className="mx-auto max-w-3xl">
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
        </div>

        {/* Composer */}
        <div className={inputClass}>
          <div className="relative mx-auto max-w-3xl">
            {/* Slash command menu */}
            {showSlashMenu && filteredCommands.length > 0 && (
              <div className="absolute bottom-full left-0 z-20 mb-2 w-full overflow-hidden rounded-xl border border-line/50 bg-[oklch(99.5%_0.002_240)] shadow-[0_8px_30px_oklch(31%_0.038_248_/_0.12)]">
                <div className="border-b border-line/30 px-3.5 py-2">
                  <span className="text-[11px] font-medium text-stone/50">Commands</span>
                </div>
                <div ref={slashMenuRef} className="max-h-64 overflow-y-auto py-1">
                  {filteredCommands.map((cmd, i) => (
                    <button
                      key={cmd.name}
                      type="button"
                      onClick={() => handleSlashSelect(cmd.name)}
                      className={`w-full text-left px-3.5 py-2.5 flex items-start gap-3 transition-colors ${
                        i === slashIndex
                          ? "bg-accent/6 text-ink"
                          : "text-stone hover:bg-accent/4"
                      }`}
                    >
                      <span className="text-[12px] font-medium text-accent shrink-0 mt-px font-geist">
                        /{cmd.name}
                      </span>
                      <span className="text-xs text-stone/60 leading-relaxed font-geist">
                        {cmd.prompt}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Research mode buttons */}
            <div className="flex gap-1.5 mb-2">
              {(
                [
                  { mode: "market", label: "Market Research", icon: Landmark },
                  { mode: "company", label: "Company Research", icon: Building2 },
                ] as const
              ).map(({ mode, label, icon: Icon }) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setActiveForm(activeForm === mode ? null : mode)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-geist transition-all duration-150 ${
                    activeForm === mode
                      ? "bg-accent text-[oklch(97%_0.004_240)] shadow-[0_1px_4px_oklch(34%_0.105_252_/_0.3)]"
                      : "text-stone/55 border border-line/35 hover:text-ink hover:border-line/60 bg-transparent"
                  }`}
                >
                  <Icon size={11} strokeWidth={1.7} />
                  {label}
                </button>
              ))}
            </div>

            {/* Research form — appears above input when a mode is active */}
            {activeForm && (
              <AtlasResearchForm
                mode={activeForm}
                onSubmit={handleResearchFormSubmit}
                onClose={() => setActiveForm(null)}
              />
            )}

            {/* Input area — Claude/ChatGPT style rounded capsule */}
            <div className="atlas-input-wrap">
              <div className="flex items-end gap-0">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={hasMessages ? "Ask a follow-up..." : "Ask Atlas IQ anything..."}
                  rows={1}
                  className="w-full resize-none bg-transparent px-5 py-3.5 text-[15px] leading-relaxed text-ink placeholder:text-stone/40 font-geist focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="m-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-[oklch(98%_0.004_240)] transition-all duration-150 hover:opacity-90 disabled:opacity-20 disabled:bg-stone/30"
                  aria-label="Send message"
                >
                  <ArrowUp size={16} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            <p className="mt-2 text-center text-[10px] text-stone/35 font-geist">
              Atlas IQ can make mistakes. Verify important information.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
