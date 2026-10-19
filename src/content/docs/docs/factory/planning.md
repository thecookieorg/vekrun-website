---
title: Planning
description: Plan mode produces a structured, editable plan that becomes Factory tasks with traceability.
sidebar:
  order: 2
---

Verified on macOS only.

## Generating a plan

In Plan mode the agent investigates the repository and produces a **plan revision** as structured output, validated against a schema. The plan card shows requirements, proposed architecture, milestones, tasks with dependencies, risks and acceptance criteria.

## Review and approval

You review the revision and approve it; approval is audited. Revisions are versioned, so a later plan can be compared with an earlier one.

:::note[Partially built]
Editing a plan in place before approval is specified but not yet implemented; today you ask for a new revision. Planning roles for product, architecture, security, implementation and QA are the vocabulary of the design and not yet selectable.
:::

## From plan to tasks

An approved plan is materialised into Factory tasks that carry the dependency graph and a reference back to the plan revision. Traceability is intrinsic: a task knows which plan item it implements, and a delivered change can be traced to the approved revision after independent verification.

A ticket from the [Board](/docs/board/start-work/) can start a plan with the ticket reference attached, so the chain is ticket → plan → tasks → verified change.

## Synchronisation

:::note[Planned]
Pushing plans and task status to Linear, Jira or Asana uses the milestone 10 synchronisation ledger. Automated planning triggers and recurring planning workflows are milestone 9. See the [roadmap](/roadmap/).
:::
