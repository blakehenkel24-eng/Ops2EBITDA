---
name: ops2ebitda-data-request-builder
description: Use when creating specific data request lists needed to validate hypotheses, conduct operating analysis, or prepare diligence.
---

# Data Request Builder

## Purpose

Use this skill to convert a business question or operating hypothesis into a clear data request list.

The output should be specific enough to send to a CFO, FP&A lead, sales ops lead, procurement lead, or data team.

## When to Use

Use this skill for:

- Root cause analysis
- Diligence
- KPI diagnostics
- Pricing analysis
- Procurement analysis
- Working capital analysis
- Sales productivity analysis
- Retention analysis
- Dashboard buildout
- VCP validation

## Inputs Needed

Ask for or infer:

- Business question
- Hypotheses to test
- Analysis objective
- Required time period
- Granularity
- Relevant segments
- Source systems
- Urgency

## Output Structure

| Data Request | Purpose | Fields Needed | Granularity | Time Period | Source System | Owner | Priority |
|---|---|---|---|---|---|---|---|

## Field-Level Detail

For each request, specify fields where useful.

Example for pricing:
- Invoice ID
- Invoice date
- Customer ID
- SKU
- List price
- Gross price
- Discount
- Rebate
- Freight
- Net revenue
- COGS
- Sales rep
- Region

## Priority Levels

- **P1:** Required to answer the core question
- **P2:** Useful to explain variance
- **P3:** Nice-to-have for deeper segmentation

## Data Request Rules

- Be specific.
- Avoid asking for “all data.”
- State why each dataset is needed.
- Identify ideal granularity.
- Include time period.
- Include source system when likely.
- Flag if data quality may be an issue.

## Example Prompt

Use the Data Request Builder skill. I need to diagnose why DSO increased by 9 days. Build a data request list with fields, granularity, time period, source system, owner, and priority.

## Quality Checklist

- Is each request tied to an analysis objective?
- Are fields specific?
- Is granularity clear?
- Is the time period clear?
- Are priorities assigned?
- Could this be sent to a data owner?
