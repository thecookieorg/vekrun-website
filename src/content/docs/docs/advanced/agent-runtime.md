---
title: Agent runtime
description: The model and tool loop, modes as policy profiles, context, memory and egress, as implemented.
sidebar:
  order: 3
---

The runtime is Vekrun's own Rust loop; it does not depend on any other agent product. The same loop runs in the desktop app and from the CLI (`vekrun agent run`; exact flags unverified on this site, use `--help` from your build).

## The loop

Model call, tool proposals, policy decisions, tool execution, evidence back into the timeline. Every tool action goes through the policy engine and leaves an audit event. Cancellation stops the loop and the subprocesses it started. Structured outputs are validated against schemas, which is how Plan mode produces a typed `PlanRevision`.

## Modes as policy profiles

Ask, Plan, Build, Debug and Review are policy profiles, not personalities: the model is the same, the authority differs. Ask cannot write (tested). Build shows every write as a diff and applies it only after approval, with checkpoints and rollback. Debug adds approved command execution. Review reads a change set and reports. A Custom profile with its own role, tools and permissions is specified but not yet exposed.

## Context

On open, project discovery reads marker files, a language census, instruction files and Git status into the system prompt, all as data. The context inspector shows exactly what each turn sent. The `read_terminal` tool reads a Rust-side terminal model rather than scraping the renderer. The **egress preview** shows what is about to leave the machine before the first contact with a hosted provider in a session, including the framed ticket content when work starts from the Board, and requires an explicit Send.

## Memory

Six scopes: user, project, team, agent, task and council session. Access is enforced per scope through a memory-access capability; every memory records provenance; retention is configurable; memories enter the prompt as data. Recall and remember are tools; the Memory panel edits and deletes.

## Plans, councils and teams

Approved plan revisions are materialised into Factory tasks with intrinsic traceability. Council orchestration runs an isolated first round, critique rounds on positions only, moderator synthesis with evidence cited only from read-only tool ledgers, enforced member, round, budget and timeout limits, and ends with the user's decision (defaults: three members, two rounds, visible estimate). Delegation never widens authority; see [Rust internals](/docs/advanced/rust-internals/).

## Not yet built

Durable background execution, remote workers, scheduling, user-defined agent services and their APIs, and the extension host. See [Progress](/docs/advanced/progress/).
