// Generates the Open Graph images (1200×630) in the site's charcoal and lime
// palette. Renders HTML in Chromium so Inter is set exactly as on the site.
// Run: node scripts/og-image.mjs
import { chromium } from '@playwright/test';
import { readFileSync, mkdirSync } from 'node:fs';

const font = readFileSync('node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2').toString('base64');
const mark = readFileSync('public/brand/vekrun-mark.svg', 'utf8');

const images = [
  { file: 'default', kicker: 'The AI software engineering Factory', title: 'From prompt to verified outcome.' },
  { file: 'teams', kicker: 'Vekrun Teams', title: 'One self-hosted Factory for your engineering team.', foot: '$199 a month for up to 10 engineers · planned launch pricing' },
  { file: 'benefits', kicker: 'Benefits', title: 'Get your day back from your AI agents.' },
  { file: 'before-and-after', kicker: 'Before & After', title: 'Stop managing agents. Start directing outcomes.' },
];

const page = (i) => `<!doctype html><html><head><style>
@font-face { font-family: Inter; src: url(data:font/woff2;base64,${font}) format('woff2'); font-weight: 100 900; }
* { margin: 0; box-sizing: border-box; }
body { width: 1200px; height: 630px; background: #0d1014; color: #e9eee9; font-family: Inter, sans-serif; padding: 80px; display: flex; flex-direction: column; position: relative; overflow: hidden; }
body::before { content: ''; position: absolute; inset: -200px auto auto -200px; width: 800px; height: 600px; background: radial-gradient(closest-side, rgba(192,244,138,0.10), transparent); }
.brand { display: flex; align-items: center; gap: 18px; font-size: 36px; font-weight: 640; letter-spacing: -0.02em; position: relative; }
.brand svg { width: 60px; height: 60px; }
.k { margin-top: auto; font-size: 28px; color: #c0f48a; font-weight: 500; position: relative; }
h1 { margin-top: 18px; font-size: 84px; line-height: 1.02; font-weight: 640; letter-spacing: -0.045em; max-width: 1000px; position: relative; }
.f { margin-top: 28px; font-size: 24px; color: #8b989d; position: relative; }
.line { position: absolute; left: 0; right: 0; bottom: 0; height: 6px; background: #c0f48a; }
</style></head><body>
<div class="brand">${mark}Vekrun</div>
<p class="k">${i.kicker}</p><h1>${i.title}</h1>${i.foot ? `<p class="f">${i.foot}</p>` : ''}<div class="line"></div>
</body></html>`;

mkdirSync('public/og', { recursive: true });
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
for (const i of images) {
  await p.setContent(page(i));
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: `public/og/${i.file}.png` });
  console.log('wrote', `public/og/${i.file}.png`);
}
await b.close();
