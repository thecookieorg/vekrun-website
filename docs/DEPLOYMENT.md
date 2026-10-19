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
   The repository was made public on 2026-10-19.
5. GitHub Actions minutes are free for public repositories and metered for
   private ones. While the repository was private, every deploy run failed
   in a few seconds with the annotation *"The job was not started because
   recent account payments have failed or your spending limit needs to be
   increased"*, and GitHub's domain check reported
   `NotServedByPagesError` because nothing had been deployed. Making the
   repository public and re-running the workflow fixed both.

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

Optional: domain verification under **Settings → Pages → Verified domains**
prevents takeover if the Pages site is ever removed. GitHub shows a code; the
record is a `TXT` whose **name** is `_github-pages-challenge-thecookieorg`
(a subdomain, not the apex) and whose **value** is that code. A TXT record on
the apex whose value is the challenge name does nothing.

First verified deploy: 2026-10-19, run 39330408855. The apex returns 200,
`www` and plain HTTP redirect to `https://vekrunapp.com/`, HTTPS is enforced.

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
