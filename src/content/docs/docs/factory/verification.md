---
title: Verification
description: An agent's claim is never treated as proof. A different agent verifies, with evidence.
sidebar:
  order: 5
---

Verified on macOS only. Milestone 7 is in progress; the pieces below are merged.

## Independent verifier

The agent that implemented a task does not attest to its own correctness. A separate verifier receives the original objective, the acceptance criteria, the change set and the task artifacts, and runs what applies: deterministic tests, build, type, lint and static checks, security checks and a review. It reports **passed**, **failed**, **inconclusive** or **blocked**, with the commands it ran, their output and any limitations.

A pass without evidence is refused by the contract. The verifier never receives the implementer's self-assessment as evidence.

## Bounded repair

A failed verification creates a repair task, then re-verification. Repairs are bounded; when the bound is exhausted the task escalates to you in the Agent Inbox.

## Integration

The integrator inspects verified branches, previews the merge with conflicts detected through a merge-tree, and asks for approval before touching protected project state. The chain closes only with a verified merge.

## Snapshots

Before a risky agent turn and before integration, Vekrun snapshots uncommitted state. Restore is previewed, selective and undoable, and protects edits you made in between. Database changes, remote side effects and running processes are not reversible by a snapshot, and the interface says which changes no snapshot restores.

## Still open

:::note[Planned]
The full end-to-end demonstration (a manager delegates, the verifier catches a seeded defect, a bounded repair fixes it, integration requests approval) is the milestone 7 gate and has not been recorded yet. See the [roadmap](/roadmap/).
:::
