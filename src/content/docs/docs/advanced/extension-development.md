---
title: Extension development
description: The planned extension interfaces and the sandboxing rules they will live under.
sidebar:
  order: 6
---

:::caution[Not built yet]
The extension host, SDK and community index are milestone 10 and have not started. There is nothing to build against yet. This page describes design intent. See the [roadmap](/roadmap/).
:::

## Intent

- Extensions can add provider adapters, context sources, tools, commands, themes, panels, workflow templates and language features.
- Each has a versioned manifest with declared capabilities, reviewed at install; enable, disable, update and remove; a local development kit; import; and a public community index format.
- The threat model points at a WebAssembly component host with capability-scoped imports. If the chosen runtime cannot sandbox adequately, the capability set is restricted and the restriction documented.
- An extension cannot exceed its declared capabilities (to be tested), and no extension can bypass the central policy engine.
- MCP servers are user-configured and go through the same policy engine; MCP does not replace native orchestration.
