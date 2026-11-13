import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const noOverflow = async (page: Page) => {
  const over = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(over, 'page must not scroll horizontally').toBe(false);
};
const purchase = /buy|checkout|subscribe|start trial|free trial|sign up/i;
const statusWords = /\b(in development|planned feature|under consideration|not (yet )?implemented|verified in development|status:)\b/i;

const pages = ['/', '/product/', '/how-it-works/', '/pricing/', '/integrations/', '/download/', '/security/', '/privacy/', '/license/', '/contact/'];

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
      await expect(main).not.toContainText(/Vekrun is (free and )?open[- ]source|Apache License|AI-native terminal|Vekrun Teams|\$199|Vekrun Personal/i);
      await expect(main).not.toContainText(/requires? (Claude Code|Codex)|(Claude Code|Codex) (is|are) required/i);
      await expect(page.getByRole('link', { name: purchase })).toHaveCount(0);
      await expect(page.getByRole('button', { name: purchase })).toHaveCount(0);
      await expect(page.locator('a[href*="/docs/"], a[href*="/roadmap/"], a[href*="/features/"], a[href*="/teams/"], a[href*="/benefits/"], a[href*="/before-and-after/"]')).toHaveCount(0);
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
  test('renders the central message, trust signals, metadata and structured data', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Your AI engineering team. On your machine.');
    await expect(page.getByText('From idea to verified software.')).toBeVisible();
    await expect(page).toHaveTitle('Vekrun · Your AI engineering team. On your machine.');
    await expect(page.getByRole('list', { name: 'Why Vekrun' }).getByRole('listitem')).toHaveText(['Local-first', 'Model-independent', 'Works with your stack', 'Free for individuals']);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /\/og\/default\.png$/);
    const types = await page.locator('script[type="application/ld+json"]').evaluateAll((els) => els.map((e) => JSON.parse(e.textContent ?? '{}')['@type']));
    expect(types).toEqual(expect.arrayContaining(['Organization', 'WebSite', 'SoftwareApplication']));
  });

  test('tells one story in seven sections', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('main > section')).toHaveCount(9);
    await expect(page.locator('main h2')).toHaveText([
      'Your stack. Your repository. Your workflow.',
      'One engineering workflow, from request to pull request.',
      'Your models. Your choice.',
      'Your project shouldn’t start from zero every session.',
      'Don’t send screenshots. Send the app.',
      'Done means proven, not just claimed.',
      'Free for individuals. Cloud and Enterprise to follow.',
      'Hand Vekrun your next outcome.',
    ]);
  });

  test('makes model independence unmistakable, native agent first', async ({ page }) => {
    await page.goto('/');
    const sec = page.locator('#models');
    await expect(sec).toContainText('You don’t need to install or subscribe to Claude Code, Codex or any other coding-agent CLI to use Vekrun.');
    const cards = sec.locator('article');
    await expect(cards.first()).toContainText('Vekrun’s native agent');
    await expect(cards.first()).toContainText('OpenRouter');
    await expect(cards.nth(1)).toContainText('Optional');
    await expect(cards.nth(1)).toContainText('None of them is required');
    await expect(sec).toContainText('billed by the provider you choose');
  });

  test('shows the stack in two seamless marquees that stand still under reduced motion', async ({ page }) => {
    await page.goto('/');
    const mq = page.getByRole('region', { name: 'Technologies Vekrun works with' });
    for (const n of ['Ruby on Rails', 'Laravel', 'Expo', 'Flutter', 'PostgreSQL', 'Supabase']) await expect(mq.locator('.sr-only')).toContainText(n);
    await expect(mq.locator('.mq-track').first()).toHaveCSS('animation-name', 'mq-slide');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(mq.locator('.mq-track').first()).toHaveCSS('animation-name', 'none');
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

  test('the workflow, Memory, Live Share and Proof Pack demos play to their final state', async ({ page }) => {
    test.setTimeout(120_000);
    await page.goto('/');
    for (const sel of ['[data-howflow]', '[data-memory]', '[data-liveshare]', '[data-proofpack]']) {
      const d = page.locator(sel).first();
      await d.scrollIntoViewIfNeeded();
      await expect(d, sel).toHaveAttribute('data-demo', /playing|done/);
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload();
    await expect(page.locator('[data-liveshare] [data-ls-state="verified"]')).toHaveText('Verified on 9c41a7e');
    await expect(page.locator('[data-memory] [data-m-q]')).toHaveText('Why do payment webhooks use an idempotency key?');
    await expect(page.locator('[data-memory] [data-m-link]')).toHaveCount(4);
    await expect(page.locator('[data-liveshare]')).toContainText('served from your machine while Live Share is on');
  });

  test('every call to action on the homepage resolves', async ({ page }) => {
    await page.goto('/');
    for (const href of await page.locator('main a.btn, main a.link-more').evaluateAll((els) => els.map((e) => e.getAttribute('href')!))) {
      if (href.startsWith('#') || href.startsWith('mailto:')) continue;
      expect((await page.request.get(href.replace(/[?#].*/, ''))).status(), href).toBe(200);
    }
  });
});

test.describe('pricing', () => {
  test('has Free, Cloud and Enterprise and no Teams pricing', async ({ page }) => {
    await page.goto('/pricing/');
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /\/og\/pricing\.png$/);
    await expect(page.locator('.plan h3')).toHaveText(['Free', 'Cloud', 'Enterprise']);
    const [free, cloud, ent] = [page.locator('.plan.is-free'), page.locator('.plan.is-cloud'), page.locator('.plan.is-enterprise')];
    await expect(free).toContainText('$0');
    await expect(free).toContainText('forever');
    await expect(free.getByRole('link', { name: 'Request early access' })).toHaveAttribute('href', '/download/');
    await expect(cloud).toContainText('Coming soon');
    await expect(cloud).toContainText('Pricing TBD');
    await expect(cloud.getByRole('link', { name: 'Join the wishlist' })).toHaveAttribute('href', '/pricing/#cloud-wishlist');
    await expect(ent).toContainText('Custom');
    await expect(ent.getByRole('link', { name: 'Register interest' })).toHaveAttribute('href', /^mailto:support@vekrunapp\.com\?subject=Vekrun%20Enterprise%20interest/);
    for (const p of [cloud, ent]) await expect(p).toContainText('Planned. Not available yet.');
    await expect(page.locator('main')).not.toContainText(/\$199|\$99|per engineer|calculator/i);
    await expect(page.locator('main')).toContainText('Every plan uses the models you choose');
    await expect(page.locator('[data-teams-calc]')).toHaveCount(0);
  });

  test('only the Cloud card says Coming soon', async ({ page }) => {
    for (const path of ['/', '/pricing/']) {
      await page.goto(path);
      await expect(page.getByText('Coming soon', { exact: true })).toHaveCount(1);
      await expect(page.locator('.plan.is-cloud')).toContainText('Coming soon');
    }
  });

  test('the Cloud wishlist is a real email with consent and an unsubscribe path', async ({ page }) => {
    await page.goto('/pricing/');
    const wl = page.locator('#cloud-wishlist');
    const href = (await wl.locator('[data-wishlist]').getAttribute('href'))!;
    expect(href).toMatch(/^mailto:support@vekrunapp\.com\?subject=Vekrun%20Cloud%20wishlist&body=/);
    const body = decodeURIComponent(href.split('body=')[1]!);
    expect(body).toContain('email me about Vekrun Cloud');
    expect(body).toContain('Individual / Team / Enterprise');
    await expect(wl).toContainText('reply “unsubscribe” to be removed');
    await expect(wl.getByRole('link', { name: 'Privacy' })).toHaveAttribute('href', '/privacy/');
    await expect(page.locator('form')).toHaveCount(0);
  });

  test('the FAQ opens and matches its structured data', async ({ page }) => {
    await page.goto('/pricing/');
    const faq = page.locator('details.faq-i').nth(2);
    await faq.locator('summary').click();
    await expect(faq).toHaveAttribute('open', '');
    await expect(faq).toContainText('optional integrations');
    const ld = await page.locator('script[type="application/ld+json"]').evaluateAll((els) => els.map((e) => JSON.parse(e.textContent ?? '{}')));
    const faqLd = ld.find((d) => d['@type'] === 'FAQPage');
    expect(faqLd.mainEntity.length).toBe(await page.locator('details.faq-i').count());
  });
});

test.describe('how it works', () => {
  test('walks the five stages and keeps the sections old URLs point at', async ({ page }) => {
    await page.goto('/how-it-works/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('From idea to verified software, in five steps.');
    await expect(page.getByRole('navigation', { name: 'On this page' }).getByRole('link')).toHaveText(['Describe', 'Plan', 'Build', 'Verify', 'Review']);
    for (const id of ['describe', 'council', 'factory', 'verification', 'git', 'inbox']) await expect(page.locator(`#${id}`), id).toHaveCount(1);
    await expect(page.locator('#verification')).toContainText('what wasn’t checked');
  });

  test('the Council seats appear and the decision follows', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/how-it-works/');
    const c = page.locator('[data-council]');
    await c.scrollIntoViewIfNeeded();
    await expect(c).toHaveAttribute('data-demo', 'done');
    await expect(c.locator('[data-cn-seat].is-off')).toHaveCount(0);
    await expect(c.locator('[data-cn-decision]')).toBeVisible();
  });

  test('Inbox approvals work in the demonstration only', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/how-it-works/');
    const ap = page.locator('[data-approvals]');
    await ap.getByRole('tab', { name: /Rotate the webhook signing secret/ }).click();
    await ap.getByRole('button', { name: 'Reject' }).filter({ visible: true }).click();
    await expect(ap.getByText(/Rejected by/).filter({ visible: true }).first()).toBeVisible();
  });

  test('the delivery screenshot loads', async ({ page }) => {
    await page.goto('/how-it-works/');
    const img = page.locator('#factory img[src="/shots/project-delivery-1440.webp"]');
    await img.scrollIntoViewIfNeeded();
    await expect(img).toHaveJSProperty('complete', true);
    expect(await img.evaluate((i: HTMLImageElement) => i.naturalWidth)).toBeGreaterThan(0);
  });
});

test.describe('conversion paths', () => {
  for (const path of ['/', '/product/', '/how-it-works/', '/integrations/']) {
    test(`${path} ends with early access and pricing`, async ({ page }) => {
      await page.goto(path);
      const next = page.locator('section[aria-labelledby="next-title"]');
      await expect(next.getByRole('link', { name: 'Request early access' })).toHaveAttribute('href', '/download/');
      await expect(next.getByRole('link', { name: 'See pricing' })).toHaveAttribute('href', '/pricing/');
      await expect(next).toContainText('No public download yet');
    });
  }
});

test.describe('live share and privacy', () => {
  test('privacy says what Live Share relays and how wishlist emails are handled', async ({ page }) => {
    await page.goto('/privacy/');
    await expect(page.locator('main')).not.toContainText('passes through no Vekrun server');
    await expect(page.locator('#live-share')).toHaveText('Live Share');
    for (const t of ['What stays local.', 'What the gateway relays.', 'What the gateway keeps.', 'Cloud wishlist', 'unsubscribe', 'No cookies, analytics']) await expect(page.locator('main')).toContainText(t);
    await page.goto('/security/');
    await expect(page.locator('#live-share')).toHaveText('Live Share goes through our gateway');
  });

  test('integrations put the native agent first, mark coding agents optional and list nothing unfinished as shipped', async ({ page }) => {
    await page.goto('/integrations/');
    const h2s = page.locator('main h2');
    await expect(h2s.nth(0)).toHaveText('Vekrun’s native agent');
    await expect(h2s.nth(1)).toHaveText('Optional coding agents');
    await expect(page.locator('main')).toContainText('None of them is required');
    await expect(page.locator('main')).toContainText('Antigravity CLI');
    await expect(page.locator('main')).not.toContainText(/Gemini CLI|Kamal|Vercel|PagerDuty/);
    await expect(page.getByRole('heading', { name: 'Native integrations.' })).toBeVisible();
    await expect(page.locator('#mcp')).toContainText('Planned: Asana tools for agents');
  });
});

test.describe('product', () => {
  test('every product demo plays to completion and is labelled a concept', async ({ page }) => {
    test.setTimeout(180_000);
    await page.goto('/product/');
    const roots = page.locator('[data-demo-root]');
    expect(await roots.count()).toBeGreaterThanOrEqual(1);
    for (let i = 0; i < (await roots.count()); i++) {
      await roots.nth(i).scrollIntoViewIfNeeded();
      await expect(roots.nth(i)).toHaveAttribute('data-demo', 'done', { timeout: 60_000 });
      await expect(roots.nth(i).getByText(/Illustrative product concept/).first()).toBeVisible();
    }
  });

  test('has every section the old URLs point at, models first', async ({ page }) => {
    await page.goto('/product/');
    await expect(page.getByRole('navigation', { name: 'On this page' }).getByRole('link').first()).toHaveText('Models');
    for (const id of ['models', 'memory', 'live-share', 'stack', 'board', 'mobile', 'tools']) await expect(page.locator(`#${id}`), id).toHaveCount(1);
  });

  test('Live Share and Memory use real screenshots that load', async ({ page }) => {
    await page.goto('/product/');
    for (const [id, shot] of [['live-share', 'liveshare-review'], ['memory', 'memory-understand']] as const) {
      const img = page.locator(`#${id} img[src="/shots/${shot}-1440.webp"]`);
      await img.scrollIntoViewIfNeeded();
      await expect(img, shot).toHaveJSProperty('complete', true);
      expect(await img.evaluate((i: HTMLImageElement) => i.naturalWidth), shot).toBeGreaterThan(0);
      await expect(page.locator(`#${id} figcaption`)).toContainText('Vekrun desktop app');
    }
    await expect(page.locator('#live-share a[href="/privacy/#live-share"]')).toBeVisible();
    await expect(page.locator('#live-share')).toContainText('not hosted for you');
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
});

test.describe('navigation and theme', () => {
  test('the desktop header has Product, How It Works and Pricing, and Get Vekrun', async ({ page, isMobile }) => {
    test.skip(isMobile, 'desktop navigation only');
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Primary' });
    await expect(nav.getByRole('link')).toHaveText(['Product', 'How It Works', 'Pricing']);
    await expect(page.locator('header').getByRole('link', { name: 'Get Vekrun' })).toHaveAttribute('href', '/download/');
    await expect(page.getByRole('button', { name: 'Open menu' })).toBeHidden();
    for (const l of await nav.getByRole('link').all()) {
      const href = (await l.getAttribute('href'))!;
      expect((await page.request.get(href)).status(), href).toBe(200);
    }
    await page.goto('/pricing/');
    await expect(nav.getByRole('link', { name: 'Pricing' })).toHaveAttribute('aria-current', 'page');
  });

  test('the phone menu lists the destinations and closes on Escape', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'mobile only');
    await page.goto('/');
    await page.getByRole('button', { name: 'Open menu' }).click();
    const mnav = page.getByRole('navigation', { name: 'Primary, mobile' });
    await expect(mnav).toBeVisible();
    for (const label of ['Product', 'How It Works', 'Pricing', 'Get Vekrun']) await expect(mnav.getByRole('link', { name: label })).toBeVisible();
    await expect(mnav).not.toContainText(/Docs|Roadmap|Teams|Benefits/);
    await expect(page.getByRole('button', { name: 'Close menu' })).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Escape');
    await expect(mnav).toBeHidden();
    await noOverflow(page);
  });

  test('the footer has the utility links and no Docs or Roadmap', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer');
    for (const label of ['Integrations', 'Get Vekrun', 'Security', 'Privacy', 'Licence', 'Contact']) await expect(footer.getByRole('link', { name: label })).toBeVisible();
    await expect(footer).not.toContainText(/Docs|Documentation|Roadmap|Teams|Benefits/);
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
    await page.goto('/pricing/');
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
    await expect(section.getByRole('link', { name: 'Email support@vekrunapp.com' })).toHaveAttribute('href', 'mailto:support@vekrunapp.com?subject=Vekrun%20early%20access');
    await expect(page.locator('main')).not.toContainText('manoylo@hey.com');
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
    for (const asset of ['/favicon.svg', '/apple-touch-icon.png', '/brand/vekrun-mark.svg', '/og/default.png', '/og/pricing.png', '/og/how-it-works.png']) {
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
      ['/features/factory/', /\/how-it-works\/#factory$/],
      ['/features/planning/', /\/how-it-works\/#council$/],
      ['/features/insights/', /\/product\/#board$/],
      ['/features/engineering-memory/', /\/product\/#memory$/],
      ['/cloud/', /\/pricing\/#cloud-wishlist$/],
      ['/teams/', /\/pricing\/$/],
      ['/benefits/', /vekrunapp\.com\/$|localhost:\d+\/$/],
      ['/before-and-after/', /\/how-it-works\/$/],
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
    expect(sm).not.toMatch(/\/(docs|roadmap|features|cloud|teams|benefits|before-and-after)\//);
    const robots = await (await page.request.get('/robots.txt')).text();
    expect(robots).toContain('Sitemap: https://vekrunapp.com/sitemap-index.xml');
  });
});
