---
title: Branches
description: Status, changes, commits and branches, through the git you already have.
sidebar:
  order: 1
---

The Git view uses your installed `git`, so your hooks, aliases and credential helpers keep working, and the command line stays fully usable alongside it.

## Changes and commits

See the status of the working copy, stage files, read diffs and commit.

## Branches

Switch branches, create a branch and switch to it, or delete one. Switching is never forced: if it would lose local changes, git refuses and Vekrun shows why. Deleting asks for confirmation and refuses an unmerged branch.

## Stashes

Stash your changes, including untracked files, and pop the newest stash.

:::note[Planned]
Push, pull and fetch with stored credentials, remote branches, and a conflict-resolution view are planned. See the [roadmap](/roadmap/).
:::
