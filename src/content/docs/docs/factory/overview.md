---
title: How the Factory runs a job
description: Delegate implementation, testing and verification to coordinated agents, on separate branches, with you in control.
sidebar:
  order: 0
---

Factory runs an approved plan with a team of agents.

## How a run works

- A manager agent breaks the plan into tasks with dependencies and hands them out.
- Worker agents implement tasks in parallel, each in its own worktree, so they never collide.
- A task that finishes goes to verification. It is never marked done on the worker's own word.
- A separate verifier checks the result against the acceptance criteria and attaches the evidence: the commands it ran and what they produced.
- A failed verification opens a bounded repair. If repairs run out, the task comes to you.
- The integrator previews the merge, shows conflicts, and waits for your approval before anything protected changes.

## What you control

- Approve the plan before anything starts.
- Approve commands and writes as you would in a single session.
- Set how deep delegation can go, how many agents run at once, and the budget. A delegated task can never hold more permission or budget than the task that created it.

## From a production issue

A monitoring issue in Insights can be delegated to Factory as a whole. The built-in incident workflow investigates, reproduces, plans, implements, tests, verifies and reviews, and stops before deployment. See [delegating to Factory](/docs/insights/delegating-to-factory/).

## Keep it light

Factory is for work worth splitting up. For a small change, a single agent is faster. Council review is never required.

:::note[Planned]
Pausing, redirecting and reassigning a running task, a live activity wall, and running agents in the background or on another machine are planned. See the [roadmap](/roadmap/).
:::
