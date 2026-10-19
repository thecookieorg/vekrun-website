---
title: Installation
description: There are no public builds of Vekrun yet. This page explains what that means and how to build from source.
sidebar:
  order: 1
---

:::caution[No public builds yet]
Vekrun has no installers, packages or signed binaries. The [download page](/download/) shows releases only when they exist. Signed installers for macOS, Windows and Linux are milestone 12 on the [roadmap](/roadmap/).
:::

## Building from source

The source repository is not yet public. Once it is, the steps below are the supported way to run Vekrun. They are taken from the project's README and are the same commands continuous integration runs.

Prerequisites:

- Rust stable, installed through [rustup](https://rustup.rs).
- Node 22 or newer.
- pnpm 12.
- The [Tauri 2 prerequisites](https://tauri.app/start/prerequisites/) for your operating system.

```bash
pnpm install
cargo test --workspace --exclude vekrun-desktop   # Rust crates; also generates TypeScript bindings
pnpm -r typecheck && pnpm -r lint && pnpm -r test
pnpm dev                                          # launches the desktop app via `tauri dev`
cargo run -p vekrun-cli -- version                # the headless CLI
```

The first `cargo test` run generates the TypeScript bindings the desktop app imports, so run it before `pnpm dev`.

## Platforms

macOS, Windows and Linux are all targets. Only macOS has been run by hand. The CI matrix is the source of truth for the other two; a green Windows or Linux job means the code compiles and its tests pass there, not that someone has used the application on that platform.

Full details, including the merge gate, are in [Build from source](/docs/contributing/build-from-source/).
