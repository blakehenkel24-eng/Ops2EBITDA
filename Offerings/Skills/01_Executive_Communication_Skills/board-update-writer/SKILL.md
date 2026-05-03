---
name: ops2ebitda-board-update-writer
description: Use when converting raw operating notes, KPI commentary, initiative status, or management updates into PE board-ready update language.
---

# Board Update Writer

## Purpose

Use this skill to convert rough operating notes into concise board-ready language for private equity-backed companies.

The output should help a board understand:

- What changed
- Why it matters
- Whether the workstream is on track
- What management is doing
- What risks need attention
- What decisions are needed

## When to Use

Use this skill for:

- Board pack sections
- Monthly operating review updates
- Workstream status updates
- Initiative progress summaries
- Risk and mitigation summaries
- CEO / CFO update drafts
- Partner-ready portfolio company commentary

## Inputs Needed

Ask for or infer:

- Company / workstream context
- KPI movement
- Prior target or baseline
- Current status
- Management explanation
- Actions underway
- Owner
- Timing
- Risks / blockers
- Decisions needed

If the input is incomplete, proceed with caveats and list missing inputs.

## Output Structure

Use this format unless the user requests otherwise:

### Executive Takeaway

One to three bullets. State the answer first.

### Board-Ready Update

| Area | Update |
|---|---|
| Status | Green / Amber / Red |
| What changed | Specific movement, milestone, or issue |
| Why it matters | Operating and financial implication |
| Action underway | Owner + action + timing |
| Risks / blockers | Specific risks or unresolved issues |
| Decision needed | Board / sponsor / management decision, if any |

### Suggested Board Language

Draft a concise paragraph or bullet set that can be pasted into a board deck.

### Open Questions

List questions that should be resolved before finalizing.

## RAG Status Guidance

Use evidence-based status:

- **Green:** On track, evidence supports progress, no material intervention needed.
- **Amber:** Some risk, dependency, slippage, incomplete evidence, or partial underperformance.
- **Red:** Off track, value at risk, missed milestone, unclear owner, weak recovery plan, or material performance issue.

Do not mark something Green just because management says it is on track.

## Writing Rules

- Lead with the answer.
- Avoid generic “progress continues” language.
- Do not bury the risk.
- Use numbers when available.
- Make the “so what” explicit.
- Flag weak management explanations.
- Avoid dramatic language.
- Avoid unsupported EBITDA claims.

## Example Prompt

Use the Board Update Writer skill. Turn these rough notes into a board-ready update with RAG status, what changed, why it matters, action underway, risks, and decisions needed:

[paste notes]

## Quality Checklist

Before finalizing, verify:

- Is the status justified?
- Is the implication clear?
- Is the action specific?
- Is the owner named or implied?
- Is the risk stated plainly?
- Are assumptions visible?
- Could this be pasted into a board update with limited editing?
