// Generates the default Open Graph image from an SVG template with sharp.
// Run: node scripts/og-image.mjs
import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';

const W = 1200, H = 630;
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <pattern id="dots" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1.2" fill="#2f4053"/></pattern>
    <radialGradient id="fade" cx="50%" cy="35%" r="65%"><stop offset="0%" stop-color="#fff" stop-opacity="1"/><stop offset="100%" stop-color="#fff" stop-opacity="0"/></radialGradient>
    <mask id="m"><rect width="${W}" height="${H}" fill="url(#fade)"/></mask>
  </defs>
  <rect width="${W}" height="${H}" fill="#0a0e14"/>
  <rect width="${W}" height="${H}" fill="url(#dots)" mask="url(#m)"/>
  <g transform="translate(80,88)">
    <rect x="0" y="0" width="64" height="64" rx="16" fill="#111820" stroke="#2f4053" stroke-width="2"/>
    <path d="M16 19 32 47 48 19" stroke="#5fd3b5" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <rect x="39" y="41" width="10" height="6" rx="1.5" fill="#edf1f5"/>
    <text x="84" y="46" font-family="Geist Variable, Inter, Helvetica, Arial, sans-serif" font-size="34" font-weight="600" fill="#edf1f5" letter-spacing="-0.5">Vekrun</text>
  </g>
  <g font-family="Geist Variable, Inter, Helvetica, Arial, sans-serif" font-weight="600" fill="#edf1f5" letter-spacing="-3">
    <text x="80" y="300" font-size="92">Your terminal.</text>
    <text x="80" y="398" font-size="92">Your models.</text>
    <text x="80" y="496" font-size="92" fill="#5fd3b5">Your rules.</text>
  </g>
  <text x="80" y="566" font-family="Geist Variable, Inter, Helvetica, Arial, sans-serif" font-size="26" fill="#98a6b8">The open-source developer workspace. vekrunapp.com</text>
</svg>`;
mkdirSync('public/og', { recursive: true });
const png = await sharp(Buffer.from(svg)).png().toBuffer();
writeFileSync('public/og/default.png', png);
// Apple touch icon from the favicon mark.
const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#0a0e14"/><path d="M8.5 9.5 16 22.5 23.5 9.5" stroke="#5fd3b5" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/><rect x="19.5" y="20" width="5" height="3" rx=".75" fill="#edf1f5"/></svg>`;
writeFileSync('public/apple-touch-icon.png', await sharp(Buffer.from(icon)).resize(180, 180).png().toBuffer());
console.log('wrote public/og/default.png and public/apple-touch-icon.png');
