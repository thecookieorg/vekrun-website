---
title: CLI and APIs
description: The headless CLI that exists today, and the agent service APIs that are planned.
sidebar:
  order: 6
---

## The CLI today

The `vekrun` CLI is built on the same crates, state machines, permission checks and task schemas as the desktop application; there is no second implementation of business logic, so the two agree by construction. From a source checkout:

```bash
cargo run -p vekrun-cli -- version
```

The project record also names `vekrun settings` (read and write the layered settings store) and `vekrun agent run` (run one agent session headlessly). Their exact flags are unverified on this site; run them with `--help` from your build.

## Planned: jobs from the CLI

:::note[Planned]
Job create, status, cancel and resume where safe, result export, explicit exit codes, versioned APIs and authenticated service access are not built yet. See the [roadmap](/roadmap/).
:::

## Planned: agent service APIs

- An agent definition has a name, purpose, version, typed input and output, capabilities, models, tools, inherited policies, memory scope, event subscriptions and a lifecycle status.
- Services register and are discoverable by capability; authorised agent-to-agent calls are allowed.
- The API is versioned and authenticated: invoke, status, results, event subscription, cancel, health and readiness, start, stop, update and rollback.
- Local binding is private by default; external exposure needs explicit configuration, authentication, TLS and network safeguards.
- Correlation IDs, execution traces, provenance of outputs and evidence, searchable local logs and optional signed audit receipts. No mandatory telemetry.

A Vekrun MCP server exposing approved functionality to external clients is part of the same group; see [MCP](/docs/advanced/mcp/).
