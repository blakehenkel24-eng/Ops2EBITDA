# AtlasIQ Research Desk Redesign

**Date:** 2026-06-19  
**Status:** Approved visual direction  
**Scope:** `/atlas-iq` landing page only

## Objective

Make AtlasIQ feel like a credible private-equity research workspace rather than a generic AI feature page. The page should lead with the investment question, demonstrate the shape of the resulting work product, and let visitors choose a research workflow without reading two overlapping feature inventories.

## Design Direction

Use the approved **Research Desk** concept: an editorial, workflow-first composition inspired by an investment committee working paper. The page remains restrained and professional, with asymmetric layouts, thin rules, compact labels, and tangible research artifacts.

The design must remain consistent with the existing Ops2EBITDA system:

- Newsreader for editorial headings and the existing sans-serif body face.
- Cool paper and ink palette with a restrained blue accent.
- Square or minimally rounded geometry.
- Full-width editorial sections instead of repeated floating cards.
- No gradients, decorative blobs, glass effects, oversized icons, or generic feature-card grids.

## Page Structure

### 1. Research Desk Hero

The hero introduces AtlasIQ as a sponsor research system and frames the primary action around an investment question.

- Eyebrow: `ATLASIQ / SPONSOR RESEARCH SYSTEM`
- Heading: `Start with the investment question.`
- Supporting copy explains that AtlasIQ turns a market, company, or thesis question into an IC-ready research brief.
- Primary CTA: `Open research desk`, linking to `/atlas-iq/chat`.
- Compact mode label: `MARKET · COMPANY · THESIS`.

The right side contains a realistic, static example of the output rather than an abstract illustration. The sample artifact is an `IC RESEARCH NOTE` for Commercial HVAC Services with three short entries:

- Market: a sourced market observation.
- Risk: a supported inference.
- Diligence: an unresolved question.

This artifact is illustrative page content, not a claim that a live report has already been generated.

### 2. Research Entry Points

Replace the three equal capability cards with three full-width numbered workflow rows:

1. **Map a market** / `SECTOR MEMO`
2. **Screen a company** / `TARGET SCREEN`
3. **Challenge a thesis** / `IC CHALLENGE`

Each row contains a concise, action-oriented description and a directional affordance. All rows link to `/atlas-iq/chat`. The rows must feel like choices in a research workflow, not product feature cards.

### 3. Evidence Standard

Replace the Operating Library, Workflow Commands, and Source Aware list with a single evidence posture section. It explains the product's analytical distinction through three compact states:

- `Sourced fact`
- `Supported inference`
- `Open diligence item`

Each state has a distinct but restrained marker and a short definition. This section demonstrates how AtlasIQ communicates confidence without making unsupported quantitative claims.

### 4. Final Action

End with one quiet, direct CTA to `/atlas-iq/chat`. Avoid a detached centered link floating in excess whitespace; the action should be structurally connected to the evidence section.

## Responsive Behavior

- At wide widths, the hero uses an asymmetric two-column layout with the memo artifact occupying the narrower column.
- Below the desktop breakpoint, the memo artifact moves beneath the hero copy.
- Research rows retain their numbered hierarchy and stack their label, description, and arrow without overlap.
- Evidence states become a vertical list on narrow screens.
- Typography uses fixed responsive steps, not viewport-width scaling.
- Interactive targets remain at least 44px high and preserve visible keyboard focus.

## Interaction Details

- CTA and workflow-row hover states use subtle color and rule changes; no exaggerated elevation or motion.
- Movement is limited to short opacity, color, and small directional transitions and respects `prefers-reduced-motion`.
- The full workflow row is clickable and receives a clear focus-visible state.
- Existing destination behavior remains unchanged: all entry points open `/atlas-iq/chat`.

## Content Constraints

- Use concrete PE language and avoid generic AI claims such as `unlock`, `transform`, or `copilot`.
- Do not claim real-time data access, proprietary coverage, or report counts not already substantiated by the application.
- Keep the example research note short enough to scan and clearly presented as a sample artifact.
- Prefer investment actions and work products over internal product terminology.

## Implementation Boundaries

- Modify `app/atlas-iq/page.tsx` and the associated AtlasIQ landing-page styles in `app/globals.css`.
- Preserve metadata, navigation, footer, and the existing `/atlas-iq/chat` route.
- Reuse the existing typography, color variables, layout primitives, and icon library.
- Remove obsolete landing-page data arrays, icon imports, and CSS selectors after replacement.
- Do not change chat behavior, API behavior, authentication, or other marketing pages.
- Do not add dependencies.

## Verification

The implementation is complete when:

- The old three-card grid and three-row differentiator list are gone.
- The approved Research Desk hierarchy is present at desktop and mobile widths.
- Every CTA and workflow row reaches `/atlas-iq/chat`.
- Keyboard focus, hover behavior, contrast, and reduced-motion behavior are usable.
- There is no horizontal overflow or text collision at common desktop and mobile widths.
- Lint, type checking, and production build checks pass.
- Browser screenshots confirm the rendered page matches the approved direction and contains no console errors.

