import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const noOverflow = async (page: Page) => {
  const over = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(over, 'page must not scroll horizontally').toBe(false);
};
const purchase = /buy|checkout|subscribe|start trial|free trial|sign up/i;
const statusWords = /\b(in development|planned feature|under consideration|not (yet )?implemented|verified in development|status:)\b/i;

const pages = ['/', '/product/', '/how-it-works/', '/before-and-after/', '/pricing/', '/integrations/', '/download/', '/security/', '/privacy/', '/license/', '/contact/'];

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
      await expect(main).not.toContainText(/Vekrun is (free and )?open[- ]source|Apache License|AI-native terminal|Vekrun Personal/i);
      await expect(main, 'no old Cloud or Enterprise plans').not.toContainText(/Vekrun Cloud|Cloud wishlist|Vekrun Enterprise|Enterprise (tier|plan) is|\$99|per developer/i);
      await expect(main).not.toContainText(/requires? (Claude Code|Codex)|(Claude Code|Codex) (is|are) required/i);
      await expect(page.getByRole('link', { name: purchase })).toHaveCount(0);
      await expect(page.getByRole('button', { name: purchase })).toHaveCount(0);
      await expect(page.locator('a[href*="/docs/"], a[href*="/roadmap/"], a[href*="/features/"], a[href*="/teams/"], a[href*="/cloud/"], a[href*="/benefits/"], a[href*="#cloud-wishlist"]')).toHaveCount(0);
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
    await expect(page.getByRole('list', { name: 'Why Vekrun' }).getByRole('listitem')).toHaveText(['Local-first', 'Download local AI models', 'Model-independent', 'Works with your stack', 'Free for individuals']);
    await expect(page.getByRole('link', { name: 'Download local AI models' })).toHaveAttribute('href', '#models');
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /\/og\/default\.png$/);
    const types = await page.locator('script[type="application/ld+json"]').evaluateAll((els) => els.map((e) => JSON.parse(e.textContent ?? '{}')['@type']));
    expect(types).toEqual(expect.arrayContaining(['Organization', 'WebSite', 'SoftwareApplication']));
  });

  test('tells the story in order, from stack to plans', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('main h2')).toHaveText([
      'Your stack. Your repository. Your workflow.',
      'One engineering workflow, from request to pull request.',
      'Your AI. Your hardware. Your choice.',
      'Software that understands your software.',
      'Let anyone experience what you’re building.',
      'Done means proven, not just claimed.',
      'More than an AI coding agent.',
      'Stop managing AI agents. Start directing engineering.',
      'Free for you. Teams on your infrastructure.',
      'Hand Vekrun your next outcome.',
    ]);
    for (const a of await page.locator('#more .hl a').evaluateAll((els) => els.map((e) => e.getAttribute('href')!))) expect(a).toMatch(/^\/product\/#/);
    await expect(page.locator('#before-after .ba-row')).toHaveCount(3);
    await expect(page.locator('#before-after').getByRole('link', { name: 'See all eight moments' })).toHaveAttribute('href', '/before-and-after/');
    await expect(page.getByRole('list', { name: 'App types Live Share supports' }).getByRole('listitem')).toHaveText(['Web', 'iOS', 'Android', 'Expo', 'Flutter', 'Desktop']);
  });

  test('makes model independence unmistakable, native agent first', async ({ page }) => {
    await page.goto('/');
    const sec = page.locator('#models');
    await expect(sec).toContainText('You don’t need Claude Code, Codex or any other coding-agent subscription to use Vekrun.');
    const cards = sec.locator('article');
    await expect(cards.first()).toContainText('Vekrun’s native agent');
    await expect(cards.first()).toContainText('OpenRouter');
    await expect(cards.nth(1)).toContainText('Optional');
    await expect(cards.nth(1)).toContainText('None of them is required');
    await expect(sec).toContainText('billed by the provider you choose');
    await expect(cards.first().getByText('Download local AI models')).toBeVisible();
    await expect(sec).toContainText('running the entire autonomous Factory on a local model alone is still being certified');
    const lib = sec.locator('[data-mdl]');
    await expect(lib).toContainText('Example');
    for (const t of ['9.0 GB', 'Runs well on this machine', 'Needs 64 GB of memory', 'Too large', 'Installed', 'Downloads through Ollama']) await expect(lib).toContainText(t);
    await expect(sec).toContainText('doesn’t ship its own inference engine');
    await expect(sec).toContainText('doesn’t make every workflow offline');
    await expect(page.locator('main')).not.toContainText('Illustrative product concept');
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

  test('the Factory hero reaches its final state and can replay', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const f = page.locator('[data-factory]');
    await expect(f).toHaveAttribute('data-demo', 'done');
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
    await expect(page.locator('[data-mdl] [data-state-btn]')).toHaveText('In use');
    await expect(page.locator('[data-mdl] [data-pct]')).toHaveText('Selected for coding');
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
  test('has two plans: Free for individuals and Teams, self-hosted and planned', async ({ page }) => {
    await page.goto('/pricing/');
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /\/og\/pricing\.png$/);
    await expect(page.locator('.plan h3')).toHaveText(['Free', 'Teams']);
    const [free, teams] = [page.locator('.plan.is-free'), page.locator('.plan.is-teams')];
    await expect(free.locator('.plan-price')).toHaveText(/\$0\s*forever/);
    await expect(free).toContainText('For individual engineers');
    await expect(free).toContainText('Free on your machine');
    for (const k of ['Competitive Engineering', 'Change Impact Intelligence', 'CLI and MCP']) await expect(free).toContainText(k);
    await expect(free.getByRole('link', { name: 'Request early access' })).toHaveAttribute('href', '/download/');
    await expect(teams.locator('.plan-price')).toHaveText(/\$199\s*per month, includes 10 engineers/);
    await expect(teams).toContainText('USD. $10 per month for each additional engineer.');
    await expect(teams).toContainText('self-hosted');
    await expect(teams).toContainText('Planned. Not available yet.');
    await expect(teams.getByRole('link', { name: 'Register Teams interest' })).toHaveAttribute('href', /^mailto:support@vekrunapp\.com\?subject=Vekrun%20Teams%20interest&body=/);
    await expect(page.locator('main')).toContainText('Vekrun charges no usage fees');
    await expect(page.locator('main')).not.toContainText(/unlimited|SSO|SOC 2|end-to-end encrypt|compliance certif/i);
  });

  test('the Teams calculator charges $199 up to 10 engineers and $10 for each one after', async ({ page }) => {
    await page.goto('/pricing/#teams');
    const calc = page.locator('[data-teams-calc]');
    const input = calc.getByLabel('Engineers on your team');
    const total = calc.locator('[data-total]');
    await expect(input).toHaveValue('10');
    await expect(total).toHaveText('$199');
    await calc.getByRole('button', { name: 'One more engineer' }).click();
    await expect(input).toHaveValue('11');
    await expect(total).toHaveText('$209');
    await expect(calc).toContainText('$199 for the first 10 engineers, plus 1 × $10.');
    for (const [n, price] of [['5', '$199'], ['10', '$199'], ['20', '$299'], ['30', '$399'], ['1', '$199']] as const) {
      await input.fill(n);
      await expect(total, `${n} engineers`).toHaveText(price);
    }
    await calc.getByRole('button', { name: 'One fewer engineer' }).click();
    await expect(input).toHaveValue('1');
    await expect(calc.getByRole('list', { name: 'Example monthly prices' }).getByRole('listitem')).toHaveText([/5 engineers\s*\$199/, /10 engineers\s*\$199/, /11 engineers\s*\$209/, /20 engineers\s*\$299/, /30 engineers\s*\$399/]);
  });

  test('the calculator reads correctly without JavaScript', async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto('/pricing/');
    await expect(page.locator('[data-teams-calc] [data-total]')).toHaveText('$199');
    await expect(page.locator('[data-teams-calc]')).toContainText('11 engineers');
    await ctx.close();
  });

  test('Teams interest is a real email with consent and an unsubscribe path', async ({ page }) => {
    await page.goto('/pricing/');
    const sec = page.locator('#teams');
    await expect(sec.getByRole('heading', { level: 2 })).toHaveText('Vekrun Teams, on infrastructure you control.');
    await expect(sec).toContainText('not a Vekrun-hosted compute subscription');
    const href = (await sec.locator('[data-teams-interest]').getAttribute('href'))!;
    expect(href).toMatch(/^mailto:support@vekrunapp\.com\?subject=Vekrun%20Teams%20interest&body=/);
    const body = decodeURIComponent(href.split('body=')[1]!);
    expect(body).toContain('Email me about Teams availability');
    expect(body).toContain('Number of engineers:');
    await expect(sec).toContainText('reply “unsubscribe” to be removed');
    await expect(sec.getByRole('link', { name: 'Privacy' })).toHaveAttribute('href', '/privacy/');
    await expect(page.locator('form')).toHaveCount(0);
  });

  test('compares personal engineering with team coordination', async ({ page }) => {
    await page.goto('/pricing/');
    const table = page.getByRole('table');
    await expect(table.locator('thead th')).toHaveText(['Compared', 'Free', /Teams\s*Planned/]);
    await expect(table.locator('tbody tr')).toHaveCount(10);
    await expect(table.getByRole('row', { name: /Where it runs/ })).toContainText('servers you control');
    await expect(table.getByRole('row', { name: /Price/ })).toContainText('$199 per month for up to 10 engineers, then $10 each');
  });

  test('the FAQ answers the agreed questions and matches its structured data', async ({ page }) => {
    await page.goto('/pricing/');
    await expect(page.locator('details.faq-i summary')).toHaveText([
      'Is Vekrun Free really free?', 'What’s included in Teams?', 'Does Teams include 10 engineers?', 'How does pricing change when the team grows?',
      'Does Teams include cloud infrastructure?', 'Who pays for AI model usage and remote workers?', 'Can Teams run on our own servers?',
      'Can an individual use Vekrun without Teams?', 'Is Teams available yet?', 'Do we need a separate Enterprise plan?',
    ]);
    const grow = page.locator('details.faq-i').nth(3);
    await grow.locator('summary').click();
    await expect(grow).toHaveAttribute('open', '');
    await expect(grow).toContainText('11 engineers is $209, 20 is $299 and 30 is $399');
    const ld = await page.locator('script[type="application/ld+json"]').evaluateAll((els) => els.map((e) => JSON.parse(e.textContent ?? '{}')));
    const faqLd = ld.find((d) => d['@type'] === 'FAQPage');
    expect(faqLd.mainEntity.length).toBe(await page.locator('details.faq-i').count());
    const app = ld.find((d) => d['@type'] === 'SoftwareApplication');
    expect(app.offers).toEqual([{ '@type': 'Offer', name: 'Vekrun Free', price: '0', priceCurrency: 'USD' }]);
    expect(await page.locator('meta[name="description"]').getAttribute('content')).toMatch(/Vekrun Teams is planned and self-hosted: \$199 USD per month for up to 10 engineers, plus \$10 per additional engineer\./);
  });

  test('the homepage summarizes both plans and links to Teams', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#pricing .plan h3')).toHaveText(['Free', 'Teams']);
    await expect(page.locator('#pricing')).toContainText('$199 per month for up to 10 engineers');
    for (const path of ['/download/', '/product/', '/contact/']) {
      await page.goto(path);
      await expect(page.locator('main a[href="/pricing/#teams"]').first(), path).toBeVisible();
    }
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
  for (const path of ['/', '/product/', '/how-it-works/', '/before-and-after/', '/integrations/']) {
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
  test('privacy says what Live Share relays and how interest emails are handled', async ({ page }) => {
    await page.goto('/privacy/');
    await expect(page.locator('main')).not.toContainText('passes through no Vekrun server');
    await expect(page.locator('#live-share')).toHaveText('Live Share');
    for (const t of ['What stays local.', 'What the gateway relays.', 'What the gateway keeps.', 'Teams interest', 'unsubscribe', 'No cookies, analytics', 'not on Vekrun servers']) await expect(page.locator('main')).toContainText(t);
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
  test('explains local models in full, qualified', async ({ page }) => {
    await page.goto('/product/');
    const sec = page.locator('#models');
    for (const t of ['Discover models', 'Download from Vekrun', 'Run locally', 'Connect cloud models', 'Choose per workflow', 'Change your setup']) await expect(sec.getByRole('heading', { name: t })).toBeVisible();
    await expect(sec).toContainText('still being certified');
  });

  test('every product demo plays to completion', async ({ page }) => {
    test.setTimeout(180_000);
    await page.goto('/product/');
    const roots = page.locator('[data-demo-root]');
    expect(await roots.count()).toBeGreaterThanOrEqual(1);
    for (let i = 0; i < (await roots.count()); i++) {
      await roots.nth(i).scrollIntoViewIfNeeded();
      await expect(roots.nth(i)).toHaveAttribute('data-demo', 'done', { timeout: 60_000 });
    }
  });

  test('has every section the old URLs point at, models first', async ({ page }) => {
    await page.goto('/product/');
    await expect(page.getByRole('navigation', { name: 'On this page' }).getByRole('link').first()).toHaveText('Models');
    for (const id of ['models', 'council', 'memory', 'architecture', 'live-share', 'browser', 'proof', 'delivery', 'board', 'environments', 'voice', 'apps', 'stack', 'mobile', 'tools']) await expect(page.locator(`#${id}`), id).toHaveCount(1);
  });

  test('real screenshots load: Memory, Live Share and the Interactive Browser', async ({ page }) => {
    await page.goto('/product/');
    for (const [id, shot] of [['live-share', 'liveshare-review'], ['memory', 'memory-understand'], ['browser', 'browser-annotate']] as const) {
      const img = page.locator(`#${id} img[src="/shots/${shot}-1440.webp"]`);
      await img.scrollIntoViewIfNeeded();
      await expect(img, shot).toHaveJSProperty('complete', true);
      expect(await img.evaluate((i: HTMLImageElement) => i.naturalWidth), shot).toBeGreaterThan(0);
      await expect(page.locator(`#${id} figcaption`).last()).toContainText('Vekrun desktop app');
    }
    await expect(page.locator('#live-share a[href="/privacy/#live-share"]')).toBeVisible();
    await expect(page.locator('#memory')).toContainText('Obsidian');
  });

  test('Live Share covers web, mobile and desktop, and states its limits', async ({ page }) => {
    await page.goto('/product/');
    const sec = page.locator('#live-share');
    await expect(sec.getByRole('heading', { level: 2 })).toHaveText('Let anyone experience what you’re building.');
    await expect(sec).toContainText('Don’t send screenshots. Send the app.');
    await expect(sec.getByRole('list', { name: 'How a Live Share review works' }).getByRole('listitem')).toHaveCount(7);
    const targets = sec.getByRole('list', { name: 'Apps you can share with Live Share' });
    for (const t of ['Web apps', 'iOS', 'Android', 'Expo and React Native', 'Flutter', 'Swift and Kotlin', 'Desktop apps']) await expect(targets.getByRole('heading', { name: t, exact: true })).toBeVisible();
    await expect(sec).toContainText('doesn’t replace device testing');
    await expect(sec).toContainText('it isn’t hosting');
  });

  test('marks what is planned and does not overclaim the Council', async ({ page }) => {
    await page.goto('/product/');
    await expect(page.locator('#memory .state').first()).toHaveText('Available');
    await expect(page.locator('#architecture .state')).toHaveText('Planned');
    await expect(page.locator('#architecture')).toContainText('planned and not available yet');
    await expect(page.locator('#council')).toContainText('Not every task convenes a Council');
    await expect(page.locator('#council').getByRole('heading', { name: 'A second opinion that actually challenges the first.' })).toBeVisible();
    await expect(page.locator('#council')).not.toContainText('still being certified');
    await expect(page.locator('main')).not.toContainText(/every review is independent|fully offline/i);
  });

  test('the architecture graph, voice and environment examples reach their final state', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/product/');
    for (const sel of ['[data-arch]', '[data-voice]', '[data-env]', '[data-lsflow]']) await expect(page.locator(sel), sel).toHaveAttribute('data-demo', 'done');
    await expect(page.locator('[data-arch] [data-impact]')).toBeVisible();
    await expect(page.locator('[data-voice]')).toContainText('Proposed Work Item');
    await expect(page.locator('[data-env]')).toContainText('Install once yourself');
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

test.describe('platforms', () => {
  test('lists macOS as the alpha platform and Windows and Linux as planned', async ({ page }) => {
    await page.goto('/');
    const ld = (await page.locator('script[type="application/ld+json"]').allTextContents()).join(' ');
    expect(ld).toContain('"operatingSystem":"macOS"');
    expect(ld).not.toMatch(/Windows|Linux/);
    await page.goto('/download/');
    await expect(page.locator('main')).toContainText('Alpha, by early access');
    await expect(page.getByRole('list', { name: 'What to expect from early access' })).toContainText('Apple Silicon or Intel');
    await expect(page.locator('main')).not.toContainText(/batch|waitlist position|within \d+ days/i);
    await expect(page.locator('main')).toContainText('Planned');
  });
});

test.describe('before and after', () => {
  test('is a real page with eight moments and an honest note', async ({ page }) => {
    await page.goto('/before-and-after/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Stop managing AI agents. Start directing engineering.');
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /\/og\/before-and-after\.png$/);
    await expect(page.locator('.ba-row')).toHaveCount(8);
    await expect(page.locator('main')).toContainText('Illustrative comparisons, not customer quotes.');
    await expect(page.locator('main blockquote, main q')).toHaveCount(0);
    await expect(page.locator('main')).not.toContainText(/\d+\s?%|\d+x faster|hours saved/i);
  });

  test('the day comparison switches with the mouse and the keyboard', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/before-and-after/');
    const tabs = page.getByRole('tablist', { name: 'Compare an engineering day' });
    await expect(tabs.getByRole('tab', { name: 'With Vekrun' })).toHaveAttribute('aria-selected', 'true');
    await tabs.getByRole('tab', { name: 'Before' }).click();
    await expect(page.locator('#dc-before')).toBeVisible();
    await expect(page.locator('#dc-after')).toBeHidden();
    await page.keyboard.press('ArrowRight');
    await expect(tabs.getByRole('tab', { name: 'With Vekrun' })).toBeFocused();
    await expect(page.locator('#dc-after')).toContainText('Review the Proof Pack');
  });
});

test.describe('navigation and theme', () => {
  test('the desktop header has Product, How It Works and Pricing, and Get Vekrun', async ({ page, isMobile }) => {
    test.skip(isMobile, 'desktop navigation only');
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Primary' });
    await expect(nav.getByRole('link')).toHaveText(['Product', 'How It Works', 'Before & After', 'Pricing']);
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
    for (const label of ['Product', 'How It Works', 'Before & After', 'Pricing', 'Get Vekrun']) await expect(mnav.getByRole('link', { name: label })).toBeVisible();
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
    for (const asset of ['/favicon.svg', '/apple-touch-icon.png', '/brand/vekrun-mark.svg', '/og/default.png', '/og/pricing.png', '/og/how-it-works.png', '/og/before-and-after.png', '/og/product.png']) {
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
      ['/cloud/', /\/pricing\/#teams$/],
      ['/teams/', /\/pricing\/#teams$/],
      ['/benefits/', /\/before-and-after\/$/],
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
    expect(sm).not.toMatch(/\/(docs|roadmap|features|cloud|teams|benefits)\//);
    const robots = await (await page.request.get('/robots.txt')).text();
    expect(robots).toContain('Sitemap: https://vekrunapp.com/sitemap-index.xml');
  });
});
