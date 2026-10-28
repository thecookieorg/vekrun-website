---
title: Permissions
description: Nothing runs or changes without your say-so.
sidebar:
  order: 4
---

Vekrun denies by default. An agent, a tool or a terminal feature gets a capability only when a rule grants it, and every decision is recorded.

## What is controlled

Reading, writing and deleting files; running commands; Git operations; network and remote connections; credentials; model requests; and later, extensions and MCP servers.

## Approval today

- Every command an agent wants to run asks you first. There is no auto-approve switch, on purpose, until operating-system sandboxing is in place.
- Every write appears as a diff for you to accept or reject.
- Before running a command, Vekrun checks what isolation your machine can provide and reports it. Something that needs isolation the machine cannot give does not run.
- Your own unsaved edits are never overwritten.

## Where authority comes from

The session mode is the permission profile: Ask reads, Build proposes, Debug may run approved commands, Review reports. In the AI Factory, a delegated task can never hold more permission or budget than the task that created it.

## What cannot change the rules

Text in your repository, terminal output, tool results and the model's own replies are information. None of them can grant permission.

:::note[Planned]
Named profiles (supervised, balanced, custom), operating-system sandboxing for tools, and per-server permissions for MCP are planned. See the [roadmap](/roadmap/).
:::

See also [Settings: Permissions](/docs/settings/permissions/).
