# Skill Installation Guide

## What This Is

This package contains uploadable `SKILL.md` files. Each skill is designed as a standalone instruction file that can be added to an AI assistant, Claude-style skill system, coding agent, project folder, or custom workspace.

## Recommended Installation Pattern

### Option 1: Upload Individual Skills

Use this when you want a narrow behavior.

Example:
- Upload `Board Update Writer/SKILL.md` when preparing board materials.
- Upload `Root Cause Hypothesis Builder/SKILL.md` when diagnosing KPI movement.
- Upload `Executive Readiness Reviewer/SKILL.md` before sending work upward.

### Option 2: Upload a Full Package

Use this when your workspace supports multiple skills.

Example:
- Upload all skills in `Executive Communication Skills` for board and executive writing.
- Upload all skills in `Operating Diagnostic Skills` for root cause analysis.
- Upload all skills in `Work Product Quality Control Skills` for review workflows.

### Option 3: Add COMMON_SKILL.md

Use `COMMON_SKILL.md` as a shared baseline if your AI tool allows common context files.

## How to Invoke a Skill

Ask directly:

- “Use the Board Update Writer skill…”
- “Use the Root Cause Hypothesis Builder skill…”
- “Use the Executive Readiness Reviewer skill…”
- “Use the Recommendation Sharpener skill…”

## Recommended Prompt Pattern

Use:

“Use the [skill name] skill. Context: [brief context]. Objective: [what you need]. Input: [paste notes/data/draft]. Output format: [if specific].”

## Quality Control

Always check:

- Did the output invent facts?
- Did it separate fact from assumption?
- Did it connect to KPI, EBITDA, cash, or value logic where relevant?
- Did it identify missing data?
- Is the recommendation actionable?
- Is the tone appropriate for PE operating work?

## Important Caveat

These skills improve structure and output quality. They do not replace judgment, source validation, or financial review.
