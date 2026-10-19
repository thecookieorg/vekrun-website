---
title: Vekrun documentation
description: How to build, run and contribute to Vekrun, with honest notes on what exists today and what is still planned.
---

Vekrun is an open-source developer workspace: a terminal, AI coding agents that use the models you choose, a Factory of coordinated agent teams with independent verification, and an agent platform you can self-host. It is written Rust-first on Tauri 2.

## Project status

Vekrun is **pre-release**. There are no public binaries and no installer. The project is being built against a twelve-milestone plan; milestone 1 is implemented and milestones 2 through 7 are in progress as of 2026-10-19. See the [roadmap](/roadmap/) for the current state of every milestone.

Everything described here as working has been merged to the main branch with tests and has been run by hand on macOS only. Windows and Linux builds pass continuous integration but have not been verified by a person. The source repository is not yet public.

## How these docs mark status

Each page tells you which of these applies:

- **Verified on macOS only.** The behaviour exists on main, with tests, and has been exercised on a Mac.
- **Planned.** The page opens with a note naming the milestone. The text describes design intent, not a procedure you can follow today.
- **Unverified.** A detail (usually an exact command flag) that the project record names but this site has not confirmed.

Nothing on this site presents a planned feature as a working one. If a page contradicts the application you built from source, the application is right and the page needs a fix.

## Sections

- [Getting started](/docs/getting-started/installation/): build from source, first launch, connect a provider, use local models.
- [Terminal](/docs/terminal/shell-configuration/): shells, tabs and panes, keybindings, SSH, themes.
- [AI](/docs/ai/providers/): providers, agent modes, permissions, context management.
- [Factory](/docs/factory/agent-teams/): agent teams, planning, Council, scheduling, verification, worktrees.
- [Board](/docs/board/integrations/): ticket sources, repository mapping, Start Work, synchronisation.
- [Advanced](/docs/advanced/self-hosting/): self-hosting, remote workers, the CLI, agent APIs, MCP, extensions.
- [Contributing](/docs/contributing/build-from-source/): build, architecture, process, testing, security reporting.
