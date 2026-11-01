// Renders the Vekrun mark (the prompt chevron folded into a V, with a block
// cursor) in the desktop application's palette: charcoal tile, lime V.
// Writes the master SVG, the favicon, the Apple touch icon and PNG exports.
// Run: node scripts/brand-mark.mjs
import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';

export const markSvg = ({ size = 1024, bg = null, tile = '#151b20', edge = '#353f45', v = '#c0f48a', cursor = '#e9eee9' } = {}) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32" fill="none">
  ${bg ? `<rect width="32" height="32" rx="7" fill="${bg}"/>` : ''}<rect x="1" y="1" width="30" height="30" rx="8" fill="${tile}" stroke="${edge}"/>
  <path d="M8.5 9.5 16 22.5 23.5 9.5" stroke="${v}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="19.5" y="20" width="5" height="3" rx="0.75" fill="${cursor}"/>
</svg>`;

mkdirSync('public/brand', { recursive: true });
const dark = { tile: '#151b20', edge: '#353f45', v: '#c0f48a', cursor: '#e9eee9' };
const light = { tile: '#ffffff', edge: '#c4ccbf', v: '#4d7c0f', cursor: '#111511' };
const variants = [
  ['vekrun-mark-dark-1024.png', 1024, { ...dark, bg: '#0d1014' }],
  ['vekrun-mark-dark-512.png', 512, { ...dark, bg: '#0d1014' }],
  ['vekrun-mark-transparent-1024.png', 1024, dark],
  ['vekrun-mark-light-1024.png', 1024, { ...light, bg: '#f6f7f4' }],
];
const png = (svg, size) => sharp(Buffer.from(svg), { density: 600 }).resize(size, size).png().toBuffer();
for (const [name, size, opts] of variants) {
  writeFileSync(`public/brand/${name}`, await png(markSvg({ size, ...opts }), size));
  console.log('wrote public/brand/' + name);
}
writeFileSync('public/brand/vekrun-mark.svg', markSvg({ ...dark, bg: '#0d1014' }));
writeFileSync('public/favicon.svg', markSvg({ size: 32, ...dark }));
// Apple touch icon: a full-bleed charcoal square (iOS rounds the corners itself).
const touch = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" fill="#151b20"/><path d="M8.5 9.5 16 22.5 23.5 9.5" stroke="#c0f48a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><rect x="19.5" y="20" width="5" height="3" rx="0.75" fill="#e9eee9"/></svg>`;
writeFileSync('public/apple-touch-icon.png', await png(touch, 180));
console.log('wrote vekrun-mark.svg, favicon.svg and apple-touch-icon.png');
