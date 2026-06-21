# AtlasIQ Research Desk Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the generic AtlasIQ landing-page feature inventory with the approved investment-question, sample-memo, research-path, and evidence-standard experience.

**Architecture:** Keep the landing page server-rendered and data-driven inside `app/atlas-iq/page.tsx`. Replace the obsolete Atlas landing selectors in `app/globals.css` with narrowly scoped Research Desk styles while preserving the existing route, metadata, navigation, and chat implementation.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS utilities, scoped global CSS, Lucide React.

---

### Task 1: Lock Existing Route Behavior

**Files:**
- Inspect: `app/atlas-iq/page.tsx`
- Inspect: `app/atlas-iq/chat/page.tsx`
- Inspect: `app/globals.css`

- [ ] **Step 1: Confirm the baseline page compiles**

Run: `npm run typecheck`

Expected: exit code 0 with no TypeScript diagnostics.

- [ ] **Step 2: Confirm the baseline lint state**

Run: `npm run lint -- app/atlas-iq/page.tsx`

Expected: exit code 0 with no ESLint diagnostics for the landing page.

- [ ] **Step 3: Record behavior that must remain stable**

Verify in `app/atlas-iq/page.tsx` that metadata keeps `path: "/atlas-iq"` and that the primary CTA links to `/atlas-iq/chat`. The redesigned primary CTA, all three research rows, and the final CTA must use that same destination.

### Task 2: Replace the Feature Inventory With the Research Desk

**Files:**
- Modify: `app/atlas-iq/page.tsx`

- [ ] **Step 1: Remove the obsolete capability and differentiator models**

Delete `capabilities`, `differentiators`, and the unused `Landmark`, `Building2`, `MessageCircle`, `Zap`, `BookOpen`, and `Shield` imports. Retain `ArrowRight` and add no dependency.

- [ ] **Step 2: Add the research-path and evidence-state content**

Use these exact typed data structures:

```tsx
const researchPaths = [
  {
    number: "01",
    title: "Map a market",
    output: "Sector memo",
    description:
      "Size the opportunity, map fragmentation, identify sponsor activity, and isolate the questions that matter before outreach begins.",
  },
  {
    number: "02",
    title: "Screen a company",
    output: "Target screen",
    description:
      "Test business quality, platform fit, operating leverage, and the risks that should shape the first diligence request.",
  },
  {
    number: "03",
    title: "Challenge a thesis",
    output: "IC challenge",
    description:
      "Pressure-test the investment logic, separate evidence from assumption, and turn unanswered questions into a diligence agenda.",
  },
] as const;

const evidenceStates = [
  {
    label: "Sourced fact",
    description: "Traceable evidence with enough context to inspect the underlying claim.",
    tone: "fact",
  },
  {
    label: "Supported inference",
    description: "An analytical conclusion made explicit, with the evidence and assumptions behind it.",
    tone: "inference",
  },
  {
    label: "Open diligence item",
    description: "A material gap converted into a question the deal team can resolve.",
    tone: "open",
  },
] as const;
```

- [ ] **Step 3: Build the approved semantic page hierarchy**

Render one `main.atlas-research-desk` containing:

1. `section.atlas-research-hero` with the sponsor-research-system eyebrow, `Start with the investment question.` heading, supporting copy, `/atlas-iq/chat` CTA, and mode label.
2. `aside.atlas-research-note` with the visible label `Sample IC research note`, Commercial HVAC Services title, and Market, Risk, and Diligence entries.
3. `section.atlas-research-paths` headed `Three ways in.` with each item rendered as a full-row `Link` to `/atlas-iq/chat`.
4. `section.atlas-evidence-standard` headed `Know what is proven.` with the three evidence states.
5. A final `Open research desk` link to `/atlas-iq/chat` inside the evidence section footer.

The sample memo must not be `aria-hidden`; it is meaningful product evidence. The arrow icons inside links must include `aria-hidden="true"`.

- [ ] **Step 4: Run the focused checks**

Run: `npm run lint -- app/atlas-iq/page.tsx && npm run typecheck`

Expected: both commands exit 0.

### Task 3: Rebuild the AtlasIQ Landing Styles

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Remove obsolete presentation styles**

Delete `.atlas-hero`, `.atlas-hero::before`, `.atlas-hero::after`, `.atlas-hero__grid`, `.atlas-mark`, `.atlas-mark span`, `.atlas-hero__artifact`, `.atlas-memo-sheet`, `.atlas-capability`, `.atlas-dossier`, and their mobile overrides. Keep `.atlas-page`, the Atlas chat styles, and navigation styles unchanged.

- [ ] **Step 2: Add Research Desk layout and interaction styles**

Add scoped selectors for:

```css
.atlas-research-desk
.atlas-research-topline
.atlas-research-hero
.atlas-research-hero__copy
.atlas-research-note
.atlas-research-note__header
.atlas-research-note__row
.atlas-research-note__marker
.atlas-research-paths
.atlas-research-path
.atlas-research-path__number
.atlas-research-path__body
.atlas-research-path__output
.atlas-evidence-standard
.atlas-evidence-grid
.atlas-evidence-item
.atlas-evidence-marker
.atlas-evidence-footer
```

Use existing color variables and thin rules. The hero must use `grid-template-columns: minmax(0, 1.35fr) minmax(18rem, 0.65fr)` at desktop and one column below `768px`. Research rows must use stable grid tracks at desktop and stack below `640px`. Interactive rows must have `min-height: 7rem`, a visible `:focus-visible` outline, and restrained hover color/arrow movement. Evidence states must use three columns at desktop and one column below `768px`.

- [ ] **Step 3: Add reduced-motion behavior**

Inside the existing or a new `@media (prefers-reduced-motion: reduce)` block, remove transforms and set transition durations to `0.01ms` for `.atlas-research-path` and its arrow.

- [ ] **Step 4: Run static verification**

Run: `npm run lint -- app/atlas-iq/page.tsx && npm run typecheck && npm run build`

Expected: all commands exit 0 and the build lists `/atlas-iq` and `/atlas-iq/chat` without errors.

### Task 4: Browser QA and Visual Verification

**Files:**
- Create: `output/playwright/atlas-research-desk-desktop.png`
- Create: `output/playwright/atlas-research-desk-mobile.png`

- [ ] **Step 1: Start or reuse the local application server**

Run: `npm run dev`

Expected: Next.js reports a local URL and serves `/atlas-iq` successfully.

- [ ] **Step 2: Verify desktop rendering**

At 1440 x 1000, confirm the hero copy and memo are side by side, the three research rows remain stable, the evidence legend is legible, no text overlaps, and the page has no horizontal overflow. Save the desktop screenshot.

- [ ] **Step 3: Verify mobile rendering**

At 390 x 844, confirm the memo follows the hero copy, each research path stacks without clipping, evidence items become a vertical list, tap targets are at least 44px high, and the page has no horizontal overflow. Save the mobile screenshot.

- [ ] **Step 4: Verify behavior and accessibility**

Confirm the primary CTA, three research rows, and final CTA all resolve to `/atlas-iq/chat`; keyboard tab order follows the visual order; focus indicators are visible; reduced-motion preference disables directional transforms; and the browser console contains no errors.

- [ ] **Step 5: Review the final diff**

Run: `git diff --check && git diff -- app/atlas-iq/page.tsx app/globals.css`

Expected: no whitespace errors, no obsolete landing selectors, no unrelated changes introduced, and no fallback-like duplicate implementation remains.

