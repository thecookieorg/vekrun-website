---
title: Permissions
description: Review what agents and tools are allowed to do.
sidebar:
  order: 4
---

Vekrun denies everything an agent or tool has not been explicitly allowed, and keeps a record of each decision.

## Today

- Commands are approved one at a time. There is no auto-approve.
- File writes are approved as diffs.
- The session mode sets the ceiling: Ask reads, Build proposes, Debug may run approved commands, Review reports.
- A delegated task can never exceed the permissions or budget of the task that created it.
- Before a command runs, Vekrun reports what isolation your machine can provide.

## The audit record

Every allowed and denied action is written to a record you can read, in order, with what asked and why it was decided.

:::note[Planned]
Named permission profiles, operating-system sandboxing for tools, and per-server permissions for MCP servers are planned. See the [roadmap](/roadmap/).
:::

Details for the curious are in [AI coding: Permissions](/docs/ai-coding/permissions/).
