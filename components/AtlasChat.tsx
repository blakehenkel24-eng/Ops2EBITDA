"use client";

import { useChat } from "@ai-sdk/react";
import { TextStreamChatTransport, isTextUIPart, UIMessagePart, UIDataTypes, UITools } from "ai";
import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { AtlasChatMessage } from "./AtlasChatMessage";
import { AtlasResearchProgress } from "./AtlasResearchProgress";
import { AtlasWelcome } from "./AtlasWelcome";
import { AtlasResearchForm } from "./AtlasResearchForm";
import { ATLAS_COMMANDS } from "@/lib/atlas/prompts";
import { ArrowUp, Landmark, Building2, History, MessageSquarePlus, PanelLeftClose, Trash2, Layers } from "lucide-react";
import { DealWorkspacePanel } from "./DealWorkspacePanel";
import type { UIMessage } from "@ai-sdk/react";

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
const HISTORY_STORAGE_KEY = "atlas-iq-chat-history";

interface AtlasChatSession {
  id: string;
  title: string;
  preview: string;
  updatedAt: number;
  messages: UIMessage[];
}

function createSessionId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `atlas-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function readStoredSessions(): AtlasChatSession[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((session): session is AtlasChatSession =>
        typeof session?.id === "string" &&
        typeof session?.title === "string" &&
        typeof session?.preview === "string" &&
        Number.isFinite(session?.updatedAt) &&
        Array.isArray(session?.messages)
      )
      .sort((a, b) => b.updatedAt - a.updatedAt);
  } catch {
    return [];
  }
}

function writeStoredSessions(sessions: AtlasChatSession[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(sessions.slice(0, 24)));
  } catch {
    // History is a convenience feature; storage failures should not break chat.
  }
}

function cleanHistoryText(text: string) {
  return text
    .replace(/[*_`>#-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function sessionTitleFromMessages(messages: UIMessage[]) {
  const firstUserMessage = messages.find((message) => message.role === "user");
  if (!firstUserMessage) return "New research chat";
  const text = cleanHistoryText(getMessageText(firstUserMessage.parts));
  return text.length > 54 ? `${text.slice(0, 54).trim()}...` : text || "New research chat";
}

function sessionPreviewFromMessages(messages: UIMessage[]) {
  const lastMessage = [...messages].reverse().find((message) => message.role !== "system");
  if (!lastMessage) return "No messages yet";
  const text = cleanHistoryText(getMessageText(lastMessage.parts));
  return text.length > 74 ? `${text.slice(0, 74).trim()}...` : text || "No messages yet";
}

export function AtlasChat({ fullPage = false }: { fullPage?: boolean }) {
  const [researchMode, setResearchMode] = useState<string>("chat");
  const [activeForm, setActiveForm] = useState<"market" | "company" | null>(null);
  const [progressStages, setProgressStages] = useState<ProgressStage[]>([]);
  const [input, setInput] = useState("");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [activeDealId, setActiveDealId] = useState<string | null>(null);
  const [dealPanelOpen, setDealPanelOpen] = useState(false);
  const [sessions, setSessions] = useState<AtlasChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState(createSessionId);
  const historyLoadedRef = useRef(false);
  const [slashDismissed, setSlashDismissed] = useState(false);
  const [slashIndex, setSlashIndex] = useState(0);
  const [reportRevealing, setReportRevealing] = useState(false);
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
        body: { mode: "chat", dealId: activeDealId },
        fetch: customFetch,
      }),
    [customFetch, activeDealId]
  );

  const { messages, sendMessage, status, setMessages } = useChat({ transport });

  const isLoading = status === "submitted" || status === "streaming";
  const hasMessages = messages.length > 0;

  useEffect(() => {
    if (!fullPage) return;
    const timeoutId = window.setTimeout(() => {
      setSessions(readStoredSessions());
      historyLoadedRef.current = true;
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [fullPage]);

  useEffect(() => {
    if (!fullPage || !historyLoadedRef.current || messages.length === 0) return;

    const session: AtlasChatSession = {
      id: activeSessionId,
      title: sessionTitleFromMessages(messages),
      preview: sessionPreviewFromMessages(messages),
      updatedAt: Date.now(),
      messages,
    };

    setSessions((current) => {
      const next = [session, ...current.filter((item) => item.id !== activeSessionId)]
        .sort((a, b) => b.updatedAt - a.updatedAt)
        .slice(0, 24);
      writeStoredSessions(next);
      return next;
    });
  }, [activeSessionId, fullPage, messages]);

  const isReport = researchMode === "market" || researchMode === "company";

  // When loading ends: for reports, trigger reveal animation then clear
  const wasLoadingRef = useRef(false);
  useEffect(() => {
    if (!wasLoadingRef.current || isLoading) {
      wasLoadingRef.current = isLoading;
      return;
    }

    wasLoadingRef.current = isLoading;

    if (researchMode === "market" || researchMode === "company") {
      let finishTimer: number | undefined;
      const revealTimer = window.setTimeout(() => {
        setReportRevealing(true);
        finishTimer = window.setTimeout(() => {
          setReportRevealing(false);
          setProgressStages([]);
          setResearchMode("chat");
        }, 600);
      }, 0);

      return () => {
        window.clearTimeout(revealTimer);
        if (finishTimer) window.clearTimeout(finishTimer);
      };
    }

    const resetTimer = window.setTimeout(() => {
      setProgressStages([]);
      setResearchMode("chat");
    }, 0);

    return () => window.clearTimeout(resetTimer);
  }, [isLoading, researchMode]);

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

  const handleNewChat = useCallback(() => {
    setMessages([]);
    setProgressStages([]);
    setResearchMode("chat");
    setActiveForm(null);
    setInput("");
    setActiveSessionId(createSessionId());
  }, [setMessages]);

  const handleSelectSession = useCallback(
    (session: AtlasChatSession) => {
      if (isLoading) return;
      setActiveSessionId(session.id);
      setMessages(session.messages);
      setActiveForm(null);
      setProgressStages([]);
      setResearchMode("chat");
    },
    [isLoading, setMessages]
  );

  const handleDeleteSession = useCallback(
    (sessionId: string) => {
      setSessions((current) => {
        const next = current.filter((session) => session.id !== sessionId);
        writeStoredSessions(next);
        return next;
      });

      if (sessionId === activeSessionId) {
        handleNewChat();
      }
    },
    [activeSessionId, handleNewChat]
  );

  const rootClass = fullPage
    ? `atlas-chat-viewport ${historyOpen ? "is-history-open" : ""}`
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
      {fullPage && (
        <>
          {!historyOpen && (
            <button
              type="button"
              onClick={() => setHistoryOpen(true)}
              className="atlas-history-trigger"
              aria-label="Open chat history"
              aria-expanded={false}
            >
              <History size={17} strokeWidth={1.8} />
            </button>
          )}
          <AtlasChatHistoryPanel
            open={historyOpen}
            sessions={sessions}
            activeSessionId={activeSessionId}
            isLoading={isLoading}
            onClose={() => setHistoryOpen(false)}
            onNewChat={handleNewChat}
            onSelectSession={handleSelectSession}
            onDeleteSession={handleDeleteSession}
          />
          {!dealPanelOpen && (
            <button
              type="button"
              onClick={() => setDealPanelOpen(true)}
              className="deal-workspace-trigger"
              aria-label="Open deal workspace"
              aria-expanded={false}
            >
              <Layers size={17} strokeWidth={1.8} />
            </button>
          )}
          <DealWorkspacePanel
            open={dealPanelOpen}
            onClose={() => setDealPanelOpen(false)}
            activeDealId={activeDealId}
            onActiveDealChange={setActiveDealId}
          />
        </>
      )}
      <section className={shellClass}>
        <div ref={scrollRef} className={scrollClass}>
          {/* Welcome state, vertically centered and filling the scroll area */}
          {!hasMessages && !isLoading && (
            <AtlasWelcome
              onStartResearch={handleStartResearch}
              onSuggestion={handleSuggestion}
            />
          )}

          {/* Message thread */}
          <div className="mx-auto max-w-4xl">
            {messages.map((message, idx) => {
              const isLastMessage = message.id === messages[messages.length - 1]?.id;
              const isStreamingMsg = isLoading && isLastMessage;
              const hideForReport = isReport && isStreamingMsg && message.role === "assistant";

              // Detect if this assistant message is a report by checking preceding user message
              let msgReportMode: "market" | "company" | undefined;
              let msgReportQuery: string | undefined;
              if (message.role === "assistant" && idx > 0) {
                const prevMsg = messages[idx - 1];
                if (prevMsg?.role === "user") {
                  const rawText = getMessageText(prevMsg.parts);
                  const modeMatch = rawText.match(/^\[mode:(market|company)]\s*/);
                  if (modeMatch) {
                    msgReportMode = modeMatch[1] as "market" | "company";
                    msgReportQuery = rawText.slice(modeMatch[0].length);
                  }
                }
              }

              return (
                <AtlasChatMessage
                  key={message.id}
                  role={message.role as "user" | "assistant"}
                  content={getMessageText(message.parts)}
                  onCommand={
                    message.role === "assistant" && idx === lastAssistantIdx && !isLoading
                      ? handleCommand
                      : undefined
                  }
                  isStreaming={isStreamingMsg && !hideForReport}
                  isHidden={hideForReport}
                  isRevealing={reportRevealing && isLastMessage && message.role === "assistant"}
                  reportMode={msgReportMode}
                  reportQuery={msgReportQuery}
                />
              );
            })}
            {(isLoading || (reportRevealing && isReport)) && (
              <AtlasResearchProgress
                visible
                mode={researchMode}
                stages={progressStages}
                isComposing={isReport && isLoading && progressStages.some(s => s.id === "synthesis")}
                isFadingOut={reportRevealing}
              />
            )}
          </div>
        </div>

        {/* Composer */}
        <div className={inputClass}>
          <div className="relative mx-auto max-w-4xl">
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

            <div className="mx-auto w-full max-w-[48rem]">
              {/* Research mode buttons */}
              <div className="mb-2 flex gap-1.5">
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

              {/* Research form appears above input when a mode is active */}
              {activeForm && (
                <AtlasResearchForm
                  mode={activeForm}
                  onSubmit={handleResearchFormSubmit}
                  onClose={() => setActiveForm(null)}
                />
              )}
            </div>

            {/* Input area */}
            <div className="atlas-input-wrap">
              <div className="flex items-end gap-0">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={hasMessages ? "Ask a follow-up..." : "Ask about a deal or thesis..."}
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

function AtlasChatHistoryPanel({
  open,
  sessions,
  activeSessionId,
  isLoading,
  onClose,
  onNewChat,
  onSelectSession,
  onDeleteSession,
}: {
  open: boolean;
  sessions: AtlasChatSession[];
  activeSessionId: string;
  isLoading: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onSelectSession: (session: AtlasChatSession) => void;
  onDeleteSession: (sessionId: string) => void;
}) {
  return (
    <aside className="atlas-history-panel" aria-hidden={!open} inert={!open}>
      <div className="flex h-14 items-center justify-between border-b border-line/45 px-4">
        <div className="flex items-center gap-2">
          <History size={15} strokeWidth={1.7} className="text-accent" />
          <span className="font-mono-label text-[0.68rem] text-ink">Chat history</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="atlas-history-icon-button"
          aria-label="Close chat history"
        >
          <PanelLeftClose size={15} strokeWidth={1.8} />
        </button>
      </div>

      <div className="border-b border-line/35 p-3">
        <button
          type="button"
          onClick={onNewChat}
          className="atlas-history-new-chat"
        >
          <MessageSquarePlus size={15} strokeWidth={1.8} />
          New chat
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {sessions.length === 0 ? (
          <div className="px-3 py-5 text-sm leading-6 text-stone/65">
            Your ATLAS IQ research threads will appear here after you start a chat.
          </div>
        ) : (
          <div className="space-y-1">
            {sessions.map((session) => {
              const active = session.id === activeSessionId;
              return (
                <div
                  key={session.id}
                  className={`atlas-history-row ${active ? "is-active" : ""}`}
                >
                  <button
                    type="button"
                    onClick={() => onSelectSession(session)}
                    disabled={isLoading}
                    className="min-w-0 flex-1 text-left disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span className="block truncate text-sm font-medium text-ink">
                      {session.title}
                    </span>
                    <span className="mt-1 block truncate text-xs text-stone/70">
                      {session.preview}
                    </span>
                    <span className="mt-2 block font-mono-label text-[0.58rem] text-stone/45">
                      {new Intl.DateTimeFormat("en", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      }).format(session.updatedAt)}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteSession(session.id)}
                    className="atlas-history-delete"
                    aria-label={`Delete ${session.title}`}
                  >
                    <Trash2 size={13} strokeWidth={1.7} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}
