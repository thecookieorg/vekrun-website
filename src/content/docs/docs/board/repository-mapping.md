---
title: Repository mapping
description: Tell the Board which repository a ticket belongs to, and where its worktrees go.
sidebar:
  order: 2
---

Verified on macOS only.

## The repository registry

The Board keeps a registry of repositories you work in. Each entry has a location on disk, a branch-name template used when work starts on a ticket, and a worktree location.

## Associating tickets

A ticket is associated with a repository so Start Work knows where to branch. With the Local source the association is set on the ticket. Once live providers exist, mappings between a provider project and a repository will do this automatically, with manual override.

## Git

Repository operations run through your installed `git` for commits, pushes, fetches and worktrees, so hooks and credential helpers apply; reads use a Rust Git library. The Git view shows status, staging, diffs and commits.
