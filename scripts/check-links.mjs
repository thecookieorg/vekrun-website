// Crawls dist/ for internal links and fragment anchors. Fails on anything that
// does not resolve to a built page or asset. External links are listed, not fetched.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';

const dist = resolve('dist');
if (!existsSync(dist)) { console.error('dist/ not found; run `pnpm build` first'); process.exit(2); }

const htmlFiles = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p); else if (p.endsWith('.html')) htmlFiles.push(p);
  }
})(dist);

const ids = new Map(); // file -> Set(ids)
const links = []; // {file, href}
const hrefRe = /<(?:a|link)\b[^>]*?\bhref=["']([^"']+)["']/gi;
const srcRe = /<(?:img|script|source)\b[^>]*?\bsrc=["']([^"']+)["']/gi;
const idRe = /\bid=["']([^"']+)["']/gi;

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const set = new Set();
  for (const m of html.matchAll(idRe)) set.add(m[1]);
  ids.set(file, set);
  for (const m of html.matchAll(hrefRe)) links.push({ file, href: m[1] });
  for (const m of html.matchAll(srcRe)) links.push({ file, href: m[1] });
}

const external = new Set();
const broken = [];
const resolveTarget = (file, href) => {
  const [pathPart, hash] = href.replace(/\?[^#]*/, '').split('#');
  let target;
  if (pathPart === '' || pathPart === undefined) target = file;
  else if (pathPart.startsWith('/')) target = join(dist, pathPart);
  else target = join(dirname(file), pathPart);
  if (!target.endsWith('.html') && !/\.[a-z0-9]+$/i.test(target)) target = join(target, 'index.html');
  return { target, hash };
};

for (const { file, href } of links) {
  if (/^(https?:|mailto:|tel:|data:|javascript:)/i.test(href)) { if (/^https?:/i.test(href)) external.add(href); continue; }
  const { target, hash } = resolveTarget(file, href);
  if (!existsSync(target)) { broken.push({ file, href, reason: 'missing target' }); continue; }
  if (hash && target.endsWith('.html')) {
    const set = ids.get(target) ?? (() => { const s = new Set(); for (const m of readFileSync(target, 'utf8').matchAll(idRe)) s.add(m[1]); ids.set(target, s); return s; })();
    if (!set.has(decodeURIComponent(hash))) broken.push({ file, href, reason: `missing anchor #${hash}` });
  }
}

const rel = (f) => f.slice(dist.length + 1);
console.log(`${htmlFiles.length} pages, ${links.length} links checked, ${external.size} distinct external URLs (not fetched).`);
if (broken.length) {
  console.error(`\n${broken.length} broken internal link(s):`);
  for (const b of broken) console.error(`  ${rel(b.file)} -> ${b.href}  (${b.reason})`);
  process.exit(1);
}
console.log('No broken internal links.');
