---
name: ops2ebitda-driver-tree-builder
description: Use when breaking a KPI or business outcome into operating drivers, sub-drivers, data sources, owners, and actions.
---

# Driver Tree Builder

## Purpose

Use this skill to break a business outcome or KPI into its controllable operating drivers.

The goal is to help the user understand what actually moves the number.

## When to Use

Use this skill for:

- Revenue
- EBITDA
- Gross margin
- NRR / GRR
- Churn
- Pipeline coverage
- Sales productivity
- DSO / DPO / DIO
- Cash conversion cycle
- Inventory turns
- Labor productivity
- OEE
- On-time delivery
- CAC payback

## Inputs Needed

Ask for or infer:

- KPI or outcome
- Business model
- Industry context
- Available data
- Function owner
- Current issue or target

## Output Structure

### Driver Tree

Use a hierarchical structure:

- KPI / Outcome
  - Level 1 driver
    - Level 2 driver
      - Metric / data source
      - Owner
      - Potential action

### Driver Table

| Driver | Sub-Driver | Metric | Source System | Owner | Potential Action |
|---|---|---|---|---|---|

### Priority Drivers

Identify which drivers are likely most important given the context.

## Driver Tree Rules

- Separate leading and lagging indicators.
- Separate controllable and external drivers.
- Avoid overlapping branches.
- Include source systems where possible.
- Include owner roles.
- Do not overcomplicate with irrelevant branches.

## Example Prompt

Use the Driver Tree Builder skill. Build a driver tree for gross margin in a PE-backed distribution business. Include metrics, source systems, owners, and possible actions.

## Quality Checklist

- Is the tree MECE enough to be useful?
- Are drivers actionable?
- Are source systems included?
- Are owner roles clear?
- Are leading indicators identified?
- Does the tree help determine next analysis?
