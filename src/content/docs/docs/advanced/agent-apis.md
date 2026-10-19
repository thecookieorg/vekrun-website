---
title: Agent APIs
description: Define, deploy and call your own agents through versioned, authenticated interfaces.
sidebar:
  order: 4
---

:::caution[Not built yet]
User-defined agent services and their APIs are milestone 8 and have not started. This page describes design intent. See the [roadmap](/roadmap/).
:::

## Intent

- An agent definition has a name, purpose, version, typed input and output, capabilities, models, tools, inherited policies, memory scope, event subscriptions and a lifecycle status.
- Services register and are discoverable by capability; authorised agent-to-agent calls are allowed.
- The API is versioned and authenticated: invoke, status, results, event subscription, cancel, health and readiness, start, stop, update and rollback.
- Local binding is private by default; external exposure needs explicit configuration, authentication, TLS and network safeguards.
- Correlation IDs, execution traces, provenance of outputs and evidence, searchable local logs and optional signed audit receipts. No mandatory telemetry.

A Vekrun MCP server exposing approved functionality to external MCP clients is part of the same milestone group; see [MCP](/docs/advanced/mcp/).
