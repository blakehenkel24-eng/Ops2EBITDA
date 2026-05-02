# Content Quality Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Overhaul the content generation pipeline to use static, deeply researched, high-quality PE content instead of generic templates.

**Architecture:** We will create a `content/curated-articles/` directory. We will rewrite `scripts/enrich-content.mjs` to read from this directory and merge the high-quality article sections into the generated JSON data. We will then generate the actual content files for a subset of the modules to prove the pipeline, and then we can scale it up.

**Tech Stack:** Node.js, JSON, Markdown

---

### Task 1: Setup Infrastructure and Refactor `enrich-content.mjs`

**Files:**
- Modify: `scripts/enrich-content.mjs`

- [ ] **Step 1: Modify the enrichment script to read curated articles**
We need to update `scripts/enrich-content.mjs` to check for a curated JSON file before falling back to the hardcoded generators, or completely replace the hardcoded generators with a requirement for curated content. Let's make it read the curated files and gracefully fallback to the existing generators if the curated file doesn't exist yet.

```javascript
// Add to the top of scripts/enrich-content.mjs after imports:
const curatedRoot = path.join(contentRoot, "curated-articles");
if (!fs.existsSync(curatedRoot)) fs.mkdirSync(curatedRoot, { recursive: true });

function getCuratedArticle(slug) {
  const curatedPath = path.join(curatedRoot, `${slug}.json`);
  if (fs.existsSync(curatedPath)) {
    return JSON.parse(fs.readFileSync(curatedPath, "utf8")).articleSections;
  }
  return null;
}
```

- [ ] **Step 2: Update the enrichment loop**
Find the bottom loop in `scripts/enrich-content.mjs`:
```javascript
for (const [directory, makeArticle] of Object.entries(enrichers)) {
  for (const { filePath, item } of readCollection(directory)) {
    let generatedSections = getCuratedArticle(item.slug);
    
    // Fallback to legacy generators if no curated content exists yet
    if (!generatedSections) {
      generatedSections = makeArticle(item);
    }
    
    // Inject the curated book excerpts if they exist
    if (item.bookExcerpts && item.bookExcerpts.length > 0) {
      generatedSections.push({
        title: "Authoritative Sourcing (Vault References)",
        body: item.bookExcerpts,
        callout: "The above excerpts were queried directly from the Private Equity Vault source books to ensure operational fidelity."
      });
    }
    
    item.articleSections = generatedSections;
    item.diagrams = diagramsFor(directory, item);
    write(filePath, item);
  }
}
```

- [ ] **Step 3: Run the enrichment script to verify it still works with the fallback**
Run: `node scripts/enrich-content.mjs`
Expected: Success message indicating static content was enriched.

---

### Task 2: Generate Curated Content for Fundamentals

**Files:**
- Create: `content/curated-articles/lbo-basics.json`
- Create: `content/curated-articles/add-on-acquisitions.json`

- [ ] **Step 1: Write `content/curated-articles/lbo-basics.json`**
The executing agent will write this file utilizing its internal knowledge of *The Private Equity Playbook* and *Private Equity 4.0*. The content must be extremely punchy, actionable, and focused on operational alpha, avoiding generic fluff.

```json
{
  "id": "lbo-basics",
  "articleSections": [
    {
      "title": "The Operational Realities of Leverage",
      "body": [
        "In Private Equity 4.0, leverage is no longer the primary driver of returns; it is the amplifier of operational alpha. An LBO forces extreme capital discipline onto a management team. Because the debt load absorbs free cash flow, the company loses the luxury of hiding operational inefficiencies behind a fat balance sheet.",
        "For the operating partner, the LBO structure means that every dollar of EBITDA improvement is magnified at exit. A 200bps margin expansion doesn't just increase profits; it rapidly accelerates deleveraging, creating a compounding effect on equity value."
      ],
      "callout": "Leverage strips away the luxury of complacency. It forces management to focus entirely on cash-generative operations."
    },
    {
      "title": "Working Capital as the First Lever",
      "body": [
        "The first 100 days of an LBO are rarely about transformative growth; they are about cash control. Operators must immediately triage DSO, DPO, and inventory turns.",
        "A company with $100M revenue and a 120-day Cash Conversion Cycle has roughly $33M trapped in working capital. Driving that down to 60 days releases $16M—cash that can be immediately used to pay down senior debt or fund an add-on acquisition without drawing the revolver."
      ]
    },
    {
      "title": "The Debt Paydown vs. Growth Paradox",
      "body": [
        "Traditional LBOs relied on steady amortization. Modern value creation requires balancing debt service with aggressive growth investments (like go-to-market scaling or digital transformation).",
        "The operator's job is to sequence initiatives: capture quick cost wins and procurement savings in Year 1 to service the debt and build a war chest, then deploy that capital into revenue growth levers in Years 2 and 3."
      ]
    }
  ]
}
```

- [ ] **Step 2: Write `content/curated-articles/add-on-acquisitions.json`**
```json
{
  "id": "add-on-acquisitions",
  "articleSections": [
    {
      "title": "The Roll-up Machine: Converting Fragmentation into Scale",
      "body": [
        "Add-on acquisitions are not simply smaller deals attached to a platform. In a PE operating context, they are a repeatable method for converting fragmentation into scale, strengthening a platform's market position, and driving multiple arbitrage.",
        "Small companies trade for 4-6x EBITDA. Scaled platforms trade for 8-12x. The core value creation engine of an add-on strategy is acquiring EBITDA cheaply, integrating it onto a professionalized platform, and selling the combined entity at the platform premium."
      ],
      "callout": "Multiple arbitrage is not market magic; it is the mathematical reward for successfully integrating complexity."
    },
    {
      "title": "Integration: Where Value is Actually Created",
      "body": [
        "The financial model may show revenue synergies, cost synergies, and multiple arbitrage, but the actual value is created—or destroyed—in integration execution.",
        "The best operators treat add-ons as an operating capability, not a transaction. This requires a 100-day integration plan mapped before close, named functional owners, and a synergy ledger that separates bankable savings from optimistic deal-model fluff. A bad add-on distracts management, breaks customer service, and creates data chaos."
      ]
    },
    {
      "title": "Sequencing the Synergy Capture",
      "body": [
        "Synergies mature on different timelines. Cost synergies (vendor consolidation, duplicate headcount elimination, facility rationalization) should show up within 2-3 quarters. If they don't, the data is usually broken.",
        "Revenue synergies (cross-selling, geographic expansion) take significantly longer because they rely on sales incentives and customer trust. The most common PE mistake is underwriting revenue synergies too early in the hold period."
      ]
    }
  ]
}
```

- [ ] **Step 3: Run enrichment to see the new curated articles**
Run: `node scripts/enrich-content.mjs`
Expected: The JSON files in `content/fundamentals/` for LBO Basics and Add-On Acquisitions now contain the curated high-quality article sections.

---

### Task 3: Iterative Generation Phase

- [ ] **Step 1: Expand Curated Content Generation**
Using the `write_file` tool, the executing agent will continue to create JSON files in `content/curated-articles/` for the remaining Fundamentals, Playbooks, Industries, and KPIs, referencing the four core books and operational alpha principles.
*(Note: To prevent session timeout, the executing agent should batch these into logical groups and commit frequently. The agent is authorized to generate the first 10-15 most critical files to establish the core knowledge base, and can generate the rest in subsequent iterations.)*

- [ ] **Step 2: Final Verification**
Run `node scripts/enrich-content.mjs` and verify no errors occur.
Run the application build command (e.g., `npm run build` or `npm run dev`) to ensure the frontend successfully renders the new deep-dive content.
