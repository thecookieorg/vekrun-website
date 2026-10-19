---
title: Editing code
description: The built-in editor, and how it keeps your edits and an agent's edits from colliding.
sidebar:
  order: 3
---

The Code area has a file explorer, tabs and an editor, in the development build.

## Explorer and search

The explorer shows your project with ignored files hidden. Search finds text across the project, and opening a result takes you to the line.

## Editing and saving

Open a file in a tab and edit it with syntax highlighting. Save with `⌘S`. If the file changed on disk while you were editing, Vekrun does not overwrite it: a bar offers to reload the disk version or to keep yours. A new file is never created over an existing one by accident.

## Diff against HEAD

Compare the open file with its last committed version side by side.

## Ask an agent about a selection

Select code and choose **Ask agent about selection**. A session opens with the selection already in context.

## Your unsaved edits are safe

An agent cannot write to a file you have unsaved changes in, and restoring a snapshot skips those files too.

:::note[Planned]
Language servers (diagnostics, go to definition), find and replace across files, and remote editing over SSH are planned. See the [roadmap](/roadmap/).
:::
