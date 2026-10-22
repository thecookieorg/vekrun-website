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

// Vekrun Cloud: the same card in the Cloud identity (mint = your machine, blue = the organization).
const cloudSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M48 0H0V48" fill="none" stroke="#233146" stroke-width="1"/></pattern>
    <radialGradient id="fade2" cx="55%" cy="40%" r="60%"><stop offset="0%" stop-color="#fff" stop-opacity="1"/><stop offset="100%" stop-color="#fff" stop-opacity="0"/></radialGradient>
    <mask id="m2"><rect width="${W}" height="${H}" fill="url(#fade2)"/></mask>
    <linearGradient id="mintblue" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8ce6c4"/><stop offset="1" stop-color="#618bff"/></linearGradient>
    <radialGradient id="glowA" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#618bff" stop-opacity="0.35"/><stop offset="1" stop-color="#618bff" stop-opacity="0"/></radialGradient>
    <radialGradient id="glowB" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#8ce6c4" stop-opacity="0.28"/><stop offset="1" stop-color="#8ce6c4" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="#080b12"/>
  <ellipse cx="980" cy="200" rx="420" ry="300" fill="url(#glowA)"/>
  <ellipse cx="200" cy="560" rx="420" ry="260" fill="url(#glowB)"/>
  <rect width="${W}" height="${H}" fill="url(#grid)" mask="url(#m2)" opacity="0.7"/>
  <g transform="translate(80,80)">
    <rect x="0" y="0" width="56" height="56" rx="14" fill="#111927" stroke="#32455f" stroke-width="2"/>
    <path d="M14 17 28 41 42 17" stroke="#8ce6c4" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <rect x="34" y="36" width="9" height="5" rx="1.5" fill="#f4f7fb"/>
    <text x="74" y="40" font-family="Geist Variable, Inter, Helvetica, Arial, sans-serif" font-size="30" font-weight="600" fill="#f4f7fb" letter-spacing="-0.5">Vekrun Cloud</text>
    <rect x="300" y="12" width="172" height="34" rx="17" fill="#111927" stroke="#32455f" stroke-width="1.5"/>
    <circle cx="322" cy="29" r="5" fill="#f0c060"/>
    <text x="336" y="35" font-family="Geist Variable, Inter, Helvetica, Arial, sans-serif" font-size="18" fill="#9aa9bc">In development</text>
  </g>
  <g font-family="Geist Variable, Inter, Helvetica, Arial, sans-serif" font-weight="600" fill="#f4f7fb" letter-spacing="-3">
    <text x="80" y="300" font-size="84">Your entire</text>
    <text x="80" y="390" font-size="84">engineering team.</text>
    <text x="80" y="480" font-size="84" fill="url(#mintblue)">One connected workspace.</text>
  </g>
  <text x="80" y="560" font-family="Geist Variable, Inter, Helvetica, Arial, sans-serif" font-size="25" fill="#9aa9bc">Developers, AI agents and managers, coordinated. Optional. vekrunapp.com/cloud</text>
</svg>`;
writeFileSync('public/og/cloud.png', await sharp(Buffer.from(cloudSvg)).png().toBuffer());
console.log('wrote public/og/default.png, public/og/cloud.png and public/apple-touch-icon.png');
