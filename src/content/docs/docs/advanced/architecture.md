---
title: Architecture
description: Nine Rust components, one shared contracts crate, the invariants they keep, and the four deployment modes.
sidebar:
  order: 1
---

Vekrun is Rust-first. Rust owns durable state transitions, process lifetimes, filesystem changes, authorisation, scheduling, tool execution, resource tracking, recovery and agent logic. React and TypeScript own presentation. They talk through a versioned IPC contract whose TypeScript types are generated from the Rust definitions.

## Components

| Component | Crate | Owns |
|---|---|---|
| Desktop | `apps/desktop` | window lifecycle, UI, command palette, settings screens, notifications |
| Core | `crates/vekrun-core` | project and workspace, PTY, files, Git, search, credentials, policy engine, settings, SQLite |
| Control plane | `crates/vekrun-control-plane` | task and team records, queues, state machine, leases, approvals, scheduling, worker registry, event journal, budgets, audit |
| Agent runtime | `crates/vekrun-agent-runtime` | model and tool loop, instructions, scoped memory, context, planning, delegation, typed I/O, retries, cancellation |
| Orchestrator | `crates/vekrun-orchestrator` | task DAG execution, manager and worker hierarchy, integration, independent verification |
| Worker | `crates/vekrun-worker` | local or remote execution, heartbeat, claiming, sandbox integration, reporting, limits, recovery |
| Provider gateway | `crates/vekrun-provider-gateway` | model capabilities, routing, streaming adapters, quotas, cost, fallbacks |
| Agent API | `crates/vekrun-agent-api` | service registration, authenticated invocation, deployment lifecycle |
| Extension host | `crates/vekrun-extension-host` | permissions, UI contributions, tools, workflows, connectors, MCP |

`crates/vekrun-types` holds the shared contracts; `crates/vekrun-cli` is the headless entry point. Each crate's `lib.rs` states what it implements today and what it does not. There are no placeholder APIs.

## Invariants

1. **One authoritative state machine owns each task.** Workers execute leased work and report events; the control plane resolves state. The legal transitions are a single table, and every change is a journal row in the same transaction.
2. **Leases limit duplicate execution; nothing is replayed blindly.** A lost lease returns the task to the queue. Non-idempotent shell actions are reconciled under a documented per-tool policy, never re-run on faith.
3. **Rust decides; the UI renders.** No authorisation, scheduling, state transition or filesystem change originates in TypeScript.
4. **Deny is the default.** Every side-effecting path goes through the policy engine and writes an audit event to a journal that rejects updates and deletes at the database level.
5. **Secrets never cross into the webview** or into tools by default.
6. **The terminal path has no AI on it.** Opening a shell never depends on a model, a network or a daemon.

## Deployment modes

| Mode | Runs | Jobs survive window close? |
|---|---|---|
| Desktop-only terminal | desktop and core in one process | no AI jobs exist |
| Desktop plus local worker | desktop and a local Rust daemon | yes, in the daemon |
| Desktop managing remote workers | desktop plus a control plane and worker on a host you control | yes, on the remote host |
| Headless | CLI and daemon, no desktop | yes |

Only the first mode exists in full today. The daemon behind the second and fourth, and the remote workers of the third, are milestone 8 (see [Progress](/docs/advanced/progress/)). Basic single-agent use never requires a remote service, and Vekrun never claims execution on a powered-off machine.

## Data

SQLite, one file per control-plane instance, WAL on, migrations composed from each crate's ordered list. Settings are layered: built-in, global, project. Credentials live in the operating-system keychain, never in SQLite.

## Decisions

Architectural decisions are recorded as ADRs in `docs/adr/`: Rust-first; one state machine per task; SQLite with append-only migrations; a deny-by-default policy engine; TypeScript bindings generated from Rust. Propose a new one with a pull request adding a numbered ADR marked "proposed".
