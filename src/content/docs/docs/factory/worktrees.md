---
title: Worktrees
description: Parallel work gets parallel worktrees by default.
sidebar:
  order: 6
---

Verified on macOS only.

Every Factory task and every ticket started from the Board gets its own Git worktree by default, so concurrent changes never collide in one working copy. Worktrees are created, listed and removed through your installed `git`, so hooks and credential helpers behave as they do on the command line.

A worktree is version-control isolation only. It is not a security sandbox; sandboxing is the policy engine's and the operating system's job. See [Permissions](/docs/ai/permissions/).

The branch name template and the worktree location are configurable in the repository registry; see [Repository mapping](/docs/board/repository-mapping/).
