// Minimal foreground static server for dist/, with GitHub Pages semantics:
// directory → index.html, missing file → 404.html with status 404.
// Used by Playwright (astro preview daemonises, which Playwright treats as an early exit).
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, resolve } from 'node:path';

const root = resolve('dist');
const port = Number(process.argv[2] ?? 4329);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain', '.webmanifest': 'application/manifest+json' };

createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost');
  let path = decodeURIComponent(url.pathname);
  if (path.includes('..')) { res.writeHead(400); return res.end(); }
  let file = join(root, path);
  try {
    const s = await stat(file);
    if (s.isDirectory()) {
      if (!path.endsWith('/')) { res.writeHead(301, { Location: path + '/' + url.search }); return res.end(); }
      file = join(file, 'index.html');
    }
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[extname(file)] ?? 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(body);
  } catch {
    try {
      const body = await readFile(join(root, '404.html'));
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(body);
    } catch { res.writeHead(404); res.end('Not found'); }
  }
}).listen(port, () => console.log(`serving dist/ at http://localhost:${port}`));
