# AtlasIQ Soft Frame Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the AtlasIQ grid-textured outskirts with the approved quiet Soft Frame treatment.

**Architecture:** Keep the existing chat component structure and update only its full-page surface styles in `app/globals.css`. The viewport becomes a solid matte shell, while the existing chat document remains a brighter bounded working surface at desktop and full-width at mobile.

**Tech Stack:** CSS, Next.js 16, React 19, browser-based visual QA.

---

### Task 1: Implement the Soft Frame

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Lock the current stylesheet baseline**

Run: `npm run lint && npm run typecheck`

Expected: both commands exit 0.

- [ ] **Step 2: Replace the visible outer texture**

Set the full-page surfaces to these exact roles:

```css
.atlas-chat-viewport {
  background: oklch(92.8% 0.009 240);
}

.atlas-chat-document,
.atlas-chat-composer {
  background: oklch(97.6% 0.005 238);
}
```

Remove both `background-image` grid layers and `background-size` from `.atlas-chat-viewport`.

- [ ] **Step 3: Soften the desktop frame**

Keep the existing 72rem width and history-aware calculation. Use one-pixel vertical rules and a low-opacity lateral shadow:

```css
border-inline: 1px solid oklch(62% 0.024 242 / 0.2);
box-shadow:
  -14px 0 30px oklch(31% 0.038 248 / 0.035),
  14px 0 30px oklch(31% 0.038 248 / 0.035);
```

- [ ] **Step 4: Preserve mobile full-bleed behavior**

At `max-width: 768px`, retain a single `oklch(97.6% 0.005 238)` background for the viewport, document, and composer. Do not add borders or shadows at mobile widths.

### Task 2: Verify Interaction and Rendering

**Files:**
- Inspect: `app/globals.css`

- [ ] **Step 1: Verify desktop closed-history state**

At 1440 x 900, confirm equal outer gutters, no repeating pattern, a visible but quiet surface boundary, and no horizontal overflow.

- [ ] **Step 2: Verify desktop open-history state**

Open chat history and confirm the document shifts into the remaining viewport with at least 40px right margin and no horizontal overflow. Close history afterward.

- [ ] **Step 3: Verify mobile state**

At 390 x 844, confirm the document is full-width, the outer field is absent, and there is no horizontal overflow.

- [ ] **Step 4: Run completion checks**

Run: `npm run lint && npm run typecheck && npm run build && git diff --check`

Expected: all commands exit 0 and the build includes `/atlas-iq/chat`.

