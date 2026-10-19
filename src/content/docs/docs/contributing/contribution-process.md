---
title: Contribution process
description: How to propose and land a change once the repository is public.
sidebar:
  order: 3
---

:::note[Repository not yet public]
The desktop repository has not been published. The process below is what the project uses internally and will apply unchanged once it opens. See the [roadmap](/roadmap/) for publication timing.
:::

## What helps most right now

Vekrun is early. The most useful contributions are review of the architecture and contracts, platform testing on Windows and Linux, and issues that name a specific requirement.

## Ground rules

- Rust owns behaviour; the UI renders. A pull request that puts business logic in TypeScript will be asked to move it.
- No fake features. A screen is not a feature. Empty states say what is not built and which milestone builds it.
- No silent scope changes. If a requirement is wrong or conflicts with another, open an issue naming the conflict and proposing the change.
- Every side effect goes through the policy engine.
- Platform claims need evidence: "works" means on which operating system, verified how.

## Workflow

1. Open or pick an issue. Say which milestone and component it belongs to.
2. Branch from `main` as `type/short-slug` (`feat/`, `fix/`, `chore/`, `refactor/`, `docs/`).
3. Run the checks in [Testing](/docs/contributing/testing/) before pushing, each separately.
4. If you changed a type in `crates/vekrun-types`, commit the regenerated bindings.
5. Open a pull request using the template. Say what you tested and on which platform.

Commits are small and atomic, in the imperative mood, describing the change.

## Code of conduct

The project follows the Contributor Covenant.
