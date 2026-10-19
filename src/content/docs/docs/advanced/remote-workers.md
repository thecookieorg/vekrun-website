---
title: Remote workers
description: First-party Rust workers on your own machines, reached over SSH by default.
sidebar:
  order: 2
---

:::caution[Not built yet]
Remote workers are milestone 8. This page describes design intent. See the [roadmap](/roadmap/).
:::

## Three different things

- A **remote terminal** is an SSH shell on another machine. That exists today; see [SSH](/docs/terminal/ssh/).
- A **remote worker** executes leased Factory tasks on a machine you choose.
- A **deployed agent API** is a user-defined service running on a host; see [Agent APIs](/docs/advanced/agent-apis/).

## Intent for workers

- The default transport is an SSH port-forward to a worker bound to localhost on the remote host. TLS with a pinned certificate is opt-in.
- Workers register with authentication, hold task leases, send heartbeats, stream logs, report resource metrics and support cancellation.
- After a disconnect a worker reconnects and reconciles task status with the control plane. A lost lease never replays a non-idempotent shell action; reconciliation uses idempotency tokens under a documented per-tool policy.
- Credentials for a remote host are separate from provider keys and from other workers.
- The worker install is optional for terminal users and required only for tasks meant to outlive the desktop window.
