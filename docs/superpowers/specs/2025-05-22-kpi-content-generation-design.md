# Design Document: 9 New KPI Curated Articles

## Goal
Generate 9 new JSON files in `content/curated-articles/` for specific KPIs, using a senior operating partner tone and a consistent 5-section structure.

## Content Strategy: The "Operational Lever" Framework
Each article will follow this thematic structure:
1. **Strategic Value:** The "Why" from a Private Equity perspective (visibility, multiples, floor).
2. **Operational Drivers:** Practical levers to move the metric (process, people, tech).
3. **Quality & Pitfalls:** Common mistakes, reporting "leakage", and quality of earnings considerations.
4. **EBITDA & Value Creation:** Direct link between the KPI and enterprise value.
5. **Exit Readiness:** How the next buyer will view this metric and how to position it.

## Target KPIs
1. `expansion-revenue`
2. `gross-margin`
3. `grr` (Gross Revenue Retention)
4. `lead-conversion-rate`
5. `logo-retention`
6. `maverick-spend`
7. `mrr` (Monthly Recurring Revenue)
8. `on-time-delivery`
9. `plant-oee` (Overall Equipment Effectiveness)

## Technical Specification
- **Format:** JSON
- **Schema:** 
  ```json
  {
    "id": "string",
    "articleSections": [
      {
        "title": "string",
        "body": ["string", "string"],
        "callout": "string (optional)"
      }
    ]
  }
  ```
- **Constraint:** Exactly 5 sections per file.
- **Tone:** Senior Operating Partner (Professional, dense, practical, LBO-focused).
- **No-Go:** No book/author mentions, no source citations.

## Verification Plan
- Validate JSON structure for all 9 files.
- Verify exactly 5 sections per file.
- Peer review for tone consistency (Operating Partner perspective).
