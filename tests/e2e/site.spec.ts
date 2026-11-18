import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const noOverflow = async (page: Page) => {
  const over = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(over, 'page must not scroll horizontally').toBe(false);
};
const purchase = /buy|checkout|subscribe|start trial|free trial|sign up/i;
const statusWords = /\b(in development|planned feature|under consideration|not (yet )?implemented|verified in development|status:)\b/i;

const pages = ['/', '/product/', '/how-it-works/', '/teams/', '/before-and-after/', '/pricing/', '/integrations/', '/download/', '/security/', '/privacy/', '/license/', '/contact/'];

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
      await expect(main, 'no Planned labels').not.toContainText(/\bPlanned\b/);
      // A marketing site: everything is presented as done. No "coming", "soon", "later" or "not available yet".
      await expect(page.locator('span[title][aria-hidden="true"] > span.font-mono'), 'every brand tile shows its official logo').toHaveCount(0);
      await expect(page.locator('body'), 'no coming-soon copy').not.toContainText(/coming soon|coming later|coming to|not (yet )?available|isn’t available|aren’t available|can’t be bought|no public download|will follow|\byet\b/i);
      await expect(main).not.toContainText(/Vekrun is (free and )?open[- ]source|Apache License|AI-native terminal|Vekrun Personal/i);
      await expect(main, 'no old Cloud or Enterprise plans').not.toContainText(/Vekrun Cloud|Cloud wishlist|Vekrun Enterprise|Enterprise (tier|plan) is|\$99|per developer/i);
      await expect(main).not.toContainText(/requires? (Claude Code|Codex)|(Claude Code|Codex) (is|are) required/i);
      await expect(page.getByRole('link', { name: purchase })).toHaveCount(0);
      await expect(page.getByRole('button', { name: purchase })).toHaveCount(0);
      await expect(page.locator('a[href*="/docs/"], a[href*="/roadmap/"], a[href*="/features/"], a[href*="/cloud/"], a[href*="/benefits/"], a[href*="#cloud-wishlist"]')).toHaveCount(0);
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
  test('renders the central message, both calls to action, metadata and structured data', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Your AI engineering team. On your machine.');
    await expect(page.getByText('From idea to verified software.', { exact: true })).toBeVisible();
    await expect(page).toHaveTitle('Vekrun · Your AI engineering team. On your machine.');
    const hero = page.locator('main section').first();
    await expect(hero.getByRole('link', { name: 'Request early access' })).toHaveAttribute('href', '/download/');
    await expect(hero.getByRole('link', { name: 'See it in action' })).toHaveAttribute('href', '#demo');
    await expect(page.locator('#demo')).toHaveCount(1);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /\/og\/default\.png$/);
    const types = await page.locator('script[type="application/ld+json"]').evaluateAll((els) => els.map((e) => JSON.parse(e.textContent ?? '{}')['@type']));
    expect(types).toEqual(expect.arrayContaining(['Organization', 'WebSite', 'SoftwareApplication']));
  });

  test('tells the story in exactly five acts, with nothing else between them', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('main h2')).toHaveText([
      'Don’t guess which approach is better. Build both. Prove it.',
      'From request to reviewed pull request.',
      'The next task starts where the last one finished.',
      'Your models. Your infrastructure. Your rules.',
    ]);
    await expect(page.locator('main > section')).toHaveCount(5);
    await expect(page.locator('#team-memory').getByRole('heading', { level: 3 })).toHaveText('Your team shares a codebase. Now it can share an engineering brain.');
    await expect(page.locator('#team-memory').getByRole('link', { name: 'Explore Vekrun Teams' })).toHaveAttribute('href', '/teams/');
    await expect(page.locator('main')).not.toContainText(/What’s next for Vekrun|coming to Vekrun Free|Work Anywhere is coming/i);
    // Provider catalogues and marquees live on Integrations, not here.
    await expect(page.getByRole('region', { name: 'Technologies Vekrun works with' })).toHaveCount(0);
    await expect(page.locator('main .logo-glyph, main .vendor-glyph')).toHaveCount(0);
  });

  test('Act 5 states the control promise, names models and agents in one line and offers both plans', async ({ page }) => {
    await page.goto('/');
    const sec = page.locator('#control');
    await expect(sec.locator('#models')).toContainText(/OpenRouter, xAI.*Ollama and LM Studio.*Claude Code, Codex, Antigravity CLI and Grok Build are optional/);
    await expect(sec.getByRole('link', { name: 'All integrations' })).toHaveAttribute('href', '/integrations/');
    await expect(sec.getByRole('figure', { name: /Your Mac runs Vekrun/ })).toContainText('Your VPS');
    await expect(sec.locator('.plan h3')).toHaveText(['Free', 'Teams']);
    await expect(sec.locator('.plan').first()).toContainText('Work Anywhere on your own VPS');
    await expect(sec.locator('.plan').first().getByRole('link', { name: 'Request early access' })).toHaveAttribute('href', '/download/');
    await expect(sec.locator('.plan.is-teams').getByRole('link', { name: 'Explore Teams' })).toHaveAttribute('href', '/teams/');
    await expect(sec.locator('.plan.is-teams').getByRole('link', { name: 'Register interest' })).toHaveAttribute('href', /^mailto:support@vekrunapp\.com\?subject=Vekrun%20Teams%20interest/);
    await expect(sec).toContainText('$199 a month for up to 10 engineers, plus $10 for each one after that');
    await expect(sec).toContainText('Works in the repositories you already have');
    await expect(page.locator('[data-teams-calc]')).toHaveCount(0);
    await expect(page.locator('main')).not.toContainText(/partner(ed|ship)? with xAI|endorsed by xAI/i);
  });

  test('the hero is a Vekrun window that goes from request to a reviewable pull request', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const f = page.locator('[data-engine]');
    await expect(f).toHaveAttribute('data-demo', 'done');
    await expect(f).toHaveAttribute('data-phase', '5');
    await expect(f.locator('[data-req]')).toContainText('keep their cart across web and mobile');
    await expect(f.locator('.is-off')).toHaveCount(0);
    await expect(f.getByRole('list', { name: 'Steps' }).getByRole('button')).toHaveText(['1Request', '2Plan', '3Approaches', '4Verify', '5Pull request']);
    for (const t of ['Plan approved by you', 'Codex', 'Grok Build', 'from a41c9e2', '52 of 52', 'Loses carts on restart', 'Not checked', 'build-01, your VPS', 'Ready for review', 'B is kept with its evidence']) await expect(f).toContainText(t);
    await expect(f.locator('.eh-proof .is-pass')).toHaveCount(3);
    await expect(f.locator('.eh-proof .is-none')).toHaveCount(1);
    await expect(f.locator('.eh-tag')).toHaveText('Example');
    await f.getByRole('button', { name: 'Replay' }).click();
    await expect(f).toHaveAttribute('data-demo', /playing|done/);
    await noOverflow(page);
  });

  test('the hero steps can be chosen by hand, and the CLI view tells the same run', async ({ page }) => {
    await page.goto('/');
    const f = page.locator('[data-engine]');
    await f.scrollIntoViewIfNeeded();
    await expect(f).toHaveAttribute('data-demo', 'playing');
    await f.getByRole('button', { name: /Plan$/ }).click();
    await expect(f).toHaveAttribute('data-phase', '2');
    await expect(f.getByRole('button', { name: /Plan$/ })).toHaveAttribute('aria-pressed', 'true');
    await expect(f).not.toHaveAttribute('data-demo', 'playing');
    await expect(f.locator('.eh-lane').first()).toHaveClass(/is-off|eh-lane/);
    await expect(f.locator('.eh-ev.is-pr')).toHaveClass(/is-off/);
    await f.getByRole('button', { name: 'CLI' }).click();
    await expect(f.getByRole('button', { name: 'CLI' })).toHaveAttribute('aria-pressed', 'true');
    await expect(f.locator('[data-pane="cli"]')).toBeVisible();
    await expect(f.locator('[data-pane="factory"]')).toBeHidden();
    await f.getByRole('button', { name: /Pull request$/ }).click();
    await expect(f.locator('[data-pane="cli"]')).toContainText('PR #512 opened');
    await f.getByRole('button', { name: 'Factory' }).click();
    await expect(f.locator('[data-pane="factory"]')).toBeVisible();
  });

  test('the hero plays in phases without moving the page', async ({ page }) => {
    await page.goto('/');
    const f = page.locator('[data-engine]');
    await f.scrollIntoViewIfNeeded();
    const h = (await f.boundingBox())!.height;
    await expect(f).toHaveAttribute('data-demo', 'playing');
    await expect(f).toHaveAttribute('data-phase', '3', { timeout: 10_000 });
    await expect(f).toHaveAttribute('data-phase', '5', { timeout: 15_000 });
    await expect(f).toHaveAttribute('data-demo', 'done');
    expect(Math.abs((await f.boundingBox())!.height - h)).toBeLessThan(2);
  });

  test('a demo pauses with the pause control and resumes', async ({ page }) => {
    await page.goto('/');
    const f = page.locator('[data-engine]');
    await f.scrollIntoViewIfNeeded();
    await expect(f).toHaveAttribute('data-demo', 'playing');
    await f.locator('[data-demo-play]').click();
    await expect(f).toHaveAttribute('data-demo', 'paused');
    await f.locator('[data-demo-play]').click();
    await expect(f).toHaveAttribute('data-demo', 'playing');
  });

  test('the journey walks six moments, can be driven by keyboard and never changes height', async ({ page }) => {
    await page.goto('/');
    const j = page.locator('[data-journey]');
    await j.scrollIntoViewIfNeeded();
    const tabs = j.getByRole('tab');
    await expect(tabs).toHaveCount(6);
    for (const [i, t] of ['Context', 'Plan', 'Build', 'Verify', 'Proof', 'Review'].entries()) await expect(tabs.nth(i)).toContainText(t);
    const h = (await j.locator('.jd-stage').boundingBox())!.height;
    await tabs.nth(3).click();
    await expect(tabs.nth(3)).toHaveAttribute('aria-selected', 'true');
    const verify = j.getByRole('tabpanel', { name: /Verify/ });
    await expect(verify).toBeVisible();
    await expect(verify).toContainText('Risk: high');
    await expect(verify.locator('.is-pass')).toHaveCount(3);
    await expect(verify.locator('.is-fail')).toHaveCount(1);
    await expect(verify.locator('.is-none')).toHaveCount(1);
    await page.keyboard.press('ArrowDown');
    await expect(tabs.nth(4)).toHaveAttribute('aria-selected', 'true');
    await expect(tabs.nth(4)).toBeFocused();
    await expect(j.getByRole('tabpanel', { name: /Proof/ })).toContainText('listed rather than hidden');
    for (const k of [0, 1, 2, 5]) { await tabs.nth(k).click(); expect(Math.abs((await j.locator('.jd-stage').boundingBox())!.height - h), `moment ${k}`).toBeLessThan(2); }
    await expect(j.getByRole('tabpanel', { name: /Review/ })).toContainText('PR Guardian');
    await expect(j.getByRole('tabpanel', { name: /Review/ })).toContainText('Waiting for your approval');
  });

  test('every homepage demo reads in full without JavaScript', async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto('/');
    await expect(page.locator('[data-engine]')).toContainText('Ready for review');
    for (const t of ['Change impact at a41c9e2', 'Plan · 3 Work Items', 'Factory · 3 isolated worktrees', 'Risk: high', 'Proof Pack · pinned to 9c41a7e', 'Idempotent payment retries']) await expect(page.locator('[data-journey]')).toContainText(t);
    await expect(page.locator('[data-membridge]')).toContainText('Add partial refunds');
    await expect(page.locator('[data-compete]')).toContainText('Recommended: A');
    await ctx.close();
  });

  test('the memory demo recalls a verified fix and a decision with their sources and freshness', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const m = page.locator('[data-membridge]');
    await expect(m).toHaveAttribute('data-demo', 'done');
    await expect(m).toHaveAttribute('data-step', '3');
    for (const t of ['Verified fix', 'Decision', 'Proof Pack · 9c41a7e', 'PR #412 · a41c9e2', 'Add partial refunds', 'still current']) await expect(m).toContainText(t);
    await expect(page.locator('#memory')).toContainText('checked for freshness');
  });

  test('the homepage demos all play to their final state', async ({ page }) => {
    test.setTimeout(120_000);
    await page.goto('/');
    for (const sel of ['[data-engine]', '[data-compete]', '[data-journey]', '[data-membridge]']) {
      const d = page.locator(sel).first();
      await d.scrollIntoViewIfNeeded();
      await expect(d, sel).toHaveAttribute('data-demo', /playing|done/);
    }
  });

  test('every call to action on the homepage resolves', async ({ page }) => {
    await page.goto('/');
    for (const href of await page.locator('main a.btn, main a.link-more, main a.link-slide').evaluateAll((els) => els.map((e) => e.getAttribute('href')!))) {
      if (href.startsWith('#') || href.startsWith('mailto:')) continue;
      expect((await page.request.get(href.replace(/[?#].*/, ''))).status(), href).toBe(200);
    }
  });
});

test.describe('product models and history', () => {
  test('the Product page explains models in full: native agent first, local models qualified', async ({ page }) => {
    await page.goto('/product/');
    const sec = page.locator('#models');
    const cards = sec.locator('article');
    await expect(cards.first()).toContainText('Vekrun’s native agent');
    await expect(cards.first()).toContainText('OpenRouter');
    await expect(cards.first()).toContainText('xAI');
    await expect(cards.nth(1)).toContainText('Optional');
    await expect(cards.nth(1)).toContainText('Grok Build');
    await expect(cards.nth(1)).toContainText('None of them is required');
    await expect(sec).toContainText('billed by the provider you choose');
    await expect(cards.first().getByText('Download local AI models')).toBeVisible();
    await expect(sec).toContainText('running the entire autonomous Factory on a local model alone is still being certified');
    await expect(sec.getByRole('link', { name: 'Three ways to bring Grok into Vekrun' })).toHaveAttribute('href', '/integrations/#grok');
    const lib = sec.locator('[data-mdl]');
    await expect(lib).toContainText('Example');
    for (const t of ['9.0 GB', 'Runs well on this machine', 'Needs 64 GB of memory', 'Too large', 'Installed', 'Downloads through Ollama']) await expect(lib).toContainText(t);
    await expect(sec).toContainText('doesn’t ship its own inference engine');
    await expect(sec).toContainText('doesn’t make every workflow offline');
    await expect(page.locator('main')).not.toContainText('Illustrative product concept');
  });

  test('the Git Time Machine steps back through revisions and only shows impact today', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/product/');
    const ag = page.locator('#architecture [data-arch]');
    await expect(ag.locator('[data-rev-label]')).toHaveText('at a41c9e2');
    await expect(ag.locator('[data-impact]')).toBeVisible();
    await expect(ag.locator('[data-impact]')).toContainText('1 inferred link to check');
    await ag.getByRole('button', { name: /March/ }).click();
    await expect(ag.getByRole('button', { name: /March/ })).toHaveAttribute('aria-pressed', 'true');
    await expect(ag.locator('[data-rev-label]')).toHaveText('at 2f07b1d');
    await expect(ag.locator('[data-n="hook"]')).toHaveClass(/is-future/);
    await expect(ag.locator('[data-n="api"]')).not.toHaveClass(/is-future/);
    await expect(ag.locator('[data-impact]')).toHaveCSS('opacity', '0');
    await expect(ag.locator('[data-rev-note]')).toContainText('checkout web app');
    await ag.getByRole('button', { name: /Today/ }).click();
    await expect(ag.locator('.is-future')).toHaveCount(0);
    await expect(ag.locator('[data-impact]')).toHaveCSS('opacity', '1');
  });
});

test.describe('pricing', () => {
  test('has two plans: Free for individuals and Teams, self-hosted, with no checkout', async ({ page }) => {
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
    await expect(teams.getByRole('link', { name: 'Register Teams interest' })).toHaveAttribute('href', /^mailto:support@vekrunapp\.com\?subject=Vekrun%20Teams%20interest&body=/);
    await expect(page.locator('main')).toContainText('Vekrun charges no usage fees');
    await expect(teams.locator('li').first()).toHaveText(/Shared Engineering Memory/);
    await expect(teams.getByRole('link', { name: 'Explore Vekrun Teams' })).toHaveAttribute('href', '/teams/');
    await expect(free).toContainText('Work Anywhere: run the Factory on your own VPS');
    await expect(page.locator('main')).not.toContainText(/coming to Vekrun Free|Coming to Free|\(coming soon\)/i);
    await expect(page.locator('main')).not.toContainText(/unlimited|SOC 2|end-to-end encrypt|compliance certif|SSO (add-on|is an extra)/i);
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
    await expect(sec.getByRole('heading', { level: 2 })).toHaveText('Vekrun Teams: one engineering brain for your whole team.');
    await expect(sec.getByRole('heading', { level: 3 }).first()).toHaveText('Shared Engineering Memory');
    await expect(sec.getByRole('link', { name: 'Explore Vekrun Teams' })).toHaveAttribute('href', '/teams/');
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
    await expect(table.locator('thead th')).toHaveText(['Compared', 'Free', 'Teams']);
    await expect(table.locator('tbody tr')).toHaveCount(12);
    await expect(table.locator('tbody tr').nth(1)).toContainText('Personal Engineering Memory');
    await expect(table.getByRole('row', { name: /Remote execution/ })).toContainText('Work Anywhere: run the Factory on your own VPS');
    await expect(table.getByRole('row', { name: /How to start/ })).toContainText('Register Teams interest');
    await expect(table.getByRole('row', { name: /Sign-in and access/ })).toContainText('SSO');
    await expect(table.getByRole('row', { name: /Where it runs/ })).toContainText('servers you control');
    await expect(table.getByRole('row', { name: /Price/ })).toContainText('$199 per month for up to 10 engineers, then $10 each');
  });

  test('the FAQ answers the agreed questions and matches its structured data', async ({ page }) => {
    await page.goto('/pricing/');
    await expect(page.locator('details.faq-i summary')).toHaveText([
      'Is Vekrun Free really free?', 'What’s included in Teams?', 'How does pricing change when the team grows?',
      'Does Teams include cloud infrastructure?', 'Who pays for AI model usage and remote workers?', 'Do I need Teams to run Vekrun on my own server?', 'Is SSO an extra cost?',
      'Can an individual use Vekrun without Teams?', 'Do we need a separate Enterprise plan?',
    ]);
    const grow = page.locator('details.faq-i').nth(2);
    await grow.locator('summary').click();
    await expect(grow).toHaveAttribute('open', '');
    await expect(grow).toContainText('a team of 5 pays the same as a team of 10');
    await expect(grow).toContainText('11 engineers is $209, 20 is $299 and 30 is $399');
    await expect(page.locator('details.faq-i').nth(5)).toContainText('included in Vekrun Free');
    const ld = await page.locator('script[type="application/ld+json"]').evaluateAll((els) => els.map((e) => JSON.parse(e.textContent ?? '{}')));
    const faqLd = ld.find((d) => d['@type'] === 'FAQPage');
    expect(faqLd.mainEntity.length).toBe(await page.locator('details.faq-i').count());
    const app = ld.find((d) => d['@type'] === 'SoftwareApplication');
    expect(app.offers).toEqual([{ '@type': 'Offer', name: 'Vekrun Free', price: '0', priceCurrency: 'USD' }]);
    expect(await page.locator('meta[name="description"]').getAttribute('content')).toMatch(/Vekrun Teams is self-hosted: \$199 USD per month for up to 10 engineers, plus \$10 per additional engineer\./);
  });

  test('the homepage summarizes both plans and links to Teams', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#pricing .plan h3')).toHaveText(['Free', 'Teams']);
    await expect(page.locator('#pricing')).toContainText('$199 a month for up to 10 engineers');
    for (const path of ['/', '/download/', '/product/', '/contact/', '/pricing/']) {
      await page.goto(path);
      await expect(page.locator('main a[href="/teams/"]').first(), path).toBeVisible();
    }
  });
});

test.describe('how it works', () => {
  test('walks the six stages and keeps the sections old URLs point at', async ({ page }) => {
    await page.goto('/how-it-works/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('The workflow, step by step.');
    await expect(page.locator('main section').first().getByRole('link', { name: 'See one change, start to finish' })).toHaveAttribute('href', '/#journey');
    await expect(page.getByRole('navigation', { name: 'On this page' }).getByRole('link')).toHaveText(['Describe', 'Plan and compare', 'Build', 'Verify', 'Deliver', 'Remember']);
    for (const id of ['describe', 'council', 'compare', 'factory', 'verification', 'git', 'inbox', 'remember']) await expect(page.locator(`#${id}`), id).toHaveCount(1);
    await expect(page.locator('#verification')).toContainText('what wasn’t checked');
    await expect(page.locator('#verification')).toContainText('mutation challenge');
    await expect(page.locator('#git')).toContainText('PR Guardian');
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

test.describe('teams', () => {
  test('leads with Shared Engineering Memory, links interest and pricing, and answers the questions', async ({ page }) => {
    await page.goto('/teams/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Your team shares a codebase. Now it can share an engineering brain.');
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /\/og\/teams\.png$/);
    const hero = page.locator('main').locator('section').first();
    await expect(hero.getByRole('link', { name: 'Register Teams interest' })).toHaveAttribute('href', /^mailto:support@vekrunapp\.com\?subject=Vekrun%20Teams%20interest/);
    await expect(hero.getByRole('link', { name: 'Explore how Teams works' })).toHaveAttribute('href', '#how');
    await expect(page.locator('main h2').first()).toHaveText('The knowledge your team creates shouldn’t disappear when a conversation ends.');
    for (const h of ['Your engineering intelligence. Your infrastructure. Your rules.', 'Your engineers. Your identities. Your access rules.']) await expect(page.getByRole('heading', { name: h })).toBeVisible();
    await expect(page.locator('#capabilities .caps > li')).toHaveCount(8);
    await expect(page.locator('#shared-memory .better > li')).toHaveCount(4);
    await expect(page.locator('main .scatter, main .bento')).toHaveCount(0);
    const caps = page.locator('#capabilities');
    for (const k of ['Shared Engineering Memory', 'Team coordination', 'Autonomous Factory workers', 'Organization policies', 'Shared Architecture Intelligence', 'PR intelligence', 'SSO and access control', 'Engineering insights']) await expect(caps).toContainText(k, { ignoreCase: true });
    await expect(page.locator('#sso')).toContainText('Microsoft Entra ID, Google Workspace, Okta');
    await expect(page.locator('main')).not.toContainText(/design target|future requirement|part of the direction|Coming to Vekrun Teams/);
    await expect(page.locator('#sso')).toContainText('SSO is part of Teams, not an add-on.');
    await expect(page.locator('#pricing')).toContainText('$199');
    await expect(page.locator('#pricing').getByRole('link', { name: 'Compare plans and calculate your price' })).toHaveAttribute('href', '/pricing/#teams');
    await expect(page.locator('#pricing [data-teams-calc]')).toHaveCount(0);
    await expect(page.locator('main')).not.toContainText(/SOC 2|end-to-end encrypt|guarantee(d|s)? (security|correct)/i);
    await expect(page.locator('details.faq-i')).toHaveCount(8);
    const ld = await page.locator('script[type="application/ld+json"]').evaluateAll((els) => els.map((e) => JSON.parse(e.textContent ?? '{}')));
    expect(ld.find((d) => d['@type'] === 'FAQPage').mainEntity.length).toBe(8);
  });

  test('the shared memory story steps through three engineers and keeps restricted and superseded records out of context', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/teams/');
    await expect(page.locator('[data-mstory]')).toHaveAttribute('data-demo', 'done');
    if ((page.viewportSize()?.width ?? 0) >= 896) {
      await expect(page.locator('[data-mstory] .ms-fl-hub')).toContainText('Shared Engineering Memory');
      await expect(page.locator('[data-mstory] [data-fl-line="3"]')).toHaveCSS('background-color', /rgb/);
    }
    const ms = page.locator('[data-mstory]');
    await ms.scrollIntoViewIfNeeded();
    await expect(ms).toHaveAttribute('data-demo', 'done');
    await expect(ms).toHaveAttribute('data-step', '3');
    for (const k of ['Verified', 'Inferred', 'Superseded', 'a41c9e2', 'Billing only']) await expect(ms).toContainText(k);
    await ms.getByRole('button', { name: /Show step 1/ }).click();
    await expect(ms).toHaveAttribute('data-step', '1');
    await ms.getByRole('button', { name: /Show step 2/ }).click();
    await expect(ms).toHaveAttribute('data-step', '2');
  });

  test('the SSO example revokes and restores access, and the diagrams settle under reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/teams/');
    const sso = page.locator('[data-sso]');
    await sso.scrollIntoViewIfNeeded();
    await expect(sso).toHaveAttribute('data-demo', 'done');
    for (const k of ['Entra ID', 'Google Workspace', 'Okta']) await expect(sso).toContainText(k);
    await expect(sso).toHaveAttribute('data-revoked', '');
    await sso.getByRole('button', { name: 'Restore Priya’s access' }).click();
    await expect(sso).not.toHaveAttribute('data-revoked', '');
    await sso.getByRole('button', { name: 'Revoke Priya’s access' }).click();
    await expect(sso).toHaveAttribute('data-revoked', '');
    await expect(sso.locator('[data-audit]')).toContainText('revoked');
    await expect(page.locator('[data-pool]')).toHaveAttribute('data-step', '3');
    await expect(page.locator('[data-selfhost]')).not.toHaveAttribute('data-live', '');
    await expect(page.locator('[data-selfhost] .is-hidden')).toHaveCount(0);
  });
});

test.describe('competitive engineering', () => {
  test('compares approaches from one commit, shows passed, failed and unchecked criteria, and says when nothing qualifies', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const cx = page.locator('[data-compete]');
    await cx.scrollIntoViewIfNeeded();
    await expect(cx).toHaveAttribute('data-demo', 'done');
    await expect(cx).toContainText('Example data');
    const panel = cx.getByRole('tabpanel').filter({ visible: true });
    await expect(panel).toContainText('Make payment retries idempotent');
    await expect(panel).toContainText('Both start from a41c9e2');
    for (const t of ['Codex', 'Grok Build', 'No double charges', '3 double charges', 'Lock lost on restart', 'No load profile', 'Recommended: A']) await expect(panel).toContainText(t);
    for (const st of ['Passed', 'Failed', 'Not checked']) await expect(panel.locator('.sr-only', { hasText: st }).first()).toBeAttached();
    await expect(panel.getByRole('button', { name: 'Choose B' })).toHaveCount(0);
    await panel.getByRole('button', { name: 'Choose A' }).click();
    await expect(panel.getByRole('button', { name: 'Choose A' })).toHaveAttribute('aria-pressed', 'true');
    await expect(panel.locator('[data-chosen]')).toContainText('You chose A');
    await panel.getByRole('button', { name: 'Try a third approach' }).click();
    await expect(panel.getByRole('button', { name: 'Choose A' })).toHaveAttribute('aria-pressed', 'false');
    await expect(panel.locator('[data-chosen]')).toContainText('third approach from the same commit');
    await cx.getByRole('tab', { name: 'Neither qualifies' }).click();
    await expect(cx.getByRole('tab', { name: 'Neither qualifies' })).toHaveAttribute('aria-selected', 'true');
    await expect(cx.getByRole('tabpanel').filter({ visible: true })).toContainText('No recommendation');
    await cx.getByRole('tab', { name: 'Neither qualifies' }).press('ArrowLeft');
    await expect(cx.getByRole('tab', { name: 'One approach qualifies' })).toBeFocused();
  });
});

test.describe('conversion paths', () => {
  test('/ ends with the two plans instead of a separate closing band', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('section[aria-labelledby="next-title"]')).toHaveCount(0);
    const last = page.locator('main > section').last();
    await expect(last.getByRole('link', { name: 'Request early access' })).toHaveAttribute('href', '/download/');
    await expect(last.getByRole('link', { name: 'Compare plans' })).toHaveAttribute('href', '/pricing/');
    await expect(last).toContainText('Early access is by email');
  });
  for (const path of ['/product/', '/how-it-works/', '/before-and-after/', '/integrations/']) {
    test(`${path} ends with early access and pricing`, async ({ page }) => {
      await page.goto(path);
      const next = page.locator('section[aria-labelledby="next-title"]');
      await expect(next.getByRole('link', { name: 'Request early access' })).toHaveAttribute('href', '/download/');
      await expect(next.getByRole('link', { name: 'See pricing' })).toHaveAttribute('href', '/pricing/');
      await expect(next).toContainText('Early access is by email');
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
    await expect(h2s.nth(0)).toHaveText('Model providers');
    await expect(h2s.nth(1)).toHaveText('Optional coding agents');
    const models = page.locator('section[aria-labelledby="g-models"]');
    for (const [n, tag] of [['OpenRouter', 'Gateway'], ['xAI', 'Direct'], ['Ollama', 'Local'], ['LM Studio', 'Local']]) await expect(models.locator('li', { hasText: n })).toContainText(tag);
    await expect(page.locator('main')).toContainText('None of them is required');
    await expect(page.locator('main')).toContainText('Antigravity CLI');
    await expect(page.locator('main')).toContainText('Grok Build');
    await expect(page.locator('main')).toContainText('xAI');
    await expect(page.locator('main')).not.toContainText(/Gemini CLI|Kamal|Vercel|PagerDuty/);
    await expect(page.getByRole('heading', { name: 'Work and delivery tools.' })).toBeVisible();
    const hosting = page.locator('#hosting');
    for (const n of ['Hetzner', 'DigitalOcean', 'Vultr', 'Akamai Linode', 'AWS', 'Any existing server']) await expect(hosting).toContainText(n);
    await expect(hosting).toContainText('not services Vekrun reads from or reports to');
    await expect(page.locator('section[aria-labelledby="g-pm"]')).toContainText('tools your agents can use in Asana');
  });
});

test.describe('integrations search', () => {
  test('filters the catalogue as you type, says how many match and offers a way forward when nothing does', async ({ page }) => {
    await page.goto('/integrations/');
    const q = page.getByRole('searchbox', { name: 'Search integrations' });
    await expect(q).toBeVisible();
    await q.fill('grok');
    await expect(page.locator('[data-finder-n]')).toHaveText(/\d+ match/);
    await expect(page.locator('#grok')).toBeVisible();
    await expect(page.locator('section[aria-labelledby="g-agents"]')).toBeVisible();
    await expect(page.locator('section[aria-labelledby="g-agents"] li', { hasText: 'Grok Build' })).toBeVisible();
    await expect(page.locator('section[aria-labelledby="g-agents"] li', { hasText: 'Codex' })).toBeHidden();
    await expect(page.locator('section[aria-labelledby="g-pm"]')).toBeHidden();
    await q.fill('hetzner');
    await expect(page.locator('#hosting li', { hasText: 'Hetzner' })).toBeVisible();
    await expect(page.locator('#grok')).toBeHidden();
    await expect(page.getByRole('heading', { name: 'Work and delivery tools.' })).toBeVisible();
    await q.fill('zzzz');
    await expect(page.locator('[data-finder-none]')).toBeVisible();
    await expect(page.locator('[data-finder-n]')).toHaveText('0 matches');
    await q.fill('');
    await expect(page.locator('section[aria-labelledby="g-pm"]')).toBeVisible();
    await expect(page.locator('[data-finder-none]')).toBeHidden();
    await noOverflow(page);
  });

  test('lists everything without JavaScript and hides the search box', async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto('/integrations/');
    await expect(page.locator('[data-finder]')).toBeHidden();
    for (const n of ['OpenRouter', 'Grok Build', 'Jira', 'Sentry', 'Hetzner']) await expect(page.locator('main')).toContainText(n);
    await ctx.close();
  });
});

test.describe('product', () => {
  test('explains three separate routes to Grok, each with its own sign-in and billing, and claims no endorsement', async ({ page }) => {
    await page.goto('/integrations/');
    const g = page.locator('#grok');
    await expect(g.getByRole('heading', { level: 2 })).toHaveText('Three ways to bring Grok into Vekrun.');
    await expect(g.getByRole('heading', { level: 3 })).toHaveText(['Grok Build, as a coding agent', 'Grok models, directly through xAI', 'Grok models, through OpenRouter']);
    const cards = g.locator('.grok li');
    await expect(cards.nth(0)).toContainText('Vekrun keeps the plan, the permissions, the verification and the delivery');
    await expect(cards.nth(1)).toContainText('native agent, the Council and the Factory');
    await expect(cards.nth(1)).toContainText('never tied to one version');
    await expect(cards.nth(1)).toContainText('Billed by xAI');
    await expect(cards.nth(2)).toContainText('Billed by OpenRouter');
    await expect(g).toContainText('isn’t affiliated with or endorsed by xAI');
    const native = page.locator('section[aria-labelledby="g-models"]');
    const agents = page.locator('section[aria-labelledby="g-agents"]');
    await expect(native.locator('.tiles')).toContainText('xAI');
    await expect(native.locator('.tiles')).not.toContainText('Grok Build');
    await expect(agents.locator('.tiles')).toContainText('Grok Build');
    // Official marks, not monograms: one file per theme, exactly as the owner provides them.
    for (const tile of [native.locator('.tiles li', { hasText: 'xAI' }), agents.locator('.tiles li', { hasText: 'Grok Build' })]) {
      await expect(tile.locator('.vendor-glyph svg').filter({ visible: true })).toHaveCount(1);
      await expect(tile.locator('.font-mono')).toHaveCount(0);
    }
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /xAI.*Grok Build/);
  });

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

  test('is organised as five chapters closed by models, and keeps every section the old URLs point at', async ({ page }) => {
    await page.goto('/product/');
    await expect(page.getByRole('navigation', { name: 'On this page' }).getByRole('link')).toHaveText(['Think', 'Build', 'Prove', 'Deliver', 'Remember and collaborate']);
    await expect(page.locator('.ch-k')).toHaveText(['Think', 'Build', 'Prove', 'Deliver', 'Remember']);
    await expect(page.locator('main .ticks')).toHaveCount(0);
    await expect(page.locator('#work-anywhere')).toContainText('Work Anywhere is included in Vekrun Free');
    for (const id of ['collaborate', 'models', 'council', 'competitive', 'experiments', 'improvement-lab', 'memory', 'architecture', 'production', 'live-share', 'browser', 'proof', 'high-assurance', 'delivery', 'guardian', 'templates', 'board', 'work-anywhere', 'environments', 'voice', 'apps', 'stack', 'mobile', 'tools']) await expect(page.locator(`#${id}`), id).toHaveCount(1);
    await expect(page.locator('#next')).toHaveCount(0);
    await expect(page.locator('main')).not.toContainText('What’s next');
  });

  test('weaves the newer capabilities into the story, without status labels', async ({ page }) => {
    await page.goto('/product/');
    for (const [id, t] of [['prove', 'Risk Intelligence'], ['prove', 'Adaptive Verification'], ['deliver', 'Autonomy Controller'], ['deliver', 'Advanced PR Intelligence'], ['remember', 'Verified Failure Learning'], ['remember', 'Context Engine'], ['build', 'Headless CLI and MCP'], ['remember', 'Vekrun-to-Vekrun collaboration'], ['collaborate', 'Bring people, and other Vekruns, into the work.']] as const) await expect(page.locator(`#${id}`), t).toContainText(t);
    await expect(page.locator('main')).not.toContainText(/\b(Planned|In development|Not implemented|Building now)\b/);
  });

  test('real screenshots load: the Interactive Browser', async ({ page }) => {
    await page.goto('/product/');
    for (const [id, shot] of [['browser', 'browser-annotate']] as const) {
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
    await expect(sec).toContainText('Don’t send screenshots. Send the app.');
    await expect(sec.getByRole('list', { name: 'How a Live Share review works' }).getByRole('listitem')).toHaveCount(7);
    for (const t of ['Web', 'iOS', 'Android', 'Expo', 'Flutter', 'desktop']) await expect(sec).toContainText(t);
    await expect(sec).toContainText('it isn’t hosting');
    await expect(sec.locator('a[href="/privacy/#live-share"]')).toBeVisible();
  });

  test('presents Living Architecture as available and honest about uncertainty', async ({ page }) => {
    await page.goto('/product/');
    await expect(page.locator('.state')).toHaveCount(0);
    await expect(page.locator('#architecture')).not.toContainText('Planned');
    await expect(page.locator('#architecture')).toContainText('Understand your software before changing it.');
    for (const k of ['Git Time Machine', 'tied to its revision', 'cites its source', 'inferred ones are marked']) await expect(page.locator('#architecture')).toContainText(k);
    await expect(page.locator('#architecture [data-arch] .ag-revb')).toHaveCount(3);
    await expect(page.locator('#remember').getByRole('link', { name: 'Vekrun Teams' }).first()).toHaveAttribute('href', '/teams/');
    await expect(page.locator('#work-anywhere')).toContainText('included in Vekrun Free');
    await expect(page.locator('#council')).toContainText('Not every task convenes a Council');
    await expect(page.locator('#council')).not.toContainText('still being certified');
    await expect(page.locator('main')).not.toContainText(/every review is independent|fully offline/i);
  });

  test('the architecture graph, voice and environment examples reach their final state', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/product/');
    for (const sel of ['[data-arch]', '[data-env]', '[data-lsflow]', '[data-memory]', '[data-compete]', '[data-anywhere]']) await expect(page.locator(sel).first(), sel).toHaveAttribute('data-demo', 'done');
    await expect(page.locator('[data-memory] [data-m-q]')).toHaveText('Why do payment webhooks use an idempotency key?');
    await expect(page.locator('[data-anywhere] .wa-s.is-todo')).toHaveCount(0);
    await expect(page.locator('[data-anywhere]')).toContainText('Proof Pack ready for review');
    await expect(page.locator('[data-arch] [data-impact]')).toBeVisible();
    await expect(page.locator('#voice')).toContainText('becomes work you approve');
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
  test('lists macOS as the platform, with no other platforms promised', async ({ page }) => {
    await page.goto('/');
    const ld = (await page.locator('script[type="application/ld+json"]').allTextContents()).join(' ');
    expect(ld).toContain('"operatingSystem":"macOS"');
    expect(ld).not.toMatch(/Windows|Linux/);
    await page.goto('/download/');
    await expect(page.locator('main')).toContainText('Apple Silicon and Intel Macs, by early access invitation');
    await expect(page.getByRole('list', { name: 'What to expect from early access' })).toContainText('Apple Silicon or Intel');
    await expect(page.locator('main')).not.toContainText(/batch|waitlist position|within \d+ days/i);
    await expect(page.locator('main')).not.toContainText(/Windows|Linux/);
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
  test('the desktop header has Product, Teams, Pricing and Integrations, and Get Vekrun', async ({ page, isMobile }) => {
    test.skip(isMobile, 'desktop navigation only');
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Primary' });
    await expect(nav.getByRole('link')).toHaveText(['Product', 'Teams', 'Pricing', 'Integrations']);
    const foot = page.locator('footer');
    for (const l of ['How It Works', 'Before & After']) await expect(foot.getByRole('link', { name: l })).toBeVisible();
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
    for (const label of ['Product', 'Teams', 'Pricing', 'Integrations', 'Get Vekrun']) await expect(mnav.getByRole('link', { name: label })).toBeVisible();
    await expect(mnav).not.toContainText(/Docs|Roadmap|Benefits/);
    await expect(page.getByRole('button', { name: 'Close menu' })).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Escape');
    await expect(mnav).toBeHidden();
    await noOverflow(page);
  });

  test('the footer has the utility links and no Docs or Roadmap', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer');
    for (const label of ['Teams', 'Before & After', 'Integrations', 'Get Vekrun', 'Security', 'Privacy', 'Licence', 'Contact']) await expect(footer.getByRole('link', { name: label, exact: true })).toBeVisible();
    await expect(footer).not.toContainText(/Docs|Documentation|Roadmap|Benefits/);
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

  test('offers early access by invitation and links no installer', async ({ page }) => {
    await page.goto('/download/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Request early access.');
    await expect(page.getByRole('list', { name: 'Availability by platform' }).getByRole('listitem')).toHaveCount(1);
    await expect(page.locator('a[href$=".dmg"], a[href$=".exe"], a[href$=".msi"], a[href$=".AppImage"], a[href$=".deb"]')).toHaveCount(0);
    await expect(page.getByRole('link', { name: /build from source/i })).toHaveCount(0);
  });
});

test.describe('brand', () => {
  test('logo, favicon, touch icon and OG images are published in the charcoal and lime palette', async ({ page }) => {
    for (const asset of ['/favicon.svg', '/apple-touch-icon.png', '/brand/vekrun-mark.svg', '/og/default.png', '/og/pricing.png', '/og/how-it-works.png', '/og/before-and-after.png', '/og/product.png', '/og/teams.png']) {
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
      ['/cloud/', /\/teams\/$/],
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
    expect(sm).not.toMatch(/\/(docs|roadmap|features|cloud|benefits)\//);
    const robots = await (await page.request.get('/robots.txt')).text();
    expect(robots).toContain('Sitemap: https://vekrunapp.com/sitemap-index.xml');
  });
});

test.describe('live share stacks', () => {
  test('shows the previewable stacks as a strip of official logos under the Live Share copy', async ({ page }) => {
    await page.goto('/product/');
    const strip = page.getByLabel('Stacks Live Share previews');
    await expect(strip).toBeVisible();
    const names = strip.locator('ul:not([aria-hidden]) li');
    for (const t of ['React Native', 'Expo', 'Ruby on Rails', 'Python and Django', 'PHP and Laravel', 'Elixir', 'Android native', 'iOS native', 'Flutter', 'Electron', 'Tauri']) await expect(names.filter({ hasText: t })).toHaveCount(1);
    await expect(strip.locator('ul:not([aria-hidden]) li svg, ul:not([aria-hidden]) li img')).toHaveCount(await names.count());
  });
});

test.describe('vekrun to vekrun', () => {
  test('shows seven Macs working in one shared workspace, each move narrated', async ({ page }) => {
    await page.goto('/product/#vekrun-to-vekrun');
    const mesh = page.locator('#vekrun-to-vekrun [data-vmesh]');
    await expect(page.locator('#vekrun-to-vekrun')).toContainText('Seven engineers. Seven Macs. One workspace.');
    await expect(mesh.locator('[data-mac]')).toHaveCount(7);
    await expect(mesh.getByRole('list', { name: 'Workspace activity' }).getByRole('listitem')).toHaveCount(6);
    await page.getByRole('button', { name: 'Pause or play the demonstration' }).first().waitFor();
    await expect(mesh.locator('[data-vm-count]')).toHaveText('7', { timeout: 15000 });
    await expect(mesh.locator('[data-ev="5"]')).toHaveClass(/is-on/, { timeout: 20000 });
  });
});
