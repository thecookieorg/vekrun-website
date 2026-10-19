---
title: Installation
description: There are no public builds yet. Here is what that means and how to build Vekrun from source.
sidebar:
  order: 1
---

:::note[Planned]
Signed installers for macOS, Windows and Linux are not built yet. The [download page](/download/) lists releases only when they exist. See the [roadmap](/roadmap/).
:::

## Building from source

The source repository is not yet public. Once it is, these are the supported steps, taken from the project README.

You need:

- Rust stable, installed through [rustup](https://rustup.rs).
- Node 22 or newer and pnpm 12.
- The [Tauri 2 prerequisites](https://tauri.app/start/prerequisites/) for your operating system.

```bash
pnpm install
cargo test --workspace --exclude vekrun-desktop   # also generates the TypeScript bindings
pnpm -r typecheck && pnpm -r lint && pnpm -r test
pnpm dev                                          # launches the desktop app
```

Run the `cargo test` step once before `pnpm dev`; it generates files the desktop app needs.

## Platforms

macOS, Windows and Linux are all targets. Only macOS has been used by hand so far. Windows and Linux builds compile and pass their tests in continuous integration, which is not the same as someone having used the application there.

Contributors will find the full checks and the merge gate under [Contributing](/docs/advanced/contributing/).
