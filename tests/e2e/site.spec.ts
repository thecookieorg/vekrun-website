import { test, expect, type Page } from '@playwright/test';

const noOverflow = async (page: Page) => {
  const over = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(over, 'page must not scroll horizontally').toBe(false);
};

test.describe('homepage', () => {
  test('renders the Factory positioning, metadata and structured data', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Tell Vekrun what needs to ship.');
    await expect(page.getByText('AI software engineering Factory').first()).toBeVisible();
    await expect(page).toHaveTitle('Vekrun: the AI software engineering Factory');
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /AI software engineering Factory/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://vekrunapp.com/');
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /\/og\/default\.png$/);
    const ld = await page.locator('script[type="application/ld+json"]').first().textContent();
    expect(JSON.parse(ld ?? '{}')['@type']).toBe('SoftwareApplication');
    await expect(page.getByText('Vekrun is in development. There is no public download yet.').first()).toBeVisible();
    await expect(page.locator('body')).not.toContainText(/open[- ]source|Apache|Vekrun Cloud/i);
    await noOverflow(page);
  });

  test('the Factory hero reaches its final state, is labelled a concept, and can replay', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const f = page.locator('[data-factory]');
    await expect(f).toHaveAttribute('data-demo', 'done');
    await expect(f.getByText('Illustrative product concept', { exact: false })).toBeVisible();
    await expect(f.locator('[data-job="j1"]')).toHaveAttribute('data-stage', '5');
    await expect(f.locator('[data-f-inbox]')).toBeVisible();
    await f.getByRole('button', { name: 'Replay' }).click();
    await expect(f).toHaveAttribute('data-demo', /playing|done/);
  });

  test('every homepage demo plays to completion when visible', async ({ page }) => {
    test.setTimeout(120_000);
    await page.goto('/');
    const roots = page.locator('[data-demo-root]');
    const n = await roots.count();
    expect(n).toBeGreaterThanOrEqual(1);
    for (let i = 0; i < n; i++) {
      await roots.nth(i).scrollIntoViewIfNeeded();
      await expect(roots.nth(i)).toHaveAttribute('data-demo', 'done', { timeout: 60_000 });
    }
  });

  test('a demo pauses with the pause control and resumes', async ({ page }) => {
    await page.goto('/');
    const f = page.locator('[data-factory]');
    await f.scrollIntoViewIfNeeded();
    await expect(f).toHaveAttribute('data-demo', 'playing');
    await f.locator('[data-demo-play]').click();
    await expect(f).toHaveAttribute('data-demo', 'paused');
    await f.locator('[data-demo-play]').click();
    await expect(f).toHaveAttribute('data-demo', 'playing');
  });

  test('the Insights period control is a keyboard-operable radiogroup with illustrative data', async ({ page }) => {
    await page.goto('/');
    const ins = page.locator('[data-insights]').first();
    const group = ins.getByRole('radiogroup', { name: 'Reporting period' });
    await group.scrollIntoViewIfNeeded();
    await expect(ins.getByText('Illustrative data')).toBeVisible();
    await group.getByRole('radio', { name: '30d' }).click();
    await expect(group.getByRole('radio', { name: '30d' })).toHaveAttribute('aria-checked', 'true');
    await expect(ins.locator('[data-metric="0"]')).toHaveText('64');
    await page.keyboard.press('ArrowRight');
    await expect(group.getByRole('radio', { name: 'All time' })).toHaveAttribute('aria-checked', 'true');
    await expect(ins.locator('[data-metric="0"]')).toHaveText('212');
  });

  test('the homepage shows two packages with planned Teams pricing and no purchase control', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Vekrun Personal' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Vekrun Teams' })).toBeVisible();
    await expect(page.getByText('Planned launch pricing. Vekrun Teams is not available to buy yet.').first()).toBeVisible();
    await expect(page.getByRole('link', { name: /buy|checkout|subscribe|start trial|sign up/i })).toHaveCount(0);
  });

  test('the coding studio accepts a real approve or reject decision', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/features/ai-coding/');
    const studio = page.locator('[data-coding]');
    await studio.getByRole('button', { name: 'Replay' }).click();
    await studio.getByRole('button', { name: 'Reject', exact: true }).click();
    await expect(studio.getByText('Rejected by you · nothing written')).toBeVisible();
    await expect(studio.getByRole('button', { name: 'Approve', exact: true })).toBeDisabled();
  });

  test('the review inbox switches pull requests and records a demonstration decision', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/features/code-review/');
    const inbox = page.locator('[data-review-inbox]');
    await inbox.getByRole('tab', { name: /#86/ }).click();
    await expect(inbox.getByRole('tabpanel', { name: /#86/ })).toBeVisible();
    await inbox.getByRole('tabpanel', { name: /#86/ }).getByRole('button', { name: 'Request changes' }).click();
    await expect(inbox.getByText(/Changes requested by you \(demonstration\)/)).toBeVisible();
  });

  test('production incidents can be driven by hand from Investigate & Fix to a ticket', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/features/board/');
    const ins = page.locator('[data-insights-walk]');
    await ins.getByRole('button', { name: 'Replay' }).click();
    await ins.getByRole('button', { name: 'Investigate & Fix' }).click();
    await expect(ins.getByRole('button', { name: 'Create ticket' })).toBeVisible({ timeout: 8_000 });
    await ins.getByRole('button', { name: 'Create ticket' }).click();
    await expect(ins.getByText('Ticket API-231 created in Jira')).toBeVisible({ timeout: 5_000 });
    await ins.getByRole('button', { name: 'Delegate to Factory' }).click();
    await expect(ins.getByRole('button', { name: 'Mark resolved in Honeybadger' })).toBeVisible({ timeout: 12_000 });
    await ins.getByRole('button', { name: 'Mark resolved in Honeybadger' }).click();
    await expect(ins.getByRole('button', { name: 'Resolved by you (demonstration)' })).toBeDisabled();
  });

  test('the terminal showcase has real tabs', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/features/terminal/');
    const term = page.locator('[data-terminal]');
    await term.getByRole('tab', { name: 'ssh: staging' }).click();
    await expect(term.getByRole('tabpanel', { name: 'ssh: staging' })).toContainText('journalctl');
    await term.getByRole('tab', { name: 'web' }).focus();
    await page.keyboard.press('ArrowLeft');
    await expect(term.getByRole('tab', { name: 'api' })).toHaveAttribute('aria-selected', 'true');
  });
});

test.describe('navigation and theme', () => {
  test('primary navigation links resolve', async ({ page, isMobile }) => {
    test.skip(isMobile, 'desktop navigation only');
    await page.goto('/');
    const links = await page.getByRole('navigation', { name: 'Primary' }).getByRole('link').all();
    expect(links.length).toBeGreaterThanOrEqual(3);
    for (const l of links) {
      const href = await l.getAttribute('href');
      if (!href || href.startsWith('/#')) continue;
      const res = await page.request.get(href);
      expect(res.status(), href).toBe(200);
    }
  });

  test('mobile menu opens, traps nothing, and closes on Escape', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'mobile only');
    await page.goto('/');
    const toggle = page.getByRole('button', { name: 'Open menu' });
    await expect(page.locator('header .btn').first()).toBeHidden();
    await toggle.click();
    await expect(page.getByRole('navigation', { name: 'Primary, mobile' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Close menu' })).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Escape');
    await expect(page.getByRole('navigation', { name: 'Primary, mobile' })).toBeHidden();
    await noOverflow(page);
  });

  test('theme toggle switches and persists', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');
    const before = await html.getAttribute('data-theme');
    await page.getByRole('button', { name: /Switch to (light|dark) theme/ }).first().click();
    const after = await html.getAttribute('data-theme');
    expect(after).not.toBe(before);
    await page.reload();
    await expect(html).toHaveAttribute('data-theme', after!);
    await page.goto('/docs/');
    await expect(html).toHaveAttribute('data-theme', after!);
  });

  test('dark is the default, an explicit choice wins, and auto follows the system', async ({ browser }) => {
    const ctx = await browser.newContext({ colorScheme: 'light' });
    const page = await ctx.newPage();
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.goto('/docs/');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.evaluate(() => localStorage.setItem('starlight-theme', ''));
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await page.goto('/docs/');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await page.evaluate(() => localStorage.setItem('starlight-theme', 'dark'));
    await page.goto('/docs/');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await ctx.close();
  });

  test('skip link targets main content', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: 'Skip to content' });
    await expect(skip).toBeFocused();
    await expect(page.locator('#main')).toHaveCount(1);
  });
});

test.describe('other pages', () => {
  for (const path of ['/features/', '/features/factory/', '/features/board/', '/features/inbox/', '/features/verification/', '/features/engineering-memory/', '/features/mobile/', '/features/terminal/', '/features/ai-coding/', '/features/code-review/', '/how-it-works/', '/teams/', '/integrations/', '/roadmap/', '/download/', '/license/', '/docs/', '/security/', '/privacy/', '/contact/']) {
    test(`${path} renders with one h1, no overflow and no retired claims`, async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      if (path !== '/license/') await expect(page.locator('main, body').first()).not.toContainText(/Vekrun is (free and )?open[- ]source|Apache License|Vekrun Cloud|AI-native terminal/i);
      await noOverflow(page);
    });
  }

  test('the Teams page is self-hosted, prices with the planned formula and sells nothing', async ({ page }) => {
    await page.goto('/teams/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('On your infrastructure');
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /\/og\/teams\.png$/);
    await expect(page.getByRole('link', { name: /buy|checkout|subscribe|start trial|sign up/i })).toHaveCount(0);
    await expect(page.getByRole('button', { name: /buy|checkout|subscribe|start trial|sign up|register/i })).toHaveCount(0);
    await expect(page.getByText(/enterprise plan/i).first()).toBeVisible();
    const calc = page.locator('[data-teams-calc]');
    await calc.scrollIntoViewIfNeeded();
    const monthly = calc.locator('[data-pc-monthly]');
    await expect(monthly).toHaveText('$399');
    await expect(calc.locator('[data-pc-annual]')).toContainText('$4,788');
    const num = calc.getByLabel('Engineers, typed');
    for (const [n, cost] of [[1, '$199'], [10, '$199'], [11, '$209'], [30, '$399'], [100, '$1,099']] as const) {
      await num.fill(String(n));
      await expect(monthly).toHaveText(cost);
    }
    const range = calc.getByLabel('Engineers', { exact: true });
    await range.focus();
    await page.keyboard.press('Home');
    await expect(monthly).toHaveText('$199');
    const faq = page.locator('#faq details').first();
    await faq.locator('summary').click();
    await expect(faq).toHaveAttribute('open', '');
  });

  test('the Teams dashboard, settings, roles and workflow are keyboard-operable', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/teams/');
    const dash = page.locator('[data-dashboard]');
    const overview = dash.getByRole('tab', { name: 'Overview' });
    await overview.scrollIntoViewIfNeeded();
    await overview.focus();
    await page.keyboard.press('ArrowDown');
    await expect(dash.getByRole('tab', { name: 'Projects' })).toHaveAttribute('aria-selected', 'true');
    const gov = page.locator('[data-governance]');
    await gov.getByRole('tab', { name: 'Data sharing' }).click();
    await expect(gov.getByRole('tabpanel', { name: 'Data sharing' })).toBeVisible();
    const roles = page.locator('[data-roles]');
    await roles.getByRole('tab', { name: 'Project manager' }).click();
    await expect(roles.getByRole('tabpanel', { name: 'Project manager' })).toBeVisible();
    const wf = page.locator('[data-workflow]');
    await wf.getByRole('button', { name: /Step 3 of 8/ }).click();
    await expect(wf).toHaveAttribute('data-current', '3');
  });

  test('every demo on the Teams page plays to completion and is labelled a concept', async ({ page }) => {
    test.setTimeout(300_000);
    await page.goto('/teams/');
    const roots = page.locator('[data-demo-root]');
    const n = await roots.count();
    for (let i = 0; i < n; i++) {
      await roots.nth(i).scrollIntoViewIfNeeded();
      await expect(roots.nth(i)).toHaveAttribute('data-demo', 'done', { timeout: 60_000 });
      await expect(roots.nth(i).getByText(/Illustrative product concept/)).toBeVisible();
    }
  });

  test('the Inbox approvals work in the demonstration only', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/features/inbox/');
    const ap = page.locator('[data-approvals]');
    await ap.getByRole('tab', { name: /Rotate the webhook signing secret/ }).click();
    await ap.getByRole('button', { name: 'Reject' }).filter({ visible: true }).click();
    await expect(ap.getByText(/Rejected by you \(demonstration\)/)).toBeVisible();
  });

  test('the Board flow ends with a pull request waiting for a person', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/features/board/');
    const bf = page.locator('[data-board-flow]');
    await expect(bf).toHaveAttribute('data-demo', 'done');
    await expect(bf.locator('[data-cards="review"] [data-hero-card]')).toHaveCount(1);
    await expect(bf.locator('[data-bf-state]')).toHaveText('Waiting for review');
  });

  test('the roadmap filters by status and keeps its area index in step', async ({ page, isMobile }) => {
    await page.goto('/roadmap/');
    await page.locator('label.filter-pill').filter({ hasText: /^\s*In development/ }).click();
    await expect(page.locator('[data-roadmap-count]')).toContainText('of 72 items');
    for (const s of await page.locator('[data-roadmap-item]:not([hidden])').evaluateAll((els) => els.map((e) => e.getAttribute('data-status')))) expect(s).toBe('in-progress');
    if (!isMobile) await expect(page.locator('[data-roadmap-nav="teams"]')).toBeHidden();
    await page.locator('label.filter-pill').filter({ hasText: /^\s*In development/ }).click();
    await expect(page.locator('[data-roadmap-count]')).toContainText('Showing all 72 items');
  });

  test('the Teams roadmap group exists and holds only planned work', async ({ page }) => {
    await page.goto('/roadmap/#teams');
    const group = page.locator('#teams');
    await expect(group.getByRole('heading', { name: 'Vekrun Teams' })).toBeVisible();
    const items = group.locator('[data-roadmap-item]');
    expect(await items.count()).toBeGreaterThanOrEqual(6);
    for (const s of await items.evaluateAll((els) => els.map((e) => e.getAttribute('data-status')))) expect(s).toBe('planned');
  });

  test('download page shows the in-development state when there are no releases', async ({ page }) => {
    await page.goto('/download/');
    await expect(page.getByText(/no public (release|releases|builds|downloads)/i).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /roadmap/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /build from source/i })).toHaveCount(0);
  });

  test('docs search index and sidebar exist', async ({ page, isMobile }) => {
    await page.goto('/docs/getting-started/installation/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    const res = await page.request.get('/pagefind/pagefind.js');
    expect(res.status()).toBe(200);
    if (!isMobile) await expect(page.getByRole('link', { name: 'Overview' }).first()).toBeVisible();
  });

  test('old URLs redirect to their new homes', async ({ page }) => {
    for (const [from, to] of [['/cloud/', /\/teams\/$/], ['/ai-teams/', /\/features\/factory\/$/], ['/factory/', /\/features\/factory\/$/], ['/open-source/', /\/license\/$/], ['/features/insights/', /\/features\/board\/#incidents$/], ['/docs/ai-teams/council/', /\/docs\/factory\/council\/$/], ['/docs/getting-started/connecting-ai/', /\/docs\/getting-started\/connecting-tools\/$/]] as const) {
      await page.goto(from);
      await expect(page, from).toHaveURL(to);
    }
  });

  test('the Product menu opens with keyboard and closes on Escape', async ({ page, isMobile }) => {
    test.skip(isMobile, 'desktop navigation only');
    await page.goto('/');
    const button = page.getByRole('button', { name: 'Product' });
    await button.focus();
    await page.keyboard.press('ArrowDown');
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('link', { name: /^AI Factory/ }).first()).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  test('unknown routes serve the custom 404', async ({ page }) => {
    const res = await page.goto('/this-does-not-exist/');
    expect(res?.status()).toBe(404);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('nothing at this address');
  });

  test('sitemap and robots are published', async ({ page }) => {
    expect((await page.request.get('/sitemap-index.xml')).status()).toBe(200);
    const robots = await (await page.request.get('/robots.txt')).text();
    expect(robots).toContain('Sitemap: https://vekrunapp.com/sitemap-index.xml');
  });
});
