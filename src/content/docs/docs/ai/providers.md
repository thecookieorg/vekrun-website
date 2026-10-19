---
title: Providers
description: The model providers Vekrun connects to, how each is reached, and what the gateway guarantees.
sidebar:
  order: 1
---

Verified on macOS only.

## The provider gateway

All model traffic goes through a Rust provider gateway: direct requests, streaming, a capability registry, routing profiles, budgets and a usage ledger. There is no Vekrun-hosted inference and no markup. The [integrations catalog](/integrations/) lists every provider with its current status.

## Available today

| Provider | Connection |
|---|---|
| Anthropic | API key |
| OpenAI | API key |
| Google Gemini | API key |
| OpenAI-compatible endpoints | base URL and API key |
| Ollama | local runtime, detected |
| LM Studio | local runtime, detected |

OpenRouter and llama.cpp-style servers work through the OpenAI-compatible adapter with their own base URL; neither has a dedicated preset yet. BytePlus ModelArk is planned.

## Guarantees

- Keys live in the operating system keychain and never reach the webview, logs or tools.
- Each adapter has deterministic mocks for tests and opt-in live tests against the real provider.
- The capability registry records "unknown" where a provider does not publish a fact. Vekrun does not invent context sizes or prices.
- A fallback to a different provider never happens unless your policy allows it. Private data is never quietly sent to a new provider.
- Transient errors are retried with backoff; the retry is visible in the session timeline.

## Routing, budgets and usage

Routing profiles (explicit, quality, latency, cost, balanced and custom) and a budget hierarchy of global, project, team, agent and task are in place, with a usage ledger. A child scope cannot expand a parent's limit. Estimated local spend caps cannot enforce a provider's actual bill unless the provider offers compatible controls; Vekrun says so in the interface.

:::note[Planned]
Model pools, cost dashboards and policy-gated fallbacks are completed in milestone 9. Coding-agent account connections are milestone 3. See the [roadmap](/roadmap/).
:::
