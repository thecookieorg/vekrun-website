---
title: Coding sessions
description: Ask, Plan, Build, Debug and Review, and what you see while an agent works.
sidebar:
  order: 2
---

A coding session is a conversation with an agent that can read your project, propose changes and run what you allow. The mode sets what it may do.

| Mode | What it may do |
|---|---|
| Ask | Read and explain. It cannot change files. |
| Plan | Investigate and propose a plan for you to approve. |
| Build | Propose code changes, shown as diffs you approve one by one. |
| Debug | Build, plus running approved commands and tests to reproduce a problem. |
| Review | Read a change and report findings. It does not edit. |

## What you see

- A live timeline of what the agent says and every action it actually took.
- The exact files, snippets and terminal output that went to the provider, in the context inspector. There is no hidden upload.
- Every write as a diff, waiting for your approval, with a checkpoint so you can roll back.
- Cancel at any time; it stops the agent and anything it started.

## Before anything leaves your machine

The first time a session would send something to a hosted provider, Vekrun shows the full content and waits for you to press **Send**.

## The agent knows your project

When you open a project, Vekrun learns its languages, package managers, test setup and instruction files, and reads the Git status. Text in your repository is information to the agent, never instructions that can override your permissions.

## Memory

Agents can remember things you tell them, scoped to you, the project, a team, an agent, a task or a Council session. The Memory panel shows every memory, where it came from, and lets you edit or delete it.

## Sessions

Sessions are saved. Resume one, fork it, search past sessions by content, or export one as Markdown.
