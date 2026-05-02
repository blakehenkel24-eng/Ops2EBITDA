# Ops2EBITDA Brand Guidelines Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the authoritative, operator-grade Ops2EBITDA brand design system in the Next.js/Tailwind v4 application.

**Architecture:** We will update the global Tailwind theme configuration, replace the Google Fonts setup, create a new Logo component, and systematically update core UI components (AppShell, Cards, DetailViews) to remove generic styling and adopt the new "margin note" aesthetic with Lucide icons.

**Tech Stack:** Next.js, Tailwind CSS v4, `next/font/google`, `lucide-react`.

---

### Task 1: Setup Fonts and Global Styles

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Update Next.js Font Imports**
Update `app/layout.tsx` to remove `Bodoni_Moda` and `Jost`. Import `Newsreader`, `Geist`, and `JetBrains_Mono` from `next/font/google`.

```tsx
import type { Metadata } from "next";
import { Newsreader, Geist, JetBrains_Mono } from "next/font/google";
import { AppShell } from "@/components/AppShell";
import "./globals.css";

const newsreader = Newsreader({ subsets: ["latin"], variable: "--font-newsreader" });
const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: "PE Ops Knowledge Base",
  description: "A static private equity operations knowledge base for value creation, industries, KPIs, and operator playbooks.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${newsreader.variable} ${geist.variable} ${jetbrains.variable}`}>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Verify `app/layout.tsx` changes**
Run `npm run typecheck` to ensure no import errors. Expected: PASS (or no output).

- [ ] **Step 3: Update Global CSS and Tailwind Theme**
Rewrite `app/globals.css` to use the new color palette and typography rules. Remove old CSS variables and gradient text classes.

```css
@import "tailwindcss";

@theme {
  --font-newsreader: var(--font-newsreader), serif;
  --font-geist: var(--font-geist), sans-serif;
  --font-jetbrains: var(--font-jetbrains), monospace;

  --color-bone: #F4EFE6;
  --color-paper: #FBF8F2;
  --color-ink: #161413;
  --color-stone: #928B7E;
  --color-ochre: #B8862F;
  --color-ochre-soft: #DEB870;
  --color-sienna: #7A2E1F;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background: var(--color-bone);
  color: var(--color-ink);
  font-family: var(--font-geist);
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4, h5, h6, .font-newsreader {
  font-family: var(--font-newsreader);
  font-weight: 500;
  letter-spacing: -0.02em;
}

/* Tactical labels */
.font-mono-label {
  font-family: var(--font-jetbrains);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.6875rem; /* 11px micro scale */
}

a {
  color: inherit;
  text-decoration: none;
}

p {
  max-width: 75ch;
  line-height: 1.6;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

::selection {
  background: var(--color-stone);
  color: var(--color-bone);
}

a, button, input {
  outline-color: var(--color-ochre);
}

:focus-visible {
  outline: 2px solid var(--color-ochre);
  outline-offset: 2px;
}

pre {
  overflow-x: auto;
  white-space: pre;
}

.editorial-rule {
  background: var(--color-stone);
  height: 1px;
}

/* Mermaid adjustments */
.mermaid-output {
  display: flex;
  justify-content: center;
  align-items: center;
}
.mermaid-output svg {
  height: auto;
  max-width: 100%;
}
```

- [ ] **Step 4: Commit Task 1**
```bash
git add app/layout.tsx app/globals.css
git commit -m "style: configure brand fonts and color palette in globals and layout"
```

---

### Task 2: Logo Component and Dependencies

**Files:**
- Create: `components/Ops2EBITDALogo.tsx`
- Modify: `package.json`

- [ ] **Step 1: Install `lucide-react`**
```bash
npm install lucide-react
```

- [ ] **Step 2: Create the Logo Component**
Create `components/Ops2EBITDALogo.tsx` implementing the brand's exact specifications.

```tsx
export function Ops2EBITDALogo({ className = "" }: { className?: string }) {
  return (
    <span className={`font-newsreader font-medium text-[1em] tracking-[-0.025em] leading-none text-ink whitespace-nowrap ${className}`}>
      Ops<span className="italic font-semibold text-ochre px-[0.02em]">2</span>EBITDA
    </span>
  );
}
```

- [ ] **Step 3: Run linter/typecheck**
```bash
npm run typecheck
npm run lint
```
Expected: PASS

- [ ] **Step 4: Commit Task 2**
```bash
git add package.json package-lock.json components/Ops2EBITDALogo.tsx
git commit -m "feat: add Ops2EBITDALogo component and lucide-react"
```

---

### Task 3: Update AppShell & Layout Aesthetics

**Files:**
- Modify: `components/AppShell.tsx`

- [ ] **Step 1: Update AppShell**
Update `components/AppShell.tsx` to use `Ops2EBITDALogo`, remove drop shadows, use 1px stone borders, and apply `lucide-react` icons if applicable (e.g., navigation). Ensure it uses the new color tokens.

```tsx
import Link from 'next/link';
import { Search, BookOpen, Layers } from 'lucide-react';
import { Ops2EBITDALogo } from './Ops2EBITDALogo';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bone text-ink flex flex-col">
      <header className="sticky top-0 z-50 bg-bone border-b border-stone/30">
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl hover:opacity-80 transition-opacity">
            <Ops2EBITDALogo />
          </Link>
          <nav className="hidden md:flex gap-6 font-geist text-sm font-medium">
            <Link href="/" className="flex items-center gap-2 hover:text-ochre transition-colors">
              <BookOpen size={16} strokeWidth={1.5} />
              Library
            </Link>
            <Link href="/study" className="flex items-center gap-2 hover:text-ochre transition-colors">
              <Layers size={16} strokeWidth={1.5} />
              Study Plans
            </Link>
          </nav>
          <div className="md:hidden flex items-center">
            {/* Mobile menu stub */}
            <button className="p-2 text-stone hover:text-ink"><Search size={20} strokeWidth={1.5}/></button>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 md:px-8 py-8 md:py-12">
        {children}
      </main>
      <footer className="border-t border-stone/30 bg-bone py-8 text-center text-sm text-stone mt-12">
        <div className="max-w-6xl mx-auto px-4 font-mono-label">
          Ops2EBITDA · Operating Knowledge for PE
        </div>
      </footer>
    </div>
  );
}
```

- [ ] **Step 2: Run linter**
```bash
npm run lint
```
Expected: PASS

- [ ] **Step 3: Commit Task 3**
```bash
git add components/AppShell.tsx
git commit -m "style: update AppShell to use brand logo and margin-note layout"
```

---

### Task 4: Refactor Cards & UI Components

**Files:**
- Modify: `components/Cards.tsx`

- [ ] **Step 1: Update `Cards.tsx`**
Remove shadow classes, adjust background to `--color-paper`, add 1px stone borders, and update typography to use `font-newsreader` for titles and `font-mono-label` for tags/labels.

```tsx
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface CardProps {
  title: string;
  description: string;
  href: string;
  tag?: string;
}

export function ContentCard({ title, description, href, tag }: CardProps) {
  return (
    <Link href={href} className="group block h-full">
      <article className="bg-paper border border-stone/30 h-full p-6 flex flex-col transition-all duration-200 hover:border-ochre">
        {tag && (
          <span className="font-mono-label text-stone mb-4 block group-hover:text-ochre transition-colors">
            {tag}
          </span>
        )}
        <h3 className="font-newsreader text-2xl mb-3 text-ink group-hover:text-ochre transition-colors">
          {title}
        </h3>
        <p className="text-stone text-sm font-geist leading-relaxed flex-1 mb-6">
          {description}
        </p>
        <div className="flex items-center text-ochre font-mono-label mt-auto opacity-0 group-hover:opacity-100 transition-opacity">
          Open briefing <ArrowRight size={14} className="ml-2" strokeWidth={1.5} />
        </div>
      </article>
    </Link>
  );
}
```

- [ ] **Step 2: Check Types**
```bash
npm run typecheck
```
Expected: PASS

- [ ] **Step 3: Commit Task 4**
```bash
git add components/Cards.tsx
git commit -m "style: update Cards to editorial margin-note aesthetic"
```

---

### Task 5: Refactor DetailViews & SearchPanel

**Files:**
- Modify: `components/DetailViews.tsx`
- Modify: `components/SearchPanel.tsx`

- [ ] **Step 1: Update DetailViews**
Update headers and layout in `DetailViews.tsx` to use `font-newsreader`, `font-mono-label` for metadata, and remove any remaining generic styles. (This is a simplified abstraction; replace the actual file contents prioritizing the typography and flat paper/bone aesthetics).

```tsx
// Using 'sed' to target specific classes if the file is large, 
// or manually rewrite the core wrapping classes.
// For the sake of the plan, focus on replacing:
// - `text-3xl font-bold` -> `font-newsreader text-4xl mb-4`
// - `text-sm text-muted mb-8` -> `font-mono-label text-stone mb-8`
// - `prose` (if used) -> Custom prose overrides or rely on globals.css.
```
*(The implementer will need to apply the specific Tailwind replacements here using the tokens: `text-ink`, `bg-paper`, `font-newsreader`, `font-mono-label`, `border-stone/30`)*. 

- [ ] **Step 2: Update SearchPanel**
Update the search input to have square corners (remove `rounded-lg` or `rounded-full`), a 1px `stone` border, and focus outline of `ochre`.

- [ ] **Step 3: Test Build**
```bash
npm run build
```
Expected: successful build.

- [ ] **Step 4: Commit Task 5**
```bash
git add components/DetailViews.tsx components/SearchPanel.tsx
git commit -m "style: apply brand tokens to DetailViews and SearchPanel"
```
