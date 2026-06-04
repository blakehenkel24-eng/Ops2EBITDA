export type ResearchMode = "market" | "company" | "chat";

export interface ResearchSource {
  title: string;
  url: string;
  type: "web" | "tavily" | "registry" | "placeholder";
  signal: string;
  snippet: string;
  query: string;
  rank: number;
  score: number;
}

export interface ResearchMemo {
  mode: ResearchMode;
  query: string;
  markdown: string;
  sources: ResearchSource[];
  confidence: "low" | "medium" | "high";
  createdAt: string;
  scores: Record<string, string>;
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AtlasCommand {
  name: string;
  label: string;
  prompt: string;
}

export interface ProgressUpdate {
  stage: string;
  description: string;
  completed: number;
  total: number;
}
