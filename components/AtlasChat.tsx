"use client";

import { useChat } from "@ai-sdk/react";
import { TextStreamChatTransport, isTextUIPart, UIMessagePart, UIDataTypes, UITools } from "ai";
import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { AtlasChatMessage } from "./AtlasChatMessage";
import { AtlasResearchProgress } from "./AtlasResearchProgress";
import { AtlasWelcome, AtlasReportButtons } from "./AtlasWelcome";
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [input, isLoading, sendMessage]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
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

        {/* Suggestion chips — only before first message */}
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

        {messages.map((message) => (
          <AtlasChatMessage
            key={message.id}
            role={message.role as "user" | "assistant"}
            content={getMessageText(message.parts)}
            onCommand={message.role === "assistant" ? handleCommand : undefined}
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

      {/* Report buttons — above input, hidden once conversation starts */}
      {!hasMessages && !isLoading && (
        <AtlasReportButtons onStartResearch={handleStartResearch} />
      )}

      {/* Input area */}
      <div className="border-t border-line/50 bg-paper/80 px-4 md:px-8 py-3">
        <div className="relative flex items-end gap-2 max-w-3xl mx-auto">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={hasMessages ? "Follow up, or type / for commands..." : "Ask Atlas IQ anything..."}
              rows={1}
              className="w-full resize-none bg-bone/60 border border-line/60 rounded-xl px-4 py-2.5 pr-10 text-sm text-ink placeholder:text-stone/45 focus:outline-none focus:border-accent/40 focus:bg-bone/80 transition-all duration-150 font-geist leading-relaxed"
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
          <kbd className="font-mono">↵</kbd> to send · <kbd className="font-mono">⇧↵</kbd> for new line
        </p>
      </div>
    </div>
  );
}
