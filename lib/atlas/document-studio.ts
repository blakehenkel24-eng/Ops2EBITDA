export interface SampleFramework {
  id: "buy-side" | "mutual";
  name: string;
  description: string;
}

export type FindingSeverity = "change" | "review" | "escalate";
export type FindingDecision = "accepted" | "rejected" | "escalated";

export interface DocumentFinding {
  id: string;
  clause: string;
  severity: FindingSeverity;
  sourceId: string;
  sourceText: string;
  recommendation: string;
  reason: string;
  frameworkRule: string;
}

export interface DocumentInspection {
  filename: string;
  size: number;
  paragraphCount: number;
  wordCount: number;
  frameworkId: SampleFramework["id"];
  findings: DocumentFinding[];
}

export const MAX_DOCX_BYTES = 15 * 1024 * 1024;

export const SAMPLE_FRAMEWORKS: SampleFramework[] = [
  {
    id: "buy-side",
    name: "Standard Buy-Side NDA",
    description: "Illustrative positions for a one-way evaluation process.",
  },
  {
    id: "mutual",
    name: "Mutual NDA",
    description: "Illustrative positions when both parties disclose information.",
  },
];

export function isDocxFilename(filename: string) {
  return filename.toLowerCase().endsWith(".docx");
}

export function validateDocxFile(file: Pick<File, "name" | "size" | "type">): string | null {
  if (!isDocxFilename(file.name)) return "Choose a Word .docx file.";
  if (file.size === 0) return "This file is empty.";
  if (file.size > MAX_DOCX_BYTES) return "Choose a .docx file smaller than 15 MB.";
  if (file.type && file.type !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    return "This file does not appear to be a Word .docx document.";
  }
  return null;
}

export function reviewIsComplete(findings: DocumentFinding[], decisions: Record<string, FindingDecision>) {
  return findings.length > 0 && findings.every((finding) => Boolean(decisions[finding.id]));
}
