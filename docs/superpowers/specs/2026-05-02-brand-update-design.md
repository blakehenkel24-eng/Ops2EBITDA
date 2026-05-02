# Ops2EBITDA Brand Guidelines Implementation Spec

## Overview
This document specifies the technical implementation details for adopting the Ops2EBITDA brand guidelines within our Next.js and Tailwind CSS (v4) application. The goal is to shift from the generic current state to an authoritative, operator-grade, editorial aesthetic.

## 1. Typography
We will configure Next.js `next/font/google` to import the required fonts and assign them as CSS variables.

*   **Newsreader:** `--font-newsreader`
    *   **Usage:** Display, headlines, pull quotes, and the primary logo font.
    *   **Weights:** 300, 400, 500, 600
    *   **Tracking:** `-0.02em` for display, `0` for body.
*   **Geist:** `--font-geist`
    *   **Usage:** UI elements, body copy, captions, navigation, tables, buttons, form labels.
    *   **Weights:** 400, 500, 600
    *   **Tracking:** `0` default, `+0.08em` for micro caps.
*   **JetBrains Mono:** `--font-jetbrains`
    *   **Usage:** Tactical labels, KPI codes, version stamps, footnotes, data callouts. Always uppercase, tracked, and small.
    *   **Weights:** 400, 500

## 2. Color Palette & Theming (Tailwind v4 `globals.css`)
The palette is restrained, utilizing paper and ink tones with specific accents.

*   **Surfaces:**
    *   `--color-bone` (`#F4EFE6`): Primary surface / body background.
    *   `--color-paper` (`#FBF8F2`): Elevated elements, cards.
*   **Foreground / Chrome:**
    *   `--color-ink` (`#161413`): Primary foreground, typography.
    *   `--color-stone` (`#928B7E`): Mid-tones, chrome, borders, disabled states.
*   **Accents (Use sparingly):**
    *   `--color-ochre` (`#B8862F`): Primary accent. Reserved for active states, levers, KPIs, and the "2" in the logo.
    *   `--color-ochre-soft` (`#DEB870`): Used for the operator "2" on dark backgrounds.
    *   `--color-sienna` (`#7A2E1F`): Critical states, variance.

## 3. Logo Component
A dedicated `Ops2EBITDALogo` React component will be created, strictly following the brand's HTML/CSS spec.

```tsx
export function Ops2EBITDALogo({ className = "" }: { className?: string }) {
  return (
    <span className={`font-newsreader font-medium text-[1em] tracking-[-0.025em] leading-none text-ink whitespace-nowrap ${className}`}>
      Ops<span className="italic font-semibold text-ochre px-[0.02em]">2</span>EBITDA
    </span>
  );
}
```
*Note: The font-family utilities will be configured in Tailwind.*

## 4. UI Elements & Layout
*   **Icons:** Migrate to `lucide-react`. Ensure icons use a 1.5px stroke width (`strokeWidth={1.5}`), square caps where possible, and avoid filled variations. The active state for icons should be colored Ochre.
*   **Spacing & Layout:** Embrace generous "margin note" styling. Eliminate heavy drop shadows; rely on `--color-paper` vs `--color-bone` contrast and sharp `--color-stone` borders (1px) for separation.
*   **Charts/Data Visualization:** Do not use gradients, 3D effects, or rounded bars. The main data series should be Ochre, while contextual data should remain Ink/Stone.

## 5. Implementation Steps
1.  **Update `layout.tsx`:** Remove Bodoni and Jost. Add Newsreader, Geist, and JetBrains Mono via `next/font/google`.
2.  **Update `globals.css`:** Define the new custom color palette and font variables using Tailwind v4 syntax (`@theme`).
3.  **Create Logo Component:** Build and integrate the `Ops2EBITDALogo` component.
4.  **Refactor Components:** Update `AppShell`, `Cards`, `DetailViews`, and other components to use the new fonts, colors, and layout principles. Ensure all hardcoded or legacy utility classes (e.g., `text-brand-gradient`, rounded classes if overly aggressive, heavy shadows) are removed or replaced.
5.  **Install `lucide-react`:** Replace existing icons with Lucide, adhering to the 1.5px stroke weight rule.
