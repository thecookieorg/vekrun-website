---
title: CLI
description: The vekrun command drives the same Rust crates as the desktop app.
sidebar:
  order: 3
---

Verified on macOS only, from a source build.

The `vekrun` CLI is built on the same crates, state machines, permission checks and task schemas as the desktop application. There is no second implementation of business logic in the interface, so what the CLI does and what the desktop does agree by construction.

## Today

From a source checkout:

```bash
cargo run -p vekrun-cli -- version
```

The project record also names `vekrun settings` (read and write the layered settings store) and `vekrun agent run` (run a single agent session headlessly). Their exact flags are unverified on this site; run the command with `--help` from your build.

## Intent

:::note[Planned]
Job create, status, cancel and resume where safe, result export, explicit exit codes, versioned APIs and authenticated service access are milestone 8. See the [roadmap](/roadmap/).
:::
