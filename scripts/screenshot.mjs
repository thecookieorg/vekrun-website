// Visual QA helper: screenshots pages at desktop and phone widths.
// Usage: node scripts/screenshot.mjs <baseUrl> <outDir> [path ...]
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const [base = 'http://localhost:4321', out = 'test-results/screens', ...paths] = process.argv.slice(2);
const pages = paths.length ? paths : ['/'];
mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
for (const theme of ['dark', 'light']) {
  for (const [name, viewport] of Object.entries({ desktop: { width: 1440, height: 900 }, phone: { width: 390, height: 844 } })) {
    const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1, reducedMotion: 'no-preference' });
    await ctx.addInitScript((t) => { try { localStorage.setItem('starlight-theme', t); } catch {} }, theme);
    const page = await ctx.newPage();
    for (const p of pages) {
      await page.goto(base + p, { waitUntil: 'networkidle' });
      await page.waitForTimeout(400);
      const slug = p === '/' ? 'home' : p.replace(/^\/|\/$/g, '').replace(/\//g, '-');
      await page.screenshot({ path: `${out}/${slug}-${name}-${theme}.png`, fullPage: true });
    }
    await ctx.close();
  }
}
await browser.close();
console.log(`screenshots in ${out}`);
