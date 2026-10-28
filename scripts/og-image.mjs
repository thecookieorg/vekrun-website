// Generates the default Open Graph image from an SVG template with sharp.
// Run: node scripts/og-image.mjs
import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';

const W = 1200, H = 630;
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <pattern id="grid0" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M48 0H0V48" fill="none" stroke="#233146" stroke-width="1"/></pattern>
    <radialGradient id="fade" cx="45%" cy="35%" r="65%"><stop offset="0%" stop-color="#fff" stop-opacity="1"/><stop offset="100%" stop-color="#fff" stop-opacity="0"/></radialGradient>
    <mask id="m"><rect width="${W}" height="${H}" fill="url(#fade)"/></mask>
    <linearGradient id="mintblue0" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8ce6c4"/><stop offset="1" stop-color="#618bff"/></linearGradient>
    <radialGradient id="glow0a" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#8ce6c4" stop-opacity="0.26"/><stop offset="1" stop-color="#8ce6c4" stop-opacity="0"/></radialGradient>
    <radialGradient id="glow0b" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#618bff" stop-opacity="0.3"/><stop offset="1" stop-color="#618bff" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="#080b12"/>
  <ellipse cx="260" cy="140" rx="460" ry="300" fill="url(#glow0a)"/>
  <ellipse cx="1000" cy="520" rx="440" ry="280" fill="url(#glow0b)"/>
  <rect width="${W}" height="${H}" fill="url(#grid0)" mask="url(#m)" opacity="0.7"/>
  <g transform="translate(80,88)">
    <rect x="0" y="0" width="64" height="64" rx="16" fill="#111927" stroke="#32455f" stroke-width="2"/>
    <path d="M16 19 32 47 48 19" stroke="#8ce6c4" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <rect x="39" y="41" width="10" height="6" rx="1.5" fill="#f4f7fb"/>
    <text x="84" y="46" font-family="Geist Variable, Inter, Helvetica, Arial, sans-serif" font-size="34" font-weight="600" fill="#f4f7fb" letter-spacing="-0.5">Vekrun</text>
  </g>
  <text x="80" y="246" font-family="Geist Mono Variable, ui-monospace, Menlo, monospace" font-size="22" fill="#8ce6c4" letter-spacing="1">AI SOFTWARE ENGINEERING FACTORY</text>
  <g font-family="Geist Variable, Inter, Helvetica, Arial, sans-serif" font-weight="600" fill="#f4f7fb" letter-spacing="-3">
    <text x="80" y="350" font-size="90">Tell Vekrun what</text>
    <text x="80" y="448" font-size="90" fill="url(#mintblue0)">needs to ship.</text>
  </g>
  <text x="80" y="540" font-family="Geist Variable, Inter, Helvetica, Arial, sans-serif" font-size="26" fill="#9aa9bc">Plan, build, test, verify and deliver across your repositories.</text>
  <text x="80" y="580" font-family="Geist Variable, Inter, Helvetica, Arial, sans-serif" font-size="22" fill="#6f7e94">In development · vekrunapp.com</text>
</svg>`;
mkdirSync('public/og', { recursive: true });
const png = await sharp(Buffer.from(svg)).png().toBuffer();
writeFileSync('public/og/default.png', png);
// Apple touch icon from the favicon mark.
const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#080b12"/><path d="M8.5 9.5 16 22.5 23.5 9.5" stroke="#8ce6c4" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/><rect x="19.5" y="20" width="5" height="3" rx=".75" fill="#f4f7fb"/></svg>`;
writeFileSync('public/apple-touch-icon.png', await sharp(Buffer.from(icon)).resize(180, 180).png().toBuffer());

// Vekrun Teams: the same card in the organization identity (mint = your machine, blue = the organization).
const teamsSvg = `
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
    <text x="74" y="40" font-family="Geist Variable, Inter, Helvetica, Arial, sans-serif" font-size="30" font-weight="600" fill="#f4f7fb" letter-spacing="-0.5">Vekrun Teams</text>
    <rect x="300" y="12" width="120" height="34" rx="17" fill="#111927" stroke="#32455f" stroke-width="1.5"/>
    <circle cx="322" cy="29" r="5" fill="#f0c060"/>
    <text x="336" y="35" font-family="Geist Variable, Inter, Helvetica, Arial, sans-serif" font-size="18" fill="#9aa9bc">Planned</text>
  </g>
  <g font-family="Geist Variable, Inter, Helvetica, Arial, sans-serif" font-weight="600" fill="#f4f7fb" letter-spacing="-3">
    <text x="80" y="300" font-size="80">One Factory for your</text>
    <text x="80" y="390" font-size="80">engineering team.</text>
    <text x="80" y="480" font-size="80" fill="url(#mintblue)">On your infrastructure.</text>
  </g>
  <text x="80" y="560" font-family="Geist Variable, Inter, Helvetica, Arial, sans-serif" font-size="25" fill="#9aa9bc">Self-hosted. $199 a month for up to 10 engineers, planned launch pricing.</text>
</svg>`;
writeFileSync('public/og/teams.png', await sharp(Buffer.from(teamsSvg)).png().toBuffer());
console.log('wrote public/og/default.png, public/og/teams.png and public/apple-touch-icon.png');
