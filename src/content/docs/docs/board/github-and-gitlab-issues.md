---
title: GitHub and GitLab issues
description: Bring GitHub and GitLab issues onto the Board and start work on them manually, with an AI agent or with Factory.
sidebar:
  order: 5
---

GitHub Issues and GitLab Issues are two of the five ticket sources the Board can connect. They use the same Start Work experience as Linear, Jira and Asana tickets.

## What works today

- Start Work on any Board ticket: pick a GitHub or GitLab issue and choose Manual, AI Agent or Factory. Vekrun creates the branch and working copy and attaches the issue as context.
- The adapters for both providers exist and are tested against recorded responses. Live synchronisation against a real account has not yet been verified, so treat the connection as in progress.
- GitHub keeps its open or closed state and its labels; Vekrun keeps its own execution state alongside, and never invents GitHub workflow transitions.
- GitLab issues are scoped to their project and keep their link to merge requests.
- Sign-in with your own application id works for GitLab. GitHub uses a personal access token stored in the keychain.

## Planned

:::note[Planned]
Live verification, authorised issue comments and closing, and linking pull requests and merge requests back to the issue are planned. See the [roadmap](/roadmap/).
:::

- Authorised progress comments and closing the issue, always with your confirmation. Finishing an agent task never closes an issue on its own.
- Linking the pull request or merge request to the originating issue.
- Issues created by you and team issues, with filters for labels, assignees and milestones.

See [Connecting a tracker](/docs/board/connecting-a-tracker/) and [Start Work](/docs/board/start-work/).
