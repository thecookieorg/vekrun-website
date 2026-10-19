# Deployment, domain and rollback

## How deployment works

`.github/workflows/deploy.yml` runs on every push to `main`:

1. `build` job: install, `astro check`, unit tests, `astro build`, link check,
   upload `dist/` as the Pages artifact. It has `contents: read` only.
2. `deploy` job: `actions/deploy-pages` with `pages: write` and
   `id-token: write`, scoped to the `github-pages` environment.

Pull requests run `.github/workflows/ci.yml` (same checks plus Playwright)
and never deploy.

## One-time repository setup (owner)

1. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
2. **Settings → Pages → Custom domain:** `vekrunapp.com`, then tick
   **Enforce HTTPS** once the certificate is issued (minutes to an hour after
   DNS resolves).
3. `public/CNAME` already contains `vekrunapp.com`, so the custom domain
   survives every deploy.
4. GitHub Pages on a **private** repository requires a paid GitHub plan.
   On a free plan the repository must be public before Pages will serve it.
   Making the repository public is the owner's decision.
5. GitHub Actions minutes are free for public repositories and metered for
   private ones. Check **Settings → Billing** before relying on the workflow.

## DNS requirements for vekrunapp.com

Configure at the DNS provider. No credentials are assumed by this repository.

| Type | Name | Value |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| AAAA | `@` | `2606:50c0:8000::153` |
| AAAA | `@` | `2606:50c0:8001::153` |
| AAAA | `@` | `2606:50c0:8002::153` |
| AAAA | `@` | `2606:50c0:8003::153` |
| CNAME | `www` | `thecookieorg.github.io` |

These are GitHub's published Pages addresses; confirm them against
[GitHub's custom-domain documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
before applying, as they can change.

`www.vekrunapp.com` redirects to the apex automatically once the apex is the
configured custom domain and the `www` CNAME exists. The canonical URL on every
page is the apex.

Optional: a `TXT` record at `_github-pages-challenge-thecookieorg` lets you
verify the domain under **Settings → Pages → Verified domains**, which prevents
takeover if the Pages site is ever removed.

## Verifying a deploy

- The Actions run is green and the `deploy` job prints the page URL.
- `https://vekrunapp.com/` serves the new build (check the footer status line
  or a changed page).
- `https://vekrunapp.com/sitemap-index.xml` and `/robots.txt` respond.
- Do not report a deploy as successful if the workflow failed.

## Rollback

Pages serves the last successful deployment. To roll back:

1. Find the last good commit on `main`.
2. `git revert` the offending commit(s) and push, or
3. Re-run the last green **Deploy to GitHub Pages** workflow from the Actions
   tab (**Re-run all jobs**), which redeploys that commit's build.

Both paths go through the same workflow, so the result is auditable.

## Security notes

- No secrets are needed to build or deploy; the workflow uses the OIDC token
  GitHub issues for Pages.
- Dependencies are pinned through `pnpm-lock.yaml`; run `pnpm audit` before
  upgrading.
- GitHub Pages does not allow custom response headers. Security headers that
  need a server (CSP, HSTS beyond GitHub's default) cannot be set here; the
  site loads no third-party scripts, fonts or trackers, which is the mitigation.
