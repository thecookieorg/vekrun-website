---
title: Agent modes
description: Ask, Plan, Build, Debug and Review are permission profiles, not personalities.
sidebar:
  order: 2
---

Verified on macOS only.

Each mode is a policy profile that decides which tools the agent may use and what needs your approval. The model is the same; the authority differs.

| Mode | What it may do |
|---|---|
| Ask | Read-only. It can search and read permitted files and explain terminal output. It cannot write; that is tested. |
| Plan | Investigates the repository and produces a structured plan revision for you to review, edit and approve. |
| Build | Proposes changes. Every write is shown as a diff and applied only after approval. |
| Debug | Build plus the ability to run approved commands and tests to reproduce a failure. |
| Review | Reads a change set and reports findings; it does not edit. |

A Custom mode with your own role, tools and permissions is specified but not yet exposed.

## What a session shows you

- A streamed timeline of model output and every tool action actually taken, with evidence. Vekrun does not show fabricated reasoning.
- A context inspector showing exactly which files, snippets and terminal output were sent to the provider.
- Approvals inline. Cancelling stops the loop and the subprocesses it started.
- Checkpoints before writes, with rollback.

## Sessions

Conversations persist. You can resume one by replay, fork it, search sessions by content and export to Markdown. Switching provider mid-session is allowed, with the context limitations stated.

## Project understanding

On open, Vekrun discovers marker files, languages, package managers and instruction files, reads Git status, and builds a system prompt from them. Repository text, including instruction files, is treated as data: it cannot override the policy engine.

## Headless

The same agent loop runs from the CLI as `vekrun agent run` (exact flags unverified on this site); see [CLI](/docs/advanced/cli/).
