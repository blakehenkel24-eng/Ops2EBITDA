# AtlasIQ Soft Frame Design

**Date:** 2026-06-19  
**Status:** Approved visual direction  
**Scope:** Full-page AtlasIQ chat surface

## Objective

Create a smooth visual distinction between the AtlasIQ working surface and its surrounding shell without making the interface feel boxed, diagrammatic, or decorative.

## Approved Direction

Use the **Soft Frame** treatment:

- Replace the visible grid with a solid, low-contrast matte outer field.
- Keep the central chat document slightly brighter than the surrounding field.
- Define the document with one-pixel vertical rules and very soft lateral depth.
- Preserve the current 72rem desktop working width and centered composition.
- Keep the composer visually continuous with the central document.
- Retain the existing history trigger and drawer behavior.
- At widths below 900px, remove the framed treatment and use a full-width chat surface.

## Visual Constraints

- No grid, graph-paper, stripe, noise, or repeating pattern.
- No gradient, glass effect, floating card treatment, or heavy shadow.
- The tonal difference should remain visible at a glance but quiet during long reading sessions.
- Use the existing cool neutral palette and AtlasIQ blue accent.
- Do not change typography, content, component structure, chat behavior, or data flow.

## Interaction Behavior

- Opening chat history continues to shrink and shift the document into the remaining viewport.
- The framed document must retain at least a 40px outer margin at desktop sizes when history is open.
- No horizontal overflow may appear in closed or open history states.
- Mobile remains full-width with no ornamental outer field.

## Verification

- Compare closed-history desktop, open-history desktop, and 390px mobile states.
- Confirm the outer field and document are visually distinct without a visible pattern.
- Confirm the composer matches the document surface.
- Confirm no horizontal overflow or console errors.
- Run lint, type checking, and the production build.

