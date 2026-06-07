# Atlas IQ Integration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate Atlas IQ as a TypeScript-native AI research product into the Ops2EBITDA Next.js app — landing page, full chat UI, embedded sidebar, streaming LLM, web research, operating library, and PDF export.

**Architecture:** Hybrid monolith in Next.js with Vercel AI SDK streaming. All new code namespaced under `lib/atlas/`, `/api/atlas/`, and `Atlas*` components. Operating library stored in Supabase pgvector (50MB index too large for static JSON). Single Vercel deploy.

**Tech Stack:** Next.js 16, React 19, Vercel AI SDK (`ai` + `@ai-sdk/openai`), Tailwind CSS 4, cheerio, jspdf, Supabase (pgvector for embeddings)

**Design spec:** `docs/superpowers/specs/2026-06-03-atlas-iq-integration-design.md`

---

## File Structure

```
NEW FILES:
  lib/atlas/types.ts              — Shared TypeScript types
  lib/atlas/prompts.ts            — PE system prompts (market/company/chat) + command mappings
  lib/atlas/research.ts           — DuckDuckGo scraper + Tavily adapter
  lib/atlas/scoring.ts            — Source ranking algorithm
  lib/atlas/library.ts            — Operating library embedding search (Supabase pgvector)
  lib/atlas/llm.ts                — OpenRouter client config for Vercel AI SDK
  lib/atlas/export.ts             — PDF generation with jspdf
  app/api/atlas/chat/route.ts     — Streaming chat endpoint
  app/api/atlas/research/route.ts — Market/company research pipeline
  app/api/atlas/library/route.ts  — Operating library query endpoint
  app/api/atlas/export/route.ts   — PDF generation endpoint
  components/AtlasSourceTags.tsx  — Source citation pills
  components/AtlasCommandBar.tsx  — PE slash command buttons
  components/AtlasMemoCard.tsx    — Structured memo rendering
  components/AtlasChatMessage.tsx — Message bubble (user + assistant)
  components/AtlasResearchProgress.tsx — Status indicator
  components/AtlasWelcome.tsx     — Initial state: mode picker + examples
  components/AtlasChat.tsx        — Main chat container (useChat hook)
  components/AtlasSidebar.tsx     — Slide-out panel + floating button
  app/atlas-iq/page.tsx           — Landing page
  app/atlas-iq/chat/page.tsx      — Full-page chat interface

MODIFIED FILES:
  package.json                    — Add dependencies
  components/ClientNav.tsx        — Add Atlas IQ nav link
  app/layout.tsx                  — Mount AtlasSidebar globally
  .env.local                      — Add API keys
```

---

## Task 1: Install Dependencies and Configure Environment

**Files:**
- Modify: `package.json`
- Modify: `.env.local`

- [ ] **Step 1: Install npm packages**

```bash
cd /Users/blakehenkelsmacbook/Desktop/Blake\'s-Vault/Projects/Ops2EBITDA
npm install ai @ai-sdk/openai cheerio jspdf
npm install -D @types/cheerio
```

- [ ] **Step 2: Add environment variables to `.env.local`**

Add these lines to the existing `.env.local`:

```
# Atlas IQ
OPENROUTER_API_KEY=
OPENROUTER_MODEL=deepseek/deepseek-chat
TAVILY_API_KEY=
OPENAI_API_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_KEY=
```

- [ ] **Step 3: Verify build still passes**

```bash
npm run build
```

Expected: Build succeeds with no errors. Existing site unchanged.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json .env.local
git commit -m "feat(atlas-iq): add dependencies for Atlas IQ integration

ai, @ai-sdk/openai, cheerio, jspdf, env vars for OpenRouter/Tavily/Supabase"
```

---

## Task 2: Types and Prompts

**Files:**
- Create: `lib/atlas/types.ts`
- Create: `lib/atlas/prompts.ts`

- [ ] **Step 1: Create shared types**

```typescript
// lib/atlas/types.ts

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
```

- [ ] **Step 2: Create PE system prompts and command mappings**

```typescript
// lib/atlas/prompts.ts

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
Have a normal conversation first. Be warm, commercially sharp, and appropriately detailed.
Use PE language naturally when useful, but do not pretend to have live source-backed facts unless the user starts research.
If the user asks for research, help clarify the target before a memo is generated.
For specific operating questions, provide a punchy, properly formatted, detailed answer with practical levers, diligence questions,
risks, and a clear suggested next step. Quantify the operating logic where possible. Use concise headings and bullets.
Do not be generic, academic, or framework-first.`;

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
```

- [ ] **Step 3: Verify typecheck**

```bash
npm run typecheck
```

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add lib/atlas/types.ts lib/atlas/prompts.ts
git commit -m "feat(atlas-iq): add types and PE system prompts

Ported from Python agent — ResearchSource, ResearchMemo, ChatMessage types.
System prompts for market/company/chat modes. Slash command mappings."
```

---

## Task 3: Web Research Module

**Files:**
- Create: `lib/atlas/research.ts`
- Create: `lib/atlas/scoring.ts`

- [ ] **Step 1: Create DuckDuckGo scraper + Tavily adapter**

```typescript
// lib/atlas/research.ts

import * as cheerio from "cheerio";
import type { ResearchSource } from "./types";

const MAX_RESULTS_PER_QUERY = 4;

export async function searchDuckDuckGo(
  query: string,
  limit = MAX_RESULTS_PER_QUERY
): Promise<ResearchSource[]> {
  const response = await fetch(
    `https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`,
    {
      headers: { "User-Agent": "AtlasIQ/1.0 research agent" },
      signal: AbortSignal.timeout(20_000),
    }
  );

  if (!response.ok) return [];

  const html = await response.text();
  const $ = cheerio.load(html);
  const sources: ResearchSource[] = [];

  $("a.result__a")
    .slice(0, limit)
    .each((i, el) => {
      const rawHref = $(el).attr("href") || "";
      const url = normalizeDuckDuckGoUrl(rawHref);
      if (!url) return;

      const title = $(el).text().trim();
      const snippetEl = $("a.result__snippet").eq(i);
      const snippet = snippetEl.text().trim();

      sources.push({
        title: title || url,
        url,
        type: "web",
        signal: snippet || "web result",
        snippet: snippet,
        query,
        rank: 0,
        score: 0,
      });
    });

  return sources;
}

export async function searchTavily(
  query: string,
  apiKey: string,
  limit = MAX_RESULTS_PER_QUERY
): Promise<ResearchSource[]> {
  try {
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        query,
        search_depth: "advanced",
        max_results: limit,
        include_answer: false,
        include_raw_content: false,
        include_images: false,
      }),
      signal: AbortSignal.timeout(30_000),
    });

    if (!response.ok) return [];

    const data = await response.json();
    return (data.results || []).slice(0, limit).map(
      (r: { url?: string; title?: string; content?: string }): ResearchSource => ({
        title: (r.title || r.url || "").trim(),
        url: (r.url || "").trim(),
        type: "tavily",
        signal: (r.content || "Tavily result").trim(),
        snippet: (r.content || "").trim().slice(0, 3000),
        query,
        rank: 0,
        score: 0,
      })
    );
  } catch {
    return [];
  }
}

export async function fetchPageText(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "AtlasIQ/1.0 research agent" },
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) return "";
    const html = await response.text();
    const $ = cheerio.load(html);
    $("script, style, noscript").remove();
    return $("body").text().replace(/\s+/g, " ").trim().slice(0, 3000);
  } catch {
    return "";
  }
}

export function getMarketQueries(market: string): string[] {
  return [
    `${market} market size CAGR growth drivers`,
    `${market} industry fragmentation consolidation private equity`,
    `${market} M&A activity acquisitions sponsor backed companies`,
    `${market} leading companies competitive landscape public comps`,
    `${market} margins labor cost cyclicality industry risks`,
  ];
}

export function getCompanyQueries(company: string): string[] {
  return [
    `${company} company overview customers competitors`,
    `${company} market positioning private company competitors`,
    `${company} funding acquisition ownership revenue leadership`,
    `${company} private equity acquisition add-on platform`,
  ];
}

export async function gatherSources(
  queries: string[],
  tavilyApiKey?: string
): Promise<ResearchSource[]> {
  const allSources: ResearchSource[] = [];

  const searchPromises = queries.map(async (query) => {
    if (tavilyApiKey) {
      const tavilyResults = await searchTavily(query, tavilyApiKey);
      if (tavilyResults.length > 0) return tavilyResults;
    }
    return searchDuckDuckGo(query);
  });

  const results = await Promise.all(searchPromises);
  for (const batch of results) {
    allSources.push(...batch);
  }

  return deduplicateSources(allSources);
}

function deduplicateSources(sources: ResearchSource[]): ResearchSource[] {
  const seen = new Set<string>();
  return sources.filter((source) => {
    const key = source.url || source.title;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function normalizeDuckDuckGoUrl(raw: string): string {
  try {
    const parsed = new URL(raw, "https://duckduckgo.com");
    if (
      parsed.hostname.endsWith("duckduckgo.com") &&
      parsed.pathname.startsWith("/l/")
    ) {
      const target = parsed.searchParams.get("uddg");
      return target ? decodeURIComponent(target) : "";
    }
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return raw;
    }
  } catch {
    // invalid URL
  }
  return "";
}
```

- [ ] **Step 2: Create source scoring/ranking**

```typescript
// lib/atlas/scoring.ts

import type { ResearchSource } from "./types";

export function rankSources(sources: ResearchSource[]): ResearchSource[] {
  const scored = sources.map((source) => ({
    ...source,
    score: scoreSource(source),
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored.map((source, i) => ({ ...source, rank: i + 1 }));
}

function scoreSource(source: ResearchSource): number {
  let score = 0;
  const text =
    `${source.title} ${source.url} ${source.signal} ${source.snippet}`.toLowerCase();

  if (source.url) score += 20;

  if (source.snippet.length >= 800) score += 20;
  else if (source.snippet.length >= 250) score += 10;

  const peTerms = ["private equity", "acquisition", "m&a", "sponsor", "platform"];
  if (peTerms.some((t) => text.includes(t))) score += 15;

  const marketTerms = ["market size", "growth", "cagr", "revenue", "margin"];
  if (marketTerms.some((t) => text.includes(t))) score += 15;

  const companyTerms = ["company", "customers", "competitors", "leadership", "ownership"];
  if (companyTerms.some((t) => text.includes(t))) score += 10;

  if (source.type === "registry") score += 10;
  if (source.type === "tavily") score += 8;
  if (source.type === "placeholder") score -= 100;

  return score;
}

export function buildSourceDigest(sources: ResearchSource[]): string {
  return sources
    .filter((s) => s.type !== "placeholder")
    .map(
      (s, i) =>
        `[Source ${i + 1}: ${s.title}](${s.url})\n${s.snippet.slice(0, 1500)}`
    )
    .join("\n\n---\n\n");
}
```

- [ ] **Step 3: Verify typecheck**

```bash
npm run typecheck
```

- [ ] **Step 4: Commit**

```bash
git add lib/atlas/research.ts lib/atlas/scoring.ts
git commit -m "feat(atlas-iq): add web research and source scoring

DuckDuckGo HTML scraping + Tavily REST API. Parallel query execution.
Source ranking ported from Python with PE-relevance signals."
```

---

## Task 4: Operating Library (Supabase pgvector)

**Files:**
- Create: `lib/atlas/library.ts`

The operating library index is 50MB (1,126 chunks × 1,536-dim embeddings). Too large for static JSON. Store in Supabase with pgvector for cosine similarity search.

- [ ] **Step 1: Create Supabase migration for operating library table**

Run this SQL via Supabase dashboard or MCP:

```sql
create extension if not exists vector;

create table atlas_operating_chunks (
  id text primary key,
  source_title text not null,
  location text not null default '',
  text text not null,
  embedding vector(1536) not null,
  primary_tags text[] default '{}',
  secondary_tags text[] default '{}',
  created_at timestamptz default now()
);

create index on atlas_operating_chunks using ivfflat (embedding vector_cosine_ops)
  with (lists = 50);
```

- [ ] **Step 2: Create upload script to seed Supabase from existing index.json**

```bash
# One-time data migration — run locally, not part of the app
# Create a temporary script at scripts/seed-operating-library.mjs
```

```javascript
// scripts/seed-operating-library.mjs
import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;
const INDEX_PATH = process.argv[2] || "../Projects/AtlasIQ - PE Market Research/.atlasiq/operating-library/index.json";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const data = JSON.parse(readFileSync(INDEX_PATH, "utf-8"));
const chunks = data.chunks;

console.log(`Uploading ${chunks.length} chunks...`);

const BATCH_SIZE = 50;
for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
  const batch = chunks.slice(i, i + BATCH_SIZE).map((c) => ({
    id: c.chunk_id,
    source_title: c.source_title,
    location: c.location || "",
    text: c.text,
    embedding: c.embedding,
    primary_tags: c.primary_tags || [],
    secondary_tags: c.secondary_tags || [],
  }));

  const { error } = await supabase.from("atlas_operating_chunks").upsert(batch);
  if (error) {
    console.error(`Batch ${i} failed:`, error.message);
  } else {
    console.log(`Uploaded ${Math.min(i + BATCH_SIZE, chunks.length)} / ${chunks.length}`);
  }
}

console.log("Done.");
```

- [ ] **Step 3: Create library search module**

```typescript
// lib/atlas/library.ts

import OpenAI from "openai";

interface LibraryChunk {
  id: string;
  source_title: string;
  location: string;
  text: string;
  similarity: number;
}

export async function searchOperatingLibrary(
  query: string,
  limit = 5
): Promise<LibraryChunk[]> {
  const openaiKey = process.env.OPENAI_API_KEY;
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

  if (!openaiKey || !supabaseUrl || !supabaseKey) return [];

  const openai = new OpenAI({ apiKey: openaiKey });
  const embeddingResponse = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: query,
  });
  const queryEmbedding = embeddingResponse.data[0].embedding;

  const response = await fetch(
    `${supabaseUrl}/rest/v1/rpc/match_operating_chunks`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({
        query_embedding: queryEmbedding,
        match_count: limit,
        match_threshold: 0.3,
      }),
    }
  );

  if (!response.ok) return [];

  return response.json();
}

export function buildLibraryContext(chunks: LibraryChunk[]): string {
  if (chunks.length === 0) return "";

  const blocks = chunks.map(
    (chunk, i) => `Context item ${i + 1}:\n${chunk.text.slice(0, 900)}`
  );

  return (
    "Private operating context:\n" +
    blocks.join("\n\n") +
    "\n\nUse this private operating context as a PE operating lens. " +
    "Do not mention books, chunks, retrieved context, embeddings, files, or internal sources. " +
    "Synthesize the ideas into your own operator-grade answer. " +
    "Push one level deeper than obvious advice: quantify the operating logic where possible."
  );
}
```

- [ ] **Step 4: Create Supabase RPC function for vector search**

Run this SQL via Supabase:

```sql
create or replace function match_operating_chunks(
  query_embedding vector(1536),
  match_count int default 5,
  match_threshold float default 0.3
)
returns table (
  id text,
  source_title text,
  location text,
  text text,
  similarity float
)
language sql stable
as $$
  select
    id,
    source_title,
    location,
    text,
    1 - (embedding <=> query_embedding) as similarity
  from atlas_operating_chunks
  where 1 - (embedding <=> query_embedding) > match_threshold
  order by embedding <=> query_embedding
  limit match_count;
$$;
```

- [ ] **Step 5: Verify typecheck**

```bash
npm run typecheck
```

- [ ] **Step 6: Commit**

```bash
git add lib/atlas/library.ts scripts/seed-operating-library.mjs
git commit -m "feat(atlas-iq): add operating library with Supabase pgvector

1,126 PE book chunks searchable via cosine similarity.
OpenAI text-embedding-3-small for query vectors.
Supabase RPC function for server-side search."
```

---

## Task 5: LLM Client Configuration

**Files:**
- Create: `lib/atlas/llm.ts`

- [ ] **Step 1: Create OpenRouter provider config for Vercel AI SDK**

```typescript
// lib/atlas/llm.ts

import { createOpenAI } from "@ai-sdk/openai";

export function getAtlasProvider() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is required");
  }

  return createOpenAI({
    apiKey,
    baseURL: "https://openrouter.ai/api/v1",
  });
}

export function getAtlasModel() {
  const provider = getAtlasProvider();
  const modelId = process.env.OPENROUTER_MODEL || "deepseek/deepseek-chat";
  return provider(modelId);
}
```

- [ ] **Step 2: Verify typecheck**

```bash
npm run typecheck
```

- [ ] **Step 3: Commit**

```bash
git add lib/atlas/llm.ts
git commit -m "feat(atlas-iq): add OpenRouter LLM client via Vercel AI SDK

DeepSeek via OpenRouter as default model. Configurable via OPENROUTER_MODEL env var."
```

---

## Task 6: PDF Export Module

**Files:**
- Create: `lib/atlas/export.ts`

- [ ] **Step 1: Create PDF generation**

```typescript
// lib/atlas/export.ts

import jsPDF from "jspdf";
import type { ResearchMemo } from "./types";

export function generateMemoPdf(memo: ResearchMemo): ArrayBuffer {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 54;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text("ATLAS IQ — PROPRIETARY RESEARCH MEMO", margin, y);
  y += 24;

  doc.setFontSize(18);
  doc.setTextColor(30);
  doc.text(memo.query, margin, y, { maxWidth: contentWidth });
  y += 28;

  doc.setFontSize(8);
  doc.setTextColor(120);
  const meta = `${memo.mode.toUpperCase()} MODE · ${memo.sources.length} sources · Confidence: ${memo.confidence} · ${memo.createdAt}`;
  doc.text(meta, margin, y);
  y += 24;

  doc.setDrawColor(200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 16;

  doc.setFontSize(10);
  doc.setTextColor(50);

  const lines = memo.markdown.split("\n");
  for (const line of lines) {
    if (y > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      y = margin;
    }

    if (line.startsWith("## ")) {
      y += 8;
      doc.setFontSize(13);
      doc.setTextColor(30);
      doc.text(line.replace("## ", ""), margin, y, { maxWidth: contentWidth });
      y += 18;
      doc.setFontSize(10);
      doc.setTextColor(50);
    } else if (line.startsWith("# ")) {
      y += 12;
      doc.setFontSize(16);
      doc.setTextColor(20);
      doc.text(line.replace("# ", ""), margin, y, { maxWidth: contentWidth });
      y += 22;
      doc.setFontSize(10);
      doc.setTextColor(50);
    } else if (line.trim()) {
      const wrapped = doc.splitTextToSize(line, contentWidth);
      for (const wLine of wrapped) {
        if (y > doc.internal.pageSize.getHeight() - margin) {
          doc.addPage();
          y = margin;
        }
        doc.text(wLine, margin, y);
        y += 14;
      }
    } else {
      y += 8;
    }
  }

  return doc.output("arraybuffer");
}
```

- [ ] **Step 2: Verify typecheck**

```bash
npm run typecheck
```

- [ ] **Step 3: Commit**

```bash
git add lib/atlas/export.ts
git commit -m "feat(atlas-iq): add PDF export for research memos

jsPDF-based PDF generation with section headings, metadata header, pagination."
```

---

## Task 7: API Routes — Chat, Research, Library, Export

**Files:**
- Create: `app/api/atlas/chat/route.ts`
- Create: `app/api/atlas/research/route.ts`
- Create: `app/api/atlas/library/route.ts`
- Create: `app/api/atlas/export/route.ts`

- [ ] **Step 1: Create streaming chat endpoint**

```typescript
// app/api/atlas/chat/route.ts

import { streamText } from "ai";
import { getAtlasModel } from "@/lib/atlas/llm";
import { getSystemPrompt, ATLAS_COMMANDS } from "@/lib/atlas/prompts";
import { searchOperatingLibrary, buildLibraryContext } from "@/lib/atlas/library";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages, mode = "chat" } = await req.json();

  const lastMessage = messages[messages.length - 1]?.content || "";

  const command = ATLAS_COMMANDS.find(
    (cmd) => lastMessage.startsWith(`/${cmd.name}`)
  );

  let systemPrompt = getSystemPrompt(mode as "market" | "company" | "chat");

  if (command) {
    systemPrompt += `\n\nThe user has invoked the ${command.label} command. ${command.prompt} Use the conversation context to generate the requested output.`;
  }

  const libraryChunks = await searchOperatingLibrary(lastMessage, 4);
  const libraryContext = buildLibraryContext(libraryChunks);
  if (libraryContext) {
    systemPrompt += `\n\n${libraryContext}`;
  }

  const result = streamText({
    model: getAtlasModel(),
    system: systemPrompt,
    messages,
    temperature: 0.2,
    maxTokens: 4000,
  });

  return result.toDataStreamResponse();
}
```

- [ ] **Step 2: Create research endpoint**

```typescript
// app/api/atlas/research/route.ts

import { streamText } from "ai";
import { getAtlasModel } from "@/lib/atlas/llm";
import { getSystemPrompt, buildMarketPrompt, buildCompanyPrompt } from "@/lib/atlas/prompts";
import { gatherSources, getMarketQueries, getCompanyQueries } from "@/lib/atlas/research";
import { rankSources, buildSourceDigest } from "@/lib/atlas/scoring";
import { searchOperatingLibrary, buildLibraryContext } from "@/lib/atlas/library";
import type { ResearchMode } from "@/lib/atlas/types";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { query, mode }: { query: string; mode: ResearchMode } = await req.json();

  const queries = mode === "market"
    ? getMarketQueries(query)
    : getCompanyQueries(query);

  const tavilyKey = process.env.TAVILY_API_KEY;
  const rawSources = await gatherSources(queries, tavilyKey);
  const sources = rankSources(rawSources);
  const sourceDigest = buildSourceDigest(sources);

  const libraryChunks = await searchOperatingLibrary(query, 6);
  const libraryContext = buildLibraryContext(libraryChunks);

  let userPrompt = mode === "market"
    ? buildMarketPrompt(query, sourceDigest)
    : buildCompanyPrompt(query, sourceDigest);

  if (libraryContext) {
    userPrompt = libraryContext + "\n\n" + userPrompt;
  }

  const systemPrompt = getSystemPrompt(mode);

  const result = streamText({
    model: getAtlasModel(),
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
    temperature: 0.2,
    maxTokens: 8000,
  });

  const response = result.toDataStreamResponse();

  // Attach sources as a custom header for the client to parse
  const headers = new Headers(response.headers);
  headers.set(
    "X-Atlas-Sources",
    Buffer.from(JSON.stringify(sources.slice(0, 20))).toString("base64")
  );
  headers.set("X-Atlas-Mode", mode);
  headers.set("X-Atlas-Query", encodeURIComponent(query));

  return new Response(response.body, {
    status: response.status,
    headers,
  });
}
```

- [ ] **Step 3: Create library query endpoint**

```typescript
// app/api/atlas/library/route.ts

import { searchOperatingLibrary } from "@/lib/atlas/library";

export async function POST(req: Request) {
  const { query, limit = 5 } = await req.json();
  const chunks = await searchOperatingLibrary(query, limit);
  return Response.json({ chunks });
}
```

- [ ] **Step 4: Create PDF export endpoint**

```typescript
// app/api/atlas/export/route.ts

import { generateMemoPdf } from "@/lib/atlas/export";
import type { ResearchMemo } from "@/lib/atlas/types";

export async function POST(req: Request) {
  const memo: ResearchMemo = await req.json();
  const pdfBuffer = generateMemoPdf(memo);

  return new Response(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="atlas-iq-${memo.mode}-${Date.now()}.pdf"`,
    },
  });
}
```

- [ ] **Step 5: Verify typecheck**

```bash
npm run typecheck
```

- [ ] **Step 6: Commit**

```bash
git add app/api/atlas/
git commit -m "feat(atlas-iq): add API routes — chat, research, library, export

Streaming chat via Vercel AI SDK. Research pipeline with parallel source gathering.
Operating library search via Supabase pgvector. PDF export endpoint."
```

---

## Task 8: UI Components — Atomic Building Blocks

**Files:**
- Create: `components/AtlasSourceTags.tsx`
- Create: `components/AtlasCommandBar.tsx`
- Create: `components/AtlasMemoCard.tsx`
- Create: `components/AtlasChatMessage.tsx`
- Create: `components/AtlasResearchProgress.tsx`

- [ ] **Step 1: Create source citation pills**

```typescript
// components/AtlasSourceTags.tsx

import type { ResearchSource } from "@/lib/atlas/types";

export function AtlasSourceTags({ sources }: { sources: ResearchSource[] }) {
  const visible = sources.filter((s) => s.type !== "placeholder").slice(0, 5);
  const remaining = sources.filter((s) => s.type !== "placeholder").length - visible.length;

  if (visible.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-line/40">
      {visible.map((source) => (
        <a
          key={source.url || source.title}
          href={source.url || undefined}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono-label text-stone bg-bone px-2 py-0.5 hover:text-accent hover:bg-accent-soft transition-colors"
        >
          {source.title.slice(0, 30)}
        </a>
      ))}
      {remaining > 0 && (
        <span className="font-mono-label text-stone bg-bone px-2 py-0.5">
          +{remaining} more
        </span>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create command bar**

```typescript
// components/AtlasCommandBar.tsx

"use client";

import { ATLAS_COMMANDS } from "@/lib/atlas/prompts";

export function AtlasCommandBar({
  onCommand,
  compact = false,
}: {
  onCommand: (command: string) => void;
  compact?: boolean;
}) {
  const commands = compact ? ATLAS_COMMANDS.slice(0, 5) : ATLAS_COMMANDS;

  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {commands.map((cmd) => (
        <button
          key={cmd.name}
          type="button"
          onClick={() => onCommand(`/${cmd.name}`)}
          className="font-mono-label text-stone bg-paper border border-line/80 px-2.5 py-1 hover:text-accent hover:border-accent/40 transition-colors"
        >
          {cmd.label}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Create memo card**

```typescript
// components/AtlasMemoCard.tsx

import type { ResearchSource } from "@/lib/atlas/types";
import { AtlasSourceTags } from "./AtlasSourceTags";

export function AtlasMemoCard({
  mode,
  query,
  content,
  sources,
  confidence,
  createdAt,
}: {
  mode: string;
  query: string;
  content: string;
  sources: ResearchSource[];
  confidence: string;
  createdAt: string;
}) {
  return (
    <div className="bg-paper border border-line/80 p-5">
      <div className="border-b border-line/40 pb-3 mb-4">
        <p className="font-mono-label text-stone mb-1.5">
          {mode.toUpperCase()} RESEARCH MEMO
        </p>
        <h3 className="font-newsreader text-xl text-ink">{query}</h3>
        <p className="text-xs text-stone mt-1">
          {sources.length} sources · Confidence: {confidence} · {createdAt}
        </p>
      </div>
      <div className="text-sm leading-7 text-stone font-geist prose-headings:font-newsreader prose-headings:text-ink prose-headings:mt-4 prose-headings:mb-2">
        <MemoContent markdown={content} />
      </div>
      <AtlasSourceTags sources={sources} />
    </div>
  );
}

function MemoContent({ markdown }: { markdown: string }) {
  const lines = markdown.split("\n");
  const elements: React.ReactNode[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("## ")) {
      elements.push(
        <h4 key={i} className="font-newsreader text-lg text-ink mt-4 mb-2">
          {line.replace("## ", "")}
        </h4>
      );
    } else if (line.startsWith("# ")) {
      elements.push(
        <h3 key={i} className="font-newsreader text-xl text-ink mt-5 mb-2">
          {line.replace("# ", "")}
        </h3>
      );
    } else if (line.startsWith("- ")) {
      elements.push(
        <li key={i} className="ml-4 list-disc">
          {formatInlineMarkdown(line.replace("- ", ""))}
        </li>
      );
    } else if (line.trim()) {
      elements.push(
        <p key={i} className="mb-2">
          {formatInlineMarkdown(line)}
        </p>
      );
    }
  }

  return <>{elements}</>;
}

function formatInlineMarkdown(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="text-ink">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}
```

- [ ] **Step 4: Create chat message bubble**

```typescript
// components/AtlasChatMessage.tsx

"use client";

import type { ResearchSource } from "@/lib/atlas/types";
import { AtlasMemoCard } from "./AtlasMemoCard";
import { AtlasCommandBar } from "./AtlasCommandBar";

interface AtlasChatMessageProps {
  role: "user" | "assistant";
  content: string;
  sources?: ResearchSource[];
  memo?: { mode: string; query: string; confidence: string; createdAt: string };
  onCommand?: (command: string) => void;
  isStreaming?: boolean;
}

export function AtlasChatMessage({
  role,
  content,
  sources,
  memo,
  onCommand,
  isStreaming,
}: AtlasChatMessageProps) {
  if (role === "user") {
    return (
      <div className="flex justify-end mb-5">
        <div className="max-w-[70%] bg-accent text-white px-4 py-3 rounded-xl rounded-br-sm text-sm leading-relaxed">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-5">
      {memo && sources ? (
        <AtlasMemoCard
          mode={memo.mode}
          query={memo.query}
          content={content}
          sources={sources}
          confidence={memo.confidence}
          createdAt={memo.createdAt}
        />
      ) : (
        <div className="max-w-[85%] bg-paper border border-line/80 px-5 py-4 rounded-sm rounded-tl-xl text-sm leading-7 text-stone font-geist">
          <MemoContentInline content={content} />
        </div>
      )}
      {onCommand && !isStreaming && (
        <AtlasCommandBar onCommand={onCommand} compact />
      )}
    </div>
  );
}

function MemoContentInline({ content }: { content: string }) {
  const lines = content.split("\n");
  return (
    <>
      {lines.map((line, i) => {
        if (line.startsWith("## ")) {
          return (
            <h4 key={i} className="font-newsreader text-base text-ink mt-3 mb-1">
              {line.replace("## ", "")}
            </h4>
          );
        }
        if (line.startsWith("- ")) {
          return (
            <li key={i} className="ml-4 list-disc text-stone">
              {line.replace("- ", "")}
            </li>
          );
        }
        if (line.trim()) {
          return <p key={i} className="mb-1.5">{line}</p>;
        }
        return null;
      })}
    </>
  );
}
```

- [ ] **Step 5: Create research progress indicator**

```typescript
// components/AtlasResearchProgress.tsx

export function AtlasResearchProgress({
  stage,
  visible,
}: {
  stage: string;
  visible: boolean;
}) {
  if (!visible) return null;

  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
      <span className="font-mono-label text-stone">{stage}</span>
    </div>
  );
}
```

- [ ] **Step 6: Verify typecheck**

```bash
npm run typecheck
```

- [ ] **Step 7: Commit**

```bash
git add components/Atlas*.tsx
git commit -m "feat(atlas-iq): add UI components — messages, memos, commands, sources, progress

All components use existing Ops2EBITDA design tokens.
AtlasChatMessage, AtlasMemoCard, AtlasCommandBar, AtlasSourceTags, AtlasResearchProgress."
```

---

## Task 9: UI Components — Chat Container and Welcome Screen

**Files:**
- Create: `components/AtlasWelcome.tsx`
- Create: `components/AtlasChat.tsx`

- [ ] **Step 1: Create welcome/mode selector screen**

```typescript
// components/AtlasWelcome.tsx

"use client";

import { Landmark, Building2, MessageCircle } from "lucide-react";

export function AtlasWelcome({
  onStartResearch,
}: {
  onStartResearch: (mode: string, query: string) => void;
}) {
  const modes = [
    {
      mode: "market",
      label: "Market Mode",
      icon: Landmark,
      description: "Sector analysis — market size, fragmentation, M&A activity, sponsor thesis.",
      placeholder: "e.g., Commercial landscaping services",
    },
    {
      mode: "company",
      label: "Company Mode",
      icon: Building2,
      description: "Target evaluation — business overview, sponsor fit, red flags, platform potential.",
      placeholder: "e.g., ServiceMaster Holdings",
    },
    {
      mode: "chat",
      label: "Chat Mode",
      icon: MessageCircle,
      description: "Conversational research — follow-ups, pressure-test thesis, dig into subsectors.",
      placeholder: "e.g., What KPIs matter for distribution?",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <p className="font-mono-label text-stone mb-3">PROPRIETARY AI RESEARCH SYSTEM</p>
      <h1 className="font-newsreader text-4xl text-ink mb-2">Atlas IQ</h1>
      <p className="text-stone text-sm mb-10 text-center max-w-md">
        Sponsor-ready market research and company analysis, powered by PE-specific intelligence.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
        {modes.map(({ mode, label, icon: Icon, description, placeholder }) => (
          <button
            key={mode}
            type="button"
            onClick={() => {
              const query = prompt(placeholder) || "";
              if (query.trim()) onStartResearch(mode, query);
            }}
            className="group text-left bg-paper border border-line/80 p-5 hover:border-accent/45 transition-colors"
          >
            <div className="flex items-center gap-2 mb-3">
              <Icon size={16} strokeWidth={1.5} className="text-accent" />
              <span className="font-mono-label text-accent">{label}</span>
            </div>
            <p className="text-sm text-stone leading-relaxed">{description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create main chat container**

```typescript
// components/AtlasChat.tsx

"use client";

import { useChat } from "ai/react";
import { useRef, useEffect, useState, useCallback } from "react";
import { AtlasChatMessage } from "./AtlasChatMessage";
import { AtlasResearchProgress } from "./AtlasResearchProgress";
import { AtlasWelcome } from "./AtlasWelcome";
import { Send } from "lucide-react";

export function AtlasChat({ fullPage = false }: { fullPage?: boolean }) {
  const [researchMode, setResearchMode] = useState<string>("chat");
  const [started, setStarted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading, append } =
    useChat({
      api: "/api/atlas/chat",
      body: { mode: researchMode },
    });

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const handleCommand = useCallback(
    (command: string) => {
      append({ role: "user", content: command });
    },
    [append]
  );

  const handleStartResearch = useCallback(
    (mode: string, query: string) => {
      setResearchMode(mode);
      setStarted(true);
      append({ role: "user", content: query });
    },
    [append]
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
            content={message.content}
            onCommand={message.role === "assistant" ? handleCommand : undefined}
            isStreaming={isLoading && message.id === messages[messages.length - 1]?.id}
          />
        ))}
        <AtlasResearchProgress
          stage="Generating response..."
          visible={isLoading}
        />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!started) setStarted(true);
          handleSubmit(e);
        }}
        className="border-t border-line/70 bg-paper px-4 md:px-8 py-3 flex items-center gap-3"
      >
        <input
          value={input}
          onChange={handleInputChange}
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
```

- [ ] **Step 3: Verify typecheck**

```bash
npm run typecheck
```

- [ ] **Step 4: Commit**

```bash
git add components/AtlasWelcome.tsx components/AtlasChat.tsx
git commit -m "feat(atlas-iq): add chat container and welcome screen

AtlasChat with useChat hook, streaming, command support.
AtlasWelcome with mode selector (market/company/chat)."
```

---

## Task 10: Embedded Sidebar

**Files:**
- Create: `components/AtlasSidebar.tsx`

- [ ] **Step 1: Create slide-out sidebar with floating button**

```typescript
// components/AtlasSidebar.tsx

"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { X, Maximize2 } from "lucide-react";
import { AtlasChat } from "./AtlasChat";

export function AtlasSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Don't show sidebar on Atlas IQ pages (they have full UI)
  if (pathname.startsWith("/atlas-iq")) return null;

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-50 w-12 h-12 bg-accent text-white rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
          aria-label="Open Atlas IQ"
        >
          <span className="font-newsreader text-sm font-semibold">IQ</span>
        </button>
      )}

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-ink/20 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Slide-out panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-bone border-l border-line/70 shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Panel header */}
        <div className="flex items-center justify-between px-4 h-12 border-b border-line/70">
          <span className="font-mono-label text-accent">Atlas IQ</span>
          <div className="flex items-center gap-2">
            <Link
              href="/atlas-iq/chat"
              className="text-stone hover:text-ink transition-colors p-1"
              title="Expand to full page"
            >
              <Maximize2 size={14} strokeWidth={1.5} />
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-stone hover:text-ink transition-colors p-1"
              aria-label="Close Atlas IQ"
            >
              <X size={16} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Chat (only render when open to save resources) */}
        {open && (
          <div className="h-[calc(100%-3rem)]">
            <AtlasChat />
          </div>
        )}
      </div>
    </>
  );
}
```

- [ ] **Step 2: Verify typecheck**

```bash
npm run typecheck
```

- [ ] **Step 3: Commit**

```bash
git add components/AtlasSidebar.tsx
git commit -m "feat(atlas-iq): add embedded sidebar with floating button

Slide-out panel on every page (except /atlas-iq). Floating 'IQ' button bottom-right.
Expand link to full-page chat. Backdrop dimming."
```

---

## Task 11: Pages — Landing and Chat

**Files:**
- Create: `app/atlas-iq/page.tsx`
- Create: `app/atlas-iq/chat/page.tsx`

- [ ] **Step 1: Create landing page**

```typescript
// app/atlas-iq/page.tsx

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Landmark, Building2, MessageCircle } from "lucide-react";
import { PageHeader } from "@/components/Cards";
import { PillList } from "@/components/Cards";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Atlas IQ — PE Research Intelligence",
  description:
    "Sponsor-ready market research and company analysis, powered by PE-specific AI intelligence. Ask a question. Get a memo.",
  path: "/atlas-iq",
  keywords: [
    "private equity AI",
    "PE market research",
    "investment thesis AI",
    "company analysis tool",
    "sponsor diligence",
  ],
});

const modes = [
  {
    icon: Landmark,
    label: "Market Mode",
    title: "Sector Analysis",
    description:
      "Market size, segmentation, competitive landscape, M&A activity, sponsor thesis. IC pre-read ready.",
  },
  {
    icon: Building2,
    label: "Company Mode",
    title: "Target Evaluation",
    description:
      "Business overview, market positioning, sponsor fit, red flags, and platform potential. LMM perspective.",
  },
  {
    icon: MessageCircle,
    label: "Chat Mode",
    title: "Follow-Up Research",
    description:
      "Natural conversation on live research. Challenge assumptions, dig into subsectors, pressure-test thesis.",
  },
];

const commands = [
  "/brief",
  "/thesis",
  "/redflags",
  "/comps",
  "/diligence",
  "/memo",
  "/pdf",
  "/platform",
  "/challenge",
  "/rank",
];

export default function AtlasIQPage() {
  return (
    <>
      <div className="text-center mb-12">
        <PageHeader
          eyebrow="PROPRIETARY AI RESEARCH SYSTEM"
          title="Atlas IQ"
          summary="Sponsor-ready market research and company analysis, powered by PE-specific intelligence. Ask a question. Get a memo."
          className="mx-auto text-center"
        />
        <div className="flex gap-3 justify-center mt-8">
          <Link
            href="/atlas-iq/chat"
            className="inline-flex items-center gap-2 bg-accent text-white px-6 py-2.5 rounded-lg font-mono-label hover:opacity-90 transition-opacity"
          >
            Start Research
            <ArrowRight size={14} strokeWidth={1.5} />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        {modes.map(({ icon: Icon, label, title, description }) => (
          <article
            key={label}
            className="bg-paper border border-line/80 p-6 flex flex-col"
          >
            <div className="flex items-center gap-2 mb-3">
              <Icon size={16} strokeWidth={1.5} className="text-accent" />
              <span className="font-mono-label text-accent">{label}</span>
            </div>
            <h3 className="font-newsreader text-xl text-ink mb-2">{title}</h3>
            <p className="text-sm text-stone leading-relaxed flex-1">
              {description}
            </p>
          </article>
        ))}
      </div>

      <div className="bg-paper border border-line/80 p-6 mb-12">
        <p className="font-mono-label text-stone mb-3">PE WORKFLOW COMMANDS</p>
        <PillList items={commands} />
      </div>
    </>
  );
}
```

- [ ] **Step 2: Create full-page chat page**

```typescript
// app/atlas-iq/chat/page.tsx

import type { Metadata } from "next";
import { AtlasChat } from "@/components/AtlasChat";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Atlas IQ Chat",
  description: "PE research intelligence — market analysis, company evaluation, and operating insights.",
  path: "/atlas-iq/chat",
});

export default function AtlasIQChatPage() {
  return <AtlasChat fullPage />;
}
```

- [ ] **Step 3: Verify typecheck**

```bash
npm run typecheck
```

- [ ] **Step 4: Commit**

```bash
git add app/atlas-iq/
git commit -m "feat(atlas-iq): add landing page and full-page chat

/atlas-iq — product landing with mode cards, command pills, CTA.
/atlas-iq/chat — full-page research interface."
```

---

## Task 12: Wire Into Existing Site — Nav + Layout

**Files:**
- Modify: `components/ClientNav.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Add Atlas IQ to navigation**

In `components/ClientNav.tsx`, add a nav link before the "Get the Toolkit" link. Add `Sparkles` to the existing lucide import (it's already imported). Add after the AI for PE dropdown closing `</div>` and before the "Get the Toolkit" `<Link>`:

```typescript
// Add this Link between the AI dropdown and "Get the Toolkit" in desktop nav:
<Link
  href="/atlas-iq"
  className={`font-mono-label flex items-center gap-2 px-3 py-2 transition-all duration-200 border border-transparent whitespace-nowrap ${
    pathname.startsWith('/atlas-iq')
      ? 'border-accent/20 text-accent bg-accent-soft'
      : 'text-stone hover:text-ink hover:bg-paper hover:border-line'
  }`}
>
  <Sparkles size={14} strokeWidth={1.7} aria-hidden="true" />
  Atlas IQ
</Link>
```

Also add to mobile menu, before the "Get the Toolkit" section:

```typescript
<Link
  href="/atlas-iq"
  onClick={() => setMobileMenuOpen(false)}
  className={`flex items-center gap-3 font-mono-label p-3 transition-colors ${
    pathname.startsWith('/atlas-iq')
      ? 'bg-accent-soft text-accent'
      : 'text-stone hover:bg-bone hover:text-ink'
  }`}
  aria-current={pathname.startsWith('/atlas-iq') ? 'page' : undefined}
>
  <Sparkles size={15} strokeWidth={1.7} aria-hidden="true" />
  Atlas IQ
</Link>
```

- [ ] **Step 2: Mount AtlasSidebar in layout**

In `app/layout.tsx`, add the sidebar import and component:

```typescript
// Add import at top:
import { AtlasSidebar } from "@/components/AtlasSidebar";

// In the body, add AtlasSidebar after AppShell:
<body>
  <AppShell>{children}</AppShell>
  <AtlasSidebar />
</body>
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: Build succeeds, no errors.

- [ ] **Step 4: Commit**

```bash
git add components/ClientNav.tsx app/layout.tsx
git commit -m "feat(atlas-iq): wire into nav and layout

Atlas IQ nav link in desktop + mobile nav. AtlasSidebar mounted globally."
```

---

## Task 13: Manual Testing and Verification

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

- [ ] **Step 2: Verify existing pages unchanged**

Navigate to:
- `/` — Homepage loads normally
- `/fundamentals` — Content loads
- `/industries` — Content loads
- `/playbooks` — Content loads
- `/offerings` — Products and checkout links work
- `/ai-for-pe-professionals` — AI hub loads

All pages should look identical to before.

- [ ] **Step 3: Verify Atlas IQ landing page**

Navigate to `/atlas-iq`:
- Page loads with hero, mode cards, command pills
- "Start Research" CTA links to `/atlas-iq/chat`
- Nav shows "Atlas IQ" as active

- [ ] **Step 4: Verify chat interface**

Navigate to `/atlas-iq/chat`:
- Welcome screen shows with 3 mode cards
- Click a mode, enter a query
- Verify streaming response appears
- Verify command buttons appear below response
- Click a command, verify follow-up streams

- [ ] **Step 5: Verify embedded sidebar**

On any non-Atlas-IQ page:
- Floating "IQ" button visible bottom-right
- Click opens sidebar panel
- Chat works within sidebar
- "Expand" link goes to `/atlas-iq/chat`
- Close button collapses back to floating button

- [ ] **Step 6: Verify sidebar hidden on Atlas IQ pages**

Navigate to `/atlas-iq` — no floating button visible (correct, sidebar disabled here).

- [ ] **Step 7: Commit final verification**

```bash
git add -A
git commit -m "feat(atlas-iq): complete Atlas IQ integration

Atlas IQ integrated as proprietary AI research product on Ops2EBITDA.
Landing page, full chat UI, embedded sidebar, streaming LLM via OpenRouter,
web research (DuckDuckGo + Tavily), operating library (Supabase pgvector),
PDF export. All existing pages unchanged."
```

---

## Dependency Graph

```
Task 1 (deps + env)
  ↓
Task 2 (types + prompts)
  ↓
  ├── Task 3 (research + scoring)
  ├── Task 4 (operating library)
  ├── Task 5 (LLM client)
  └── Task 6 (PDF export)
       ↓
Task 7 (API routes) — depends on 3, 4, 5, 6
  ↓
Task 8 (atomic UI components)
  ↓
Task 9 (chat container + welcome)
  ↓
Task 10 (sidebar)
  ↓
Task 11 (pages)
  ↓
Task 12 (nav + layout wiring)
  ↓
Task 13 (manual testing)
```

Tasks 3-6 can run in parallel after Task 2. Everything else is sequential.
