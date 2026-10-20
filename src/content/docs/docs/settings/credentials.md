---
title: Credentials
description: Where keys and passwords live, and how to report a security problem.
sidebar:
  order: 2
---

## Where credentials are kept

API keys live in your operating system's keychain. Vekrun's own files keep only a reference, never the secret. Keys are hidden in logs and in the interface, and they are not passed to tools, shells or remote machines.

SSH passwords are used for one connection and not stored.

Monitoring provider tokens are keychain items too. Each monitoring connection is read-only unless you turn on its separate write switch; see [Insights security](/docs/insights/security/).

Removing a provider deletes its key.

## Reporting a vulnerability

Vekrun runs commands, edits files and calls providers on your behalf, so security reports matter. Please do not open a public issue. Once the repository is public, use GitHub's private vulnerability reporting on it, or email the maintainer at the address on the GitHub profile. A dedicated security address will be published before the first public release.

Include steps to reproduce, your platform and the Vekrun version. You will hear back within seven days.

In scope: any way for an agent, extension, tool, repository content or terminal output to act outside your permissions; any exposure of a credential; any replay of a side effect after a crash; any bypass of authentication on a local service.

See also the [security page](/security/).
