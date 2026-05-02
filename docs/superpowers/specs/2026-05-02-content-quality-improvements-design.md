# Content Quality Improvements Design

## 1. Overview
The current content generation pipeline (`scripts/enrich-content.mjs`) relies on generic, hardcoded template strings to generate the "article" sections for Fundamentals, Playbooks, Industries, and KPIs. This results in repetitive, low-signal content that fails to capture the depth required for a Private Equity learning operating system. 

The user has requested an overhaul to deeply root the content in four specific authoritative resources:
1. *The Private Equity Playbook* (Adam Coffey)
2. *The Operating Partner in Private Equity*
3. The methodologies of Peter Howson (e.g., *Commercial Due Diligence*)
4. *Private Equity 4.0* (Benoît Leleux, Hans van Swaay)

This design outlines a static-generation approach where expert-level content is authored once by the CLI agent, saved as static artifacts, and merged during the build process.

## 2. Architecture

### 2.1 Content Curation Strategy
Instead of generating content dynamically at build time (which slows down the build and requires an API key) or relying on template strings, the CLI agent will perform a one-time generation of rich, highly specific article content.

- The agent will draw heavily on internal knowledge of the 4 requested books, prioritizing operational alpha, value creation levers, 100-day planning, and rigorous diligence frameworks.
- The content will be punchy, actionable, and tailored to PE operating partners.

### 2.2 Data Structure
The curated content will be stored in a new directory: `content/curated-articles/`.
Each entity (Fundamental, Playbook, Industry, KPI) will have a corresponding JSON file containing its deeply researched article sections.

Example format (`content/curated-articles/lbo-basics.json`):
```json
{
  "id": "lbo-basics",
  "articleSections": [
    {
      "title": "The Operational Realities of Leverage",
      "body": [
        "In Private Equity 4.0, leverage is no longer the primary driver of returns; it is the amplifier of operational alpha. An LBO forces discipline..."
      ],
      "callout": "Leverage strips away the luxury of complacency."
    }
  ]
}
```

### 2.3 Script Refactoring
`scripts/enrich-content.mjs` will be heavily refactored:
- All hardcoded template strings (e.g., `fundamentalArticle`, `playbookArticle`) will be removed.
- The script will read the base JSON from `content/fundamentals/` etc., and then attempt to read a matching file from `content/curated-articles/`.
- If a curated article exists, it will attach the `articleSections` to the item.
- The diagram generation logic (Mermaid diagrams) will remain unchanged, as it provides structural value.

## 3. Implementation Steps
1. Create the `content/curated-articles/` directory.
2. The CLI agent will generate and write the rich JSON content files for all entities based on the 4 key resources.
3. Refactor `scripts/enrich-content.mjs` to read from the new `curated-articles` directory instead of generating boilerplate text.
4. Run the enrichment script and verify the output.
