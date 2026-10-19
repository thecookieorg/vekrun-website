---
title: Self-hosting
description: Vekrun's control plane and workers run on machines you control. Nothing requires a Vekrun-hosted service.
sidebar:
  order: 1
---

:::caution[Not built yet]
The durable background daemon, remote control plane and worker distributions are milestone 8 and have not started. This page describes design intent. See the [roadmap](/roadmap/).
:::

## Deployment modes

| Mode | Runs | Jobs survive window close? |
|---|---|---|
| Desktop-only terminal | desktop and core in one process | no AI jobs exist |
| Desktop plus local worker | desktop and a local Rust daemon | yes, in the daemon |
| Desktop managing remote workers | desktop plus a control plane and worker on a host you control | yes, on the remote host |
| Headless | CLI and daemon, no desktop | yes |

Basic local single-agent use never requires a remote service. Vekrun never claims execution on a powered-off machine.

## Intent

- The control plane is a Rust service owning queues, transactional state transitions, leases, worker registry, approvals, policy, the event journal, identities, budgets and audit. SQLite is the store; a different persistence mode may be designed for remote deployment if measured limits demand it, without creating a mandatory cloud dependency.
- Workers are opt-in, user-level processes (a launchd agent, a systemd user unit or a per-user task), never boot-time or privileged by default.
- The local API binds privately by default. Exposure beyond the machine requires explicit configuration, authentication and TLS.
- Kubernetes is not required.
