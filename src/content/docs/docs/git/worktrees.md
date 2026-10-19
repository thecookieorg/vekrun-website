---
title: Worktrees
description: Parallel work gets parallel folders, so nothing collides.
sidebar:
  order: 2
---

A worktree is a second checkout of your repository in its own folder. Vekrun uses them so that a ticket, an agent or a team can work without disturbing what you have open.

## Where they come from

- **Start Work** on a ticket creates a worktree for it and opens a terminal there.
- Every AI Team task gets its own worktree by default.
- You can add one yourself in the Git view, on a new or an existing branch.

## Managing them

The Git view lists worktrees with their branch and path. Open a terminal in one, or remove it; removal asks for confirmation and names any uncommitted changes that would be lost.

The branch-name template and the folder worktrees go in are configurable per repository.

A worktree keeps changes apart. It is not a security boundary; permissions are handled separately, see [Permissions](/docs/ai-coding/permissions/).
