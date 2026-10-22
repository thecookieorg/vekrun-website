import { test, expect, type Page } from '@playwright/test';

const noOverflow = async (page: Page) => {
  const over = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(over, 'page must not scroll horizontally').toBe(false);
};

test.describe('homepage', () => {
  test('renders the hero, metadata and structured data', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Your terminal\.\s*Your models\.\s*Your rules\./);
    await expect(page).toHaveTitle(/Vekrun/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /open-source AI-native terminal/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://vekrunapp.com/');
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /\/og\/default\.png$/);
    const ld = await page.locator('script[type="application/ld+json"]').first().textContent();
    expect(JSON.parse(ld ?? '{}')['@type']).toBe('SoftwareApplication');
    await noOverflow(page);
  });

  test('hero preview reaches its final state, is labelled a preview, and can replay', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const app = page.locator('[data-app]');
    await expect(app).toHaveAttribute('data-demo', 'done');
    await expect(app.getByText('Product preview', { exact: false })).toBeVisible();
    await expect(app.locator('[data-status-right]')).toHaveText('Review ready');
    await app.getByRole('button', { name: 'Replay' }).click();
    await expect(app).toHaveAttribute('data-demo', /playing|done/);
  });

  test('every homepage demo plays to completion when visible', async ({ page }) => {
    test.setTimeout(300_000);
    await page.goto('/');
    const roots = page.locator('[data-demo-root]');
    const n = await roots.count();
    expect(n).toBeGreaterThanOrEqual(5);
    for (let i = 0; i < n; i++) {
      await roots.nth(i).scrollIntoViewIfNeeded();
      await expect(roots.nth(i)).toHaveAttribute('data-demo', 'done', { timeout: 60_000 });
    }
  });

  test('a demo pauses with the pause control and resumes', async ({ page }) => {
    await page.goto('/');
    const app = page.locator('[data-app]');
    await app.scrollIntoViewIfNeeded();
    await expect(app).toHaveAttribute('data-demo', 'playing');
    await app.locator('[data-demo-play]').click();
    await expect(app).toHaveAttribute('data-demo', 'paused');
    await app.locator('[data-demo-play]').click();
    await expect(app).toHaveAttribute('data-demo', 'playing');
  });

  test('the model picker is a keyboard-operable radiogroup', async ({ page }) => {
    await page.goto('/');
    const radios = page.getByRole('radiogroup', { name: 'Choose a model' }).first().getByRole('radio');
    expect(await radios.count()).toBeGreaterThanOrEqual(5);
    await radios.nth(0).click();
    await expect(radios.nth(0)).toHaveAttribute('aria-checked', 'true');
    await radios.nth(0).focus();
    await page.keyboard.press('ArrowRight');
    await expect(radios.nth(1)).toHaveAttribute('aria-checked', 'true');
  });

  test('the Board walkthrough lets a visitor pick a ticket, press Start Work and choose who does the work', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const board = page.locator('[data-board-walk]').first();
    await board.scrollIntoViewIfNeeded();
    await board.getByRole('button', { name: /VEK-148/ }).click();
    await expect(board.getByText('Selected: VEK-148', { exact: false })).toBeVisible();
    await board.getByRole('button', { name: 'Start Work' }).click();
    const dialog = board.getByRole('dialog', { name: 'Start Work' });
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: /With an AI agent/ }).click();
    await expect(board.locator('[data-column="progress"] [data-card="VEK-148"]')).toHaveCount(1, { timeout: 5_000 });
    await expect(board.locator('[data-card="VEK-148"]')).toContainText('Agent working');
    await board.getByRole('button', { name: 'Back to the Board' }).click();
    await expect(board.locator('[data-ws]')).toBeHidden();
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

  test('Insights can be driven by hand from Investigate & Fix to a ticket', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/features/insights/');
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
  for (const path of ['/features/', '/features/terminal/', '/features/ai-coding/', '/features/board/', '/ai-teams/', '/features/code-review/', '/features/insights/', '/cloud/', '/integrations/', '/roadmap/', '/download/', '/open-source/', '/docs/', '/security/', '/privacy/', '/contact/']) {
    test(`${path} renders with one h1 and no overflow`, async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      await noOverflow(page);
    });
  }

  test('the Cloud page plays every demonstration, labels them conceptual, and offers no sign-up', async ({ page }) => {
    test.setTimeout(300_000);
    await page.goto('/cloud/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('One connected workspace');
    await expect(page.getByText('In development').first()).toBeVisible();
    await expect(page.getByRole('link', { name: /sign up|start trial|subscribe|buy/i })).toHaveCount(0);
    await expect(page.getByRole('button', { name: /sign up|start trial|subscribe|buy|continue with|register interest|checkout/i })).toHaveCount(0);
    await expect(page.getByRole('link', { name: /register interest|checkout|pricing calculator/i })).toHaveCount(0);
    await expect(page.getByText('Proposed launch pricing · Cloud is in development')).toBeVisible();
    const roots = page.locator('[data-demo-root]');
    const n = await roots.count();
    expect(n).toBeGreaterThanOrEqual(7);
    for (let i = 0; i < n; i++) {
      await roots.nth(i).scrollIntoViewIfNeeded();
      await expect(roots.nth(i)).toHaveAttribute('data-demo', 'done', { timeout: 60_000 });
      await expect(roots.nth(i).getByText(/Conceptual preview/)).toBeVisible();
    }
    await expect(page.getByText('Demonstration data').first()).toBeVisible();
  });

  test('the Cloud page is dark by design and leaves the stored theme alone', async ({ page }) => {
    await page.addInitScript(() => { try { localStorage.setItem('starlight-theme', 'light'); } catch {} });
    await page.goto('/cloud/');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.locator('[data-theme-toggle]')).toHaveCount(0);
    expect(await page.evaluate(() => localStorage.getItem('starlight-theme'))).toBe('light');
    await expect(page).toHaveTitle('Vekrun Cloud — One Connected Workspace for Engineering Teams');
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /\/og\/cloud\.png$/);
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });

  test('the Cloud dashboard, settings, roles and workflow are keyboard-operable', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/cloud/');
    const dash = page.locator('[data-dashboard]');
    const overview = dash.getByRole('tab', { name: 'Overview' });
    await overview.scrollIntoViewIfNeeded();
    await overview.focus();
    await page.keyboard.press('ArrowDown');
    await expect(dash.getByRole('tab', { name: 'Projects' })).toHaveAttribute('aria-selected', 'true');
    await expect(dash.getByRole('tabpanel', { name: 'Projects' })).toBeVisible();
    for (const name of ['AI Operations', 'Quality & Insights', 'Reports', 'Settings']) {
      await dash.getByRole('tab', { name }).click();
      await expect(dash.getByRole('tabpanel', { name })).toBeVisible();
    }
    const gov = page.locator('[data-governance]');
    await gov.getByRole('tab', { name: 'Data sharing' }).click();
    await expect(gov.getByRole('tabpanel', { name: 'Data sharing' })).toContainText('Source code is not uploaded for coordination');
    const roles = page.locator('[data-roles]');
    await roles.getByRole('tab', { name: 'Project manager' }).click();
    await expect(roles.getByRole('tabpanel', { name: 'Project manager' })).toBeVisible();
    const wf = page.locator('[data-workflow]');
    await wf.getByRole('button', { name: /Step 3 of 8/ }).click();
    await expect(wf).toHaveAttribute('data-current', '3');
    await wf.getByRole('button', { name: 'Next step' }).click();
    await expect(wf).toHaveAttribute('data-current', '4');
  });

  test('the Cloud pricing calculator follows the proposed formula and works from the keyboard', async ({ page }) => {
    await page.goto('/cloud/');
    const calc = page.locator('[data-pricing-calc]');
    await calc.scrollIntoViewIfNeeded();
    const monthly = calc.locator('[data-pc-monthly]');
    const annual = calc.locator('[data-pc-annual]');
    const num = calc.getByLabel('Active members, typed');
    for (const [n, cost] of [[3, '$99'], [5, '$99'], [10, '$194'], [20, '$384'], [30, '$574'], [50, '$954'], [100, '$1,904'], [250, '$4,754']] as const) {
      await num.fill(String(n));
      await expect(monthly).toHaveText(cost);
      await expect(calc.locator('[data-pc-enterprise]')).toBeVisible({ visible: n >= 50 });
    }
    await expect(annual).toContainText('$57,048');
    await num.fill('999'); await num.blur();
    await expect(monthly).toHaveText('$4,754');
    const range = calc.getByLabel('Active members', { exact: true });
    await range.focus();
    await page.keyboard.press('Home');
    await expect(monthly).toHaveText('$99');
    await page.keyboard.press('End');
    await expect(monthly).toHaveText('$4,754');
    await expect(page.getByText('Register interest · coming soon')).toBeVisible();
    const faq = page.locator('#faq details').first();
    await faq.locator('summary').click();
    await expect(faq).toHaveAttribute('open', '');
  });

  test('the Cloud approvals and resolve controls work in the demonstration only', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/cloud/');
    const ap = page.locator('[data-approvals]');
    await ap.getByRole('tab', { name: /Rotate the webhook signing secret/ }).click();
    await ap.getByRole('button', { name: 'Reject' }).filter({ visible: true }).click();
    await expect(ap.getByText(/Rejected by you \(demonstration\)/)).toBeVisible();
    const ins = page.locator('[data-insights]');
    await ins.getByRole('button', { name: 'Mark as resolved' }).click();
    await expect(ins.getByRole('button', { name: 'Resolved by you' })).toBeDisabled();
  });

  test('the roadmap filters by status and keeps its area index in step', async ({ page, isMobile }) => {
    await page.goto('/roadmap/');
    await page.locator('label.filter-pill', { hasText: 'In progress' }).click();
    await expect(page.locator('[data-roadmap-count]')).toContainText('of 79 items');
    for (const s of await page.locator('[data-roadmap-item]:not([hidden])').evaluateAll((els) => els.map((e) => e.getAttribute('data-status')))) expect(s).toBe('in-progress');
    if (!isMobile) await expect(page.locator('[data-roadmap-nav="terminal"]')).toBeHidden();
    await page.locator('label.filter-pill', { hasText: 'In progress' }).click();
    await expect(page.locator('[data-roadmap-count]')).toContainText('Showing all 79 items');
  });

  test('the Cloud roadmap group exists and holds only planned work', async ({ page }) => {
    await page.goto('/roadmap/#cloud');
    const group = page.locator('#cloud');
    await expect(group.getByRole('heading', { name: 'Vekrun Cloud' })).toBeVisible();
    const items = group.locator('[data-roadmap-item]');
    expect(await items.count()).toBeGreaterThanOrEqual(8);
    for (const s of await items.evaluateAll((els) => els.map((e) => e.getAttribute('data-status')))) expect(s).toBe('planned');
  });

  test('download page shows the in-development state when there are no releases', async ({ page }) => {
    await page.goto('/download/');
    await expect(page.getByText(/no public (release|releases|builds|downloads)/i).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /roadmap/i }).first()).toBeVisible();
  });

  test('docs search index and sidebar exist', async ({ page, isMobile }) => {
    await page.goto('/docs/getting-started/installation/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    const res = await page.request.get('/pagefind/pagefind.js');
    expect(res.status()).toBe(200);
    if (!isMobile) await expect(page.getByRole('link', { name: 'Overview' }).first()).toBeVisible();
  });

  test('old URLs redirect to their new homes', async ({ page }) => {
    await page.goto('/factory/');
    await expect(page).toHaveURL(/\/ai-teams\/$/);
    await page.goto('/docs/factory/council/');
    await expect(page).toHaveURL(/\/docs\/ai-teams\/council\/$/);
  });

  test('the Features menu opens with keyboard and closes on Escape', async ({ page, isMobile }) => {
    test.skip(isMobile, 'desktop navigation only');
    await page.goto('/');
    const button = page.getByRole('button', { name: 'Features' });
    await button.focus();
    await page.keyboard.press('ArrowDown');
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('link', { name: /^Terminal/ }).first()).toBeFocused();
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
