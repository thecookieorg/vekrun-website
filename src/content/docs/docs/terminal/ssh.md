---
title: SSH
description: Open a shell on another machine with host keys checked every time.
sidebar:
  order: 3
---

An SSH tab opens a shell on a remote host.

## Connecting

On first contact Vekrun shows the host's key fingerprint and asks you to accept it. A host whose key later changes is refused. If the host asks for a password, you type it once for that connection; Vekrun does not store it.

## Coming later

:::note[Planned]
Saved connection profiles, automatic reconnection, port forwarding, and browsing, editing and transferring remote files are planned. See the [roadmap](/roadmap/).
:::

Running coding agents on another machine is a separate feature; see [Remote workers](/docs/advanced/remote-workers/).
