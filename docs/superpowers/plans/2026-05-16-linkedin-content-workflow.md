# LinkedIn Content Workflow — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an interactive `/linkedin` Claude Code skill that orchestrates end-to-end LinkedIn content creation for Ops2EBITDA — ideation, copywriting, branded media generation (HTML-to-PNG, Excalidraw, Canva brief), and review/export.

**Architecture:** An orchestrator skill (`SKILL.md`) manages a 4-phase pipeline (Ideate → Write → Design → Review). Media generation routes to three tools: an HTML-to-PNG renderer with 7 branded templates for infographics/data viz, the existing Excalidraw skill with a custom brand palette for framework diagrams, and a Canva brief generator for complex/photo-heavy content. All assets output to `linkedin-assets/` in the project directory.

**Tech Stack:** Claude Code skills (markdown), HTML/CSS templates, Python + Playwright (rendering), Excalidraw JSON, Ops2EBITDA brand system (Bone/Ink/Ochre/Sienna/Stone/Paper palette, Geist typography).

**Spec:** `docs/superpowers/specs/2026-05-16-linkedin-content-workflow-design.md`

---

## File Map

```
~/.claude/skills/linkedin/
├── SKILL.md                              # Orchestrator skill (Phase 1-4 flow)
└── references/
    ├── brand-reference.md                # Ops2EBITDA brand: colors, typography, voice
    ├── post-structure.md                 # Copy structure, voice rules, format-aware guidelines
    ├── render_html_to_png.py             # HTML-to-PNG renderer (Playwright)
    ├── pyproject.toml                    # Python dependencies (playwright)
    └── templates/
        ├── base.css                      # Shared brand CSS variables + typography
        ├── data-table-dark.html          # Ranked lists, comparisons (Prince Capital style)
        ├── data-table-light.html         # KPI breakdowns, metrics (Kyle Poyar style)
        ├── grid-card.html                # Numbered frameworks, checklists (Eric Melillo style)
        ├── text-card-dark.html           # Bold stat/quote on dark background
        ├── text-card-light.html          # Insight/pull-quote, editorial feel
        ├── bar-chart.html                # Horizontal/vertical bar comparisons
        └── before-after.html             # Two-panel transformation comparison

~/.claude/skills/excalidraw-diagram/references/
└── color-palette-ops2ebitda.md           # Ops2EBITDA colors in Excalidraw format

<Ops2EBITDA project root>/
├── linkedin-assets/                      # Output directory (created on first run)
│   └── YYYY-MM-DD-slug/
│       ├── post-copy.md
│       ├── media.png
│       └── media.html|.excalidraw|canva-brief.md
└── linkedin-history.md                   # Post tracking log
```

---

## Task 1: Brand Reference File

Create the brand reference markdown that the skill reads at startup. Extracts the essential brand rules from the PDF into a fast-loading format.

**Files:**
- Create: `~/.claude/skills/linkedin/references/brand-reference.md`

- [ ] **Step 1: Create the skill directory structure**

```bash
mkdir -p ~/.claude/skills/linkedin/references/templates
```

- [ ] **Step 2: Write the brand reference file**

```markdown
# Ops2EBITDA Brand Reference

## Color Palette

| Token  | Hex       | Role                                         |
|--------|-----------|----------------------------------------------|
| Bone   | `#F4EFE6` | Primary surface — title blocks, backgrounds  |
| Ink    | `#161413` | Foreground / type — headers, body text        |
| Ochre  | `#B8862F` | Primary accent — highlights, KPI callouts     |
| Sienna | `#7A2E1F` | Critical / variance — negatives, warnings     |
| Stone  | `#928B7E` | Secondary — subtitles, labels, chrome         |
| Paper  | `#FBF8F2` | Elevation — alternating tint, light bg        |

Allocation target: Bone 62%, Ink 24%, Stone 7%, Ochre 5%, Sienna 2%.

## Typography

- **Primary font**: Geist (web/social), Calibri (fallback)
- **Titles**: Bold, Ink `#161413`
- **Subtitles**: Stone `#928B7E`, lighter weight
- **Body/data**: Ink, crisp sans-serif
- **Positive highlights**: Ochre `#B8862F`
- **Negative values**: Sienna `#7A2E1F`

## Visual Direction

Cool-toned, digital-first editorial. McKinsey meets Bloomberg. Generous whitespace, structured "binder" layout, crisp data presentation, decisive typography.

## LinkedIn Branding

- Footer strip on all media: "Ops2EBITDA" in Stone, subtle, bottom-right or bottom-center
- Dark-mode infographics: Ink background, Bone text, Ochre accents
- Light-mode infographics: Bone/Paper background, Ink text, Ochre accents
- Image sizes: 1200×1200 (square, default) or 1200×628 (landscape)

## Voice (LinkedIn)

- Consulting-grade substance, not LinkedIn-bro platitudes
- Direct and opinionated — takes a position, doesn't hedge
- Concrete over abstract — real KPIs, real numbers, real scenarios
- No emoji spam. One or zero per post.
- Product mentions woven naturally ("I built a model for this"), never hard-sell

## Product Lines (for CTAs)

| Line | Price | Description |
|------|-------|-------------|
| Excel Models | $99 each | Decision-ready analytical workbooks |
| AI Project Kits | $49 each | Ready-to-build AI workspace packages |
| Skill Packages | $39 each | Reusable markdown AI skill bundles |
| Core Model Bundle | $399 | All Excel Models |
| AI Project Library | $299 | All AI Project Kits |
| Skill Package Library | $179 | All Skill Packages |
| Full Toolkit | $699 | Everything |
```

Write this to `~/.claude/skills/linkedin/references/brand-reference.md`.

- [ ] **Step 3: Verify the file exists and is readable**

```bash
cat ~/.claude/skills/linkedin/references/brand-reference.md | head -5
```

Expected: the first 5 lines of the brand reference file.

- [ ] **Step 4: Commit**

```bash
cd ~/.claude/skills/linkedin
git init 2>/dev/null || true
git add references/brand-reference.md
git commit -m "feat(linkedin): add brand reference file

Extracted Ops2EBITDA brand guidelines into fast-loading markdown.
Colors, typography, voice rules, and product lines for CTA generation."
```

---

## Task 2: Post Structure Reference

Create the copywriting reference that Phase 2 uses for post structure and format-aware guidelines.

**Files:**
- Create: `~/.claude/skills/linkedin/references/post-structure.md`

- [ ] **Step 1: Write the post structure reference**

```markdown
# LinkedIn Post Structure

## Post Format

HOOK      — First 1-2 lines (visible before "see more")
            Pattern-interrupt, bold claim, or surprising data point

GAP       — 2-3 lines creating tension or curiosity
            "Most PE firms do X. The best ones do Y."

BODY      — Core content (3-8 lines, adapted to format)
            Shorter for image posts, longer for text-only

CTA       — Soft close (1-2 lines)
            Engagement driver or tasteful product reference

HASHTAGS  — 3-5 tags, mix of broad (#PrivateEquity) and niche (#ValueCreation)

## Format-Specific Rules

### Text-Only
- Hook carries extra weight — it IS the thumbnail
- Body is the full payload (8-12 lines acceptable)
- Line breaks every 1-2 sentences for scanability
- CTA can be a question ("What's the first lever you'd pull?")

### Image + Caption
- Copy sets up the visual — shorter body (3-5 lines)
- The image does the heavy lifting
- Caption should make the reader want to expand the image
- CTA can reference the image ("The third row is the one most teams miss")

### Carousel
- Copy is the teaser — 2-3 lines max
- Each slide title + body outlined in the draft
- First slide = hook (must work as thumbnail)
- Last slide = CTA + branding

## Hashtag Bank

### Broad (pick 1-2)
#PrivateEquity #PE #ValueCreation #OperatingPartner #M&A #EBITDA

### Niche (pick 2-3)
#PortfolioOps #PEOperations #ValueCreationPlan #OperationalDueDiligence
#PEPortfolio #OperatingModel #KPIDashboard #WorkingCapital #100DayPlan

## Idea Angles (for Mode B)

When generating angles on a topic, cover these categories:
1. Hot take / contrarian insight
2. Data-driven breakdown (chart or KPI visual)
3. Framework / process visual (diagram)
4. Quick insight / branded text card
5. Meme / commentary angle
```

Write this to `~/.claude/skills/linkedin/references/post-structure.md`.

- [ ] **Step 2: Commit**

```bash
cd ~/.claude/skills/linkedin
git add references/post-structure.md
git commit -m "feat(linkedin): add post structure and copywriting reference

Hook/Gap/Body/CTA structure, format-specific rules, hashtag bank,
and idea angle categories for content ideation."
```

---

## Task 3: HTML-to-PNG Renderer

Build the Playwright-based renderer that converts branded HTML templates to LinkedIn-ready PNGs. Modeled on the Excalidraw skill's `render_excalidraw.py`.

**Files:**
- Create: `~/.claude/skills/linkedin/references/render_html_to_png.py`
- Create: `~/.claude/skills/linkedin/references/pyproject.toml`

- [ ] **Step 1: Write pyproject.toml**

```toml
[project]
name = "linkedin-render"
version = "0.1.0"
requires-python = ">=3.11"
dependencies = [
    "playwright>=1.40.0",
]
```

Write to `~/.claude/skills/linkedin/references/pyproject.toml`.

- [ ] **Step 2: Write the renderer script**

```python
"""Render branded HTML to LinkedIn-ready PNG using Playwright.

Usage:
    cd ~/.claude/skills/linkedin/references
    uv run python render_html_to_png.py <path-to-file.html> [--output path.png] [--size square|landscape] [--scale 2]

Sizes:
    square    — 1200x1200 (default, best for LinkedIn feed)
    landscape — 1200x628 (link preview / article style)

First-time setup:
    cd ~/.claude/skills/linkedin/references
    uv sync
    uv run playwright install chromium
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

SIZES = {
    "square": (1200, 1200),
    "landscape": (1200, 628),
}


def render(
    html_path: Path,
    output_path: Path | None = None,
    size: str = "square",
    scale: int = 2,
) -> Path:
    """Render an HTML file to PNG. Returns the output path."""
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        print("ERROR: playwright not installed.", file=sys.stderr)
        print(
            "Run: cd ~/.claude/skills/linkedin/references && uv sync && uv run playwright install chromium",
            file=sys.stderr,
        )
        sys.exit(1)

    if not html_path.exists():
        print(f"ERROR: File not found: {html_path}", file=sys.stderr)
        sys.exit(1)

    if size not in SIZES:
        print(f"ERROR: Unknown size '{size}'. Use: {', '.join(SIZES)}", file=sys.stderr)
        sys.exit(1)

    width, height = SIZES[size]

    if output_path is None:
        output_path = html_path.with_suffix(".png")

    with sync_playwright() as p:
        try:
            browser = p.chromium.launch(headless=True)
        except Exception as e:
            if "Executable doesn't exist" in str(e) or "browserType.launch" in str(e):
                print("ERROR: Chromium not installed for Playwright.", file=sys.stderr)
                print(
                    "Run: cd ~/.claude/skills/linkedin/references && uv run playwright install chromium",
                    file=sys.stderr,
                )
                sys.exit(1)
            raise

        page = browser.new_page(
            viewport={"width": width, "height": height},
            device_scale_factor=scale,
        )

        page.goto(html_path.resolve().as_uri())
        page.wait_for_load_state("networkidle")
        page.wait_for_timeout(500)

        page.screenshot(path=str(output_path), full_page=False)
        browser.close()

    return output_path


def main() -> None:
    parser = argparse.ArgumentParser(description="Render branded HTML to LinkedIn PNG")
    parser.add_argument("input", type=Path, help="Path to HTML file")
    parser.add_argument(
        "--output", "-o", type=Path, default=None, help="Output PNG path"
    )
    parser.add_argument(
        "--size",
        "-s",
        choices=list(SIZES),
        default="square",
        help="Output size (default: square)",
    )
    parser.add_argument(
        "--scale", type=int, default=2, help="Device scale factor (default: 2)"
    )
    args = parser.parse_args()

    png_path = render(args.input, args.output, args.size, args.scale)
    print(str(png_path))


if __name__ == "__main__":
    main()
```

Write to `~/.claude/skills/linkedin/references/render_html_to_png.py`.

- [ ] **Step 3: Install dependencies**

```bash
cd ~/.claude/skills/linkedin/references
uv sync
uv run playwright install chromium
```

Note: If Playwright/Chromium is already installed from the Excalidraw skill setup, the `playwright install chromium` step will be a fast no-op.

- [ ] **Step 4: Write a minimal test HTML file**

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1200px; height: 1200px;
      background: #161413;
      display: flex; align-items: center; justify-content: center;
      font-family: system-ui, sans-serif;
    }
    h1 { color: #F4EFE6; font-size: 48px; }
    .accent { color: #B8862F; }
  </style>
</head>
<body>
  <div style="text-align:center;">
    <h1>Ops2EBITDA</h1>
    <p class="accent" style="font-size:20px;margin-top:12px;">Render Test</p>
  </div>
</body>
</html>
```

Write to `/tmp/linkedin-render-test.html`.

- [ ] **Step 5: Test the renderer**

```bash
cd ~/.claude/skills/linkedin/references
uv run python render_html_to_png.py /tmp/linkedin-render-test.html --output /tmp/linkedin-render-test.png
```

Expected: prints `/tmp/linkedin-render-test.png` and the file exists. View the PNG with the Read tool to confirm it renders correctly — dark background, Bone-colored title, Ochre accent text, 1200x1200.

- [ ] **Step 6: Test landscape size**

```bash
cd ~/.claude/skills/linkedin/references
uv run python render_html_to_png.py /tmp/linkedin-render-test.html --output /tmp/linkedin-render-test-landscape.png --size landscape
```

Expected: a 1200x628 PNG. View to confirm.

- [ ] **Step 7: Clean up test files and commit**

```bash
rm /tmp/linkedin-render-test.html /tmp/linkedin-render-test.png /tmp/linkedin-render-test-landscape.png
cd ~/.claude/skills/linkedin
git add references/render_html_to_png.py references/pyproject.toml
git commit -m "feat(linkedin): add HTML-to-PNG renderer

Playwright-based renderer for branded LinkedIn infographics.
Supports square (1200x1200) and landscape (1200x628) sizes.
Modeled on excalidraw-diagram skill's render pipeline."
```

---

## Task 4: Base CSS (Shared Brand Styles)

Create the shared CSS file that all HTML templates import. Contains brand variables, typography, and the footer strip.

**Files:**
- Create: `~/.claude/skills/linkedin/references/templates/base.css`

- [ ] **Step 1: Write the base CSS**

```css
/* Ops2EBITDA LinkedIn Template Base Styles */

@import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700;800&display=swap');

:root {
  /* Brand palette */
  --bone: #F4EFE6;
  --ink: #161413;
  --ochre: #B8862F;
  --sienna: #7A2E1F;
  --stone: #928B7E;
  --paper: #FBF8F2;

  /* Semantic aliases */
  --bg-dark: var(--ink);
  --bg-light: var(--bone);
  --text-on-dark: var(--bone);
  --text-on-light: var(--ink);
  --accent: var(--ochre);
  --negative: var(--sienna);
  --secondary: var(--stone);
  --surface: var(--paper);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Geist', system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Dark mode base */
.dark {
  background: var(--bg-dark);
  color: var(--text-on-dark);
  width: 1200px;
  height: 1200px;
  padding: 60px;
  display: flex;
  flex-direction: column;
}

/* Light mode base */
.light {
  background: var(--bg-light);
  color: var(--text-on-light);
  width: 1200px;
  height: 1200px;
  padding: 60px;
  display: flex;
  flex-direction: column;
}

/* Typography */
.title {
  font-size: 36px;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.5px;
}

.subtitle {
  font-size: 16px;
  color: var(--secondary);
  margin-top: 8px;
  font-weight: 400;
}

.section-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--secondary);
}

.accent { color: var(--accent); }
.negative { color: var(--negative); }
.stone { color: var(--secondary); }

/* Footer branding strip */
.footer {
  margin-top: auto;
  padding-top: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.footer-brand {
  font-size: 13px;
  font-weight: 600;
  color: var(--secondary);
  letter-spacing: 1px;
}

.footer-accent-line {
  flex: 1;
  height: 1px;
  background: var(--secondary);
  opacity: 0.3;
  margin: 0 16px;
}
```

Write to `~/.claude/skills/linkedin/references/templates/base.css`.

- [ ] **Step 2: Commit**

```bash
cd ~/.claude/skills/linkedin
git add references/templates/base.css
git commit -m "feat(linkedin): add shared base CSS with brand variables

Geist font, Ops2EBITDA color palette as CSS variables, dark/light
base classes, typography hierarchy, and footer branding strip."
```

---

## Task 5: Template — data-table-dark

The Prince Capital-style dark-theme ranked table. Used for comparison tables, ranked lists, leaderboards.

**Files:**
- Create: `~/.claude/skills/linkedin/references/templates/data-table-dark.html`

- [ ] **Step 1: Write the template**

The template is a complete, self-contained HTML file. Claude fills in the data by generating a new HTML file that uses the same structure but with real content. The template serves as the pattern to follow.

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" href="base.css">
  <style>
    .header-bar {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 8px;
    }
    .header-bar .accent-line {
      width: 40px; height: 3px;
      background: var(--ochre);
    }
    .table-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      margin-top: 24px;
    }
    .table-header {
      display: grid;
      padding: 12px 16px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: var(--ochre);
      border-bottom: 1px solid rgba(244, 239, 230, 0.1);
    }
    .table-row {
      display: grid;
      padding: 16px;
      align-items: center;
      border-bottom: 1px solid rgba(244, 239, 230, 0.06);
      font-size: 15px;
    }
    .table-row:nth-child(even) {
      background: rgba(244, 239, 230, 0.03);
    }
    .row-number {
      font-size: 14px;
      font-weight: 700;
      color: var(--ochre);
    }
    .row-name {
      font-weight: 600;
      color: var(--bone);
    }
    .row-value {
      font-weight: 700;
      color: var(--bone);
    }
    .row-secondary {
      font-size: 13px;
      color: var(--stone);
    }
    .bar {
      height: 6px;
      border-radius: 3px;
      background: linear-gradient(90deg, var(--ochre), var(--stone));
    }
    .source-note {
      font-size: 10px;
      color: var(--stone);
      opacity: 0.7;
      margin-top: 12px;
    }
  </style>
</head>
<body>
  <div class="dark">
    <div class="section-label">Private Equity Operations</div>
    <div class="header-bar">
      <div class="accent-line"></div>
    </div>
    <div class="title">Top Value Creation Levers by EBITDA Impact</div>
    <p class="subtitle">Ranked by median first-year contribution to portfolio company EBITDA</p>

    <div class="table-container">
      <div class="table-header" style="grid-template-columns: 40px 1fr 150px 100px;">
        <span>#</span>
        <span>Lever</span>
        <span>Median Impact</span>
        <span>Adoption</span>
      </div>

      <!-- EXAMPLE ROWS — Claude replaces these with real content -->
      <div class="table-row" style="grid-template-columns: 40px 1fr 150px 100px;">
        <span class="row-number">01</span>
        <span class="row-name">Pricing Optimization</span>
        <span class="row-value">+3.2pp margin</span>
        <span class="row-secondary">78%</span>
      </div>
      <div class="table-row" style="grid-template-columns: 40px 1fr 150px 100px;">
        <span class="row-number">02</span>
        <span class="row-name">Procurement Consolidation</span>
        <span class="row-value">+2.8pp margin</span>
        <span class="row-secondary">71%</span>
      </div>
      <div class="table-row" style="grid-template-columns: 40px 1fr 150px 100px;">
        <span class="row-number">03</span>
        <span class="row-name">Working Capital Release</span>
        <span class="row-value">+$2.1M FCF</span>
        <span class="row-secondary">65%</span>
      </div>
      <div class="table-row" style="grid-template-columns: 40px 1fr 150px 100px;">
        <span class="row-number">04</span>
        <span class="row-name">Sales Productivity</span>
        <span class="row-value">+18% pipeline</span>
        <span class="row-secondary">58%</span>
      </div>
      <div class="table-row" style="grid-template-columns: 40px 1fr 150px 100px;">
        <span class="row-number">05</span>
        <span class="row-name">Customer Retention / NRR</span>
        <span class="row-value">+4pp NRR</span>
        <span class="row-secondary">52%</span>
      </div>
    </div>

    <p class="source-note">Source: Ops2EBITDA analysis of PE-backed portfolio company value creation plans</p>

    <div class="footer">
      <span class="footer-brand">OPS2EBITDA</span>
      <div class="footer-accent-line"></div>
    </div>
  </div>
</body>
</html>
```

Write to `~/.claude/skills/linkedin/references/templates/data-table-dark.html`.

- [ ] **Step 2: Render the template and visually verify**

```bash
cd ~/.claude/skills/linkedin/references
uv run python render_html_to_png.py templates/data-table-dark.html --output /tmp/test-data-table-dark.png
```

View the PNG with the Read tool. Verify: dark Ink background, Ochre accents on row numbers and header, Bone text, Stone secondary values, footer branding strip at bottom.

- [ ] **Step 3: Fix any visual issues**

If text is clipped, spacing is off, or colors don't look right, edit the HTML/CSS and re-render. Repeat until the template looks polished and on-brand.

- [ ] **Step 4: Commit**

```bash
cd ~/.claude/skills/linkedin
git add references/templates/data-table-dark.html
git commit -m "feat(linkedin): add data-table-dark template

Prince Capital-style dark ranked table for comparisons, leaderboards,
and ranked lists. Ink background, Ochre accents, Bone text."
```

---

## Task 6: Template — data-table-light

Kyle Poyar-style light-theme KPI breakdown. Used for metric snapshots, performance summaries.

**Files:**
- Create: `~/.claude/skills/linkedin/references/templates/data-table-light.html`

- [ ] **Step 1: Write the template**

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" href="base.css">
  <style>
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-top: 32px;
    }
    .kpi-card {
      background: var(--paper);
      border-radius: 8px;
      padding: 20px;
      border: 1px solid rgba(22, 20, 19, 0.06);
    }
    .kpi-label {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: var(--stone);
    }
    .kpi-value {
      font-size: 36px;
      font-weight: 800;
      margin-top: 8px;
      color: var(--ink);
    }
    .kpi-delta {
      font-size: 13px;
      margin-top: 4px;
      font-weight: 600;
    }
    .kpi-delta.positive { color: var(--ochre); }
    .kpi-delta.negative { color: var(--sienna); }
    .detail-table {
      margin-top: 24px;
      width: 100%;
      border-collapse: collapse;
    }
    .detail-table th {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--stone);
      text-align: left;
      padding: 10px 12px;
      border-bottom: 2px solid var(--ink);
    }
    .detail-table td {
      font-size: 14px;
      padding: 10px 12px;
      border-bottom: 1px solid rgba(22, 20, 19, 0.08);
      color: var(--ink);
    }
    .detail-table tr:nth-child(even) td {
      background: var(--paper);
    }
    .detail-table td.value {
      font-weight: 700;
      text-align: right;
    }
  </style>
</head>
<body>
  <div class="light">
    <div class="section-label">Working Capital Analysis</div>
    <div class="title" style="margin-top:8px;">Cash Conversion Deep Dive</div>
    <p class="subtitle">Q1 2026 portfolio company performance vs. targets</p>

    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-label">DSO</div>
        <div class="kpi-value">42d</div>
        <div class="kpi-delta negative">↑ 8 days vs prior year</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">DPO</div>
        <div class="kpi-value">31d</div>
        <div class="kpi-delta negative">↓ 4 days vs target</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Cash Conversion Cycle</div>
        <div class="kpi-value">58d</div>
        <div class="kpi-delta positive">Opportunity: $2.1M</div>
      </div>
    </div>

    <table class="detail-table">
      <thead>
        <tr>
          <th>Component</th>
          <th>Current</th>
          <th>Target</th>
          <th style="text-align:right;">Gap</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Days Sales Outstanding</td>
          <td>42 days</td>
          <td>34 days</td>
          <td class="value negative">+8d</td>
        </tr>
        <tr>
          <td>Days Payable Outstanding</td>
          <td>31 days</td>
          <td>35 days</td>
          <td class="value negative">−4d</td>
        </tr>
        <tr>
          <td>Days Inventory Outstanding</td>
          <td>47 days</td>
          <td>42 days</td>
          <td class="value negative">+5d</td>
        </tr>
      </tbody>
    </table>

    <div class="footer">
      <span class="footer-brand">OPS2EBITDA</span>
      <div class="footer-accent-line"></div>
    </div>
  </div>
</body>
</html>
```

Write to `~/.claude/skills/linkedin/references/templates/data-table-light.html`.

- [ ] **Step 2: Render and visually verify**

```bash
cd ~/.claude/skills/linkedin/references
uv run python render_html_to_png.py templates/data-table-light.html --output /tmp/test-data-table-light.png
```

View with Read tool. Verify: Bone background, KPI cards on Paper, Ochre positive deltas, Sienna negatives, clean editorial feel.

- [ ] **Step 3: Fix any visual issues, then commit**

```bash
cd ~/.claude/skills/linkedin
git add references/templates/data-table-light.html
git commit -m "feat(linkedin): add data-table-light template

Kyle Poyar-style light KPI breakdown with metric cards and detail
table. Bone/Paper background, Ochre highlights, Sienna negatives."
```

---

## Task 7: Template — grid-card

Eric Melillo-style numbered grid of items. Used for frameworks, checklists, numbered playbooks.

**Files:**
- Create: `~/.claude/skills/linkedin/references/templates/grid-card.html`

- [ ] **Step 1: Write the template**

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" href="base.css">
  <style>
    .grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 14px;
      margin-top: 28px;
      flex: 1;
    }
    .grid-item {
      background: var(--paper);
      border: 1px solid rgba(22, 20, 19, 0.08);
      border-radius: 8px;
      padding: 18px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .grid-item-number {
      width: 28px; height: 28px;
      border-radius: 6px;
      background: var(--ochre);
      color: var(--bone);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 700;
    }
    .grid-item-title {
      font-size: 14px;
      font-weight: 700;
      color: var(--ink);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .grid-item-desc {
      font-size: 12px;
      color: var(--stone);
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="light">
    <div class="section-label">Operating Playbook</div>
    <div class="title" style="margin-top:8px;">9 Levers That Drive PE Portfolio Value</div>
    <p class="subtitle">The operating partner's toolkit for the first 100 days</p>

    <div class="grid">
      <div class="grid-item">
        <div class="grid-item-number">01</div>
        <div class="grid-item-title">Pricing Architecture</div>
        <div class="grid-item-desc">Map margin leakage across every SKU and customer tier.</div>
      </div>
      <div class="grid-item">
        <div class="grid-item-number">02</div>
        <div class="grid-item-title">Procurement Spend Cube</div>
        <div class="grid-item-desc">Consolidate suppliers. Benchmark against category spend.</div>
      </div>
      <div class="grid-item">
        <div class="grid-item-number">03</div>
        <div class="grid-item-title">Working Capital</div>
        <div class="grid-item-desc">DSO, DPO, DIO — release cash trapped in the cycle.</div>
      </div>
      <div class="grid-item">
        <div class="grid-item-number">04</div>
        <div class="grid-item-title">Sales Productivity</div>
        <div class="grid-item-desc">Pipeline coverage, quota attainment, rep-level economics.</div>
      </div>
      <div class="grid-item">
        <div class="grid-item-number">05</div>
        <div class="grid-item-title">Customer Retention</div>
        <div class="grid-item-desc">NRR cohort analysis. Churn root cause. Expansion revenue.</div>
      </div>
      <div class="grid-item">
        <div class="grid-item-number">06</div>
        <div class="grid-item-title">Add-On Integration</div>
        <div class="grid-item-desc">Synergy capture tracking. Integration PMO cadence.</div>
      </div>
      <div class="grid-item">
        <div class="grid-item-number">07</div>
        <div class="grid-item-title">KPI Dashboard</div>
        <div class="grid-item-desc">Board-ready metrics. Leading vs. lagging indicators.</div>
      </div>
      <div class="grid-item">
        <div class="grid-item-number">08</div>
        <div class="grid-item-title">Management Cadence</div>
        <div class="grid-item-desc">Operating rhythm. Weekly, monthly, quarterly reviews.</div>
      </div>
      <div class="grid-item">
        <div class="grid-item-number">09</div>
        <div class="grid-item-title">AI Workflow Capture</div>
        <div class="grid-item-desc">Automate recurring analysis. Build institutional memory.</div>
      </div>
    </div>

    <div class="footer">
      <span class="footer-brand">OPS2EBITDA</span>
      <div class="footer-accent-line"></div>
    </div>
  </div>
</body>
</html>
```

Write to `~/.claude/skills/linkedin/references/templates/grid-card.html`.

- [ ] **Step 2: Render and visually verify**

```bash
cd ~/.claude/skills/linkedin/references
uv run python render_html_to_png.py templates/grid-card.html --output /tmp/test-grid-card.png
```

Verify: 3x3 grid, Ochre numbered badges, clean Paper cards on Bone background, uppercase titles, Stone descriptions.

- [ ] **Step 3: Fix any visual issues, then commit**

```bash
cd ~/.claude/skills/linkedin
git add references/templates/grid-card.html
git commit -m "feat(linkedin): add grid-card template

Eric Melillo-style numbered grid for frameworks, checklists, and
playbooks. 3x3 layout with Ochre badges on Bone/Paper background."
```

---

## Task 8: Template — text-card-dark

Bold stat or quote on a dark branded background. The fastest media format to produce.

**Files:**
- Create: `~/.claude/skills/linkedin/references/templates/text-card-dark.html`

- [ ] **Step 1: Write the template**

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" href="base.css">
  <style>
    .quote-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 40px;
    }
    .quote-text {
      font-size: 38px;
      font-weight: 700;
      line-height: 1.35;
      color: var(--bone);
      max-width: 900px;
    }
    .quote-highlight {
      color: var(--ochre);
    }
    .divider {
      width: 50px;
      height: 2px;
      background: var(--ochre);
      margin: 28px auto;
    }
    .quote-attribution {
      font-size: 14px;
      color: var(--stone);
      letter-spacing: 2px;
      text-transform: uppercase;
    }
  </style>
</head>
<body>
  <div class="dark">
    <div class="section-label" style="text-align:center;width:100;">Private Equity Operations</div>

    <div class="quote-container">
      <p class="quote-text">
        "Most PE firms leave <span class="quote-highlight">2–3 turns of EBITDA improvement</span>
        on the table in year one."
      </p>
      <div class="divider"></div>
      <p class="quote-attribution">Ops2EBITDA</p>
    </div>

    <div class="footer">
      <span class="footer-brand">OPS2EBITDA</span>
      <div class="footer-accent-line"></div>
    </div>
  </div>
</body>
</html>
```

Write to `~/.claude/skills/linkedin/references/templates/text-card-dark.html`.

- [ ] **Step 2: Render and visually verify**

```bash
cd ~/.claude/skills/linkedin/references
uv run python render_html_to_png.py templates/text-card-dark.html --output /tmp/test-text-card-dark.png
```

Verify: centered quote with Ochre highlight, Ink background, Ochre divider line, Stone attribution, footer strip.

- [ ] **Step 3: Fix visual issues, then commit**

```bash
cd ~/.claude/skills/linkedin
git add references/templates/text-card-dark.html
git commit -m "feat(linkedin): add text-card-dark template

Bold stat/quote on Ink background with Ochre highlights.
Centered layout for maximum scroll-stop impact."
```

---

## Task 9: Template — text-card-light

Editorial pull-quote or insight on a light background. Thought leadership feel.

**Files:**
- Create: `~/.claude/skills/linkedin/references/templates/text-card-light.html`

- [ ] **Step 1: Write the template**

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" href="base.css">
  <style>
    .insight-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 20px 40px;
    }
    .accent-bar {
      width: 4px;
      background: var(--ochre);
      border-radius: 2px;
    }
    .insight-block {
      display: flex;
      gap: 28px;
    }
    .insight-text {
      font-size: 32px;
      font-weight: 600;
      line-height: 1.4;
      color: var(--ink);
    }
    .insight-highlight {
      color: var(--ochre);
      font-weight: 800;
    }
    .insight-detail {
      font-size: 16px;
      color: var(--stone);
      margin-top: 20px;
      line-height: 1.6;
      max-width: 800px;
    }
    .tag-row {
      display: flex;
      gap: 8px;
      margin-top: 24px;
    }
    .tag {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--stone);
      background: var(--paper);
      padding: 6px 12px;
      border-radius: 4px;
      border: 1px solid rgba(22, 20, 19, 0.08);
    }
  </style>
</head>
<body>
  <div class="light">
    <div class="section-label">Operating Insight</div>

    <div class="insight-container">
      <div class="insight-block">
        <div class="accent-bar"></div>
        <div>
          <p class="insight-text">
            The best 100-day plans don't start with
            <span class="insight-highlight">what to fix</span> — they start with
            <span class="insight-highlight">what to measure</span>.
          </p>
          <p class="insight-detail">
            Without a KPI baseline in the first two weeks, every "improvement"
            is anecdotal. The operating partner's first job isn't action — it's
            instrumentation.
          </p>
          <div class="tag-row">
            <span class="tag">Value Creation</span>
            <span class="tag">100-Day Plan</span>
            <span class="tag">KPIs</span>
          </div>
        </div>
      </div>
    </div>

    <div class="footer">
      <span class="footer-brand">OPS2EBITDA</span>
      <div class="footer-accent-line"></div>
    </div>
  </div>
</body>
</html>
```

Write to `~/.claude/skills/linkedin/references/templates/text-card-light.html`.

- [ ] **Step 2: Render and visually verify**

```bash
cd ~/.claude/skills/linkedin/references
uv run python render_html_to_png.py templates/text-card-light.html --output /tmp/test-text-card-light.png
```

Verify: Bone background, Ochre accent bar on left, Ink text with Ochre highlights, Stone detail text, tag pills.

- [ ] **Step 3: Fix visual issues, then commit**

```bash
cd ~/.claude/skills/linkedin
git add references/templates/text-card-light.html
git commit -m "feat(linkedin): add text-card-light template

Editorial pull-quote with Ochre accent bar on Bone background.
Thought leadership feel with tag pills."
```

---

## Task 10: Template — bar-chart

Simple horizontal bar chart for comparisons. Kyle Poyar-style clean data viz.

**Files:**
- Create: `~/.claude/skills/linkedin/references/templates/bar-chart.html`

- [ ] **Step 1: Write the template**

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" href="base.css">
  <style>
    .chart-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-top: 28px;
      gap: 18px;
    }
    .bar-row {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .bar-label {
      width: 200px;
      font-size: 14px;
      font-weight: 600;
      color: var(--ink);
      text-align: right;
      flex-shrink: 0;
    }
    .bar-track {
      flex: 1;
      height: 32px;
      background: var(--paper);
      border-radius: 4px;
      overflow: hidden;
      position: relative;
    }
    .bar-fill {
      height: 100%;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 12px;
      font-size: 13px;
      font-weight: 700;
      color: var(--bone);
    }
    .bar-fill.primary {
      background: var(--ink);
    }
    .bar-fill.accent {
      background: var(--ochre);
    }
    .bar-fill.negative {
      background: var(--sienna);
    }
    .chart-note {
      font-size: 12px;
      color: var(--stone);
      margin-top: 8px;
    }
    .legend {
      display: flex;
      gap: 20px;
      margin-top: 16px;
    }
    .legend-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: var(--stone);
    }
    .legend-dot {
      width: 10px; height: 10px;
      border-radius: 50%;
    }
  </style>
</head>
<body>
  <div class="light">
    <div class="section-label">EBITDA Impact Analysis</div>
    <div class="title" style="margin-top:8px;">Margin Improvement by Lever</div>
    <p class="subtitle">Basis points of margin captured in first 12 months</p>

    <div class="chart-container">
      <div class="bar-row">
        <span class="bar-label">Pricing</span>
        <div class="bar-track">
          <div class="bar-fill accent" style="width:85%;">+320bp</div>
        </div>
      </div>
      <div class="bar-row">
        <span class="bar-label">Procurement</span>
        <div class="bar-track">
          <div class="bar-fill accent" style="width:72%;">+280bp</div>
        </div>
      </div>
      <div class="bar-row">
        <span class="bar-label">Workforce Optimization</span>
        <div class="bar-track">
          <div class="bar-fill primary" style="width:55%;">+210bp</div>
        </div>
      </div>
      <div class="bar-row">
        <span class="bar-label">Revenue Mix Shift</span>
        <div class="bar-track">
          <div class="bar-fill primary" style="width:42%;">+160bp</div>
        </div>
      </div>
      <div class="bar-row">
        <span class="bar-label">SG&A Rationalization</span>
        <div class="bar-track">
          <div class="bar-fill primary" style="width:30%;">+115bp</div>
        </div>
      </div>
    </div>

    <div class="legend">
      <div class="legend-item"><div class="legend-dot" style="background:var(--ochre);"></div> Top-quartile impact</div>
      <div class="legend-item"><div class="legend-dot" style="background:var(--ink);"></div> Median impact</div>
    </div>

    <div class="footer">
      <span class="footer-brand">OPS2EBITDA</span>
      <div class="footer-accent-line"></div>
    </div>
  </div>
</body>
</html>
```

Write to `~/.claude/skills/linkedin/references/templates/bar-chart.html`.

- [ ] **Step 2: Render, verify, fix, and commit**

```bash
cd ~/.claude/skills/linkedin/references
uv run python render_html_to_png.py templates/bar-chart.html --output /tmp/test-bar-chart.png
```

Verify: horizontal bars with Ochre and Ink fills, right-aligned labels, value inside bar, legend at bottom.

```bash
cd ~/.claude/skills/linkedin
git add references/templates/bar-chart.html
git commit -m "feat(linkedin): add bar-chart template

Horizontal bar chart for KPI/margin comparisons. Ochre for
top-quartile, Ink for median. Kyle Poyar-style clean data viz."
```

---

## Task 11: Template — before-after

Two-panel comparison for transformation stories.

**Files:**
- Create: `~/.claude/skills/linkedin/references/templates/before-after.html`

- [ ] **Step 1: Write the template**

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" href="base.css">
  <style>
    .panels {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      flex: 1;
      margin-top: 28px;
    }
    .panel {
      border-radius: 8px;
      padding: 28px;
      display: flex;
      flex-direction: column;
    }
    .panel.before {
      background: var(--paper);
      border: 1px solid rgba(22, 20, 19, 0.08);
    }
    .panel.after {
      background: var(--ink);
      color: var(--bone);
    }
    .panel-label {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 16px;
    }
    .panel.before .panel-label { color: var(--sienna); }
    .panel.after .panel-label { color: var(--ochre); }
    .panel-title {
      font-size: 22px;
      font-weight: 700;
      margin-bottom: 16px;
    }
    .panel-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .panel-list li {
      font-size: 14px;
      line-height: 1.5;
      padding-left: 16px;
      position: relative;
    }
    .panel.before .panel-list li::before {
      content: "✕";
      position: absolute;
      left: 0;
      color: var(--sienna);
      font-weight: 700;
      font-size: 12px;
    }
    .panel.after .panel-list li::before {
      content: "→";
      position: absolute;
      left: 0;
      color: var(--ochre);
      font-weight: 700;
      font-size: 12px;
    }
    .panel-metric {
      margin-top: auto;
      padding-top: 16px;
      border-top: 1px solid rgba(146, 139, 126, 0.2);
      display: flex;
      align-items: baseline;
      gap: 8px;
    }
    .panel-metric-value {
      font-size: 28px;
      font-weight: 800;
    }
    .panel.before .panel-metric-value { color: var(--sienna); }
    .panel.after .panel-metric-value { color: var(--ochre); }
    .panel-metric-label {
      font-size: 13px;
      color: var(--stone);
    }
    .vs-badge {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 44px; height: 44px;
      border-radius: 50%;
      background: var(--ochre);
      color: var(--bone);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 800;
      z-index: 1;
    }
  </style>
</head>
<body>
  <div class="light">
    <div class="section-label">Transformation Case</div>
    <div class="title" style="margin-top:8px;">Pricing Optimization: Before vs. After</div>
    <p class="subtitle">Mid-market industrial distribution — 18-month PE hold</p>

    <div class="panels" style="position:relative;">
      <div class="panel before">
        <div class="panel-label">Before</div>
        <div class="panel-title">Legacy Pricing</div>
        <ul class="panel-list">
          <li>Cost-plus across all customers</li>
          <li>No tier differentiation</li>
          <li>Reps discount to win deals</li>
          <li>No margin visibility by SKU</li>
          <li>Annual price increases ad hoc</li>
        </ul>
        <div class="panel-metric">
          <span class="panel-metric-value">31.2%</span>
          <span class="panel-metric-label">Gross Margin</span>
        </div>
      </div>

      <div class="panel after">
        <div class="panel-label">After</div>
        <div class="panel-title">Value-Based Pricing</div>
        <ul class="panel-list">
          <li>Segment-specific pricing tiers</li>
          <li>Discount guardrails by customer value</li>
          <li>Automated price exception tracking</li>
          <li>SKU-level margin waterfall</li>
          <li>Contractual annual escalators</li>
        </ul>
        <div class="panel-metric">
          <span class="panel-metric-value">34.5%</span>
          <span class="panel-metric-label">Gross Margin (+330bp)</span>
        </div>
      </div>
    </div>

    <div class="footer">
      <span class="footer-brand">OPS2EBITDA</span>
      <div class="footer-accent-line"></div>
    </div>
  </div>
</body>
</html>
```

Write to `~/.claude/skills/linkedin/references/templates/before-after.html`.

- [ ] **Step 2: Render, verify, fix, and commit**

```bash
cd ~/.claude/skills/linkedin/references
uv run python render_html_to_png.py templates/before-after.html --output /tmp/test-before-after.png
```

Verify: side-by-side panels, Sienna "Before" label and metric, Ochre "After" label and metric, Ink panel for "After," Paper panel for "Before."

```bash
cd ~/.claude/skills/linkedin
git add references/templates/before-after.html
git commit -m "feat(linkedin): add before-after template

Two-panel transformation comparison. Sienna/Paper for 'before',
Ochre/Ink for 'after'. Includes metric callouts at panel bottom."
```

---

## Task 12: Excalidraw Brand Palette

Map the Ops2EBITDA colors into the Excalidraw skill's `color-palette.md` format so framework diagrams use the brand palette.

**Files:**
- Create: `~/.claude/skills/excalidraw-diagram/references/color-palette-ops2ebitda.md`

- [ ] **Step 1: Read the existing Excalidraw color palette for reference**

```bash
cat ~/.claude/skills/excalidraw-diagram/references/color-palette.md
```

Use the same section structure but with Ops2EBITDA colors.

- [ ] **Step 2: Write the Ops2EBITDA Excalidraw palette**

```markdown
# Ops2EBITDA Color Palette (Excalidraw)

**Use this palette instead of the default when generating Ops2EBITDA branded diagrams.**

---

## Shape Colors (Semantic)

| Semantic Purpose     | Fill      | Stroke    |
|----------------------|-----------|-----------|
| Primary/Neutral      | `#F4EFE6` | `#161413` |
| Secondary            | `#FBF8F2` | `#928B7E` |
| Tertiary             | `#928B7E` | `#161413` |
| Start/Trigger        | `#F4EFE6` | `#B8862F` |
| End/Success          | `#B8862F` | `#161413` |
| Warning/Reset        | `#7A2E1F` | `#161413` |
| Decision             | `#F4EFE6` | `#B8862F` |
| AI/LLM              | `#F4EFE6` | `#928B7E` |
| Inactive/Disabled    | `#FBF8F2` | `#928B7E` (use dashed stroke) |
| Error                | `#7A2E1F` | `#161413` |

---

## Text Colors (Hierarchy)

| Level          | Color     | Use For                          |
|----------------|-----------|----------------------------------|
| Title          | `#161413` | Section headings, major labels   |
| Subtitle       | `#928B7E` | Subheadings, secondary labels    |
| Body/Detail    | `#928B7E` | Descriptions, annotations        |
| On light fills | `#161413` | Text inside Bone/Paper shapes    |
| On dark fills  | `#F4EFE6` | Text inside Ink/Sienna shapes    |

---

## Evidence Artifact Colors

| Artifact           | Background | Text Color |
|--------------------|-----------|------------|
| Code snippet       | `#161413` | `#B8862F`  |
| JSON/data example  | `#161413` | `#F4EFE6`  |

---

## Default Stroke & Line Colors

| Element                                | Color     |
|----------------------------------------|-----------|
| Arrows                                 | `#161413` |
| Structural lines (dividers, trees)     | `#928B7E` |
| Marker dots (fill + stroke)            | `#B8862F` |

---

## Background

| Property          | Value     |
|-------------------|-----------|
| Canvas background | `#FFFFFF` |
```

Write to `~/.claude/skills/excalidraw-diagram/references/color-palette-ops2ebitda.md`.

- [ ] **Step 3: Commit**

```bash
cd ~/.claude/skills/excalidraw-diagram
git add references/color-palette-ops2ebitda.md
git commit -m "feat(excalidraw): add Ops2EBITDA brand palette

Maps Bone/Ink/Ochre/Sienna/Stone/Paper to Excalidraw semantic
color format for branded framework diagrams."
```

---

## Task 13: Orchestrator Skill — SKILL.md

The main `/linkedin` skill file that Claude reads to execute the workflow.

**Files:**
- Create: `~/.claude/skills/linkedin/SKILL.md`

- [ ] **Step 1: Write the SKILL.md**

```markdown
---
name: linkedin
description: Use when creating LinkedIn content for Ops2EBITDA. Orchestrates ideation, copywriting, branded media generation (HTML-to-PNG infographics, Excalidraw diagrams, Canva briefs), and review/export. Invoke when the user wants to create a LinkedIn post, generate social media content, or produce branded visuals for Ops2EBITDA products.
---

# LinkedIn Content Workflow

End-to-end LinkedIn content creation for Ops2EBITDA. Four phases: Ideate → Write → Design → Review.

## Startup

Read these files before starting:
- `references/brand-reference.md` — colors, typography, voice, product lines
- `references/post-structure.md` — copy structure, format rules, hashtag bank

Read from the Ops2EBITDA project directory:
- `PRODUCT.md` — product context for CTAs
- `linkedin-history.md` — past posts (if exists)
- `content/` — knowledge base articles (JSON files with `articleSections`, `summary`, `tags`)

## Phase 1: IDEATE

Ask the user which mode to use:

**Mode A — Mine the knowledge base**: Read articles from `content/` directory (fundamentals, playbooks, industries, kpis). Identify concepts with LinkedIn potential. Prioritize: visual arguments, product tie-ins, topics not yet covered in `linkedin-history.md`.

**Mode B — Topic-driven**: User gives a topic. Generate 5-8 angles per the categories in `references/post-structure.md` (hot take, data breakdown, framework visual, text card, meme).

**Mode C — Trend mashup**: Search web for trending PE, AI, and operations topics on LinkedIn. Map each trend to knowledge base content for a unique angle.

Present 5-8 ranked ideas. Each idea includes:
- One-line hook
- Format: text-only | image+caption | carousel
- Media type: data-viz | framework-diagram | branded-card | meme | none
- Product tie-in (if natural)
- Effort: quick | medium | full

User picks one. Advance to Phase 2.

## Phase 2: WRITE

Draft the full post using the structure from `references/post-structure.md`:
- HOOK → GAP → BODY → CTA → HASHTAGS
- Apply brand voice rules (consulting-grade, direct, concrete, no emoji spam)
- Adapt length to format (shorter for image posts, longer for text-only)

Present the draft. User approves, revises, or requests new angle. On approval, advance to Phase 3.

**If format is text-only**: Skip Phase 3, go directly to Phase 4.

## Phase 3: DESIGN

Route to the appropriate media tool based on the idea's media type:

### Route: HTML-to-PNG (data-viz, branded-card)

1. Choose the best-fit template from `references/templates/`:
   - `data-table-dark.html` — ranked lists, comparisons
   - `data-table-light.html` — KPI breakdowns, metrics
   - `grid-card.html` — numbered frameworks, checklists
   - `text-card-dark.html` — bold stat/quote, dark bg
   - `text-card-light.html` — insight/pull-quote, light bg
   - `bar-chart.html` — horizontal bar comparisons
   - `before-after.html` — transformation two-panel

2. Generate a new HTML file based on the template pattern but with real content from the post. Save to the output directory as `media.html`.

3. Render to PNG:
```bash
cd ~/.claude/skills/linkedin/references
uv run python render_html_to_png.py <path-to-media.html> --output <path-to-media.png>
```

4. View the rendered PNG with the Read tool. If anything looks off (text clipped, spacing wrong, colors off), fix the HTML and re-render. Repeat until polished.

### Route: Excalidraw (framework-diagram)

1. Read `~/.claude/skills/excalidraw-diagram/references/color-palette-ops2ebitda.md` for brand colors.
2. Follow the excalidraw-diagram skill to generate the `.excalidraw` JSON using the Ops2EBITDA palette.
3. Save as `media.excalidraw` in the output directory.
4. Render to PNG using the Excalidraw renderer:
```bash
cd ~/.claude/skills/excalidraw-diagram/references
uv run python render_excalidraw.py <path-to-media.excalidraw> --output <path-to-media.png>
```
5. View and iterate until polished.

### Route: Canva Brief (complex/photo-heavy)

Generate a `canva-brief.md` with:
- Dimensions (1200x1200 or carousel slide size)
- Color hex codes from brand palette
- Text content per element with size and position
- Layout description with reference template style
- Notes on photo/imagery needed

Save to output directory. User builds final asset in Canva.

Present the rendered media (or brief). User approves, requests revision, or switches media route. On approval, advance to Phase 4.

## Phase 4: REVIEW

Present the complete post for final approval:
- Full post copy
- Rendered media (display the PNG)
- Product tie-in noted
- Suggested posting: Tue-Thu, 7-9am ET

**Actions:**
- **Approve** → finalize and export
- **Revise copy** → back to Phase 2
- **Revise media** → back to Phase 3
- **Switch media route** → back to Phase 3 with different route
- **Regenerate** → back to Phase 2 with same idea, new angle

**On approval:**

1. Create output directory:
```bash
mkdir -p <project-root>/linkedin-assets/YYYY-MM-DD-slug/
```

2. Save `post-copy.md` with the full post text.

3. Save media files (`media.png` + source file).

4. Append to `linkedin-history.md`:
```markdown
## YYYY-MM-DD — [Slug]
- **Topic**: [topic]
- **Format**: [text-only|image+caption|carousel]
- **Media**: [template name or excalidraw or canva]
- **Product**: [product referenced, or "none"]
- **Source**: [knowledge base article, or "original"]
```

5. Copy post text to clipboard:
```bash
cat <path>/post-copy.md | pbcopy
```

6. Report: "Post ready. Text copied to clipboard. Media at: `<path>/media.png`"

## Content Mix Guidance

When reviewing `linkedin-history.md`, flag if:
- Same topic posted within last 2 weeks
- More than 3 consecutive posts with same media type (suggest variety)
- A product line hasn't been referenced in 3+ weeks
- Format has been the same for 4+ posts (mix text-only, image, carousel)
```

Write to `~/.claude/skills/linkedin/SKILL.md`.

- [ ] **Step 2: Verify the skill is discoverable**

After writing the file, the skill should appear in Claude Code's skill list. Verify by checking:

```bash
ls ~/.claude/skills/linkedin/SKILL.md
```

The file should exist and the YAML frontmatter should parse correctly (name: `linkedin`, description starting with "Use when").

- [ ] **Step 3: Commit**

```bash
cd ~/.claude/skills/linkedin
git add SKILL.md
git commit -m "feat(linkedin): add orchestrator skill

Four-phase pipeline: Ideate (3 modes) → Write (structured copy) →
Design (HTML-to-PNG / Excalidraw / Canva brief) → Review & Export.
Reads brand reference, post structure, knowledge base, and history."
```

---

## Task 14: Project Scaffolding

Create the output directory structure and initialize the history log in the Ops2EBITDA project.

**Files:**
- Create: `<project-root>/linkedin-history.md`
- Create: `<project-root>/linkedin-assets/.gitkeep`

- [ ] **Step 1: Create the linkedin-assets directory**

```bash
mkdir -p "<project-root>/linkedin-assets"
touch "<project-root>/linkedin-assets/.gitkeep"
```

Replace `<project-root>` with the actual Ops2EBITDA project path.

- [ ] **Step 2: Initialize the history log**

```markdown
# LinkedIn Post History

Tracks published Ops2EBITDA LinkedIn content for mix balance and deduplication.

---
```

Write to `<project-root>/linkedin-history.md`.

- [ ] **Step 3: Add linkedin-assets/ to .gitignore**

Add this line to `<project-root>/.gitignore`:

```
linkedin-assets/
```

The rendered PNGs and generated HTML are output artifacts, not source — no need to track them in git. The `linkedin-history.md` log IS tracked.

- [ ] **Step 4: Commit**

```bash
cd <project-root>
git add linkedin-history.md linkedin-assets/.gitkeep .gitignore
git commit -m "feat: scaffold LinkedIn content workflow output structure

Initialize post history log and linkedin-assets output directory.
Assets excluded from git tracking via .gitignore."
```

---

## Task 15: End-to-End Validation

Run the full workflow once to verify everything works together.

- [ ] **Step 1: Invoke the skill**

Type `/linkedin` in Claude Code. Verify:
- The skill loads and reads brand-reference.md, post-structure.md
- It asks which ideation mode to use

- [ ] **Step 2: Test Mode B ideation**

Provide the topic "working capital." Verify:
- 5-8 ideas generated with hooks, format recommendations, media types
- Ideas reference Ops2EBITDA knowledge base content
- Product tie-ins mention the Working Capital & Cash Conversion Model ($99)

- [ ] **Step 3: Test copywriting**

Pick a data-viz idea. Verify:
- Post follows HOOK → GAP → BODY → CTA → HASHTAGS structure
- Voice is consulting-grade, not generic
- Copy length adapts to image+caption format

- [ ] **Step 4: Test HTML-to-PNG rendering**

Approve the copy and let the skill generate media. Verify:
- Correct template selected for the media type
- HTML generated with real content (not placeholder)
- PNG renders at 1200x1200
- Brand colors correct (Bone/Ink/Ochre/Sienna/Stone)
- Footer branding present

- [ ] **Step 5: Test review and export**

Approve the final output. Verify:
- Files saved to `linkedin-assets/YYYY-MM-DD-slug/` (post-copy.md, media.png, media.html)
- Entry appended to `linkedin-history.md`
- Post text copied to clipboard

- [ ] **Step 6: Test Excalidraw route**

Run `/linkedin` again, pick a framework-diagram idea. Verify:
- Excalidraw JSON uses Ops2EBITDA palette colors
- `.excalidraw` file saved alongside PNG
- Diagram renders correctly

- [ ] **Step 7: Commit any fixes**

If any issues were found during validation, fix them and commit:

```bash
git add -A
git commit -m "fix(linkedin): fixes from end-to-end validation"
```
