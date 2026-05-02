# PE Ops Learning OS

A static, curated learning platform for private equity operations, value creation, industry intelligence, KPI study, and operating-partner playbooks.

## V1 Scope

- Static content rendered from JSON under `content/`
- PE fundamentals, value creation playbooks, industry profiles, project playbooks, and KPI library
- Search, visual diagrams, cross-links, and a Phase 2 Ask / Study Mode placeholder
- No auth, database, ingestion UI, embeddings, RAG, or LLM calls

## Source Posture

V1 uses original synthesized content informed by the local vault and PE research notes. It does not reproduce copyrighted books or proprietary/paywalled materials.

Primary local references:

- `../../wiki/private-equity`
- `../../wiki/research/private-equity`

## Commands

```bash
npm install
npm run content:generate
npm run lint
npm run typecheck
npm run build
```
