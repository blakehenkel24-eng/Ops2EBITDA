# LinkedIn Content Workflow — Design Spec

## Overview

An interactive Claude Code skill (`/linkedin`) that orchestrates end-to-end LinkedIn content creation for Ops2EBITDA: ideation, copywriting, branded media generation, and review/export. Designed for 2-3 posts per week, producing consulting-grade PE operations content with on-brand visuals.

## System Architecture

```
/linkedin
  Phase 1: IDEATE — generate post ideas (3 source modes)
  Phase 2: WRITE  — draft post copy (structured format, brand voice)
  Phase 3: DESIGN — create media asset (3 tool routes)
  Phase 4: REVIEW — present for approval, export assets
```

### Files Read at Startup

| File | Purpose |
|------|---------|
| `brand-reference.md` | Extracted brand guidelines (colors, typography, voice) |
| `PRODUCT.md` | Product context for CTAs and positioning |
| `content/` directory | Knowledge base articles for mining ideas |
| `linkedin-history.md` | Tracks posted content to avoid repetition and balance mix |

### Output Directory

```
linkedin-assets/
  YYYY-MM-DD-slug/
    post-copy.md
    media.png
    media.excalidraw   (if Excalidraw route)
    media.html          (if HTML route)
    canva-brief.md      (if Canva route)
```

---

## Phase 1: Ideation

Three source modes, selected interactively at the start of each session:

### Mode A — Knowledge Base Mining

Claude reads wiki articles and the content directory, identifies concepts with high LinkedIn potential. Prioritizes:
- Concepts that compress into a single visual argument (framework, KPI breakdown, before/after)
- Topics that naturally tie back to a paid product (Excel model, AI kit, skill package)
- Content gaps: topics in the knowledge base not yet posted (checked against `linkedin-history.md`)

### Mode B — Topic-Driven

User provides a topic or product name. Claude generates 5-8 angles:
- Hot take / contrarian insight
- Data-driven breakdown (Kyle Poyar style)
- Framework / process visual (Excalidraw style)
- Quick insight / branded text card
- Meme / commentary angle

### Mode C — Trend Mashup

Claude researches trending topics in PE, AI, and ops LinkedIn via web search, then maps each trend back to the knowledge base for a unique angle.

### Idea Output Format

Each idea includes:
- One-line hook (the first line of the post)
- Recommended format: text-only, image+caption, or carousel
- Recommended media type: data viz, framework diagram, branded card, or meme
- Product soft-promotion opportunity (if any)
- Estimated effort: quick (text-only), medium (branded card), full (data viz or diagram)

User picks one idea (or riffs on a mashup) and advances to Phase 2.

---

## Phase 2: Copywriting

### Post Structure

```
HOOK      — First 1-2 lines (visible before "see more")
            Pattern-interrupt, bold claim, or surprising data point

GAP       — 2-3 lines creating tension or curiosity
            "Most PE firms do X. The best ones do Y."

BODY      — Core content (3-8 lines, adapted to format)
            Shorter for image posts, longer for text-only

CTA       — Soft close (1-2 lines)
            Engagement driver or tasteful product reference

HASHTAGS  — 3-5 tags, mix of broad (#PrivateEquity) and niche (#ValueCreation)
```

### Brand Voice Rules

- Consulting-grade substance, not LinkedIn-bro platitudes
- Direct and opinionated — takes a position, doesn't hedge
- Concrete over abstract — real KPIs, real numbers, real scenarios
- No emoji spam. One or zero per post.
- Product mentions woven in naturally ("I built a model for this"), never hard-sell

### Format-Aware Copy

- **Text-only**: Hook carries extra weight, body is the full payload
- **Image + caption**: Copy sets up the visual, body is shorter — the image does the heavy lifting
- **Carousel**: Copy is the teaser, each slide outlined as part of the draft

User approves, revises, or requests a different angle before advancing.

---

## Phase 3: Media Design

The skill routes to the right tool based on the ideation phase recommendation.

### Route 1: HTML-to-PNG (Primary)

For data tables, KPI cards, ranked lists, branded text cards, and data visualizations.

**Brand styling:**
- Dark mode: Ink `#161413` background, Bone `#F4EFE6` text, Ochre `#B8862F` accents
- Light mode: Bone/Paper background, Ink text, Ochre accents
- Typography: Geist (brand font), same hierarchy as web — bold titles, Stone `#928B7E` subtitles
- Sienna `#7A2E1F` for negative/warning values
- Subtle Ops2EBITDA branding footer strip

**Starting template library:**

| Template | Use Case | Reference Style |
|----------|----------|-----------------|
| `data-table-dark` | Ranked lists, comparison tables | Prince Capital |
| `data-table-light` | KPI breakdowns, metric snapshots | Kyle Poyar |
| `grid-card` | Numbered frameworks, checklists, playbooks | Eric Melillo |
| `text-card-dark` | Bold stat or quote on dark background | Branded insight |
| `text-card-light` | Insight or pull-quote, editorial feel | Thought leadership |
| `bar-chart` | Simple horizontal/vertical bar comparisons | Kyle Poyar |
| `before-after` | Two-panel comparison | Transformation stories |

**Render pipeline:** A dedicated `render_html_to_png.py` script (modeled on the Excalidraw skill's `render_excalidraw.py`) that takes an HTML file path, launches headless Chromium via Playwright, and screenshots at LinkedIn-optimal sizes (1200x1200 square or 1200x628 landscape). Lives alongside the templates in the skill's `references/` directory.

### Route 2: Excalidraw

For framework diagrams, value creation chains, decision trees, process flows.

1. Generates `.excalidraw` JSON using a custom Ops2EBITDA color palette mapped to the Excalidraw skill's `color-palette.md` format
2. Renders to PNG via the Excalidraw skill's Playwright renderer
3. Saves the `.excalidraw` source file for manual editing in excalidraw.com

**Ops2EBITDA Excalidraw palette mapping:**

| Semantic Purpose | Fill | Stroke |
|------------------|------|--------|
| Primary/Neutral | `#F4EFE6` (Bone) | `#161413` (Ink) |
| Accent/Highlight | `#B8862F` (Ochre) | `#161413` (Ink) |
| Warning/Negative | `#7A2E1F` (Sienna) | `#161413` (Ink) |
| Secondary | `#928B7E` (Stone) | `#161413` (Ink) |
| Background | `#FBF8F2` (Paper) | `#928B7E` (Stone) |
| Canvas background | `#FFFFFF` | — |

### Route 3: Canva Brief

For photo-heavy content, complex layered design, or carousel slides.

Output includes:
- Exact dimensions (1200x1200 or carousel slide size)
- Color hex codes from brand palette
- Text content per element, sized and positioned
- Layout description with reference style
- User takes the brief into Canva to build the final asset

---

## Phase 4: Review & Export

### Review Display

Uses the visual companion (browser preview) to show the finished product:
- Hook and full post copy
- Rendered PNG at actual LinkedIn dimensions
- Product soft-promotion (if any)
- Suggested posting time (PE/finance LinkedIn engagement: Tue-Thu, 7-9am)

### Available Actions

| Action | Effect |
|--------|--------|
| Approve | Finalize, log to history, copy text to clipboard |
| Revise copy | Return to Phase 2 with feedback |
| Revise media | Regenerate with adjustments |
| Switch media route | Change tool (e.g., data table to Excalidraw diagram) |
| Regenerate | Fresh angle on the same idea |

### On Approval

1. Saves all assets to `linkedin-assets/YYYY-MM-DD-slug/`
2. Logs to `linkedin-history.md`: date, topic, format, media type, product referenced, knowledge base source
3. Copies post text to clipboard
4. Reports PNG path for drag-and-drop to LinkedIn

### History Log Enables

- No duplicate topics within a configurable window
- Content mix tracking ("4 data viz posts in a row — consider text-only or meme next")
- Product coverage tracking ("haven't referenced AI Project Kits in 3 weeks")

---

## Components to Build

| # | Component | Description |
|---|-----------|-------------|
| 1 | `/linkedin` orchestrator skill | Main flow controller — SKILL.md with phase routing logic |
| 2 | HTML-to-PNG media engine | Branded HTML templates + Playwright renderer script |
| 3 | Excalidraw brand palette | Ops2EBITDA colors mapped into Excalidraw skill format |
| 4 | Brand reference file | Brand guidelines extracted from PDF into fast-loading markdown |
| 5 | Template library | 7 starting HTML templates (see Route 1 table) |

## Brand Reference

### Colors

| Token | Hex | Role |
|-------|-----|------|
| Bone | `#F4EFE6` | Primary surface — title blocks, total rows |
| Ink | `#161413` | Foreground / type — headers, section bars |
| Ochre | `#B8862F` | Primary accent — highlights, KPI callouts |
| Sienna | `#7A2E1F` | Critical / variance — negatives, warnings |
| Stone | `#928B7E` | Secondary — subtitles, labels, chrome |
| Paper | `#FBF8F2` | Elevation — alternating tint, light backgrounds |

Color allocation target: Bone 62%, Ink 24%, Stone 7%, Ochre 5%, Sienna 2%.

### Typography

- **Font**: Geist (web/social), Calibri (Excel fallback)
- **Titles**: Bold, large, Ink color
- **Subtitles**: Stone color, smaller weight
- **Data/body**: Ink, crisp sans-serif
- **Accented values**: Ochre for positive highlights, Sienna for negative

### Voice

- Cool-toned, editorial, consulting-grade — McKinsey meets Bloomberg
- Direct and opinionated, concrete over abstract
- No emoji spam, no LinkedIn-bro platitudes
- Product references woven naturally, never hard-sell

---

## Dependencies

- **Playwright** — rendering HTML-to-PNG and Excalidraw-to-PNG (already installed via Excalidraw skill)
- **Excalidraw skill** — installed at `~/.claude/skills/excalidraw-diagram/`
- **Web search** — for Mode C trend research (via built-in tools or firecrawl-search)
- **Visual companion** — for Phase 4 review display (brainstorming skill server)
- **No new npm/pip packages** required in the Ops2EBITDA project itself
