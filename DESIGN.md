# PE Ops Knowledge Base Design Direction

## Visual Position

A cool-toned, digital-first executive binder with an editorial, breathable feel. It blends classic management consulting (like Kearney/McKinsey) with modern institutional fintech (like Bloomberg). It relies on generous whitespace, a structured "binder" layout, crisp data presentation, and decisive typography.

## Color

Use a cool, digital palette. Backgrounds use cool slate-grays (`--paper`), while content pages sit on pure white panels (`--panel`) to feel like physical paper inside a digital binder. Text is a sharp dark slate/charcoal (`--ink`), with strong institutional Navy (`--accent`) for active states and authority. Avoid warm, earthy tones.

## Typography

A single-family system: **Cambria** for everything (headings, body, data, labels), with `Georgia, "Times New Roman", serif` as the fallback stack. No webfonts are loaded; Cambria is a system font. Hierarchy comes from size and weight contrast, not family changes.

- **Headings (h1-h6):** Cambria, medium weight, to evoke a "published report" authority.
- **Body & Data:** Cambria. Line lengths are capped around 75 characters with generous line height for breathability.
- **Labels:** Uppercase Cambria at 11px with slight tracking (0.06em).
- **Code:** The one exception — `pre`/`code`/`kbd`/`samp` stay monospace (ui-monospace stack) for readability.

## Layout

Structured like a digital binder or dossier. 
- Navigation lives in a persistent left-hand sidebar on desktop, acting as the "tabs" of the binder.
- Content sits inside a contained, white page-like panel with subtle borders and shadows.
- Favor editorial sections, thin rules, lists, and structured briefings over generic card grids.

## Interaction

Interactions should feel like tactile, institutional utility: visible focus states, sharp active tabs (with subtle inset shadows or borders), accessible loading states, and purposeful hover treatments. Avoid decorative motion or glassmorphism.
