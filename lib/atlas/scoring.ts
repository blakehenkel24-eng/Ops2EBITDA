import type { ResearchSource } from "./types";

// ─── Term Sets ────────────────────────────────────────────────────────────────

const PE_TERMS = [
  "private equity",
  "acquisition",
  "m&a",
  "sponsor",
  "platform",
];

const MARKET_TERMS = [
  "market size",
  "growth",
  "cagr",
  "revenue",
  "margin",
];

const COMPANY_TERMS = [
  "company",
  "business",
  "founded",
  "ceo",
  "headquarters",
  "employees",
  "revenue",
];

// ─── Scoring ──────────────────────────────────────────────────────────────────

export function scoreSource(source: ResearchSource): number {
  const text = `${source.title} ${source.snippet}`.toLowerCase();
  let score = 0;

  // URL presence
  if (source.url) score += 20;

  // Snippet length
  if (source.snippet.length >= 800) {
    score += 20;
  } else if (source.snippet.length >= 250) {
    score += 10;
  }

  // PE terms
  if (PE_TERMS.some((t) => text.includes(t))) score += 15;

  // Market terms
  if (MARKET_TERMS.some((t) => text.includes(t))) score += 15;

  // Company terms
  if (COMPANY_TERMS.some((t) => text.includes(t))) score += 10;

  // Source type bonuses
  if (source.type === "registry") score += 15;
  if (source.signal === "sec-edgar") score += 10;
  if (source.type === "tavily") score += 8;

  // Placeholder penalty
  if (source.type === "placeholder") score -= 100;

  return score;
}

export function rankSources(sources: ResearchSource[]): ResearchSource[] {
  const scored = sources.map((s) => ({
    ...s,
    score: scoreSource(s),
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored.map((s, i) => ({
    ...s,
    rank: i + 1,
  }));
}

// ─── Digest Builder ───────────────────────────────────────────────────────────

/** Expects pre-ranked sources (call rankSources first). Matches terminal digest format. */
export function buildSourceDigest(sources: ResearchSource[]): string {
  if (sources.length === 0) {
    return "No live sources were available. Treat the report as a framework and make source gaps explicit.";
  }

  return sources
    .slice(0, 32)
    .map((s) => {
      const snippet = s.snippet.slice(0, 3000);
      const lines: string[] = [
        `[${s.rank || "?"}] ${s.title}`,
        `Type: ${s.type} | Score: ${s.score} | Query: ${s.query || "n/a"}`,
        `URL: ${s.url || "n/a"}`,
        `Signal: ${s.signal || "context"}`,
        `Excerpt: ${snippet}`,
      ];
      return lines.join("\n");
    })
    .join("\n\n");
}
