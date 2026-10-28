---
title: Connecting your coding CLIs and tools
description: Vekrun finds the coding CLIs on your machine and connects your model accounts, Git host, trackers and monitoring. Each provider bills you directly.
sidebar:
  order: 2
---

Vekrun ships no model access of its own. It works with the coding agents and accounts you already have, and each provider bills you directly.

## Coding CLIs on your Host

Vekrun looks for Claude Code and Codex on your machine, and shows each one’s version and whether it is signed in. Your logins stay on your machine; Vekrun never copies them anywhere.

- **Claude Code** runs Factory jobs end to end in the development build.
- **Codex** is detected and tested against a stand-in; a live run is still to come.

:::note[Planned]
Gemini CLI and GitHub CLI support, and installing or updating coding CLIs from inside Vekrun where the vendor supports it, are planned. See the [roadmap](/roadmap/#agents).
:::

A coding CLI subscription and paid API access are separate things. Using a personal subscription for unattended automation may not be allowed by its provider; check their terms.

## Model accounts

1. Open Settings, then Providers.
2. Choose Anthropic, OpenAI, Google Gemini, OpenRouter or any OpenAI-compatible endpoint, and paste your key.
3. Press **Test**, then save.

The key is stored in your operating system’s keychain, never in a plain file. These connections are tested against recorded responses in the development build; live runs are pending. OpenRouter is billed by OpenRouter, separately from any coding CLI subscription.

## Local models

Vekrun detects Ollama and LM Studio, and can pull and remove Ollama models. See [Choosing models](/docs/ai-coding/choosing-models/).

## Git, trackers and monitoring

Connect GitHub or GitLab, Jira, Linear or Asana, and Sentry, Honeybadger, Datadog or AppSignal from Settings. Each authenticates the way its provider allows. See [Connecting a tracker](/docs/board/connecting-a-tracker/) and [monitoring providers](/docs/insights/providers/).

## What happens before anything is sent

The first time a job would send something to a hosted provider, Vekrun shows what is about to leave your machine and waits for you to confirm. Your policies decide which providers are allowed.
