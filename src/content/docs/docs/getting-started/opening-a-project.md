---
title: Opening a project
description: One open project drives the terminal, the editor, the agents and the Board.
sidebar:
  order: 4
---

Vekrun works on one project at a time. Pick it from the project picker in the top bar; Vekrun remembers the choice across restarts.

## What the project affects

- **Shells** start in the project folder.
- **Code** shows the project's files, hiding anything your Git ignore rules exclude, plus folders like `node_modules` and build output.
- **Agents** learn the project's languages, package managers and instruction files, and see its Git status, before you ask the first question.
- **Git** shows the project's branches, worktrees and changes.
- **Board** can link a ticket to this repository so Start Work knows where to branch.

## Git repositories

A project that is a Git repository gets the full set of Git features. A plain folder still works for the terminal, the editor and single-agent coding.

## Switching projects

Switch with the project picker at any time. Running shells keep running; new ones start in the new project.
