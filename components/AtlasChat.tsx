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
  return parts
    .filter(isTextUIPart)
    .map((p) => p.text)
    .join("");
}

const SUGGESTIONS = [
  "Top value creation levers for HVAC roll-ups",
  "Red flags in a facilities management target",
  "What makes a good PE platform in waste services?",
  "Compare maintenance vs. project revenue quality",
];

export function AtlasChat({ fullPage = false }: { fullPage?: boolean }) {
  const [researchMode, setResearchMode] = useState<string>("chat");
  const [input, setInput] = useState("");
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashFilter, setSlashFilter] = useState("");
  const [slashIndex, setSlashIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const slashMenuRef = useRef<HTMLDivElement>(null);

  const transport = useMemo(
    () =>
      new TextStreamChatTransport({
        api: "/api/atlas/chat",
        body: { mode: researchMode },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [researchMode]
  );

  const { messages, sendMessage, status } = useChat({ transport });

  const isLoading = status === "submitted" || status === "streaming";
  const hasMessages = messages.length > 0;

  // Find last assistant message index for command bar
  const lastAssistantIdx = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "assistant") return i;
    }
    return -1;
  }, [messages]);

  // Filtered slash commands
  const filteredCommands = useMemo(() => {
    if (!slashFilter) return ATLAS_COMMANDS;
    return ATLAS_COMMANDS.filter((cmd) =>
      cmd.name.startsWith(slashFilter.toLowerCase())
    );
  }, [slashFilter]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isLoading]);

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

  // Detect slash command typing
  useEffect(() => {
    if (input === "/") {
      setShowSlashMenu(true);
      setSlashFilter("");
      setSlashIndex(0);
    } else if (input.startsWith("/") && !input.includes(" ")) {
      setShowSlashMenu(true);
      setSlashFilter(input.slice(1));
      setSlashIndex(0);
    } else {
      setShowSlashMenu(false);
    }
  }, [input]);

  const handleCommand = useCallback(
    (command: string) => {
      sendMessage({ text: command });
    },
    [sendMessage]
  );

  const handleStartResearch = useCallback(
    (mode: string, query: string) => {
      setResearchMode(mode);
      sendMessage({ text: query });
    },
    [sendMessage]
  );

  const handleSend = useCallback(() => {
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input.trim() });
    setInput("");
    setShowSlashMenu(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [input, isLoading, sendMessage]);

  const handleSlashSelect = useCallback(
    (cmd: string) => {
      sendMessage({ text: `/${cmd}` });
      setInput("");
      setShowSlashMenu(false);
    },
    [sendMessage]
  );

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
          setShowSlashMenu(false);
          return;
        }
        if (e.key === "Tab") {
          e.preventDefault();
          setInput(`/${filteredCommands[slashIndex].name}`);
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

  return (
    <div
      className={`flex flex-col ${fullPage ? "h-[calc(100vh-4rem)]" : "h-full"}`}
    >
      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
        {!hasMessages && <AtlasWelcome onStartResearch={handleStartResearch} />}

        {/* Suggestion chips */}
        {!hasMessages && !isLoading && (
          <div className="flex flex-wrap gap-2 justify-center max-w-xl mx-auto mb-6">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleSuggestion(s)}
                className="text-xs text-stone/70 border border-line/40 rounded-full px-3 py-1.5 hover:border-accent/30 hover:text-accent hover:bg-accent/4 transition-all duration-150 font-geist"
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
        <AtlasResearchProgress
          stage="Atlas IQ is thinking..."
          visible={isLoading}
        />
      </div>

      {/* Report buttons */}
      {!hasMessages && !isLoading && (
        <AtlasReportButtons onStartResearch={handleStartResearch} />
      )}

      {/* Input area */}
      <div className="border-t border-line/50 bg-paper/80 px-4 md:px-8 py-3">
        <div className="relative max-w-3xl mx-auto">
          {/* Slash command menu */}
          {showSlashMenu && filteredCommands.length > 0 && (
            <div className="absolute bottom-full left-0 w-full mb-2 bg-paper border border-line/60 rounded-xl shadow-lg overflow-hidden z-20">
              <div className="px-3 py-2 border-b border-line/30">
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
                        ? "bg-accent/6 text-ink"
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
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={hasMessages ? "Follow up, or type / for commands..." : "Ask Atlas IQ anything..."}
                rows={1}
                className="w-full resize-none bg-bone/60 border border-line/60 rounded-xl px-4 py-2.5 text-sm text-ink placeholder:text-stone/45 focus:outline-none focus:border-accent/40 focus:bg-bone/80 transition-all duration-150 font-geist leading-relaxed"
              />
            </div>
            <button
              type="button"
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="w-8 h-8 rounded-lg bg-accent text-white flex items-center justify-center disabled:opacity-25 transition-opacity duration-150 shrink-0 mb-0.5"
            >
              <ArrowUp size={15} strokeWidth={2} />
            </button>
          </div>
          <p className="text-[10px] text-stone/35 text-center mt-1.5 font-geist">
            <kbd className="font-mono">↵</kbd> to send · <kbd className="font-mono">⇧↵</kbd> for new line · <kbd className="font-mono">/</kbd> for commands
          </p>
        </div>
      </div>
    </div>
  );
}
