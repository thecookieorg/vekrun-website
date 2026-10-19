---
title: Agent teams
description: Managers delegate, workers execute, and authority never widens on the way down.
sidebar:
  order: 1
---

Verified on macOS only. The Factory is milestone 6, in progress; the pieces below are merged.

## Roles

A Factory run has a manager and workers. The manager analyses the objective, decomposes it into tasks with dependencies, delegates, waits for its children and reports. Workers claim leased tasks and run them in their own worktrees. Specialised roles from the specification (architect, developer, debugger, tester, reviewer, verifier, security reviewer, documentation, integrator) are the vocabulary; today the manager and worker roles are implemented, with the independent verifier and integrator described under [Verification](/docs/factory/verification/).

## Invariants

- A child never holds more budget or tool authority than its parent. This is property-tested.
- Delegation depth and the number of concurrent agents are capped.
- Managers wait for their children; they never bypass permissions.
- Every task is owned by one state machine with fourteen explicit states. A task cannot start before its dependencies, and a dependency cycle is rejected.
- A task that finishes lands in **Verifying**, never in Done by its own say-so.

## Task runs

A task runs under a lease. Lost leases return the task to the queue; nothing with side effects is replayed blindly. The Factory view shows the queue and each task's state.

## The Agent Inbox

Everything waiting for a person, approvals, escalations, integration decisions, reviews and blocked tasks, appears in one prioritised list. Approvals from every session are answered there.

## Steering

:::note[Planned]
Pause, redirect and reassign, the activity wall, team tree and task DAG views, and user-defined role templates are later milestone 6 work. Vekrun will not claim an in-flight operation is transactional when it is not. See the [roadmap](/roadmap/).
:::
