import { extractText, getDocumentProxy } from "unpdf";
import { generateText } from "ai";
import { getAtlasModel } from "@/lib/atlas/llm";

const MAX_CHARS = 120_000;

export async function extractPdfText(bytes: Uint8Array): Promise<string> {
  const pdf = await getDocumentProxy(bytes);
  const { text } = await extractText(pdf, { mergePages: false });
  return (Array.isArray(text) ? text.join("\n") : text).trim();
}

const PROMPT_BY_TYPE: Record<string, string> = {
  cim: "This is a CIM (marketing document). Extract a factual digest for a PE deal team: business overview, products/customers, revenue, EBITDA, margin, growth, customer concentration, and any flagged risks. Be terse and quantitative. Do not editorialize.",
  qoe: "This is a Quality of Earnings report. Extract: adjusted/normalized EBITDA, key add-backs, revenue quality notes, working-capital observations, and any earnings-quality red flags.",
};

export async function digestDocumentText(docType: string, raw: string): Promise<string> {
  const instruction =
    PROMPT_BY_TYPE[docType] ??
    "Extract a terse, quantitative factual digest of this deal document for a PE deal team.";
  const clipped = raw.slice(0, MAX_CHARS);
  const { text } = await generateText({
    model: getAtlasModel(),
    temperature: 0.2,
    prompt: `${instruction}\n\nDocument text:\n${clipped}\n\nDigest (under 400 words):`,
  });
  return text.trim();
}
