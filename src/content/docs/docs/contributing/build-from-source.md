---
title: Build from source
description: Prerequisites, the build commands, and what a green build does and does not prove.
sidebar:
  order: 1
---

The repository is not yet public. These steps apply once it is, and are what the project runs today.

## Prerequisites

- Rust stable through [rustup](https://rustup.rs).
- Node 22 or newer and pnpm 12.
- The [Tauri 2 prerequisites](https://tauri.app/start/prerequisites/) for your platform.

## Build and run

```bash
pnpm install
cargo test --workspace --exclude vekrun-desktop   # also generates the TypeScript bindings
pnpm -r typecheck && pnpm -r lint && pnpm -r test
pnpm dev                                          # desktop app through `tauri dev`
cargo run -p vekrun-cli -- version                # headless CLI
```

The bindings in `packages/ipc/src/generated/` are produced by the Rust tests. If you change a type in `crates/vekrun-types`, commit the regenerated bindings.

## The merge gate

GitHub Actions is switched off for the repository for now, by the owner's decision on 2026-10-19. `scripts/ci.sh` mirrors the workflow step by step with per-step exit codes, and a green run on the developer's machine is the gate. Its last line names the host operating system. Windows and Linux are unverified until Actions is turned back on, and every pull-request note says so.

## Platforms

macOS, Windows and Linux are all targets at every milestone gate. Only macOS has been run by hand. Do not read a green CI job as a platform having been used.
