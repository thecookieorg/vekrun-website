import { test, expect, type Page } from '@playwright/test';

const noOverflow = async (page: Page) => {
  const over = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(over, 'page must not scroll horizontally').toBe(false);
};

test.describe('homepage', () => {
  test('renders the hero, metadata and structured data', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Your terminal\.\s*Your AI\.\s*Your workflow\./);
    await expect(page).toHaveTitle(/Vekrun/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /open-source AI-native terminal/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://vekrunapp.com/');
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /\/og\/default\.png$/);
    const ld = await page.locator('script[type="application/ld+json"]').first().textContent();
    expect(JSON.parse(ld ?? '{}')['@type']).toBe('SoftwareApplication');
    await noOverflow(page);
  });

  test('product preview reaches its final state and is labelled a concept', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const preview = page.locator('[data-preview]');
    await expect(preview.getByText('Product preview', { exact: false })).toBeVisible();
    await expect(preview.locator('[data-field="review"]')).toContainText('Ready for you');
    await expect(preview.locator('[data-step="verify"]')).toHaveAttribute('data-state', 'done');
    await preview.getByRole('button', { name: 'Replay' }).click();
    await expect(preview.locator('[data-field="review"]')).toContainText('Not started');
  });

  test('AI Teams stages are keyboard-operable tabs', async ({ page }) => {
    await page.goto('/');
    const tabs = page.getByRole('tablist', { name: 'AI Teams stages' }).getByRole('tab');
    await expect(tabs).toHaveCount(6);
    await tabs.nth(0).focus();
    await page.keyboard.press('ArrowRight');
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('tabpanel', { name: 'Plan' })).toContainText('drafts a plan');
    await page.keyboard.press('End');
    await expect(tabs.nth(5)).toHaveAttribute('aria-selected', 'true');
  });
});

test.describe('navigation and theme', () => {
  test('primary navigation links resolve', async ({ page, isMobile }) => {
    test.skip(isMobile, 'desktop navigation only');
    await page.goto('/');
    const links = await page.getByRole('navigation', { name: 'Primary' }).getByRole('link').all();
    expect(links.length).toBeGreaterThanOrEqual(5);
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

  test('skip link targets main content', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: 'Skip to content' });
    await expect(skip).toBeFocused();
    await expect(page.locator('#main')).toHaveCount(1);
  });
});

test.describe('other pages', () => {
  for (const path of ['/features/', '/features/terminal/', '/features/ai-coding/', '/features/board/', '/ai-teams/', '/features/code-review/', '/integrations/', '/roadmap/', '/download/', '/open-source/', '/docs/', '/security/', '/privacy/', '/contact/']) {
    test(`${path} renders with one h1 and no overflow`, async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      await noOverflow(page);
    });
  }

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

  test('the Board demo offers three ways to work', async ({ page }) => {
    await page.goto('/');
    const tabs = page.getByRole('tablist', { name: 'Ways to work on a ticket' }).getByRole('tab');
    await expect(tabs).toHaveCount(3);
    await tabs.nth(2).click();
    await expect(page.getByRole('tabpanel', { name: 'Delegate to an AI team' })).toBeVisible();
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
