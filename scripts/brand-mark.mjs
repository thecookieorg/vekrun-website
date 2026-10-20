// Renders the Vekrun mark (no wordmark) to PNG for avatars and app stores.
// Run: node scripts/brand-mark.mjs
import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';

const mark = (bg, tile, stroke, cursor) => `
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 32 32">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#5fd3b5"/><stop offset="1" stop-color="#4fb8d8"/>
    </linearGradient>
  </defs>
  ${bg ? `<rect width="32" height="32" rx="7" fill="${bg}"/>` : ''}
  <rect x="1" y="1" width="30" height="30" rx="8" fill="${tile}" stroke="url(#g)" stroke-opacity="${stroke}" stroke-width="1"/>
  <path d="M8.5 9.5 16 22.5 23.5 9.5" stroke="url(#g)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <rect x="19.5" y="20" width="5" height="3" rx="0.75" fill="${cursor}"/>
</svg>`;

mkdirSync('public/brand', { recursive: true });
const variants = [
  ['vekrun-mark-dark-1024.png', mark('#0a0e14', '#111820', 0.7, '#edf1f5')],
  ['vekrun-mark-dark-512.png', mark('#0a0e14', '#111820', 0.7, '#edf1f5')],
  ['vekrun-mark-transparent-1024.png', mark(null, '#111820', 0.7, '#edf1f5')],
  ['vekrun-mark-light-1024.png', mark('#f6f8fa', '#ffffff', 0.9, '#0f1720')],
];
for (const [name, svg] of variants) {
  const size = name.includes('512') ? 512 : 1024;
  writeFileSync(`public/brand/${name}`, await sharp(Buffer.from(svg), { density: 300 }).resize(size, size).png().toBuffer());
  console.log('wrote public/brand/' + name);
}
writeFileSync('public/brand/vekrun-mark.svg', mark('#0a0e14', '#111820', 0.7, '#edf1f5').trim());
console.log('wrote public/brand/vekrun-mark.svg');
