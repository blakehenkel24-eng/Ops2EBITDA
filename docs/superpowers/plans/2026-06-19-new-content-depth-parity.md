# New Content Depth Parity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the 19 newest fundamentals and playbooks to the established high-depth standard and prevent the content pipeline from deleting or flattening them.

**Architecture:** The existing JSON files remain the hand-authored source for the newer cohort and continue to render through the shared `ArticlePage`. The legacy generator becomes non-destructive for unregistered hand-authored files, enrichment preserves authored sections and diagrams when no generated replacement exists, and a dependency-free validator enforces the parity contract.

**Tech Stack:** Next.js 16, TypeScript, JSON content, Node.js ESM scripts, Mermaid

---

## File Map

- `content/fundamentals/*.json`: expand the ten June 6 fundamentals to five sections, 15 paragraphs, at least one callout, and one rendered diagram.
- `content/playbooks/*.json`: expand the nine June 9 playbooks to the same structural and decision-usefulness standard.
- `scripts/validate-content.mjs`: validate structure, depth, diagrams, callouts, slugs, and required fields for the upgraded cohort.
- `scripts/content-pipeline.test.mjs`: exercise generation and enrichment in an isolated temporary copy and prove the newer cohort survives unchanged.
- `scripts/generate-content.mjs`: preserve JSON pages not represented in the legacy registry.
- `scripts/enrich-content.mjs`: preserve authored article sections and diagrams before considering generic fallbacks.
- `package.json`: expose content validation and pipeline-test commands.

## Editorial Contract

Every upgraded JSON file must satisfy all of these rules:

- exactly five `articleSections`, each with a unique title and exactly three non-empty paragraphs;
- 1,050 or more words across `articleSections` without padding or repeated prose;
- at least one section-level `callout`;
- at least one object in `diagrams` with a non-empty title, description, and valid Mermaid chart string;
- quantified economics or a concrete mini-case;
- explicit operating ownership, cadence, decision gates, failure modes, and underwriting or exit relevance;
- consistency between the narrative and existing top-level diagnostic, process, KPI, relationship, and example fields.

### Task 1: Add the failing content-quality validator

**Files:**
- Create: `scripts/validate-content.mjs`
- Modify: `package.json`

- [ ] **Step 1: Add a validator command that fails against the current shallow cohort**

Implement `scripts/validate-content.mjs` with constants for the exact 10 fundamental slugs and 9 playbook slugs. For each file, parse JSON and check: filename equals `${slug}.json`; expected `type`; all required fields from `lib/types.ts`; five sections; three paragraphs per section; unique non-empty section titles; at least 1,050 article words; at least one callout; at least one diagram object with `title`, `description`, and `chart`; and no placeholder tokens `TBD`, `TODO`, or `FIXME`. Print one line per violation as `<relative path>: <message>` and exit 1 when any violation exists. Print `Validated 19 upgraded content pages.` and exit 0 otherwise.

Add these scripts to `package.json`:

```json
"content:validate": "node scripts/validate-content.mjs",
"content:test-pipeline": "node scripts/content-pipeline.test.mjs"
```

- [ ] **Step 2: Run the validator and confirm the baseline failure**

Run: `npm run content:validate`

Expected: exit 1 with failures for section count, paragraph count, article depth, callout or diagram coverage across the newer cohort.

- [ ] **Step 3: Commit the executable quality contract**

Stage only `scripts/validate-content.mjs` and `package.json`. Use a Lore commit whose intent is to make abbreviated content fail visibly, with `Tested: npm run content:validate (expected failure on the 19-page baseline)`.

### Task 2: Make content generation preserve hand-authored pages

**Files:**
- Modify: `scripts/generate-content.mjs`
- Modify: `scripts/enrich-content.mjs`
- Create: `scripts/content-pipeline.test.mjs`

- [ ] **Step 1: Write an isolated round-trip regression test**

Implement `scripts/content-pipeline.test.mjs` using only `node:assert/strict`, `node:child_process`, `node:fs`, `node:os`, and `node:path`. Copy `scripts/` and `content/` into a temporary directory, hash the 19 scoped JSON files, run `node scripts/generate-content.mjs` and then `node scripts/enrich-content.mjs` with the temporary directory as `cwd`, and assert that all 19 files still exist and retain the same `articleSections` and `diagrams`. Always remove the temporary directory in `finally`. Print `Content pipeline preserved 19 hand-authored pages.` on success.

- [ ] **Step 2: Run the regression test and confirm destructive behavior**

Run: `npm run content:test-pipeline`

Expected: exit 1 because generation removes the newer files.

- [ ] **Step 3: Preserve unregistered files during generation**

Change `writeCollection(directory, items)` in `scripts/generate-content.mjs` so it creates the target directory and writes the registered items without removing the directory first. Before writing, delete only JSON filenames represented by `items`; leave every other JSON file untouched. This keeps generation deterministic for its registry while preserving hand-authored additions.

- [ ] **Step 4: Preserve authored enrichment**

In `scripts/enrich-content.mjs`, resolve article sections in this order: existing non-empty `item.articleSections`; curated sections; fallback. Resolve diagrams in this order: non-empty output from `diagramsFor`; existing non-empty `item.diagrams`; a titled wrapper around the non-empty singular `item.diagram`; empty array. This prevents enrichment from flattening the newer pages and gives legacy singular diagrams a safe rendered fallback.

- [ ] **Step 5: Run the pipeline regression test**

Run: `npm run content:test-pipeline`

Expected: `Content pipeline preserved 19 hand-authored pages.`

- [ ] **Step 6: Commit the durability fix**

Stage only the two pipeline scripts and their regression test. Use a Lore commit recording the constraint that registered legacy pages remain regenerable while unregistered authored pages survive.

### Task 3: Deepen the first five fundamentals

**Files:**
- Modify: `content/fundamentals/100-day-plan.json`
- Modify: `content/fundamentals/board-governance-in-pe.json`
- Modify: `content/fundamentals/debt-covenants-and-lender-reporting.json`
- Modify: `content/fundamentals/exit-readiness.json`
- Modify: `content/fundamentals/investment-committee-process.json`

- [ ] **Step 1: Expand each page to the editorial contract using these topic-specific arcs**

Use these five-section arcs in order:

- `100-day-plan`: mandate and value thesis; diligence-to-plan translation; prioritization and sequencing; governance and weekly cadence; day-100 proof and hold-period handoff. Include a quantified initiative bridge and a plan-to-EBITDA workflow diagram.
- `board-governance-in-pe`: active-board mandate; composition and decision rights; board materials and KPI architecture; escalation and intervention; governance as exit evidence. Include a board/committee/management decision-flow diagram.
- `debt-covenants-and-lender-reporting`: covenant architecture; headroom and downside math; reporting controls; lender communication and cure options; refinancing and exit implications. Include a worked leverage or fixed-charge-coverage example and covenant-response decision tree.
- `exit-readiness`: exit-backwards operating model; quality of earnings and data proof; commercial and management readiness; rehearsal and issue remediation; buyer confidence and value realization. Include a readiness-gates timeline diagram.
- `investment-committee-process`: IC mandate and evidence standard; underwriting case and sensitivities; operating diligence and value-creation case; challenge, conditions, and decision rights; post-close thesis tracking. Include a base/downside/upside mini-case and IC gate diagram.

- [ ] **Step 2: Parse the five files and inspect their metrics**

Run this metric check with the five Task 3 paths as arguments:

```bash
node -e 'for(const p of process.argv.slice(1)){const o=require("./"+p),s=o.articleSections||[],words=s.flatMap(x=>x.body).join(" ").trim().split(/\s+/).length; console.log(o.slug,s.length,s.reduce((n,x)=>n+x.body.length,0),words,s.filter(x=>x.callout).length,(o.diagrams||[]).length)}' content/fundamentals/100-day-plan.json content/fundamentals/board-governance-in-pe.json content/fundamentals/debt-covenants-and-lender-reporting.json content/fundamentals/exit-readiness.json content/fundamentals/investment-committee-process.json
```

Expected for every file: `5`, `15`, at least `1050`, at least `1`, at least `1`.

- [ ] **Step 3: Commit the first fundamental cohort**

Stage only these five JSON files and use a Lore commit describing the decision usefulness added and the five benchmark pages used for comparison.

### Task 4: Deepen the remaining five fundamentals

**Files:**
- Modify: `content/fundamentals/management-equity-plans.json`
- Modify: `content/fundamentals/platform-vs-add-on-strategy.json`
- Modify: `content/fundamentals/purchase-price-mechanics.json`
- Modify: `content/fundamentals/quality-of-earnings.json`
- Modify: `content/fundamentals/working-capital-in-private-equity.json`

- [ ] **Step 1: Expand each page to the editorial contract using these topic-specific arcs**

- `management-equity-plans`: alignment objective and pool sizing; cap table and waterfall mechanics; vesting, leaver, and performance terms; communication and administration; dilution, refresh grants, and exit settlement. Include a numeric proceeds-waterfall example and equity waterfall diagram.
- `platform-vs-add-on-strategy`: strategic distinction; platform underwriting and capability requirements; add-on screening and synergy logic; integration governance and sequencing; multiple arbitrage, concentration risk, and exit coherence. Include a platform/add-on decision tree.
- `purchase-price-mechanics`: enterprise-to-equity bridge; debt-like items and cash; normalized working-capital peg; closing accounts and disputes; operator preparation and proceeds certainty. Include a complete numeric purchase-price bridge and waterfall diagram.
- `quality-of-earnings`: purpose and evidence standard; adjusted EBITDA bridge; revenue quality and working capital; operator preparation and challenge process; debt capacity, valuation, and exit implications. Include a worked adjusted-EBITDA bridge and QoE evidence-flow diagram.
- `working-capital-in-private-equity`: cash conversion mechanics; normalized working capital in transactions; operational drivers and segmentation; cadence, controls, and ownership; cash release, covenant capacity, and exit sustainability. Include a numeric DSO/inventory/DPO cash bridge and cash-conversion diagram.

- [ ] **Step 2: Parse and inspect the five files**

Run:

```bash
node -e 'for(const p of process.argv.slice(1)){const o=require("./"+p),s=o.articleSections||[],words=s.flatMap(x=>x.body).join(" ").trim().split(/\s+/).length; console.log(o.slug,s.length,s.reduce((n,x)=>n+x.body.length,0),words,s.filter(x=>x.callout).length,(o.diagrams||[]).length)}' content/fundamentals/management-equity-plans.json content/fundamentals/platform-vs-add-on-strategy.json content/fundamentals/purchase-price-mechanics.json content/fundamentals/quality-of-earnings.json content/fundamentals/working-capital-in-private-equity.json
```

Expected for every file: five sections, 15 paragraphs, at least 1,050 words, one callout, and one diagram.

- [ ] **Step 3: Commit the second fundamental cohort**

Stage only these five JSON files and record the quantitative bridges and governance mechanics in the Lore commit.

### Task 5: Deepen the first five playbooks

**Files:**
- Modify: `content/playbooks/customer-concentration-reduction.json`
- Modify: `content/playbooks/debt-covenant-recovery-plan.json`
- Modify: `content/playbooks/erp-systems-consolidation.json`
- Modify: `content/playbooks/management-equity-rollout.json`
- Modify: `content/playbooks/margin-leakage-diagnostic.json`

- [ ] **Step 1: Expand each playbook to the editorial contract using these execution arcs**

- `customer-concentration-reduction`: exposure baseline; customer and renewal-risk segmentation; retention plus diversification workstreams; ownership and commercial cadence; validated concentration reduction and exit proof. Include a revenue-at-risk bridge and concentration-response diagram.
- `debt-covenant-recovery-plan`: covenant and liquidity baseline; 13-week cash and scenario model; operational and capital responses; lender sequencing and governance; cure validation and normalized reporting. Include a covenant-headroom example and recovery decision tree.
- `erp-systems-consolidation`: application and process baseline; target architecture and selection; data migration, controls, and cutover; adoption and operating governance; benefit realization and scalable exit platform. Include a phased migration diagram and quantified run-rate case.
- `management-equity-rollout`: alignment and eligibility design; pool, waterfall, vesting, and leaver mechanics; legal/tax and approval gates; communication and administration; performance tracking, refresh grants, and exit settlement. Include a management-proceeds example and rollout workflow.
- `margin-leakage-diagnostic`: expected-to-realized margin waterfall; transaction-level segmentation; root-cause workstreams; controls, owners, and weekly closure cadence; captured EBITDA validation and durability. Include a quantified leakage bridge and diagnostic-to-control diagram.

- [ ] **Step 2: Parse and inspect the five playbooks**

Run:

```bash
node -e 'for(const p of process.argv.slice(1)){const o=require("./"+p),s=o.articleSections||[],words=s.flatMap(x=>x.body).join(" ").trim().split(/\s+/).length; console.log(o.slug,s.length,s.reduce((n,x)=>n+x.body.length,0),words,s.filter(x=>x.callout).length,(o.diagrams||[]).length)}' content/playbooks/customer-concentration-reduction.json content/playbooks/debt-covenant-recovery-plan.json content/playbooks/erp-systems-consolidation.json content/playbooks/management-equity-rollout.json content/playbooks/margin-leakage-diagnostic.json
```

Expected for every file: five sections, 15 paragraphs, at least 1,050 words, one callout, and one diagram.

- [ ] **Step 3: Commit the first playbook cohort**

Stage only these five JSON files and record the executable sequencing and quantified economics in the Lore commit.

### Task 6: Deepen the remaining four playbooks

**Files:**
- Modify: `content/playbooks/quality-of-earnings-preparation.json`
- Modify: `content/playbooks/revenue-operations-cleanup.json`
- Modify: `content/playbooks/sales-compensation-redesign.json`
- Modify: `content/playbooks/sku-rationalization.json`

- [ ] **Step 1: Expand each playbook to the editorial contract using these execution arcs**

- `quality-of-earnings-preparation`: readiness diagnostic; EBITDA and add-back schedule; revenue, working-capital, and data-room proof; mock diligence and issue remediation; sustained reporting and buyer confidence. Include a worked EBITDA bridge and preparation timeline.
- `revenue-operations-cleanup`: funnel and data baseline; lifecycle definitions and system governance; stage conversion and handoff redesign; forecast cadence and accountability; performance validation and exit-grade reporting. Include funnel math and lead-to-renewal control flow.
- `sales-compensation-redesign`: strategy and productivity baseline; quota, rate, crediting, and accelerator mechanics; scenario modeling and affordability; rollout, exceptions, and governance; behavior monitoring and plan recalibration. Include a rep economics example and plan-design decision tree.
- `sku-rationalization`: SKU-level profitability and cost-to-serve; keep/fix/exit segmentation; customer migration, inventory, and stranded-cost actions; cross-functional governance and gates; captured margin, working capital, and portfolio simplification. Include a SKU economics bridge and rationalization decision tree.

- [ ] **Step 2: Parse and inspect the four playbooks**

Run:

```bash
node -e 'for(const p of process.argv.slice(1)){const o=require("./"+p),s=o.articleSections||[],words=s.flatMap(x=>x.body).join(" ").trim().split(/\s+/).length; console.log(o.slug,s.length,s.reduce((n,x)=>n+x.body.length,0),words,s.filter(x=>x.callout).length,(o.diagrams||[]).length)}' content/playbooks/quality-of-earnings-preparation.json content/playbooks/revenue-operations-cleanup.json content/playbooks/sales-compensation-redesign.json content/playbooks/sku-rationalization.json
```

Expected for every file: five sections, 15 paragraphs, at least 1,050 words, one callout, and one diagram.

- [ ] **Step 3: Commit the second playbook cohort**

Stage only these four JSON files and record the decision tools, change controls, and benefit-validation logic in the Lore commit.

### Task 7: Run the full quality and engineering verification

**Files:**
- Modify only files required to correct failures introduced by Tasks 1–6.

- [ ] **Step 1: Run the content validator**

Run: `npm run content:validate`

Expected: `Validated 19 upgraded content pages.`

- [ ] **Step 2: Run the isolated pipeline regression**

Run: `npm run content:test-pipeline`

Expected: `Content pipeline preserved 19 hand-authored pages.`

- [ ] **Step 3: Run engineering checks sequentially**

Run: `npm run typecheck`, then `npm run lint`, then `npm run build`.

Expected: all commands exit 0. If lint reports failures in unrelated pre-existing modified files, record the exact paths and separately verify that no new lint errors originate in scoped files.

- [ ] **Step 4: Inspect representative rendered pages**

Run the app locally and inspect at least these routes at desktop and narrow viewport widths:

- `/fundamentals/purchase-price-mechanics`
- `/fundamentals/board-governance-in-pe`
- `/playbooks/debt-covenant-recovery-plan`
- `/playbooks/erp-systems-consolidation`

Confirm five-section reading rhythm, paragraph spacing, callout hierarchy, Mermaid rendering, no overflow, and no console errors.

- [ ] **Step 5: Review scope and final diff**

Use `git status --short` and file-scoped diffs to confirm unrelated existing worktree changes remain untouched. Report the 19 upgraded files, pipeline safeguards, validator results, engineering checks, visual evidence, and any pre-existing unrelated failures.
