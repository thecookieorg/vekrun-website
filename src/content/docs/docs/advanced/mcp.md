---
title: MCP
description: Vekrun as a Model Context Protocol client and, later, server. What was verified about each vendor's server.
sidebar:
  order: 5
---

:::caution[Not built yet]
The MCP client, the integration catalog in the app, per-server permissions and the Vekrun MCP server are milestone 10 and have not started. This page describes design intent and the verification done so far. See the [roadmap](/roadmap/) and the [integrations catalog](/integrations/).
:::

## Intent

- Remote servers over Streamable HTTP and local servers over stdio, with OAuth where required and API keys or bearer tokens where supported.
- Credentials in the keychain; server capability and tool discovery; resources and prompts where offered; health and reconnection; timeouts and cancellation; validated tool results; an audit record for every tool execution.
- Distinct permissions for read, search, create, update, delete, trigger automation and externally consequential operations, configurable per server, agent, team, project and workflow. Permissions never exceed your own authenticated access. Destructive operations need explicit approval.
- Tool descriptions and results are untrusted content.
- Custom servers work without appearing in the catalog.
- A Vekrun MCP server exposing approved functions (list workspaces and projects, create and inspect tasks, start approved workflows, read verification reports) is off for remote access by default and requires authentication and explicit configuration.

## What was verified about vendor servers

Checked against vendor documentation on 2026-10-16. "Gated" means the vendor restricts which clients may connect.

| Vendor | Official server | Transport | Note |
|---|---|---|---|
| Linear | yes | remote | OAuth or bearer token |
| Jira, Confluence | yes (one Atlassian server) | remote | OAuth |
| Asana | yes | remote | needs a registered OAuth app |
| GitHub | yes | remote and stdio | personal access token today |
| GitLab | yes | remote | |
| Slack | yes | remote | needs a registered app |
| Notion | yes | remote | stdio server deprecated |
| Sentry | yes | remote and stdio | |
| Datadog | yes | remote | |
| Figma | yes | remote, gated | unavailable until Vekrun is listed |
| PostgreSQL | community only | stdio | reference server archived; not shipped |
| Cloudflare, Supabase, Neon, Stripe, Google Cloud | yes | remote (some also stdio) | |
| Vercel | yes | remote, gated | needs vendor approval |
| AWS, Azure | stdio proxies | stdio | no hosted bearer-token path |

Nothing here is connected in the application yet.
