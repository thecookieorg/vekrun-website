# Contributing to the Vekrun website

1. Branch from `main`: `type/short-slug` (`feat/`, `fix/`, `chore/`, `docs/`).
2. Make the change. Content edits go in `src/data/site.ts`, the JSON under
   `src/content/data/`, or the Markdown under `src/content/docs/`; see
   `docs/CONTENT.md`.
3. Run the checks, each separately: `pnpm check`, `pnpm test`, `pnpm build`,
   `pnpm test:links`, `pnpm test:e2e`.
4. For visual changes, look at the page at phone and desktop widths in both
   themes (`node scripts/screenshot.mjs`).
5. Open a pull request. Say what you verified.

Content rules: no fabricated availability, benchmarks, testimonials, download
counts or release history. Mark concepts as concepts. Third-party inference is
never described as free.
