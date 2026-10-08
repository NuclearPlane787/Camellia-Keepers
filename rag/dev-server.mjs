// Local test server: serves the website and runs the API the same way Netlify will.
//
//   node rag/dev-server.mjs            → http://localhost:8888/ask?site=bukchon
//   node rag/dev-server.mjs --mock     → same, with fake OpenAI answers (no key needed)
//
// The API key is read from Jeju_4-3/.env (one level above the website folder).
// Restart the server after rebuilding the index.

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { loadEnv, REPO_ROOT, ENV_FILE } from './env.mjs';

if (process.argv.includes('--mock')) process.env.MOCK_OPENAI = '1';
if (!process.argv.includes('--rate-limit')) process.env.DISABLE_RATE_LIMIT = '1'; // so the test set can run
const hasEnv = loadEnv();
const { default: handler } = await import('../netlify/functions/ask/ask.mjs');
const { default: index } = await import('../netlify/functions/ask/data/index.mjs');

const PORT = Number(process.env.PORT || 8888);
const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.svg': 'image/svg+xml', '.pdf': 'application/pdf', '.ico': 'image/x-icon',
};

http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  try {
    if (url.pathname === '/api/ask') {
      const chunks = [];
      for await (const c of req) chunks.push(c);
      const request = new Request(url, {
        method: req.method,
        headers: req.headers,
        body: ['GET', 'HEAD'].includes(req.method) ? undefined : Buffer.concat(chunks),
      });
      const response = await handler(request, { ip: req.socket.remoteAddress });
      res.writeHead(response.status, Object.fromEntries(response.headers));
      res.end(Buffer.from(await response.arrayBuffer()));
      return;
    }
    let p = decodeURIComponent(url.pathname);
    if (p === '/') p = '/index.html';
    if (!path.extname(p) && fs.existsSync(path.join(REPO_ROOT, p + '.html'))) p += '.html'; // /ask → ask.html, like Netlify
    const file = path.join(REPO_ROOT, path.normalize(p));
    if (!file.startsWith(REPO_ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' }); res.end('Not found'); return;
    }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  } catch (e) {
    console.error(e);
    res.writeHead(500, { 'Content-Type': 'text/plain' }); res.end('Server error');
  }
}).listen(PORT, () => {
  console.log(`\nCamellia Keepers local server → http://localhost:${PORT}/ask?site=bukchon`);
  console.log(`  QR code print sheet         → http://localhost:${PORT}/rag/qr/index.html`);
  console.log(`  OpenAI: ${process.env.MOCK_OPENAI === '1' ? 'MOCK (fake answers)' : process.env.OPENAI_API_KEY ? 'key loaded' : `NO KEY — add OPENAI_API_KEY to ${ENV_FILE}`}${hasEnv ? '' : ' (no .env file found)'}`);
  console.log(`  Index: ${index.chunks.length ? `${index.chunks.length} chunks, ${index.embed_model}, built ${index.built}` : 'NOT BUILT — run: node rag/ingest.mjs'}\n`);
});
