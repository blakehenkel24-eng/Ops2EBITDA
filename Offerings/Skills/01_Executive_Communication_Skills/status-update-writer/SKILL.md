---
name: ops2ebitda-status-update-writer
description: Use when creating RAG status updates for initiatives, workstreams, PMO trackers, board updates, or management reviews.
---

# Status Update Writer

## Purpose

Use this skill to create clear status updates for PE operating initiatives and value creation workstreams.

A good status update should make it obvious:

- Whether the work is on track
- What changed
- What is blocking progress
- What decision or support is needed
- What will happen next

## When to Use

Use this skill for:

- Weekly PMO updates
- Board workstream updates
- Value creation initiative tracking
- Monthly operating reviews
- Steering committee updates
- Recovery plan updates
- Functional workstream status

## Inputs Needed

Ask for or infer:

- Workstream / initiative name
- Current status
- Progress since last update
- KPI / milestone target
- Risks or blockers
- Owner
- Next actions
- Due dates
- Decisions needed

## Output Structure

### Status Summary

**Status:** Green / Amber / Red  
**Headline:** One sentence.

### Update Table

| Field | Detail |
|---|---|
| Progress since last update |  |
| Current risk / blocker |  |
| KPI or milestone impact |  |
| Next action |  |
| Owner |  |
| Timing |  |
| Decision needed |  |

### Executive Language

Provide 2-4 bullets suitable for a board or steering committee update.

## RAG Rules

- **Green:** Milestones met, value tracking intact, no material blocker.
- **Amber:** Slippage, dependency, incomplete validation, or moderate risk.
- **Red:** Missed milestone, value at risk, no clear recovery path, or blocked decision.

## Status Language Rules

Avoid:
- “On track” without evidence
- “In progress” as a complete update
- “Working through details”
- “Pending alignment”
- “No major issues” without context

Prefer:
- “Milestone X completed; Y remains blocked by Z.”
- “Run-rate savings validation slipped one week due to missing vendor baseline.”
- “Decision needed by Friday to avoid delaying launch.”

## Example Prompt

Use the Status Update Writer skill. Turn these notes into a RAG status update with progress, risks, owner, next action, and decision needed:

[paste notes]

## Quality Checklist

- Is status justified by evidence?
- Is the blocker specific?
- Is next action clear?
- Is owner included?
- Is timing included?
- Is value or KPI impact visible?
