---
title: Permissions
description: Deny by default, decided in Rust, recorded every time.
sidebar:
  order: 3
---

Verified on macOS only.

## The policy engine

Every side effect an agent, tool or terminal feature can cause passes through one Rust policy engine: filesystem reads, writes and deletes, shell commands, Git, remote connections, network, credentials, MCP and plugins, model egress and service deployment. A request with no matching rule is denied. Every decision writes an audit event to a journal that is append-only at the database level.

Nothing in the TypeScript interface makes an authorisation decision. Nothing in a prompt does either. The model's text, tool results, repository contents and terminal output are untrusted input.

## Profiles

The specification defines three user-approved profiles: **supervised**, **balanced** and **custom**. Today the agent modes act as policy profiles (see [Agent modes](/docs/ai/agent-modes/)); the named profile selector is milestone 11 interface work.

## Approval today

Commands require per-call approval. There is no auto-approve control, deliberately: it will not exist until operating-system-enforced sandboxes land. Before running a command, Vekrun checks what isolation the host can actually provide and reports it honestly. An operation that needs isolation the OS cannot supply fails closed.

Writes are shown as file-by-file diffs for approval, with patch-conflict detection, checkpoints and rollback. Unsaved edits you made in the meantime are never overwritten; that is tested.

## Credentials

Keys stay in the keychain and are redacted everywhere. They are not injected into tools or remote hosts, and they are separated by provider and by worker.

## Delegation

In the Factory, a child task can never hold more budget or tool authority than its parent. That invariant is property-tested. See [Agent teams](/docs/factory/agent-teams/).

:::note[Planned]
OS-level sandboxing for tools, the named permission profiles, and per-server MCP permissions are later milestones. Worktrees are version-control isolation, not a security boundary. See the [roadmap](/roadmap/).
:::
