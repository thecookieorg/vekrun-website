---
title: SSH
description: Remote shells with strict host-key checking.
sidebar:
  order: 4
---

Verified on macOS only.

## Opening a remote shell

An SSH tab opens a shell on a remote host. The connection is made by Vekrun's own Rust SSH client (built on russh), not by shelling out to the `ssh` binary.

Host keys are checked strictly. On first contact Vekrun shows the host's key fingerprint and asks you to accept it; a changed key is refused. Password prompts are one-shot: the password is used for the connection and is not stored.

## What is not built

:::note[Planned]
Connection profiles, reconnect states, permitted port forwarding, remote file browsing, editing and transfers, and remote Git are later milestone 2 and milestone 5 work. SSH agent forwarding into agent sandboxes will never be automatic. See the [roadmap](/roadmap/).
:::

Remote execution workers, which are a different thing from a remote terminal, are described under [Remote workers](/docs/advanced/remote-workers/).
