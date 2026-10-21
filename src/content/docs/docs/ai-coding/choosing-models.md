---
title: Choosing models
description: The providers and local runtimes Vekrun works with, and how it treats them.
sidebar:
  order: 1
---

Every coding session uses a model you chose. Switch providers between sessions, or mid-session with the context limits stated.

## Available today

| Provider | How you connect |
|---|---|
| Anthropic | your API key |
| OpenAI | your API key |
| Google Gemini | your API key |
| Any OpenAI-compatible endpoint | its address and your key |
| Ollama | detected on your machine |
| LM Studio | detected on your machine |

OpenRouter and llama.cpp-style servers work through the OpenAI-compatible option with their own address. See the [integrations catalog](/integrations/) for every entry and its status.

## Local models

Vekrun tells you two things separately: whether a runtime is installed, and whether it is running. A local model handles explanations and smaller coding tasks entirely offline. Larger multi-agent work may need stronger hardware or a hosted provider, and Vekrun says so rather than failing quietly.

:::note[Planned]
Downloading models from inside Vekrun, with hardware and license guidance, is planned. Until then, install models with the runtime's own tools. See the [roadmap](/roadmap/).
:::

## What Vekrun promises

- Your key never shows in logs or in the interface, and it is never handed to tools or remote machines.
- Vekrun never switches to a different provider on its own. Private data does not go anywhere you did not choose.
- Where a provider does not publish a model's context size or price, Vekrun shows "unknown" instead of guessing.
- A failed request is retried, and you can see the retry in the session.

OpenRouter works through the OpenAI-compatible connection today; the dedicated integration is planned. See [OpenRouter](/docs/ai-coding/openrouter/).
