# New Content Depth Parity Design

## Objective

Bring the 19 recently added PE fundamentals and playbooks to the same editorial, analytical, and visual standard as the established library. The upgrade should make each page feel purpose-built for its topic while preserving the shared reading experience and content model used by the stronger older pages.

## Scope

The upgrade covers the ten fundamentals introduced on June 6, 2026:

- 100-Day Plan
- Board Governance in PE
- Debt Covenants and Lender Reporting
- Exit Readiness
- Investment Committee Process
- Management Equity Plans
- Platform vs. Add-On Strategy
- Purchase Price Mechanics
- Quality of Earnings
- Working Capital in Private Equity

It also covers the nine playbooks introduced on June 9, 2026:

- Customer Concentration Reduction
- Debt Covenant Recovery Plan
- ERP Systems Consolidation
- Management Equity Rollout
- Margin Leakage Diagnostic
- Quality of Earnings Preparation
- Revenue Operations Cleanup
- Sales Compensation Redesign
- SKU Rationalization

Industry-project playbooks and older content are outside the content-rewrite scope. Shared pipeline or validation changes may apply across the library when necessary to preserve the upgraded pages and enforce the existing standard.

## Established Quality Benchmark

The benchmark is the strongest existing content rather than a new editorial format. Representative fundamentals include Value Creation Planning and Commercial Diligence. Representative playbooks include Pricing Optimization, Exit Readiness, and Data Readiness for AI.

Each upgraded page will contain:

- five substantive article sections with three developed paragraphs per section;
- approximately 1,050 to 1,400 words of displayed article copy, with flexibility where a topic needs more explanation;
- a progression from concept or diagnosis through mechanics, execution, governance, and durable value;
- at least one topic-specific callout that sharpens a decision rule or operating principle;
- one titled and described Mermaid diagram that clarifies a real workflow, bridge, waterfall, decision tree, or governance cycle;
- a worked numerical example, operating mini-case, or explicit value bridge where the subject supports quantification;
- concrete ownership, management cadence, decision gates, failure modes, and exit or underwriting implications;
- language specific to the topic, avoiding interchangeable template prose.

The target is parity, not identical word counts. A page passes when it carries the same decision usefulness and analytical density as the benchmark pages.

## Editorial Design

### Fundamentals

Fundamentals will teach the concept through five layers: definition and mechanics; sponsor or underwriting relevance; operator implications during the hold; downside cases and common misinterpretations; and how the concept affects governance, value realization, or exit. Transactional topics such as purchase price, quality of earnings, working capital, and management equity will include explicit bridges or waterfall examples. Governance topics will include roles, escalation paths, and decision rights.

### Playbooks

Playbooks will read as executable operating guides. Their five-section arc will cover the baseline and value hypothesis; diagnostic data and segmentation; sequenced workstreams and decision gates; ownership, cadence, controls, and change management; and benefit validation plus exit durability. Existing structured fields such as diagnostic questions, data needs, process steps, KPIs, the 100-day plan, and common mistakes will remain intact and consistent with the expanded narrative rather than being repeated mechanically.

### Diagrams

Every upgraded page will populate the rendered `diagrams` collection, not only the legacy singular `diagram` field. Each diagram must explain a topic-specific relationship that is easier to understand visually than in prose. Decorative or generic left-to-right flows do not satisfy the requirement.

## Content-Pipeline Durability

The current generation workflow knows only the older content registry and can remove the 19 newer pages. The implementation will make collection generation non-destructive for hand-authored pages that are not in the legacy registry. Enrichment will preserve a page's existing `articleSections` and `diagrams` when no type-specific generated replacement exists, while continuing to enrich legacy generated pages from their curated sources. This protects the upgraded cohort, prevents shallow fallback copy from replacing authored material, and avoids the same-slug collision between the fundamental and playbook versions of Exit Readiness.

No new runtime dependency is required. The solution should remain understandable from the repository and avoid creating a second competing source of truth.

## Quality Validation

A repository-local content check will validate the complete fundamentals and playbooks collections. At minimum it will check:

- valid JSON and required type-specific fields;
- filename, slug, and content-type consistency;
- five article sections and three non-empty paragraphs per section for the upgraded cohort;
- a practical displayed-word-depth floor that catches abbreviated pages without rewarding filler;
- unique, non-placeholder section titles;
- at least one callout and one valid rendered diagram for each upgraded page;
- valid related-content references where those references are expected;
- generation safety so the full cohort is not silently deleted or replaced with fallback copy.

The validator will report page-specific failures. It will be runnable independently and as part of the relevant content workflow.

## Verification

Completion requires:

1. parsing and validating every fundamentals and playbooks JSON file;
2. confirming all 19 upgraded pages meet the structural and depth bar;
3. running the content pipeline in a controlled round-trip and confirming it preserves the complete cohort;
4. running typecheck, lint, and production build;
5. visually inspecting representative pages from both collections at desktop and narrow viewport widths, including diagrams, callouts, headings, and long-form reading rhythm;
6. reviewing the final diff to confirm unrelated existing worktree changes were not modified.

## Non-Goals

- Redesigning the shared library layout or navigation.
- Rewriting the 27 established benchmark pages.
- Adding new dependencies or a new CMS.
- Inflating pages with generic prose solely to satisfy a word count.
- Exposing every structured metadata field as a new UI block when the article narrative already communicates it effectively.

## Acceptance Criteria

The work is complete when all 19 newer pages are comparable to the strongest older pages in displayed depth, analytical specificity, practical usefulness, and visual support; the pages survive content regeneration; automated checks prevent a future abbreviated batch from passing unnoticed; and the application passes its existing engineering verification commands.
