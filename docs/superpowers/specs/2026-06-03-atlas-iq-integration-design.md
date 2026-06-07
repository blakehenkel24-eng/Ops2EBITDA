# Atlas IQ Integration — Design Spec

**Date:** 2026-06-03
**Status:** Approved
**Scope:** Integrate Atlas IQ as proprietary AI research product on the Ops2EBITDA website

---

## Overview

Atlas IQ is a PE-focused AI research tool (originally Python CLI + FastAPI). This spec covers rewriting it in TypeScript and embedding it into the Ops2EBITDA Next.js app as a first-class product offering. Landing page at `/atlas-iq`, full chat interface at `/atlas-iq/chat`, and a slide-out sidebar accessible from every page.

All free for now — pricing/gating deferred to a later decision.

## Architecture

**Approach:** Hybrid monolith — all code in the existing Next.js app, single Vercel deploy. Vercel AI SDK handles LLM streaming. No separate backend service.

### System Components

```
Ops2EBITDA Next.js App (Vercel)
├── Pages: /atlas-iq (landing), /atlas-iq/chat (full interface)
├── API Routes: /api/atlas/{chat,research,library,export}
├── Components: Atlas*-prefixed React components
├── Lib: lib/atlas/ (LLM client, research, prompts, scoring, library, export, commands)
└── Data: data/atlas/ (pre-built operating library embeddings)

External Services:
├── OpenRouter (DeepSeek) — LLM inference
├── DuckDuckGo scraping — free web research
├── Tavily API — enhanced web research (optional, env-gated)
└── OpenAI API — embedding queries for operating library
```

### Why This Architecture

- Single deploy on Vercel — no Python infra to manage
- Streaming via Vercel AI SDK avoids serverless timeout issues for LLM responses
- Web research runs in serverless functions with chunked/parallel requests
- Operating library embeddings stored in Supabase pgvector (50MB index too large for static JSON)
- All new code namespaced under `atlas/` — zero risk to existing site

## UI Design

### Design Principle

Adopt Ops2EBITDA design system exactly. Existing site is untouched — Atlas IQ is purely additive. Same typography (Newsreader/Geist/JetBrains Mono), same color tokens (`text-ink`, `text-stone`, `text-accent`, `bg-paper`, `bg-bone`, `border-line`), same component patterns (`ContentCard`, `PillList`, `PageHeader`, `font-mono-label`).

### Landing Page (`/atlas-iq`)

- **Nav:** "Atlas IQ" added to `ClientNav` with accent highlight
- **Hero:** Editorial style — mono-label eyebrow "PROPRIETARY AI RESEARCH SYSTEM", Newsreader title "Atlas IQ", Geist body copy: "Ask a question. Get a memo."
- **Three mode cards:** Market Mode, Company Mode, Chat Mode — using `ContentCard`-style pattern
- **PE commands strip:** All slash commands displayed as `PillList`-style pills
- **Below fold:** Example outputs, how-it-works steps, FAQ

### Chat Interface (`/atlas-iq/chat`)

- **Full-page layout:** Nav simplified to "Ops2EBITDA · Atlas IQ", right side: New Research / History
- **User messages:** Accent blue bubbles (right-aligned, rounded)
- **Assistant responses:** White cards with `border-line`, left-aligned
  - Memo format: mono-label category header, Newsreader title, metadata line (sources, confidence, date), structured content
  - Source tags as mono-label pills below content
- **Command buttons:** PE slash commands as clickable pills below each response (`/thesis`, `/redflags`, `/comps`, `/platform`, `/pdf`)
- **Input bar:** Bottom-fixed, `bg-paper` input with placeholder "Follow up, or type / for commands..."
- **Progress indicator:** Pulsing accent dot + mono-label status text ("Gathering sources · 8 found · Synthesizing memo")

### Embedded Sidebar

- **Floating button:** Bottom-right on every page, 48px accent blue square with "IQ" in Newsreader serif, subtle shadow
- **Slide-out panel:** Right-side panel (width ~400px), white background, border-left. Page dims behind it.
- **Compact mode:** Same design tokens, smaller fonts/spacing for sidebar context
- **"Expand ↗" link:** Opens `/atlas-iq/chat` preserving current conversation
- **Close:** Collapses back to floating button
- **Persistence:** Conversation stored in localStorage, survives page navigation

## Data Flow

### Research Request Lifecycle

1. User sends message → `POST /api/atlas/chat` with `{ message, mode, history[] }`
2. API route detects intent (market research, company analysis, or chat)
3. **Source gathering** (parallel):
   - DuckDuckGo: 5 targeted queries per research mode, HTML scrape + cheerio parse
   - Tavily: REST API call if `TAVILY_API_KEY` set
   - Operating library: cosine similarity search against pre-built embeddings
4. **Source ranking** (`scoring.ts`): PE relevance, data richness, source type, deduplication
5. **LLM synthesis**: OpenRouter (DeepSeek) with PE-specific system prompt, top-N sources + library chunks as context
6. **Streaming response**: Vercel AI SDK `streamText()` → SSE → client `useChat()` hook, token-by-token rendering
7. **Progress events**: Custom stream parts for status updates ("Gathering sources...", "N found", "Synthesizing...")

### Follow-Up Commands

`/thesis`, `/redflags`, `/brief`, `/comps`, `/platform`, `/diligence`, `/challenge`, `/rank`, `/email`, `/questions`, `/memo`, `/pdf`

- Skip source re-gathering — reuse existing memo context from conversation history
- Each command maps to a specific system prompt in `commands.ts`
- Stream response into same chat thread
- `/pdf` triggers `/api/atlas/export` endpoint → client-side download

### Operating Library

- Pre-built embeddings from Atlas IQ's existing index (1,126 chunks, 1,536-dim, 50MB)
- Stored in Supabase pgvector (too large for static JSON bundling on Vercel)
- Query-time: embed user query via OpenAI `text-embedding-3-small`, cosine similarity via Supabase RPC
- Top-K chunks injected into LLM context alongside web sources
- One-time seed script migrates existing `index.json` → Supabase

## File Structure

### New Files (21 total)

```
app/
├── atlas-iq/
│   ├── page.tsx                      # Landing page
│   └── chat/
│       └── page.tsx                  # Full-page chat interface
└── api/atlas/
    ├── chat/route.ts                 # Streaming chat endpoint
    ├── research/route.ts             # Market/company research pipeline
    ├── library/route.ts              # Operating library embedding search
    └── export/route.ts               # PDF generation

components/
├── AtlasChat.tsx                     # Main chat container (useChat hook)
├── AtlasChatMessage.tsx              # Message bubble (user + assistant)
├── AtlasMemoCard.tsx                 # Structured memo rendering
├── AtlasCommandBar.tsx               # PE command buttons below responses
├── AtlasSourceTags.tsx               # Source citation pills
├── AtlasSidebar.tsx                  # Slide-out panel + floating button
├── AtlasWelcome.tsx                  # Initial state: mode selector + examples
└── AtlasResearchProgress.tsx         # Status indicator

lib/atlas/
├── llm.ts                            # OpenRouter client wrapper
├── prompts.ts                        # PE system prompts
├── research.ts                       # DuckDuckGo scraper + Tavily adapter
├── scoring.ts                        # Source ranking algorithm
├── library.ts                        # Embedding search
├── export.ts                         # PDF generation (jspdf)
├── types.ts                          # Shared types
└── commands.ts                       # /slash command → prompt mappings

scripts/
└── seed-operating-library.mjs        # One-time migration: index.json → Supabase
```

### Modified Files (4 total)

```
components/ClientNav.tsx              # Add "Atlas IQ" nav link
app/layout.tsx                        # Mount AtlasSidebar globally
package.json                          # Add: ai, @ai-sdk/openai, jspdf, cheerio
.env.local                            # Add: OPENROUTER_API_KEY, OPENROUTER_MODEL,
                                      #       TAVILY_API_KEY, OPENAI_API_KEY
```

### Zero existing pages modified.

## Dependencies

New packages:
- `ai` — Vercel AI SDK (streaming, useChat hook)
- `@ai-sdk/openai` — OpenAI-compatible provider for AI SDK (works with OpenRouter)
- `jspdf` — PDF generation
- `cheerio` — HTML parsing for DuckDuckGo scraping

## Environment Variables

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `OPENROUTER_API_KEY` | Yes | — | LLM inference via OpenRouter |
| `OPENROUTER_MODEL` | No | `deepseek/deepseek-chat` | Model selection |
| `TAVILY_API_KEY` | No | — | Enhanced web research (optional) |
| `OPENAI_API_KEY` | No | — | Embedding queries for operating library |
| `SUPABASE_URL` | No | — | Supabase project URL (for operating library) |
| `SUPABASE_SERVICE_KEY` | No | — | Supabase service role key |

## Testing Strategy

- **Manual testing:** Run dev server, test all three modes (market, company, chat), verify streaming, test all slash commands
- **Source gathering:** Verify DuckDuckGo scraping works, verify Tavily fallback when key present
- **Operating library:** Verify embedding search returns relevant chunks
- **PDF export:** Generate and verify formatting
- **Sidebar:** Test on multiple pages, verify localStorage persistence, verify expand-to-full-page
- **Existing site regression:** Navigate all existing pages, confirm nothing changed

## Out of Scope

- User authentication / accounts
- Pricing / payment gating
- Usage limits / rate limiting
- Server-side conversation persistence (database)
- Dark mode
- Mobile-optimized chat (basic responsiveness only)
- Crawl4AI (Python-only, replaced by DuckDuckGo + Tavily)
