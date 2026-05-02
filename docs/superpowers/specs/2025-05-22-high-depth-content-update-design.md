# High-Depth Content Update Design

**Goal:** Update 12 specific JSON files in `content/curated-articles/` to meet a new high-depth "Senior Operating Partner" standard.

## Standards
- **EXACTLY 5 SECTIONS.**
- **3 DETAILED PARAGRAPHS PER SECTION.**
- **INJECT CONCRETE EXAMPLES / MATH.**
- **INJECT SPECIFIC TOOLS.**
- **ZERO CITATIONS.**
- **TONE:** Senior Operating Partner.

## Affected Files
1. `data-readiness-for-ai.json`
2. `business-services.json`
3. `distribution.json`
4. `healthcare-services.json`
5. `industrial-services.json`
6. `insurance-services.json`
7. `manufacturing.json`
8. `multi-site-services.json`
9. `staffing-human-capital-services.json`
10. `tech-enabled-services.json`
11. `vertical-saas.json`
12. `marketing-efficiency-improvement.json`

## Implementation Strategy
- Use `subagent-driven-development` to delegate the rewrite of each file.
- Each subagent will be primed with the "Senior Operating Partner" persona.
- Each subagent will research/synthesize content that meets the 5x3 rule, including math and tools.
- Each subagent will ensure the JSON structure is preserved and citations are removed.

## Success Criteria
- All 12 files updated.
- Each file has exactly 5 sections.
- Each section has exactly 3 paragraphs.
- Content is dense, practical, and includes specific tools and math.
- Tone is institutional and professional.
