// Makes one QR code per memorial site, plus a printable sheet.
//
//   cd rag && npm install && node make-qr.mjs
//   (or: BASE_URL=https://example.com node make-qr.mjs)
//
// Output: rag/qr/<site>.svg and rag/qr/index.html (open it in a browser and print).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import QRCode from 'qrcode';
import { SITES } from '../netlify/functions/ask/sites.mjs';

const BASE = (process.env.BASE_URL || 'https://camelliakeepers.com').replace(/\/$/, '');
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), 'qr');
fs.mkdirSync(OUT, { recursive: true });

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const cards = [];
const entries = [['general', null], ...Object.entries(SITES)];

for (const [slug, site] of entries) {
  const url = site ? `${BASE}/ask?site=${slug}` : `${BASE}/ask`;
  // Level Q survives ~25% damage — sensible for signs outdoors.
  const svg = await QRCode.toString(url, { type: 'svg', errorCorrectionLevel: 'Q', margin: 2, color: { dark: '#1a1814', light: '#ffffff' } });
  fs.writeFileSync(path.join(OUT, `${slug}.svg`), svg);
  const ko = site ? site.name.ko : '제주 4·3';
  const en = site ? site.name.en : 'Jeju 4·3 (general)';
  cards.push(`<section class="card"><div class="qr">${svg}</div><h2>${esc(ko)}</h2><h3>${esc(en)}</h3><p class="cta">4·3에 대해 질문해 보세요 · Ask about 4·3</p><p class="url">${esc(url.replace(/^https?:\/\//, ''))}</p></section>`);
  console.log(`${slug.padEnd(14)} ${url}`);
}

fs.writeFileSync(path.join(OUT, 'index.html'), `<!DOCTYPE html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Camellia Keepers QR codes</title>
<style>
body{margin:0;background:#faf7f2;font-family:'Apple SD Gothic Neo','Noto Sans KR',system-ui,sans-serif;color:#1a1814}
header{padding:20px 24px;font-size:14px;color:#5e5b54}
main{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:20px;padding:0 24px 24px}
.card{background:#fff;border:1px solid rgba(30,28,22,.13);border-radius:12px;padding:20px;text-align:center;break-inside:avoid}
.qr svg{width:100%;max-width:220px;height:auto}
h2{font-size:20px;margin:10px 0 2px}h3{font-size:14px;font-weight:500;margin:0 0 10px;color:#5e5b54}
.cta{margin:0;color:#7b2d2d;font-size:13px;font-weight:600}.url{margin:6px 0 0;font-size:11px;color:#948f86;word-break:break-all}
@media print{header{display:none}body{background:#fff}main{grid-template-columns:repeat(2,1fr);gap:12mm;padding:0}.card{border:1px solid #ccc}}
</style></head><body>
<header>Generated ${new Date().toISOString().slice(0, 10)} for ${esc(BASE)}. Print with Cmd+P. Each SVG file in this folder can also go straight to a print shop.</header>
<main>${cards.join('\n')}</main></body></html>
`);
console.log(`\nWrote ${entries.length} codes and a print sheet to rag/qr/`);
