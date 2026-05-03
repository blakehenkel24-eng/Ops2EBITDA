# Commercial Frontend Update Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Build the frontend-only hybrid commercial layer: simplified navigation, dashboard offering placements, and a static offerings catalog page with Lemon Squeezy placeholders.

**Architecture:** Keep product data static in `lib/offerings.ts` so the dashboard and offerings page share the same source. Update the existing top navigation in `components/ClientNav.tsx`, keep dashboard content in `app/page.tsx`, and add a new route at `app/offerings/page.tsx`. Avoid payment scripts, backend APIs, auth state, or new dependencies.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS v4 utility classes, lucide-react icons already present in the project.

---

### Task 1: Static Offering Data

**Files:**
- Create: `lib/offerings.ts`

- [x] **Step 1: Create reusable offering data**

Add `lib/offerings.ts` with these exports:

```ts
export type OfferingCategory = "Excel Model" | "AI Project Kit" | "Skill Package" | "Bundle";

export type Offering = {
  title: string;
  category: OfferingCategory;
  price: string;
  description: string;
  items: string[];
  featured?: boolean;
  futureCheckoutLabel: string;
};

export const productLines = [
  {
    title: "Excel Models",
    price: "$99 each",
    description:
      "Decision-ready workbooks for quantifying EBITDA, cash flow, and enterprise value impact.",
    examples: [
      "Pricing Waterfall & Margin Leakage Model",
      "Procurement Spend Cube & Savings Tracker",
      "Working Capital & Cash Conversion Model",
    ],
  },
  {
    title: "AI Project Kits",
    price: "$49 each",
    description:
      "Ready-to-build AI workspaces for recurring PE operating workflows and executive outputs.",
    examples: [
      "Operating Partner Copilot",
      "Board Pack & Executive Update Builder",
      "KPI Diagnostic & Root Cause Project",
    ],
  },
  {
    title: "Skill Packages",
    price: "$39 each",
    description:
      "Reusable markdown skill bundles for PE communication, diagnostics, diligence, and quality control.",
    examples: [
      "Executive Communication Skills",
      "Operating Diagnostic Skills",
      "Work Product Quality Control Skills",
    ],
  },
] as const;

export const featuredOfferings: Offering[] = [
  {
    title: "Full Ops2EBITDA Toolkit",
    category: "Bundle",
    price: "$699",
    description:
      "The complete operating asset library: models, project kits, and reusable skill packages.",
    items: ["Excel model library", "AI project kit library", "Skill package library"],
    featured: true,
    futureCheckoutLabel: "Buy with Lemon Squeezy later",
  },
  {
    title: "Core Model Bundle",
    category: "Bundle",
    price: "$399",
    description:
      "Launch-ready Excel models for the value creation analyses most likely to need real modeling depth.",
    items: ["Pricing", "Procurement", "Working capital", "Sales productivity"],
    futureCheckoutLabel: "Add checkout link later",
  },
  {
    title: "AI Project Library",
    category: "Bundle",
    price: "$299",
    description:
      "Structured AI workspaces for portfolio monitoring, board updates, diligence, and operating planning.",
    items: ["Operating partner copilot", "Board updates", "KPI diagnostics"],
    futureCheckoutLabel: "Add checkout link later",
  },
  {
    title: "Skill Package Library",
    category: "Bundle",
    price: "$179",
    description:
      "The complete set of reusable PE operating skills for AI tools, local agents, and project folders.",
    items: ["Executive communication", "Diagnostics", "Diligence", "Quality control"],
    futureCheckoutLabel: "Add checkout link later",
  },
];
```

- [x] **Step 2: Run typecheck**

Run: `npm run typecheck`

Expected: exits successfully with no TypeScript errors.

### Task 2: Simplified Navigation

**Files:**
- Modify: `components/ClientNav.tsx`

- [x] **Step 1: Replace the long link list with three lanes**

Update `ClientNav` so desktop and mobile nav render:

- Knowledge Base, with a hover/focus dropdown containing Fundamentals, Playbooks, Industries, KPIs.
- Offerings, linking to `/offerings`.
- Start Here, linking to `/study`.

Use lucide icons already installed. Keep active states for `/`, `/offerings`, `/study`, and all knowledge-base child routes.

- [x] **Step 2: Run lint and typecheck**

Run: `npm run lint && npm run typecheck`

Expected: no lint errors, no TypeScript errors. The existing `refactor.mjs` warning may still appear.

### Task 3: Dashboard Commercial Rail

**Files:**
- Modify: `app/page.tsx`
- Read: `lib/offerings.ts`

- [x] **Step 1: Import offering data**

Use `productLines` and `featuredOfferings` from `lib/offerings.ts`.

- [x] **Step 2: Rework dashboard hero and first sections**

Keep the dashboard knowledge-first, but add:

- A right-side "Paid operating assets" rail in the hero using `featuredOfferings[0]`.
- A section for the three product lines.
- A link to `/offerings`.

Keep search, operator agenda, value creation logic, featured briefings, and industry intelligence.

- [x] **Step 3: Run lint and typecheck**

Run: `npm run lint && npm run typecheck`

Expected: no lint errors, no TypeScript errors. The existing `refactor.mjs` warning may still appear.

### Task 4: Offerings Catalog Route

**Files:**
- Create: `app/offerings/page.tsx`
- Read: `lib/offerings.ts`

- [x] **Step 1: Create the route**

Add `app/offerings/page.tsx` with:

- Page header explaining the paid assets help users do the work.
- Product-line cards for Excel Models, AI Project Kits, and Skill Packages.
- Bundle cards using `featuredOfferings`.
- Non-functional buttons labeled with each offering's `futureCheckoutLabel`.
- A short note that Lemon Squeezy checkout wiring is coming later.

- [x] **Step 2: Run lint and typecheck**

Run: `npm run lint && npm run typecheck`

Expected: no lint errors, no TypeScript errors. The existing `refactor.mjs` warning may still appear.

### Task 5: Final Verification

**Files:**
- Verify: entire app

- [x] **Step 1: Run production build**

Run: `npm run build`

Expected: production build completes successfully.

- [x] **Step 2: Start dev server**

Run: `npm run dev`

Expected: server starts and prints a local URL.

- [x] **Step 3: Browser check**

Open the local URL and check:

- Desktop dashboard renders with search, knowledge sections, and offering rail.
- `/offerings` renders product lines, bundles, and placeholder purchase buttons.
- Top nav shows Knowledge Base, Offerings, Start Here.
- Knowledge Base dropdown exposes Fundamentals, Playbooks, Industries, KPIs.
- Mobile width does not overlap text or hide nav actions.

- [x] **Step 4: Review git diff**

Run: `git diff --stat && git diff --check`

Expected: diff is scoped to the commercial frontend work and `git diff --check` reports no whitespace errors.
