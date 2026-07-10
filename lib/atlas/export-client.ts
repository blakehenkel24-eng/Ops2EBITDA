import type { ResearchMemo, ResearchMode } from "./types";

export type AtlasExportFormat = "pdf" | "docx";

export interface ExportTarget {
  mode: ResearchMode;
  query: string;
  markdown: string;
}

export interface ExportMessage {
  role: string;
  text: string;
}

const REPORT_PREFIX_RE = /^\[mode:(market|company)]\s*/;

export function buildExportMemo(target: ExportTarget): ResearchMemo {
  return {
    mode: target.mode,
    query: target.query,
    markdown: target.markdown,
    sources: [],
    confidence: "medium",
    createdAt: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    scores: {},
  };
}

export function getExportCommandFormat(input: string): AtlasExportFormat | null {
  const normalized = input.trim().toLowerCase();
  if (normalized === "/pdf") return "pdf";
  if (normalized === "/word" || normalized === "/docx") return "docx";
  return null;
}

export function getLastAssistantExportTarget(messages: ExportMessage[]): ExportTarget | null {
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    if (message.role !== "assistant" || !message.text.trim()) continue;

    const previousUser = findPreviousUserMessage(messages, i);
    const userText = previousUser?.text.trim() ?? "";
    const reportMatch = userText.match(REPORT_PREFIX_RE);

    if (reportMatch) {
      return {
        mode: reportMatch[1] as "market" | "company",
        query: userText.slice(reportMatch[0].length).trim() || "Atlas IQ report",
        markdown: message.text,
      };
    }

    return {
      mode: "chat",
      query: userText || "Atlas IQ chat export",
      markdown: message.text,
    };
  }

  return null;
}

export async function downloadAtlasExport(target: ExportTarget, format: AtlasExportFormat) {
  const memo = buildExportMemo(target);
  const res = await fetch(`/api/atlas/export?format=${format}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(memo),
  });

  if (!res.ok) throw new Error("Export failed");

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `atlas-iq-${target.mode}-export.${format}`;
  link.click();
  URL.revokeObjectURL(url);
}

function findPreviousUserMessage(messages: ExportMessage[], beforeIndex: number) {
  for (let i = beforeIndex - 1; i >= 0; i--) {
    if (messages[i].role === "user") return messages[i];
  }
  return null;
}
