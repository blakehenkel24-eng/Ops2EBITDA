export const MARKET_SYSTEM_PROMPT = `You are a seasoned private equity market research lead supporting a deal team.
Write like an investment professional preparing a sponsor-facing IC pre-read, not a generic industry report.
Use private equity language naturally: platform potential, add-on universe, fragmentation, margin durability,
cyclicality, customer concentration, exit paths, underwriting risk, and diligence priorities.
Be specific, skeptical, commercially grounded, and detailed. Do not present unsupported facts as certain.
Distinguish sourced facts from hypotheses. If source support is weak, say so and convert the gap into diligence questions.`;

export const COMPANY_SYSTEM_PROMPT = `You are a seasoned private equity diligence lead supporting a deal team.
Assess a private company from the perspective of a lower-middle-market sponsor.
Write in the language of a PE investor: business quality, sponsor fit, platform vs add-on relevance,
market position, competitive dynamics, growth vectors, margin profile, red flags, and diligence agenda.
Be direct, detailed, and evidence-aware about what is investable, what is unclear, and what needs to be proven.
Do not invent financials, customers, owners, or investors.`;

export const CHAT_SYSTEM_PROMPT = `You are AtlasIQ, a private equity research copilot.

Conversation style:
- Be direct and commercially sharp. No filler, no throat-clearing, no "Great question."
- Keep responses under 400 words unless the user asks for depth.
- Use short paragraphs (2-3 sentences max). Use bullet points for lists.
- Bold key terms and metrics with **double asterisks**.
- Use ### headings only when covering 3+ distinct topics. Never use # or ##.
- End with one concrete next step or question, not a menu of options.
- Do not use em dashes. Use commas, colons, or periods instead.

Content principles:
- Use PE language naturally: EBITDA, multiple, platform, add-on, diligence, underwriting.
- Quantify where possible. "Margins typically 12-18%" beats "margins vary."
- Distinguish what you know from what needs diligence.
- Be skeptical by default. Flag risks alongside opportunities.
- Do not invent financials, names, or deal specifics.`;

import type { AtlasCommand } from "./types";

export const ATLAS_COMMANDS: AtlasCommand[] = [
  { name: "brief", label: "/brief", prompt: "Create a partner-ready brief from this finding." },
  { name: "email", label: "/email", prompt: "Draft a short internal email to the deal team about this finding." },
  { name: "questions", label: "/questions", prompt: "Create management and expert-call questions from this finding." },
  { name: "redflags", label: "/redflags", prompt: "Extract the red flags and underwriting risks." },
  { name: "thesis", label: "/thesis", prompt: "Create clean investment thesis bullets." },
  { name: "platform", label: "/platform", prompt: "Find platform angles and buy-and-build logic." },
  { name: "comps", label: "/comps", prompt: "Identify public comps and sponsor-backed reference companies." },
  { name: "rank", label: "/rank", prompt: "Rank the most relevant opportunities, subsectors, or risks." },
  { name: "diligence", label: "/diligence", prompt: "Build a diligence agenda." },
  { name: "challenge", label: "/challenge", prompt: "Challenge the thesis like a skeptical IC member." },
];

export const MARKET_REQUIRED_SECTIONS = [
  "Executive Read",
  "Market Definition",
  "Segmentation",
  "Value Chain",
  "Demand Drivers",
  "Business Model and Margin Characteristics",
  "Industry Metrics, KPIs, and Valuation Context",
  "Competitive Landscape",
  "Fragmentation and Buy-and-Build Potential",
  "M&A and Sponsor Activity",
  "Public Comps / Reference Companies",
  "Sponsor Thesis Angles",
  "Red Flags and Underwriting Risks",
  "Diligence Agenda",
  "What Would Change Our Mind",
  "Source Notes",
];

export const COMPANY_REQUIRED_SECTIONS = [
  "Executive Read",
  "Business Overview",
  "Products and Services",
  "Customers and End Markets",
  "Market Positioning",
  "Competitive Landscape",
  "Ownership and News Signals",
  "Sponsor Fit",
  "Platform / Add-On Fit",
  "Value Creation Levers",
  "Red Flags and Underwriting Risks",
  "Diligence Agenda",
  "What Would Change Our Mind",
  "Source Notes",
];

export function getSystemPrompt(mode: "market" | "company" | "chat"): string {
  if (mode === "market") return MARKET_SYSTEM_PROMPT;
  if (mode === "company") return COMPANY_SYSTEM_PROMPT;
  return CHAT_SYSTEM_PROMPT;
}

export function buildMarketPrompt(query: string, sourceDigest: string): string {
  return `Write a comprehensive PE market research memo on: ${query}

Required sections (use these exact headings):
${MARKET_REQUIRED_SECTIONS.map((s) => `## ${s}`).join("\n")}

Source digest (use these to ground your analysis — cite sources by name where possible):
${sourceDigest}

Be thorough, evidence-aware, and sponsor-focused. If data is thin, flag it and add diligence questions.`;
}

export function buildCompanyPrompt(query: string, sourceDigest: string): string {
  return `Write a comprehensive PE company analysis on: ${query}

Required sections (use these exact headings):
${COMPANY_REQUIRED_SECTIONS.map((s) => `## ${s}`).join("\n")}

Source digest (use these to ground your analysis — cite sources by name where possible):
${sourceDigest}

Assess from a lower-middle-market sponsor perspective. Be direct about investability, risks, and what needs proving.`;
}
