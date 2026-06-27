# Atlas IQ Deal Workspace — Design Spec

**Date:** 2026-06-27
**Status:** Approved for planning
**Author:** Brainstormed with Blake

## Summary

Add a collapsible right-side **Deal Workspace** panel to Atlas IQ chat. It is a
PE-native equivalent of a Claude Project: the user enters deal basics, uploads
deal documents (CIM, QoE, management deck), and adds thesis/strategy context.
All of it compiles into a single context block that is injected into Atlas's
system prompt on every chat and report turn, so answers are deal-aware without
the user re-pasting context each time.

This is a **context hub**, not an analysis engine. It does not score deals, draft
memos, or render verdicts. It captures context once and feeds it to the model.

## Goal

Let a PE user persist deal context once and have Atlas reference it on every turn,
producing sharper, deal-specific output. Built to support an eventual enterprise
go-live: documents are confidential (CIMs, QoE) and must live in secure
server-side storage, not the browser.

## Non-Goals (explicitly out of scope)

- **Mandate-fit verdict / scoring.** No automated pursue-pass read. (Considered, cut — turns a context hub into a judgment engine.)
- **Screening-memo / PIM generation.** No "draft memo" button. The existing report engine already produces memos; the workspace only feeds it context.
- **Auth / multi-tenancy.** No login, orgs, or RLS enforcement in this spec. Schema carries tenancy *seams* (`org_id`, `owner_id`) but they are not enforced yet. Auth is a separate follow-on spec, required before real go-live.
- **Per-document RAG retrieval.** Documents are summarized into a digest, not chunked/embedded for per-query retrieval. RAG is a documented future enhancement (the infra exists in `lib/atlas/library.ts`).

## Existing Architecture This Builds On

The codebase already has the patterns this feature needs:

- **Supabase** is wired server-side (`SUPABASE_URL`, `SUPABASE_SERVICE_KEY`). `lib/atlas/library.ts` calls it via REST RPC with pgvector embeddings.
- **Context injection** is an established pattern: `buildLibraryContext()` produces a string appended to `systemPrompt` in `app/api/atlas/chat/route.ts` (chat mode line ~182; report mode appends to `fullDigest` line ~127).
- **LLM** access via `getAtlasModel()` (`lib/atlas/llm.ts`, OpenRouter + ai-sdk). Embeddings via OpenAI direct.
- **Chat history** already persists in `localStorage` (`components/AtlasChat.tsx`), establishing the active-session pattern the deal switcher mirrors.

## User-Facing Design

### The panel

A collapsible panel on the **right** edge of the Atlas chat (mirrors the existing
left-side history panel `AtlasChatHistoryPanel`). A trigger button reveals it.
One deal is "active" at a time; its context feeds the chat. A header switcher
selects among saved deals and creates new ones.

### Four zones (top to bottom)

1. **Basics** — quick-fill structured fields:
   - Deal name / codename (e.g. "Project Cedar")
   - Target company name
   - Sector / sub-sector
   - Deal stage — single-select from canonical pipeline: `Sourced · Screening · IOI · LOI · Diligence · IC · Closed · Passed`
   - Deal type — single-select: `Platform · Bolt-on · Tuck-in · Carve-out · Other`

2. **Documents** — upload list. Each row shows filename, type, and digest status
   (`Reading… · Ready · Failed`). Supported: PDF (CIM, QoE, management deck,
   teaser, data-room exports). Upload → digested → contributes to context.

3. **Thesis & focus** — freeform textarea (the "custom instructions" equivalent):
   investment thesis, what Atlas should focus on, known risks to watch. Plus an
   optional set of value-creation **lever chips** (multi-select tags):
   `Organic growth · Margin expansion · Buy-and-build · Multiple expansion · Deleveraging`.

4. **Fund mandate** — collapsed by default, **shared across all deals** (one per
   org/user, not per deal): target sectors, EV/check-size band, EBITDA sweet
   spot, deal types pursued, geography, return target. Freeform or light fields.

### Behavior

- Edits autosave (debounced) to the backend.
- Switching the active deal swaps the context block used by the next chat turn.
- Empty state: a "New deal" prompt; chat works fine with no active deal (context
  block is simply empty).

## Data Model (Supabase / Postgres)

Tenancy columns are present but **nullable and unenforced** in this phase.

```
deals
  id            uuid pk
  org_id        uuid  null        -- tenancy seam (unused this phase)
  owner_id      uuid  null        -- tenancy seam (unused this phase)
  name          text  not null    -- codename, e.g. "Project Cedar"
  target        text  null
  sector        text  null
  stage         text  null        -- enum-like, app-validated
  deal_type     text  null
  thesis        text  null
  levers        text[] default '{}'
  created_at    timestamptz default now()
  updated_at    timestamptz default now()

deal_documents
  id            uuid pk
  deal_id       uuid fk -> deals.id on delete cascade
  filename      text not null
  doc_type      text null          -- cim | qoe | mgmt_deck | teaser | other
  storage_path  text not null      -- path in Storage bucket
  digest        text null          -- LLM-extracted summary used for context
  status        text not null      -- pending | reading | ready | failed
  byte_size     int  null
  created_at    timestamptz default now()

fund_mandate
  id            uuid pk
  org_id        uuid null          -- one row per org; null org = default/global
  sectors       text null
  ev_band       text null
  ebitda_band   text null
  deal_types    text[] default '{}'
  geography     text null
  return_target text null
  updated_at    timestamptz default now()
```

**Storage:** a private Supabase Storage bucket (e.g. `deal-documents`) holds raw
uploaded files. Access is server-side only (service key) in this phase.

## Document Digest Pipeline

New route: `app/api/atlas/deal-document/route.ts`.

1. **Upload** (multipart) → write raw file to Storage bucket; insert
   `deal_documents` row with `status=pending`.
2. **Extract** → `unpdf` extracts text from the PDF server-side. (New dependency,
   approved.)
3. **Digest** → one LLM pass via `getAtlasModel()` with a PE-tuned extraction
   prompt: pull the facts that matter for deal context — business overview,
   key financials (revenue, EBITDA, margin, growth), customer concentration,
   thesis-relevant signals, notable risks. Output a compact structured digest
   (target ~400–800 tokens).
4. **Store** → write digest to `deal_documents.digest`; set `status=ready`.
   On failure set `status=failed` with the error surfaced in the UI.

Processing runs async after upload returns; the UI polls or subscribes for status.
Raw files are retained (enterprise auditability). Only the digest enters the
model context — keeps token cost bounded even for large CIMs.

## Context Injection

New module `lib/atlas/deal.ts`:

```
buildDealContext(dealId: string): Promise<string>
```

Fetches the deal row, its ready document digests, and the fund mandate; assembles
one block:

```
Active deal context (private — do not cite as a source):
Deal: Project Cedar — target Apex Facility Services
Sector: Industrial services · Stage: Screening · Type: Platform
Thesis: <thesis text>
Value levers: Buy-and-build, Margin expansion
Fund mandate: B2B services, $25–100M EV, 5–8x, platform + bolt-on

Document context:
[CIM] <digest>
[QoE] <digest>

Use this as authoritative deal context. Prefer it over generic assumptions.
```

Injected in `app/api/atlas/chat/route.ts`:
- **Chat mode:** append to `systemPrompt` alongside `buildLibraryContext` (~line 182).
- **Report mode:** append to `fullDigest` alongside library context (~line 127).

### Client wiring

`AtlasChat.tsx` passes the `activeDealId` to the server. The `TextStreamChatTransport`
`body` currently carries `{ mode: "chat" }`; extend it to `{ mode, dealId }` and
rebuild the transport (via its `useMemo` deps) when the active deal changes.

## Components

- `components/DealWorkspacePanel.tsx` — the panel shell, switcher, collapse, zones.
- Zone subcomponents kept small and focused (basics form, document list + upload,
  thesis editor, mandate editor) — each independently testable.
- `lib/atlas/deal.ts` — context builder + typed data access (deal CRUD, document
  list, mandate get/set) against Supabase REST, following `library.ts` style.
- State: active deal id persists in `localStorage` (which deal is open), but all
  deal *data* lives in Supabase.

## Error Handling

- Upload failures and digest failures set `status=failed`; the row stays visible
  with a retry affordance. Chat is never blocked by a failed document.
- If Supabase env is missing, the panel degrades gracefully (read-only / hidden),
  matching how `searchOperatingLibrary` returns `[]` when unconfigured.
- Oversized / non-PDF uploads rejected client-side with a clear message.

## Testing

- `buildDealContext` — unit tests over fixture rows: empty deal, full deal,
  multiple documents, missing mandate. Assert the assembled string shape.
- Digest pipeline — test the extract→digest→store path with a fixture PDF
  (mock the LLM call); assert status transitions and failure handling.
- Context injection — assert the deal block is appended in both chat and report
  modes when a `dealId` is present, and absent when it is not.
- Panel — basic interaction tests: create deal, edit field autosaves, switch
  deal, upload shows pending→ready.

## Phasing

- **Phase 1 (this spec):** panel UI, deal CRUD, document upload + digest, fund
  mandate, context injection. Single-tenant, tenancy seams present.
- **Phase 2 (separate spec):** Auth + multi-tenancy (Supabase Auth, orgs, RLS on
  `org_id`/`owner_id`). Required before enterprise go-live.
- **Future enhancements:** per-document RAG retrieval for deep line-item Q&A
  (reuse `library.ts` embedding infra); optional mandate-fit read; optional
  screening-memo generation.

## Dependencies

- **New:** `unpdf` — server-side PDF text extraction (approved).
- **Existing reused:** `@supabase/supabase-js`, OpenAI embeddings (future RAG),
  OpenRouter via ai-sdk, existing context-injection pattern.

## Open Questions

- Document digest prompt tuning — exact fields to extract per doc type (CIM vs QoE
  differ). Refine during implementation against real sample documents.
- Async digest delivery — polling vs Supabase Realtime subscription for status.
  Default to polling for simplicity unless Realtime is already trivial to wire.
