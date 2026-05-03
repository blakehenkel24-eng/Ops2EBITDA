---
name: ops2ebitda-root-cause-hypothesis-builder
description: Use when diagnosing performance gaps or KPI movement by creating specific, testable root cause hypotheses and validation steps.
---

# Root Cause Hypothesis Builder

## Purpose

Use this skill to diagnose operating performance issues by generating specific, testable root cause hypotheses.

This skill should prevent shallow diagnosis.

Bad diagnosis:
“Margins are down because costs increased.”

Good diagnosis:
“Margins may be down because freight surcharge recovery lagged input cost inflation in two customer segments; validate by comparing invoice-level surcharge capture by customer and shipment date.”

## When to Use

Use this skill for:

- Gross margin decline
- Revenue miss
- Pipeline weakness
- Churn increase
- DSO deterioration
- Procurement savings slippage
- Labor productivity decline
- Forecast misses
- Integration delays
- Customer satisfaction decline

## Inputs Needed

Ask for or infer:

- Metric or issue
- Magnitude of change
- Time period
- Business segment
- Management explanation
- Available data
- Target / baseline
- Known operating changes

## Output Structure

### Executive Diagnostic

Briefly state the likely issue and what must be proven.

### Hypothesis Table

| Hypothesis | Driver Logic | Data Needed | Validation Method | Priority | Confidence |
|---|---|---|---|---|---|

### Next 3 Analyses

List the highest-value analyses to run next.

### Management Questions

List targeted questions to ask.

## Hypothesis Rules

Good hypotheses are:

- Specific
- Testable
- Linked to data
- Linked to operating drivers
- Prioritized
- Caveated

Bad hypotheses are:

- Generic
- Not measurable
- Just restating the symptom
- Based only on management narrative
- Too broad to test

## Common Driver Categories

Revenue:
- Volume
- Price
- Mix
- Conversion
- Retention
- Sales capacity
- Market demand

Margin:
- Price realization
- Discounting
- Input cost
- Freight
- Labor
- Mix
- Scrap / rework
- Vendor terms

Cash:
- Billing accuracy
- Collections discipline
- Customer disputes
- Inventory planning
- Supplier terms
- Payment timing

## Example Prompt

Use the Root Cause Hypothesis Builder skill. Gross margin declined 220 bps in Q2. Management says it is “mix and freight.” Build hypotheses, data needed, validation methods, and management questions.

## Quality Checklist

- Are hypotheses testable?
- Is each hypothesis tied to data?
- Are priorities clear?
- Did the output avoid just repeating management’s explanation?
- Are next analyses practical?
