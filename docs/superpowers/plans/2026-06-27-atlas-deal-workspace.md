# Atlas IQ Deal Workspace Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a right-side Deal Workspace panel to Atlas IQ that persists deal basics, documents, and thesis in Supabase and injects that context into every chat/report turn.

**Architecture:** Supabase (Postgres + Storage) holds deals, document digests, and fund mandate. A pure context-builder assembles a text block from that data; the chat route injects it exactly like the existing `buildLibraryContext`. PDF uploads are extracted with `unpdf` and summarized into a digest by the existing OpenRouter model. The React panel mirrors the existing left-side history panel and passes the active deal id through the chat transport.

**Tech Stack:** Next.js 16 (App Router), TypeScript, `@supabase/supabase-js` (REST/PostgREST via service key), `unpdf`, ai-sdk + OpenRouter, Vitest.

---

## Reference: Existing Patterns

- **Supabase REST call** — `lib/atlas/library.ts:28-46` (fetch to `${SUPABASE_URL}/rest/v1/...` with `apikey` + `Authorization` headers).
- **Context injection** — `app/api/atlas/chat/route.ts:178-183` (chat mode appends to `systemPrompt`); `:122-129` (report mode appends to `fullDigest`).
- **LLM model** — `lib/atlas/llm.ts` `getAtlasModel()`.
- **Right/left panel UI** — `components/AtlasChat.tsx:660-758` (`AtlasChatHistoryPanel`) and `app/globals.css` (`.atlas-history-panel`, `.atlas-history-trigger`).
- **Transport body** — `components/AtlasChat.tsx:189-197`.

## File Structure

- Create `lib/atlas/deal-types.ts` — shared TypeScript types.
- Create `lib/atlas/deal-context.ts` — pure context-string builder.
- Create `lib/atlas/deal.ts` — Supabase data access + `buildDealContext`.
- Create `lib/atlas/digest.ts` — PDF extraction + LLM digest.
- Create `app/api/atlas/deals/route.ts` — list/create deals + mandate.
- Create `app/api/atlas/deals/[id]/route.ts` — update/delete a deal.
- Create `app/api/atlas/deal-document/route.ts` — upload + digest.
- Create `supabase/migrations/0001_deal_workspace.sql` — schema + bucket.
- Create `components/DealWorkspacePanel.tsx` — the panel + zones.
- Modify `app/api/atlas/chat/route.ts` — inject deal context.
- Modify `components/AtlasChat.tsx` — active deal state + transport wiring + mount panel.
- Modify `app/globals.css` — panel styles.
- Modify `package.json` — deps + test script.
- Create `vitest.config.ts`.

---

## Task 0: Tooling — Vitest and unpdf

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`

- [ ] **Step 1: Install dependencies**

Run:
```bash
npm install unpdf && npm install -D vitest
```
Expected: both added to `package.json`, no peer-dep errors.

- [ ] **Step 2: Add the test script**

In `package.json` `scripts`, add after `"typecheck"`:
```json
    "test": "vitest run",
    "test:watch": "vitest",
```

- [ ] **Step 3: Create the Vitest config**

Create `vitest.config.ts`:
```ts
import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts"],
  },
  resolve: {
    alias: { "@": resolve(__dirname, ".") },
  },
});
```

- [ ] **Step 4: Verify the runner works**

Create a throwaway `lib/atlas/_smoke.test.ts`:
```ts
import { expect, test } from "vitest";
test("smoke", () => { expect(1 + 1).toBe(2); });
```
Run: `npm test`
Expected: 1 passed. Then delete the file: `rm lib/atlas/_smoke.test.ts`.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json vitest.config.ts
git commit -m "build: add vitest and unpdf for deal workspace"
```

---

## Task 1: Database schema and storage bucket

**Files:**
- Create: `supabase/migrations/0001_deal_workspace.sql`

- [ ] **Step 1: Write the migration SQL**

Create `supabase/migrations/0001_deal_workspace.sql`:
```sql
-- Deal Workspace schema. Tenancy columns (org_id/owner_id) are present but
-- nullable and unenforced in Phase 1; Phase 2 (auth) adds RLS on them.

create table if not exists deals (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid,
  owner_id    uuid,
  name        text not null,
  target      text,
  sector      text,
  stage       text,
  deal_type   text,
  thesis      text,
  levers      text[] not null default '{}',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists deal_documents (
  id            uuid primary key default gen_random_uuid(),
  deal_id       uuid not null references deals(id) on delete cascade,
  filename      text not null,
  doc_type      text,
  storage_path  text not null,
  digest        text,
  status        text not null default 'pending',
  byte_size     int,
  created_at    timestamptz not null default now()
);

create table if not exists fund_mandate (
  id            uuid primary key default gen_random_uuid(),
  org_id        uuid,
  sectors       text,
  ev_band       text,
  ebitda_band   text,
  deal_types    text[] not null default '{}',
  geography     text,
  return_target text,
  updated_at    timestamptz not null default now()
);

create index if not exists deal_documents_deal_id_idx on deal_documents(deal_id);

-- Private storage bucket for raw uploaded files.
insert into storage.buckets (id, name, public)
values ('deal-documents', 'deal-documents', false)
on conflict (id) do nothing;
```

- [ ] **Step 2: Apply the migration**

Apply via the Supabase MCP `apply_migration` tool (name: `deal_workspace`, the SQL above) OR paste the SQL into the Supabase dashboard SQL editor and run it.
Expected: three tables and the `deal-documents` bucket exist. Verify with the Supabase MCP `list_tables` tool — `deals`, `deal_documents`, `fund_mandate` appear.

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/0001_deal_workspace.sql
git commit -m "feat: deal workspace schema and storage bucket"
```

---

## Task 2: Shared types

**Files:**
- Create: `lib/atlas/deal-types.ts`

- [ ] **Step 1: Write the types**

Create `lib/atlas/deal-types.ts`:
```ts
export type DealStage =
  | "sourced" | "screening" | "ioi" | "loi" | "diligence" | "ic" | "closed" | "passed";

export type DealType =
  | "platform" | "bolt_on" | "tuck_in" | "carve_out" | "other";

export type ValueLever =
  | "organic_growth" | "margin_expansion" | "buy_and_build" | "multiple_expansion" | "deleveraging";

export type DocStatus = "pending" | "reading" | "ready" | "failed";

export interface Deal {
  id: string;
  name: string;
  target: string | null;
  sector: string | null;
  stage: DealStage | null;
  deal_type: DealType | null;
  thesis: string | null;
  levers: ValueLever[];
  created_at: string;
  updated_at: string;
}

export interface DealDocument {
  id: string;
  deal_id: string;
  filename: string;
  doc_type: string | null;
  storage_path: string;
  digest: string | null;
  status: DocStatus;
  byte_size: number | null;
  created_at: string;
}

export interface FundMandate {
  id: string;
  sectors: string | null;
  ev_band: string | null;
  ebitda_band: string | null;
  deal_types: string[];
  geography: string | null;
  return_target: string | null;
  updated_at: string;
}

/** Shape consumed by the context builder. */
export interface DealContextData {
  deal: Deal;
  documents: Pick<DealDocument, "doc_type" | "filename" | "digest" | "status">[];
  mandate: FundMandate | null;
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/atlas/deal-types.ts
git commit -m "feat: deal workspace types"
```

---

## Task 3: Pure context-string builder (TDD)

**Files:**
- Create: `lib/atlas/deal-context.ts`
- Test: `lib/atlas/deal-context.test.ts`

- [ ] **Step 1: Write the failing test**

Create `lib/atlas/deal-context.test.ts`:
```ts
import { expect, test } from "vitest";
import { buildDealContextString } from "@/lib/atlas/deal-context";
import type { DealContextData } from "@/lib/atlas/deal-types";

const base: DealContextData = {
  deal: {
    id: "1", name: "Project Cedar", target: "Apex Facility Services",
    sector: "Industrial services", stage: "screening", deal_type: "platform",
    thesis: "Fragmented roll-up; expand margin via route density.",
    levers: ["buy_and_build", "margin_expansion"],
    created_at: "", updated_at: "",
  },
  documents: [
    { doc_type: "cim", filename: "CIM.pdf", digest: "Revenue $48M, EBITDA $9.2M.", status: "ready" },
    { doc_type: "qoe", filename: "QoE.pdf", digest: null, status: "reading" },
  ],
  mandate: {
    id: "m", sectors: "B2B services", ev_band: "$25-100M", ebitda_band: "$5-15M",
    deal_types: ["platform", "bolt_on"], geography: "US", return_target: "2.5x / 25% IRR",
    updated_at: "",
  },
};

test("includes deal basics, thesis, levers, mandate, and ready digests", () => {
  const out = buildDealContextString(base);
  expect(out).toContain("Project Cedar");
  expect(out).toContain("Apex Facility Services");
  expect(out).toContain("Screening");
  expect(out).toContain("Platform");
  expect(out).toContain("Buy-and-build");
  expect(out).toContain("Fragmented roll-up");
  expect(out).toContain("B2B services");
  expect(out).toContain("[CIM] Revenue $48M");
});

test("omits documents that are not ready", () => {
  const out = buildDealContextString(base);
  expect(out).not.toContain("QoE.pdf");
});

test("returns empty string when there is no deal", () => {
  expect(buildDealContextString(null)).toBe("");
});

test("renders a deal with no documents or mandate without throwing", () => {
  const out = buildDealContextString({
    deal: { ...base.deal, thesis: null, levers: [] },
    documents: [],
    mandate: null,
  });
  expect(out).toContain("Project Cedar");
  expect(out).not.toContain("Document context");
  expect(out).not.toContain("Fund mandate");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/atlas/deal-context.test.ts`
Expected: FAIL — "buildDealContextString is not a function" / module not found.

- [ ] **Step 3: Write minimal implementation**

Create `lib/atlas/deal-context.ts`:
```ts
import type { DealContextData, DealStage, DealType, ValueLever } from "@/lib/atlas/deal-types";

const STAGE_LABEL: Record<DealStage, string> = {
  sourced: "Sourced", screening: "Screening", ioi: "IOI", loi: "LOI",
  diligence: "Diligence", ic: "IC", closed: "Closed", passed: "Passed",
};

const TYPE_LABEL: Record<DealType, string> = {
  platform: "Platform", bolt_on: "Bolt-on", tuck_in: "Tuck-in",
  carve_out: "Carve-out", other: "Other",
};

const LEVER_LABEL: Record<ValueLever, string> = {
  organic_growth: "Organic growth", margin_expansion: "Margin expansion",
  buy_and_build: "Buy-and-build", multiple_expansion: "Multiple expansion",
  deleveraging: "Deleveraging",
};

export function buildDealContextString(data: DealContextData | null): string {
  if (!data) return "";
  const { deal, documents, mandate } = data;

  const lines: string[] = ["Active deal context (private — do not cite as a source):"];

  const title = deal.target ? `${deal.name} — target ${deal.target}` : deal.name;
  lines.push(`Deal: ${title}`);

  const meta: string[] = [];
  if (deal.sector) meta.push(deal.sector);
  if (deal.stage) meta.push(`Stage: ${STAGE_LABEL[deal.stage]}`);
  if (deal.deal_type) meta.push(`Type: ${TYPE_LABEL[deal.deal_type]}`);
  if (meta.length) lines.push(meta.join(" · "));

  if (deal.thesis) lines.push(`Thesis: ${deal.thesis}`);
  if (deal.levers.length) {
    lines.push(`Value levers: ${deal.levers.map((l) => LEVER_LABEL[l]).join(", ")}`);
  }

  if (mandate) {
    const m: string[] = [];
    if (mandate.sectors) m.push(mandate.sectors);
    if (mandate.ev_band) m.push(`${mandate.ev_band} EV`);
    if (mandate.ebitda_band) m.push(`${mandate.ebitda_band} EBITDA`);
    if (mandate.geography) m.push(mandate.geography);
    if (mandate.return_target) m.push(mandate.return_target);
    if (m.length) lines.push(`Fund mandate: ${m.join(", ")}`);
  }

  const ready = documents.filter((d) => d.status === "ready" && d.digest);
  if (ready.length) {
    lines.push("", "Document context:");
    for (const doc of ready) {
      const tag = (doc.doc_type || "doc").toUpperCase();
      lines.push(`[${tag}] ${doc.digest}`);
    }
  }

  lines.push("", "Use this as authoritative deal context. Prefer it over generic assumptions.");
  return lines.join("\n");
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run lib/atlas/deal-context.test.ts`
Expected: 4 passed.

- [ ] **Step 5: Commit**

```bash
git add lib/atlas/deal-context.ts lib/atlas/deal-context.test.ts
git commit -m "feat: deal context string builder"
```

---

## Task 4: Supabase data access (TDD with mocked fetch)

**Files:**
- Create: `lib/atlas/deal.ts`
- Test: `lib/atlas/deal.test.ts`

- [ ] **Step 1: Write the failing test**

Create `lib/atlas/deal.test.ts`:
```ts
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { listDeals, createDeal, getDealContextData } from "@/lib/atlas/deal";

beforeEach(() => {
  process.env.SUPABASE_URL = "https://x.supabase.co";
  process.env.SUPABASE_SERVICE_KEY = "svc";
});
afterEach(() => vi.restoreAllMocks());

function mockFetchOnce(body: unknown, ok = true) {
  return vi.spyOn(globalThis, "fetch").mockResolvedValue({
    ok, json: async () => body, text: async () => JSON.stringify(body),
  } as Response);
}

test("listDeals calls PostgREST and returns rows", async () => {
  const spy = mockFetchOnce([{ id: "1", name: "Project Cedar", levers: [] }]);
  const deals = await listDeals();
  expect(deals).toHaveLength(1);
  const url = String(spy.mock.calls[0][0]);
  expect(url).toContain("/rest/v1/deals");
  expect(url).toContain("order=updated_at.desc");
});

test("createDeal posts a name and returns the created row", async () => {
  const spy = mockFetchOnce([{ id: "2", name: "Project Birch", levers: [] }]);
  const deal = await createDeal({ name: "Project Birch" });
  expect(deal?.name).toBe("Project Birch");
  const init = spy.mock.calls[0][1] as RequestInit;
  expect(init.method).toBe("POST");
  expect(String(init.body)).toContain("Project Birch");
});

test("getDealContextData returns null when env is missing", async () => {
  delete process.env.SUPABASE_URL;
  expect(await getDealContextData("1")).toBeNull();
});

test("getDealContextData assembles deal, documents, and mandate", async () => {
  const fetchSpy = vi.spyOn(globalThis, "fetch")
    .mockResolvedValueOnce({ ok: true, json: async () => [{ id: "1", name: "Cedar", levers: [] }] } as Response)
    .mockResolvedValueOnce({ ok: true, json: async () => [{ doc_type: "cim", filename: "C.pdf", digest: "d", status: "ready" }] } as Response)
    .mockResolvedValueOnce({ ok: true, json: async () => [{ id: "m", deal_types: [] }] } as Response);
  const data = await getDealContextData("1");
  expect(data?.deal.name).toBe("Cedar");
  expect(data?.documents).toHaveLength(1);
  expect(data?.mandate?.id).toBe("m");
  expect(fetchSpy).toHaveBeenCalledTimes(3);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/atlas/deal.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Write minimal implementation**

Create `lib/atlas/deal.ts`:
```ts
import type { Deal, DealDocument, FundMandate, DealContextData } from "@/lib/atlas/deal-types";
import { buildDealContextString } from "@/lib/atlas/deal-context";

function env() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) return null;
  return { url, key };
}

function headers(key: string, extra: Record<string, string> = {}) {
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

async function rest<T>(path: string, init?: RequestInit): Promise<T | null> {
  const e = env();
  if (!e) return null;
  const res = await fetch(`${e.url}/rest/v1/${path}`, {
    ...init,
    headers: headers(e.key, (init?.headers as Record<string, string>) ?? {}),
  });
  if (!res.ok) return null;
  return (await res.json()) as T;
}

export async function listDeals(): Promise<Deal[]> {
  return (await rest<Deal[]>("deals?select=*&order=updated_at.desc")) ?? [];
}

export async function createDeal(input: { name: string }): Promise<Deal | null> {
  const rows = await rest<Deal[]>("deals", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ name: input.name }),
  });
  return rows?.[0] ?? null;
}

export async function updateDeal(id: string, patch: Partial<Deal>): Promise<Deal | null> {
  const rows = await rest<Deal[]>(`deals?id=eq.${id}`, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ ...patch, updated_at: new Date().toISOString() }),
  });
  return rows?.[0] ?? null;
}

export async function deleteDeal(id: string): Promise<void> {
  await rest(`deals?id=eq.${id}`, { method: "DELETE" });
}

export async function listDealDocuments(dealId: string): Promise<DealDocument[]> {
  return (await rest<DealDocument[]>(
    `deal_documents?deal_id=eq.${dealId}&select=*&order=created_at.asc`
  )) ?? [];
}

export async function getMandate(): Promise<FundMandate | null> {
  const rows = await rest<FundMandate[]>("fund_mandate?select=*&limit=1");
  return rows?.[0] ?? null;
}

export async function getDealContextData(dealId: string): Promise<DealContextData | null> {
  if (!env()) return null;
  const deals = await rest<Deal[]>(`deals?id=eq.${dealId}&select=*&limit=1`);
  const deal = deals?.[0];
  if (!deal) return null;
  const documents = await rest<DealDocument[]>(
    `deal_documents?deal_id=eq.${dealId}&select=doc_type,filename,digest,status`
  );
  const mandateRows = await rest<FundMandate[]>("fund_mandate?select=*&limit=1");
  return { deal, documents: documents ?? [], mandate: mandateRows?.[0] ?? null };
}

export async function buildDealContext(dealId: string | null | undefined): Promise<string> {
  if (!dealId) return "";
  const data = await getDealContextData(dealId);
  return buildDealContextString(data);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run lib/atlas/deal.test.ts`
Expected: 4 passed.

- [ ] **Step 5: Commit**

```bash
git add lib/atlas/deal.ts lib/atlas/deal.test.ts
git commit -m "feat: deal workspace data access and context loader"
```

---

## Task 5: PDF extraction and LLM digest (TDD with mocks)

**Files:**
- Create: `lib/atlas/digest.ts`
- Test: `lib/atlas/digest.test.ts`

- [ ] **Step 1: Write the failing test**

Create `lib/atlas/digest.test.ts`:
```ts
import { expect, test, vi } from "vitest";

vi.mock("unpdf", () => ({
  extractText: vi.fn(async () => ({ text: ["Revenue was $48M. EBITDA $9.2M."] })),
  getDocumentProxy: vi.fn(async () => ({})),
}));
vi.mock("ai", () => ({
  generateText: vi.fn(async () => ({ text: "Industrial services business. Revenue $48M, EBITDA $9.2M." })),
}));
vi.mock("@/lib/atlas/llm", () => ({ getAtlasModel: () => ({}) }));

import { extractPdfText, digestDocumentText } from "@/lib/atlas/digest";

test("extractPdfText joins page text from unpdf", async () => {
  const text = await extractPdfText(new Uint8Array([1, 2, 3]));
  expect(text).toContain("Revenue was $48M");
});

test("digestDocumentText returns the model summary", async () => {
  const digest = await digestDocumentText("cim", "long raw text...");
  expect(digest).toContain("Revenue $48M");
});

test("digestDocumentText truncates very long input before sending", async () => {
  const ai = await import("ai");
  await digestDocumentText("cim", "x".repeat(200_000));
  const callArg = (ai.generateText as ReturnType<typeof vi.fn>).mock.calls[0][0];
  expect(String(callArg.prompt).length).toBeLessThan(130_000);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/atlas/digest.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Write minimal implementation**

Create `lib/atlas/digest.ts`:
```ts
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run lib/atlas/digest.test.ts`
Expected: 3 passed.

- [ ] **Step 5: Commit**

```bash
git add lib/atlas/digest.ts lib/atlas/digest.test.ts
git commit -m "feat: pdf extraction and llm digest"
```

---

## Task 6: Deal CRUD + mandate API routes

**Files:**
- Create: `app/api/atlas/deals/route.ts`
- Create: `app/api/atlas/deals/[id]/route.ts`

- [ ] **Step 1: Write the list/create route**

Create `app/api/atlas/deals/route.ts`:
```ts
import { NextResponse } from "next/server";
import { listDeals, createDeal, getMandate, listDealDocuments } from "@/lib/atlas/deal";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const dealId = searchParams.get("documentsFor");
  if (dealId) {
    return NextResponse.json({ documents: await listDealDocuments(dealId) });
  }
  const [deals, mandate] = await Promise.all([listDeals(), getMandate()]);
  return NextResponse.json({ deals, mandate });
}

export async function POST(req: Request) {
  const body = await req.json();
  const name = typeof body?.name === "string" && body.name.trim() ? body.name.trim() : "New deal";
  const deal = await createDeal({ name });
  if (!deal) return NextResponse.json({ error: "Could not create deal" }, { status: 500 });
  return NextResponse.json({ deal });
}
```

- [ ] **Step 2: Write the update/delete route**

Create `app/api/atlas/deals/[id]/route.ts`:
```ts
import { NextResponse } from "next/server";
import { updateDeal, deleteDeal } from "@/lib/atlas/deal";
import type { Deal } from "@/lib/atlas/deal-types";

const FIELDS: (keyof Deal)[] = ["name", "target", "sector", "stage", "deal_type", "thesis", "levers"];

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const patch: Partial<Deal> = {};
  for (const f of FIELDS) if (f in body) (patch as Record<string, unknown>)[f] = body[f];
  const deal = await updateDeal(id, patch);
  if (!deal) return NextResponse.json({ error: "Could not update deal" }, { status: 500 });
  return NextResponse.json({ deal });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await deleteDeal(id);
  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 3: Typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add app/api/atlas/deals
git commit -m "feat: deal crud api routes"
```

---

## Task 7: Document upload + digest route

**Files:**
- Create: `app/api/atlas/deal-document/route.ts`
- Modify: `lib/atlas/deal.ts` (add document insert/update helpers + storage upload)

- [ ] **Step 1: Add storage + document helpers to `lib/atlas/deal.ts`**

Append to `lib/atlas/deal.ts`:
```ts
import type { DocStatus } from "@/lib/atlas/deal-types";

export async function uploadToStorage(path: string, bytes: Uint8Array, contentType: string): Promise<boolean> {
  const e = env();
  if (!e) return false;
  const res = await fetch(`${e.url}/storage/v1/object/deal-documents/${path}`, {
    method: "POST",
    headers: { apikey: e.key, Authorization: `Bearer ${e.key}`, "Content-Type": contentType },
    body: bytes as BodyInit,
  });
  return res.ok;
}

export async function insertDocument(input: {
  deal_id: string; filename: string; doc_type: string | null; storage_path: string; byte_size: number;
}): Promise<DealDocument | null> {
  const rows = await rest<DealDocument[]>("deal_documents", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ ...input, status: "reading" }),
  });
  return rows?.[0] ?? null;
}

export async function setDocumentDigest(id: string, digest: string | null, status: DocStatus): Promise<void> {
  await rest(`deal_documents?id=eq.${id}`, {
    method: "PATCH",
    body: JSON.stringify({ digest, status }),
  });
}
```

- [ ] **Step 2: Write the upload route**

Create `app/api/atlas/deal-document/route.ts`:
```ts
import { NextResponse } from "next/server";
import { insertDocument, setDocumentDigest, uploadToStorage } from "@/lib/atlas/deal";
import { extractPdfText, digestDocumentText } from "@/lib/atlas/digest";

export const maxDuration = 120;

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file");
  const dealId = form.get("dealId");
  const docType = (form.get("docType") as string) || null;

  if (!(file instanceof File) || typeof dealId !== "string") {
    return NextResponse.json({ error: "file and dealId are required" }, { status: 400 });
  }
  if (file.type !== "application/pdf") {
    return NextResponse.json({ error: "Only PDF uploads are supported" }, { status: 400 });
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const storagePath = `${dealId}/${Date.now()}-${file.name}`;

  const stored = await uploadToStorage(storagePath, bytes, "application/pdf");
  if (!stored) return NextResponse.json({ error: "Storage upload failed" }, { status: 500 });

  const doc = await insertDocument({
    deal_id: dealId, filename: file.name, doc_type: docType,
    storage_path: storagePath, byte_size: bytes.byteLength,
  });
  if (!doc) return NextResponse.json({ error: "Could not record document" }, { status: 500 });

  try {
    const text = await extractPdfText(bytes);
    const digest = await digestDocumentText(docType ?? "doc", text);
    await setDocumentDigest(doc.id, digest, "ready");
    return NextResponse.json({ document: { ...doc, digest, status: "ready" } });
  } catch (err) {
    await setDocumentDigest(doc.id, null, "failed");
    const message = err instanceof Error ? err.message : "Digest failed";
    return NextResponse.json({ document: { ...doc, status: "failed" }, error: message }, { status: 200 });
  }
}
```

- [ ] **Step 3: Typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add lib/atlas/deal.ts app/api/atlas/deal-document/route.ts
git commit -m "feat: document upload and digest route"
```

---

## Task 8: Inject deal context into the chat route

**Files:**
- Modify: `app/api/atlas/chat/route.ts`

- [ ] **Step 1: Import the context builder**

In `app/api/atlas/chat/route.ts`, add to the imports near line 9:
```ts
import { buildDealContext } from "@/lib/atlas/deal";
```

- [ ] **Step 2: Read `dealId` from the request body**

Change the destructuring at line 34 from:
```ts
  const { messages: rawMessages, mode: bodyMode = "chat" } = await req.json();
```
to:
```ts
  const { messages: rawMessages, mode: bodyMode = "chat", dealId = null } = await req.json();
```

- [ ] **Step 3: Build the deal context once, after `systemPrompt` is set**

Immediately after the `if (command) { ... }` block (around line 65), add:
```ts
  const dealContext = await buildDealContext(dealId);
```

- [ ] **Step 4: Inject in report mode**

In the report branch, after the `operating_library` block builds `fullDigest` (around line 129, after the `if (libraryContext)` append), add:
```ts
          if (dealContext) {
            fullDigest += `\n\n${dealContext}`;
          }
```

- [ ] **Step 5: Inject in chat mode**

In the chat branch (around line 181), change:
```ts
  if (libraryContext) {
    systemPrompt += `\n\n${libraryContext}`;
  }
```
to:
```ts
  if (libraryContext) {
    systemPrompt += `\n\n${libraryContext}`;
  }
  if (dealContext) {
    systemPrompt += `\n\n${dealContext}`;
  }
```

- [ ] **Step 6: Typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add app/api/atlas/chat/route.ts
git commit -m "feat: inject deal context into chat and report turns"
```

---

## Task 9: Pass the active deal id through the transport

**Files:**
- Modify: `components/AtlasChat.tsx`

- [ ] **Step 1: Add active-deal state**

In `AtlasChat` (after the other `useState` calls near line 108), add:
```tsx
  const [activeDealId, setActiveDealId] = useState<string | null>(null);
```

- [ ] **Step 2: Send `dealId` in the transport body and rebuild on change**

Change the transport `useMemo` (lines 189-197) to include `dealId` and depend on `activeDealId`:
```tsx
  const transport = useMemo(
    () =>
      new TextStreamChatTransport({
        api: "/api/atlas/chat",
        body: { mode: "chat", dealId: activeDealId },
        fetch: customFetch,
      }),
    [customFetch, activeDealId]
  );
```

- [ ] **Step 3: Typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add components/AtlasChat.tsx
git commit -m "feat: thread active deal id through chat transport"
```

---

## Task 10: Deal Workspace panel component

**Files:**
- Create: `components/DealWorkspacePanel.tsx`
- Modify: `app/globals.css` (panel styles)

This task is verified via the browser preview workflow, not unit tests (DOM-heavy, follows the existing `AtlasChatHistoryPanel` pattern).

- [ ] **Step 1: Add panel styles**

In `app/globals.css`, find the `.atlas-history-panel` rule and add a sibling block after it (reuse its sizing/transition conventions). If `.atlas-history-panel` anchors left with `left: 0` and a translate, mirror it on the right:
```css
.deal-workspace-panel {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 340px;
  background: var(--paper, #fff);
  border-left: 1px solid oklch(31% 0.038 248 / 0.12);
  transform: translateX(100%);
  transition: transform 0.25s ease;
  z-index: 30;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}
.deal-workspace-panel.is-open { transform: translateX(0); }
.deal-workspace-trigger {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 9px;
  border: 1px solid oklch(31% 0.038 248 / 0.12);
  background: var(--paper, #fff);
  color: var(--stone, #555);
}
.deal-workspace-field {
  width: 100%;
  border: 1px solid oklch(31% 0.038 248 / 0.14);
  border-radius: 8px;
  padding: 7px 10px;
  font-size: 13px;
  background: transparent;
}
```
Adjust the color/variable names to match the surrounding file's existing tokens (`--paper`, `--stone`, `--line`, `--ink`, `--accent`) — inspect the existing `.atlas-history-panel` rule and copy its exact values.

- [ ] **Step 2: Write the panel component**

Create `components/DealWorkspacePanel.tsx`:
```tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { Stack, X, Upload, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import type { Deal, DealDocument, DealStage, DealType, ValueLever } from "@/lib/atlas/deal-types";

const STAGES: DealStage[] = ["sourced", "screening", "ioi", "loi", "diligence", "ic", "closed", "passed"];
const TYPES: DealType[] = ["platform", "bolt_on", "tuck_in", "carve_out", "other"];
const LEVERS: { id: ValueLever; label: string }[] = [
  { id: "organic_growth", label: "Organic growth" },
  { id: "margin_expansion", label: "Margin expansion" },
  { id: "buy_and_build", label: "Buy-and-build" },
  { id: "multiple_expansion", label: "Multiple exp." },
  { id: "deleveraging", label: "Deleveraging" },
];

interface Props {
  open: boolean;
  onClose: () => void;
  activeDealId: string | null;
  onActiveDealChange: (id: string | null) => void;
}

export function DealWorkspacePanel({ open, onClose, activeDealId, onActiveDealChange }: Props) {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [documents, setDocuments] = useState<DealDocument[]>([]);
  const [uploading, setUploading] = useState(false);

  const active = deals.find((d) => d.id === activeDealId) ?? null;

  const loadDeals = useCallback(async () => {
    const res = await fetch("/api/atlas/deals");
    if (!res.ok) return;
    const data = await res.json();
    setDeals(data.deals ?? []);
    if (!activeDealId && data.deals?.[0]) onActiveDealChange(data.deals[0].id);
  }, [activeDealId, onActiveDealChange]);

  useEffect(() => { if (open) loadDeals(); }, [open, loadDeals]);

  useEffect(() => {
    if (!activeDealId) { setDocuments([]); return; }
    fetch(`/api/atlas/deals?documentsFor=${activeDealId}`)
      .then((r) => r.json()).then((d) => setDocuments(d.documents ?? [])).catch(() => {});
  }, [activeDealId]);

  const patchActive = useCallback(async (patch: Partial<Deal>) => {
    if (!active) return;
    setDeals((cur) => cur.map((d) => (d.id === active.id ? { ...d, ...patch } : d)));
    await fetch(`/api/atlas/deals/${active.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patch),
    });
  }, [active]);

  const newDeal = useCallback(async () => {
    const res = await fetch("/api/atlas/deals", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: "New deal" }),
    });
    const data = await res.json();
    if (data.deal) { setDeals((c) => [data.deal, ...c]); onActiveDealChange(data.deal.id); }
  }, [onActiveDealChange]);

  const upload = useCallback(async (file: File, docType: string) => {
    if (!active) return;
    setUploading(true);
    const form = new FormData();
    form.append("file", file); form.append("dealId", active.id); form.append("docType", docType);
    try {
      const res = await fetch("/api/atlas/deal-document", { method: "POST", body: form });
      const data = await res.json();
      if (data.document) setDocuments((c) => [...c, data.document]);
    } finally { setUploading(false); }
  }, [active]);

  const toggleLever = useCallback((lever: ValueLever) => {
    if (!active) return;
    const next = active.levers.includes(lever)
      ? active.levers.filter((l) => l !== lever)
      : [...active.levers, lever];
    patchActive({ levers: next });
  }, [active, patchActive]);

  return (
    <aside className={`deal-workspace-panel ${open ? "is-open" : ""}`} aria-hidden={!open} inert={!open}>
      <div className="flex h-14 items-center justify-between border-b border-line/45 px-4">
        <div className="flex items-center gap-2">
          <Stack size={15} strokeWidth={1.7} className="text-accent" />
          <span className="font-mono-label text-[0.68rem] text-ink">Deal workspace</span>
        </div>
        <button type="button" onClick={onClose} aria-label="Close deal workspace" className="text-stone/70">
          <X size={15} strokeWidth={1.8} />
        </button>
      </div>

      <div className="border-b border-line/35 p-3">
        <select
          className="deal-workspace-field"
          value={active?.id ?? ""}
          onChange={(e) => (e.target.value === "__new" ? newDeal() : onActiveDealChange(e.target.value))}
        >
          {deals.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          <option value="__new">+ New deal</option>
        </select>
      </div>

      {active && (
        <div className="flex flex-col gap-5 p-4">
          <section className="flex flex-col gap-2">
            <Label>Basics</Label>
            <input className="deal-workspace-field" placeholder="Deal name" value={active.name}
              onChange={(e) => patchActive({ name: e.target.value })} />
            <input className="deal-workspace-field" placeholder="Target company" value={active.target ?? ""}
              onChange={(e) => patchActive({ target: e.target.value })} />
            <input className="deal-workspace-field" placeholder="Sector" value={active.sector ?? ""}
              onChange={(e) => patchActive({ sector: e.target.value })} />
            <div className="flex gap-2">
              <select className="deal-workspace-field" value={active.stage ?? ""}
                onChange={(e) => patchActive({ stage: (e.target.value || null) as DealStage })}>
                <option value="">Stage…</option>
                {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <select className="deal-workspace-field" value={active.deal_type ?? ""}
                onChange={(e) => patchActive({ deal_type: (e.target.value || null) as DealType })}>
                <option value="">Type…</option>
                {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </section>

          <section className="flex flex-col gap-2">
            <Label>Documents</Label>
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center gap-2 rounded-lg border border-line/40 px-3 py-2 text-xs">
                <span className="flex-1 truncate">{doc.filename}</span>
                <DocStatusBadge status={doc.status} />
              </div>
            ))}
            <label className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-line/60 px-3 py-2 text-xs text-stone/70 cursor-pointer">
              {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
              Upload CIM, QoE, deck…
              <input type="file" accept="application/pdf" className="hidden" disabled={uploading}
                onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f, inferDocType(f.name)); e.target.value = ""; }} />
            </label>
          </section>

          <section className="flex flex-col gap-2">
            <Label>Thesis &amp; focus</Label>
            <textarea className="deal-workspace-field min-h-[88px] resize-y" placeholder="Investment thesis, focus, risks to watch…"
              value={active.thesis ?? ""} onChange={(e) => patchActive({ thesis: e.target.value })} />
            <div className="flex flex-wrap gap-1.5">
              {LEVERS.map((l) => (
                <button key={l.id} type="button" onClick={() => toggleLever(l.id)}
                  className={`rounded-full px-2.5 py-1 text-[11px] border ${active.levers.includes(l.id) ? "bg-accent/10 text-accent border-accent/30" : "text-stone/70 border-line/40"}`}>
                  {l.label}
                </button>
              ))}
            </div>
          </section>
        </div>
      )}
    </aside>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <span className="font-mono-label text-[0.6rem] uppercase tracking-wide text-stone/55">{children}</span>;
}

function DocStatusBadge({ status }: { status: DealDocument["status"] }) {
  if (status === "ready") return <span className="flex items-center gap-1 text-emerald-600"><CheckCircle2 size={13} />Ready</span>;
  if (status === "failed") return <span className="flex items-center gap-1 text-red-500"><AlertCircle size={13} />Failed</span>;
  return <span className="flex items-center gap-1 text-stone/60"><Loader2 size={13} className="animate-spin" />Reading…</span>;
}

function inferDocType(filename: string): string {
  const f = filename.toLowerCase();
  if (f.includes("cim")) return "cim";
  if (f.includes("qoe") || f.includes("quality")) return "qoe";
  if (f.includes("deck") || f.includes("presentation")) return "mgmt_deck";
  return "other";
}
```

Note: if `lucide-react` does not export `Stack`, use `Layers` (already imported elsewhere in the codebase). Verify the icon names against `components/AtlasChat.tsx` imports.

- [ ] **Step 3: Typecheck**

Run: `npm run typecheck`
Expected: no errors. Fix any icon-name mismatches.

- [ ] **Step 4: Commit**

```bash
git add components/DealWorkspacePanel.tsx app/globals.css
git commit -m "feat: deal workspace panel component"
```

---

## Task 11: Mount the panel in the chat shell

**Files:**
- Modify: `components/AtlasChat.tsx`

- [ ] **Step 1: Import the panel and a trigger icon**

Add to imports in `components/AtlasChat.tsx`:
```tsx
import { DealWorkspacePanel } from "./DealWorkspacePanel";
import { Layers } from "lucide-react";
```

- [ ] **Step 2: Add open state**

Near the `activeDealId` state added in Task 9, add:
```tsx
  const [dealPanelOpen, setDealPanelOpen] = useState(false);
```

- [ ] **Step 3: Render the trigger and panel (full-page only)**

Inside the `{fullPage && ( ... )}` block (around line 471-495, next to the history panel), add a trigger button and the panel:
```tsx
          {!dealPanelOpen && (
            <button type="button" onClick={() => setDealPanelOpen(true)}
              className="deal-workspace-trigger" aria-label="Open deal workspace" aria-expanded={false}>
              <Layers size={17} strokeWidth={1.8} />
            </button>
          )}
          <DealWorkspacePanel
            open={dealPanelOpen}
            onClose={() => setDealPanelOpen(false)}
            activeDealId={activeDealId}
            onActiveDealChange={setActiveDealId}
          />
```

- [ ] **Step 4: Typecheck and lint**

Run: `npm run typecheck && npm run lint`
Expected: no errors.

- [ ] **Step 5: Verify in the browser (preview workflow)**

Start the preview (`preview_start`), open `/atlas-iq/chat`. Confirm:
- The deal-workspace trigger appears (right side); clicking opens the panel.
- "+ New deal" creates a deal; basics fields autosave (reload, values persist).
- Uploading a small PDF shows Reading… then Ready.
- After a deal has a thesis/digest, ask a deal-specific question in chat and confirm the answer reflects the deal context.
Capture a screenshot for the user.

- [ ] **Step 6: Commit**

```bash
git add components/AtlasChat.tsx
git commit -m "feat: mount deal workspace panel in chat shell"
```

---

## Task 12: Full verification pass

- [ ] **Step 1: Run the whole test suite**

Run: `npm test`
Expected: all `lib/atlas/*.test.ts` suites pass.

- [ ] **Step 2: Typecheck + lint + build**

Run: `npm run typecheck && npm run lint && npm run build`
Expected: clean.

- [ ] **Step 3: Commit any fixes, then summarize**

If fixes were needed, commit them. Report final status to the user (tests, typecheck, build, and the manual preview checks from Task 11 Step 5).

---

## Self-Review Notes (for the planner — already checked)

- **Spec coverage:** panel + four zones (Task 10), Supabase data model (Task 1/2), digest pipeline (Task 5/7), context injection (Task 8), tenancy seams (Task 1 schema), `unpdf` dep (Task 0). Mandate read covered in `getDealContextData`/context builder; a mandate-editor UI is intentionally minimal (read into context; editing can be a fast-follow — flagged).
- **Out of scope confirmed absent:** no fit verdict, no memo generation, no auth.
- **Type consistency:** `Deal`, `DealDocument`, `FundMandate`, `DealContextData`, `buildDealContext`, `buildDealContextString`, `getDealContextData` names are consistent across tasks.
- **Known gap to flag at execution:** the fund-mandate edit UI is not built in Task 10 (only deal-level fields). Mandate is read into context if a row exists. Add a mandate editor as a fast-follow if needed before launch.
