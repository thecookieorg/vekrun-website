---
title: Investigate & Fix
description: The four actions on an issue, starting with a read-only investigation you can trust.
sidebar:
  order: 6
---

Every issue offers four actions: **Investigate**, **Create Ticket**, **Generate Fix Plan** and **Delegate to Factory**. You can also **Convene Council** on an issue that deserves more than one opinion.

## Investigate

Investigate starts a read-only agent session in the mapped repository. The agent can read code and Git history and inspect the redacted issue, but cannot write files or run commands.

Before anything is sent to a model you see the egress preview: the issue block as the agent will receive it, already redacted.

The result is a structured report:

- Symptoms and evidence, with references to the frames, occurrences and files it relied on.
- Likely causes, each with a confidence level. No hypothesis is presented as a diagnosis.
- What is uncertain and what would settle it.
- Suggested next steps, the files involved and the tests to add or run.

The report is saved on the issue and starts an investigation with its own status, separate from the provider's. See [viewing errors](/docs/insights/viewing-errors/#two-statuses).

## The other three actions

- [Create Ticket](/docs/insights/creating-tickets/) puts the issue on your tracker, after checking for a ticket that already links to it.
- [Generate Fix Plan](/docs/insights/generating-plans/) drafts a plan with the issue and the report as context.
- [Delegate to Factory](/docs/insights/delegating-to-factory/) runs the incident workflow end to end, up to a reviewable change.

## Convene Council

For a contested or high-impact issue, Convene Council runs an incident council with investigator, architect, performance, security and challenger roles. Members receive the same redacted evidence as data, disagree on the record, and the report is linked to the investigation. See [Council](/docs/ai-teams/council/).

Everything here works in the development build on macOS against recorded provider data.
