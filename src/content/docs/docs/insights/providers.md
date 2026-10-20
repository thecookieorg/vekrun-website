---
title: Supported monitoring providers
description: Which monitoring tools Insights reads from, what each one gives you, and what is still to come.
sidebar:
  order: 2
---

Insights reads from four providers. Each adapter exists in the development build and is tested against recorded responses from the provider. None has been run against a live account yet, so the catalog lists them as in progress.

| Provider | What you get | Credential |
|---|---|---|
| Sentry | Issues, error events, stack traces, releases, environments, performance issues | An auth token |
| Honeybadger | Projects, grouped errors, occurrences, stack traces, environments | A personal auth token |
| Datadog | Error-tracking issues, monitors, slowest endpoints by p95 | An API key, an application key and your site |
| AppSignal | Apps, exception, performance and anomaly incidents, samples | A personal API key |

All four are read-only by default. Changing an issue's state on the provider is a separate switch that is off until you turn it on; see [security](/docs/insights/security/).

## Not built yet

Honeybadger and AppSignal also offer hosted MCP servers that need a sign-in with a registered client. That path is not built; both providers connect through their APIs with a token. Datadog trace search is not available yet.

New Relic, Bugsnag, Rollbar, Grafana and Elastic are candidates for the same adapter model. They are not scheduled.

Availability is tracked on the [integrations page](/integrations/?category=monitoring) and the [roadmap](/roadmap/).
