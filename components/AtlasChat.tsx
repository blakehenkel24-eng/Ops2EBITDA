"use client";

import { useChat } from "@ai-sdk/react";
import { TextStreamChatTransport, isTextUIPart, UIMessagePart, UIDataTypes, UITools } from "ai";
import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { AtlasChatMessage } from "./AtlasChatMessage";
import { AtlasResearchProgress } from "./AtlasResearchProgress";
import { AtlasWelcome } from "./AtlasWelcome";
import { Send } from "lucide-react";

function getMessageText(parts: UIMessagePart<UIDataTypes, UITools>[]): string {
  return parts
    .filter(isTextUIPart)
    .map((p) => p.text)
    .join("");
}

export function AtlasChat({ fullPage = false }: { fullPage?: boolean }) {
  const [researchMode, setResearchMode] = useState<string>("chat");
  const [started, setStarted] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const handleCommand = useCallback(
    (command: string) => {
      sendMessage({ text: command });
    },
    [sendMessage]
  );

  const handleStartResearch = useCallback(
    (mode: string, query: string) => {
      setResearchMode(mode);
      setStarted(true);
      sendMessage({ text: query });
    },
    [sendMessage]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim()) return;
      if (!started) setStarted(true);
      sendMessage({ text: input });
      setInput("");
    },
    [input, started, sendMessage]
  );

  if (!started && messages.length === 0) {
    return <AtlasWelcome onStartResearch={handleStartResearch} />;
  }

  return (
    <div
      className={`flex flex-col ${fullPage ? "h-[calc(100vh-4rem)]" : "h-full"}`}
    >
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
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
          stage="Generating response..."
          visible={isLoading}
        />
      </div>

      <form
        onSubmit={handleSubmit}
        className="border-t border-line/70 bg-paper px-4 md:px-8 py-3 flex items-center gap-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Follow up, or type / for commands..."
          className="flex-1 bg-bone border border-line/80 rounded-lg px-4 py-2.5 text-sm text-ink placeholder:text-stone focus:outline-none focus:border-accent/50 transition-colors font-geist"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-accent text-white w-9 h-9 rounded-lg flex items-center justify-center disabled:opacity-40 transition-opacity"
        >
          <Send size={16} strokeWidth={1.5} />
        </button>
      </form>
    </div>
  );
}
