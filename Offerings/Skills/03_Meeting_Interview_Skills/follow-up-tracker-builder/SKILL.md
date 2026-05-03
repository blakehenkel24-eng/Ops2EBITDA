---
name: ops2ebitda-follow-up-tracker-builder
description: Use when converting meeting notes, calls, workstream updates, or diligence conversations into action trackers with owners and due dates.
---

# Follow-Up Tracker Builder

## Purpose

Use this skill to convert messy notes into a clean follow-up tracker.

The goal is to create accountability after meetings.

## When to Use

Use this skill after:

- Management meetings
- Workstream check-ins
- Board prep
- Diligence calls
- PMO meetings
- Integration standups
- Functional interviews

## Inputs Needed

Ask for or infer:

- Meeting notes
- Attendees
- Decisions made
- Open questions
- Actions discussed
- Owners
- Timing
- Dependencies

If owners or dates are missing, flag them.

## Output Structure

### Decisions Made

| Decision | Owner / Approver | Notes |
|---|---|---|

### Action Tracker

| Action | Owner | Due Date | Dependency | Status | Notes |
|---|---|---|---|---|---|

### Open Questions

| Question | Owner | Needed By | Why It Matters |
|---|---|---|---|

### Risks / Blockers

| Risk / Blocker | Impact | Owner | Mitigation |
|---|---|---|---|

## Rules

- Do not bury actions in prose.
- Assign owner as “TBD” if not provided.
- Assign due date as “TBD” if not provided.
- Separate decisions from actions.
- Separate open questions from blockers.
- Make actions start with verbs.

## Example Prompt

Use the Follow-Up Tracker Builder skill. Convert these meeting notes into decisions, actions, open questions, risks, owners, and due dates:

[paste notes]

## Quality Checklist

- Are all actions captured?
- Does each action have an owner?
- Are missing owners/dates flagged?
- Are decisions separated from actions?
- Are blockers explicit?
