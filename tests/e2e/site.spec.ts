import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const noOverflow = async (page: Page) => {
  const over = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(over, 'page must not scroll horizontally').toBe(false);
};
const purchase = /buy|checkout|subscribe|start trial|free trial|sign up|register|join (the )?waitlist/i;
const statusWords = /\b(in development|planned feature|coming soon|under consideration|not (yet )?implemented|verified in development|status:)\b/i;

const pages = ['/', '/product/', '/benefits/', '/before-and-after/', '/integrations/', '/teams/', '/download/', '/security/', '/privacy/', '/license/', '/contact/'];

test.describe('every page', () => {
  for (const path of pages) {
    test(`${path} has one h1, a canonical, no overflow, no status labels and nothing for sale`, async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://vekrunapp.com${path}`);
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /^https:\/\/vekrunapp\.com\/og\/.+\.png$/);
      const main = page.locator('main');
      await expect(main).not.toContainText(statusWords);
      await expect(main).not.toContainText(/Vekrun is (free and )?open[- ]source|Apache License|Vekrun Cloud|AI-native terminal/i);
      await expect(page.getByRole('link', { name: purchase })).toHaveCount(0);
      await expect(page.getByRole('button', { name: purchase })).toHaveCount(0);
      await expect(page.locator('a[href*="/docs/"], a[href*="/roadmap/"], a[href*="/how-it-works/"], a[href*="/features/"]')).toHaveCount(0);
      await noOverflow(page);
    });
  }
});

test.describe('accessibility', () => {
  for (const path of pages) for (const theme of ['dark', 'light'] as const) {
    test(`${path} has no WCAG A or AA violations in the ${theme} theme`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.addInitScript((t) => localStorage.setItem('vekrun-theme', t), theme);
      await page.goto(path);
      await page.evaluate(() => document.querySelectorAll('.reveal,.reveal-group').forEach((e) => e.classList.add('is-visible')));
      const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
      expect(violations.map((v) => `${v.id}: ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(', ')}`)).toEqual([]);
    });
  }
});

test.describe('homepage', () => {
  test('renders the central message, metadata and structured data', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('From prompt to verified outcome.');
    await expect(page).toHaveTitle('Vekrun · From prompt to verified outcome');
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /\/og\/default\.png$/);
    const types = await page.locator('script[type="application/ld+json"]').evaluateAll((els) => els.map((e) => JSON.parse(e.textContent ?? '{}')['@type']));
    expect(types).toEqual(expect.arrayContaining(['Organization', 'WebSite', 'SoftwareApplication']));
    await expect(page.getByText('Planned launch pricing. Vekrun Teams isn’t on sale yet.').first()).toBeVisible();
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
});

test.describe('conversion paths', () => {
  for (const path of ['/product/', '/benefits/', '/before-and-after/', '/integrations/']) {
    test(`${path} ends with the Personal and Teams paths`, async ({ page }) => {
      await page.goto(path);
      const next = page.locator('section[aria-labelledby="next-title"]');
      await expect(next.getByRole('link', { name: 'Request early access' })).toHaveAttribute('href', '/download/#early-access');
      await expect(next.getByRole('link', { name: 'Explore Vekrun Teams' })).toHaveAttribute('href', '/teams/');
      await expect(next).toContainText('isn’t on sale yet');
    });
  }

  test('the homepage plans lead to Personal and Teams, and every CTA destination resolves', async ({ page }) => {
    await page.goto('/');
    const plans = page.locator('section[aria-labelledby="plans-title"]');
    await expect(plans.getByRole('link', { name: 'Request early access' })).toHaveAttribute('href', '/download/#early-access');
    await expect(plans.getByRole('link', { name: 'Explore Vekrun Teams' })).toHaveAttribute('href', '/teams/');
    for (const href of await page.locator('main a.btn').evaluateAll((els) => els.map((e) => e.getAttribute('href')!))) {
      if (href.startsWith('#')) continue;
      expect((await page.request.get(href.replace(/[?#].*/, ''))).status(), href).toBe(200);
    }
  });
});

test.describe('live share and privacy', () => {
  test('the homepage shows Live Share with a real screenshot', async ({ page }) => {
    await page.goto('/');
    const sec = page.locator('section[aria-labelledby="share-title"]');
    await expect(sec.locator('img[src="/shots/liveshare-review-1440.webp"]')).toBeAttached();
    await expect(sec.getByRole('link', { name: 'How Live Share works' })).toHaveAttribute('href', '/product/#live-share');
  });

  test('privacy says what Live Share relays through the gateway and no longer claims no Vekrun server', async ({ page }) => {
    await page.goto('/privacy/');
    await expect(page.locator('main')).not.toContainText('passes through no Vekrun server');
    const ls = page.locator('#live-share');
    await expect(ls).toHaveText('Live Share');
    for (const t of ['What stays local.', 'What the gateway relays.', 'What the gateway keeps.']) await expect(page.locator('main')).toContainText(t);
    await page.goto('/security/');
    await expect(page.locator('#live-share')).toHaveText('Live Share goes through our gateway');
  });

  test('integrations separate agents, native services and MCP, and list nothing unfinished as shipped', async ({ page }) => {
    await page.goto('/integrations/');
    await expect(page.locator('main')).toContainText('Antigravity CLI');
    await expect(page.locator('main')).not.toContainText(/Gemini CLI|Kamal|Vercel|PagerDuty/);
    await expect(page.getByRole('heading', { name: 'Native integrations.' })).toBeVisible();
    await expect(page.locator('#mcp')).toContainText('Planned: Asana tools for agents');
  });
});

test.describe('remote factory', () => {
  test('the homepage introduces Teams Remote Factory and links to the explanation', async ({ page }) => {
    await page.goto('/');
    const sec = page.locator('#teams');
    await expect(sec.getByRole('heading', { level: 2 })).toHaveText('One Factory for the whole team, wherever they work.');
    await expect(sec.getByRole('group', { name: 'Infrastructure your organization controls' })).toBeVisible();
    await expect(sec.getByText('Illustrative product concept with demonstration data.')).toBeVisible();
    await expect(sec.getByRole('link', { name: /Why teams run their own Factory/ })).toHaveAttribute('href', '/teams/#remote');
  });

  test('the Teams page leads with Remote Factory and keeps pricing honest', async ({ page }) => {
    await page.goto('/teams/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Your engineering Factory shouldn’t stop when you leave your desk.');
    await expect(page.locator('#remote')).toContainText('Nothing leaves your control');
    await expect(page.getByText('Code, credentials and execution policies stay here.')).toBeVisible();
    await expect(page.locator('#pricing')).toContainText('Will run on your servers. Your team works with it from anywhere.');
    await expect(page.locator('main')).toContainText('Vekrun Teams comes after Personal.');
    await expect(page.getByRole('link', { name: 'Request Teams early access' }).first()).toHaveAttribute('href', '/download/#early-access');
    await expect(page.getByText(/enterprise/i).first()).toBeAttached();
    await expect(page.locator('main')).not.toContainText(/\$19\b/);
  });
});

test.describe('product', () => {
  test('every product demo plays to completion and is labelled a concept', async ({ page }) => {
    test.setTimeout(180_000);
    await page.goto('/product/');
    const roots = page.locator('[data-demo-root]');
    expect(await roots.count()).toBeGreaterThanOrEqual(2);
    for (let i = 0; i < (await roots.count()); i++) {
      await roots.nth(i).scrollIntoViewIfNeeded();
      await expect(roots.nth(i)).toHaveAttribute('data-demo', 'done', { timeout: 60_000 });
      await expect(roots.nth(i).getByText(/Illustrative product concept/).first()).toBeVisible();
    }
  });

  test('has every section the old URLs point at', async ({ page }) => {
    await page.goto('/product/');
    for (const id of ['how', 'factory', 'git', 'live-share', 'council', 'board', 'inbox', 'verification', 'memory', 'mobile', 'tools']) await expect(page.locator(`#${id}`), id).toHaveCount(1);
  });

  test('Live Share, delivery and memory use real screenshots that load', async ({ page }) => {
    await page.goto('/product/');
    for (const [id, shot] of [['live-share', 'liveshare-review'], ['factory', 'project-delivery'], ['memory', 'memory-understand']] as const) {
      const img = page.locator(`#${id} img[src="/shots/${shot}-1440.webp"]`);
      await img.scrollIntoViewIfNeeded();
      await expect(img, shot).toHaveJSProperty('complete', true);
      expect(await img.evaluate((i: HTMLImageElement) => i.naturalWidth), shot).toBeGreaterThan(0);
      await expect(page.locator(`#${id} figcaption`)).toContainText('Vekrun desktop app');
    }
    await expect(page.locator('#live-share a[href="/privacy/#live-share"]')).toBeVisible();
    await expect(page.locator('#memory')).toContainText('Obsidian vault');
  });

  test('the Board flow ends with a pull request waiting for a person', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/product/');
    const bf = page.locator('[data-board-flow]');
    await bf.scrollIntoViewIfNeeded();
    await expect(bf).toHaveAttribute('data-demo', 'done');
    await expect(bf.locator('[data-bf-state]')).toHaveText('Waiting for review');
  });

  test('Inbox approvals work in the demonstration only', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/product/');
    const ap = page.locator('[data-approvals]');
    await ap.getByRole('tab', { name: /Rotate the webhook signing secret/ }).click();
    await ap.getByRole('button', { name: 'Reject' }).filter({ visible: true }).click();
    await expect(ap.getByText(/Rejected by/).filter({ visible: true }).first()).toBeVisible();
  });
});

test.describe('new pages', () => {
  test('Benefits covers six themes and both audiences without invented numbers', async ({ page }) => {
    await page.goto('/benefits/');
    await expect(page.locator('main .bn')).toHaveCount(6);
    await expect(page.getByRole('heading', { name: 'For developers' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'For engineering teams' })).toBeVisible();
    await expect(page.locator('main')).not.toContainText(/\d+\s?%|\d+x faster/i);
  });

  test('Before & After is labelled illustrative and has no testimonials', async ({ page }) => {
    await page.goto('/before-and-after/');
    await expect(page.getByText('Illustrative comparisons, not customer quotes.')).toBeVisible();
    expect(await page.getByText('Before', { exact: true }).count()).toBeGreaterThanOrEqual(7);
    expect(await page.getByText('After', { exact: true }).count()).toBeGreaterThanOrEqual(7);
    await expect(page.locator('main blockquote, main q')).toHaveCount(0);
  });
});

test.describe('teams and pricing', () => {
  test('prices with the planned formula and sells nothing', async ({ page }) => {
    await page.goto('/teams/');
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /\/og\/teams\.png$/);
    await expect(page.getByText('Planned launch pricing. Vekrun Teams isn’t on sale yet.').first()).toBeVisible();
    const calc = page.locator('[data-teams-calc]');
    await calc.scrollIntoViewIfNeeded();
    const monthly = calc.locator('[data-pc-monthly]');
    await expect(monthly).toHaveText('$399');
    await expect(calc.locator('[data-pc-annual]')).toContainText('$4,788');
    const num = calc.getByLabel('Engineers, typed');
    for (const [n, cost] of [[1, '$199'], [10, '$199'], [11, '$209'], [20, '$299'], [30, '$399'], [100, '$1,099']] as const) {
      await num.fill(String(n));
      await expect(monthly).toHaveText(cost);
    }
    const range = calc.getByLabel('Engineers', { exact: true });
    await range.focus();
    await page.keyboard.press('Home');
    await expect(monthly).toHaveText('$199');
  });

  test('FAQ opens and its structured data matches the formula', async ({ page }) => {
    await page.goto('/teams/');
    const faq = page.locator('details.faq-i').first();
    await faq.locator('summary').click();
    await expect(faq).toHaveAttribute('open', '');
    await expect(faq).toContainText('$299');
    const ld = await page.locator('script[type="application/ld+json"]').evaluateAll((els) => els.map((e) => JSON.parse(e.textContent ?? '{}')));
    const faqLd = ld.find((d) => d['@type'] === 'FAQPage');
    expect(faqLd.mainEntity.length).toBeGreaterThanOrEqual(5);
    expect(JSON.stringify(faqLd)).toContain('$399');
  });
});

test.describe('navigation and theme', () => {
  test('the desktop header has exactly the five destinations and they resolve', async ({ page, isMobile }) => {
    test.skip(isMobile, 'desktop navigation only');
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Primary' });
    await expect(nav.getByRole('link')).toHaveText(['Product', 'Benefits', 'Before & After', 'Integrations', 'Teams & Pricing']);
    await expect(page.getByRole('button', { name: 'Open menu' })).toBeHidden();
    for (const l of await nav.getByRole('link').all()) {
      const href = (await l.getAttribute('href'))!;
      expect((await page.request.get(href)).status(), href).toBe(200);
    }
    await page.goto('/benefits/');
    await expect(nav.getByRole('link', { name: 'Benefits' })).toHaveAttribute('aria-current', 'page');
  });

  test('the phone menu lists the five destinations and closes on Escape', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'mobile only');
    await page.goto('/');
    await page.getByRole('button', { name: 'Open menu' }).click();
    const mnav = page.getByRole('navigation', { name: 'Primary, mobile' });
    await expect(mnav).toBeVisible();
    for (const label of ['Product', 'Benefits', 'Before & After', 'Integrations', 'Teams & Pricing']) await expect(mnav.getByRole('link', { name: label })).toBeVisible();
    await expect(mnav).not.toContainText(/Docs|Roadmap|How it works/);
    await expect(page.getByRole('button', { name: 'Close menu' })).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Escape');
    await expect(mnav).toBeHidden();
    await noOverflow(page);
  });

  test('the footer has the utility links and no Docs or Roadmap', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer');
    for (const label of ['Get Vekrun', 'Security', 'Privacy', 'Licence', 'Contact']) await expect(footer.getByRole('link', { name: label })).toBeVisible();
    await expect(footer).not.toContainText(/Docs|Documentation|Roadmap|How it works/);
  });

  test('theme choice switches, persists and can follow the system again', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');
    const theme = page.getByRole('group', { name: 'Theme' }).first();
    await theme.getByRole('button', { name: 'Use light theme' }).click();
    await expect(html).toHaveAttribute('data-theme', 'light');
    await expect(theme.getByRole('button', { name: 'Use light theme' })).toHaveAttribute('aria-pressed', 'true');
    await page.reload();
    await expect(html).toHaveAttribute('data-theme', 'light');
    await page.goto('/teams/');
    await expect(html).toHaveAttribute('data-theme', 'light');
    await page.getByRole('group', { name: 'Theme' }).first().getByRole('button', { name: 'Use dark theme' }).click();
    await expect(html).toHaveAttribute('data-theme', 'dark');
    await page.getByRole('group', { name: 'Theme' }).first().getByRole('button', { name: 'Use system theme' }).click();
    await expect(html).toHaveAttribute('data-theme-choice', 'system');
  });

  test('without a stored choice the theme follows the system', async ({ browser }) => {
    for (const scheme of ['light', 'dark'] as const) {
      const ctx = await browser.newContext({ colorScheme: scheme });
      const page = await ctx.newPage();
      await page.goto('/');
      await expect(page.locator('html')).toHaveAttribute('data-theme', scheme);
      await expect(page.locator('meta[name="theme-color"]').first()).toHaveAttribute('content', scheme === 'light' ? '#ffffff' : '#1b1c23');
      await ctx.close();
    }
  });

  test('skip link targets main content', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
    await expect(page.locator('#main')).toHaveCount(1);
  });
});

test.describe('get vekrun', () => {
  test('early access is a plain email link, with no form', async ({ page }) => {
    await page.goto('/download/');
    const section = page.locator('#early-access');
    await expect(section.getByRole('link', { name: 'Email manoylo@hey.com' })).toHaveAttribute('href', 'mailto:manoylo@hey.com?subject=Vekrun%20early%20access');
    await expect(page.locator('form')).toHaveCount(0);
  });

  test('states plainly that there is no download yet and offers no installer', async ({ page }) => {
    await page.goto('/download/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Request early access.');
    await expect(page.getByRole('list', { name: 'Availability by platform' }).getByRole('listitem')).toHaveCount(3);
    await expect(page.locator('a[href$=".dmg"], a[href$=".exe"], a[href$=".msi"], a[href$=".AppImage"], a[href$=".deb"]')).toHaveCount(0);
    await expect(page.getByRole('link', { name: /build from source/i })).toHaveCount(0);
  });
});

test.describe('brand', () => {
  test('logo, favicon, touch icon and OG images are published in the charcoal and lime palette', async ({ page }) => {
    for (const asset of ['/favicon.svg', '/apple-touch-icon.png', '/brand/vekrun-mark.svg', '/og/default.png', '/og/teams.png', '/og/benefits.png', '/og/before-and-after.png']) {
      expect((await page.request.get(asset)).status(), asset).toBe(200);
    }
    const fav = await (await page.request.get('/favicon.svg')).text();
    expect(fav.toLowerCase()).toContain('#b9f58b');
    expect(fav.toLowerCase()).toContain('#272832');
  });
});

test.describe('retired routes and SEO', () => {
  test('old URLs redirect to their new homes', async ({ page }) => {
    for (const [from, to] of [
      ['/docs/', /\/product\/$/],
      ['/docs/getting-started/installation/', /\/download\/$/],
      ['/docs/settings/data-storage/', /\/privacy\/$/],
      ['/roadmap/', /\/product\/$/],
      ['/how-it-works/', /\/product\/#how$/],
      ['/features/factory/', /\/product\/#factory$/],
      ['/features/insights/', /\/product\/#board$/],
      ['/cloud/', /\/teams\/$/],
      ['/pricing/', /\/teams\/#pricing$/],
      ['/open-source/', /\/license\/$/],
    ] as const) {
      await page.goto(from);
      await expect(page, from).toHaveURL(to);
    }
  });

  test('redirect stubs are noindex and expose no old content', async ({ page }) => {
    const html = await (await page.request.get('/roadmap/')).text();
    expect(html).toMatch(/noindex/);
    expect(html.length).toBeLessThan(1500);
  });

  test('unknown routes serve the custom 404', async ({ page }) => {
    const res = await page.goto('/this-does-not-exist/');
    expect(res?.status()).toBe(404);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('nothing at this address');
    await expect(page.locator('main a[href*="/docs/"]')).toHaveCount(0);
  });

  test('sitemap lists only live pages, and robots points at it', async ({ page }) => {
    const sm = await (await page.request.get('/sitemap-0.xml')).text();
    for (const p of pages) expect(sm, p).toContain(`<loc>https://vekrunapp.com${p}</loc>`);
    expect(sm).not.toMatch(/\/(docs|roadmap|how-it-works|features|cloud|pricing)\//);
    const robots = await (await page.request.get('/robots.txt')).text();
    expect(robots).toContain('Sitemap: https://vekrunapp.com/sitemap-index.xml');
  });
});
