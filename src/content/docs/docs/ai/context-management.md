---
title: Context management
description: See what goes to a provider before it goes, and control what agents remember.
sidebar:
  order: 4
---

Verified on macOS only.

## The context inspector

Every session has an inspector that lists exactly what was sent to the provider on each turn: files, snippets, terminal output, instruction files and memories. There is no hidden repository upload.

## Egress preview

Before anything leaves your machine for a hosted provider, Vekrun shows it. The first contact with a hosted provider in a session requires an explicit **Send**. The preview is the same data the provider will receive, including the framed ticket content when work starts from the [Board](/docs/board/start-work/).

## The terminal as a tool

Agents can read terminal output through a `read_terminal` tool backed by a Rust-side terminal model, not by scraping the renderer. Terminal output reaches the model as data, not instructions.

## Scoped memory

Memories have six scopes: user, project, team, agent, task and council session. Access is enforced per scope, every memory records where it came from, and retention is configurable. Agents recall and remember through tools gated by a memory-access capability, and memories enter the prompt as data. A Memory panel lets you read, edit and delete them.

## Deleting data

Removing a provider deletes its key. Deleting a project's memories and indexes is a stated release gate (demonstration 10 in the plan); the memory part exists today, the index part arrives with the indexer in milestone 5.

:::note[Planned]
Incremental indexing, full-text and symbol search without a provider, and an optional downloadable embedding model with its licence shown are milestone 5. See the [roadmap](/roadmap/).
:::
