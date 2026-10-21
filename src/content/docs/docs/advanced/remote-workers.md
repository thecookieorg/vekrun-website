---
title: Remote workers and self-hosting
description: Run agent tasks on machines you control. No hosted service is required.
sidebar:
  order: 5
---

:::note[Planned]
The durable background daemon, remote workers and the remote control plane are not built yet. This page describes the design. See the [roadmap](/roadmap/).
:::

## Three different things

- A **remote terminal** is an SSH shell on another machine. That exists today; see [SSH](/docs/terminal/ssh/).
- A **remote worker** executes leased agent tasks on a machine you choose.
- A **deployed agent API** is a user-defined service running on a host; see [APIs](/docs/advanced/apis/).

## Design for workers

- The default transport is an SSH port-forward to a worker bound to localhost on the remote host. TLS with a pinned certificate is opt-in.
- Workers register with authentication, hold task leases, send heartbeats, stream logs, report resource metrics and support cancellation.
- After a disconnect a worker reconnects and reconciles task status with the control plane. A lost lease never replays a non-idempotent shell action; reconciliation uses idempotency tokens under a documented per-tool policy.
- Credentials for a remote host are separate from provider keys and from other workers.
- Workers are opt-in, user-level processes (a launchd agent, a systemd user unit or a per-user task), never boot-time or privileged by default. The install is optional for terminal users and needed only for tasks meant to outlive the desktop window.

## Self-hosting

The control plane is a Rust service owning queues, transactional state transitions, leases, the worker registry, approvals, policy, the event journal, identities, budgets and audit, with SQLite as its store. The local API binds privately by default; exposure beyond the machine needs explicit configuration, authentication and TLS. Kubernetes is not required. Every mode states what survives window close, sleep, reboot and network loss; see the deployment modes in [Architecture](/docs/advanced/architecture/).
