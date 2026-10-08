// Runs the test questions against the local server (node rag/dev-server.mjs must be running).
//   node rag/eval/run.mjs                 all questions
//   node rag/eval/run.mjs deaths apology  only ids containing these words
//   BASE=https://camelliakeepers.com node rag/eval/run.mjs   against the live site (rate-limited!)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE = process.env.BASE || 'http://localhost:8888';
const { questions } = JSON.parse(fs.readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), 'questions.json'), 'utf8'));
const filters = process.argv.slice(2);
const todo = filters.length ? questions.filter((q) => filters.some((f) => q.id.includes(f))) : questions;

let pass = 0, fail = 0;
for (const t of todo) {
  const started = Date.now();
  let answer = '', sources = [], err = null;
  try {
    const r = await fetch(`${BASE}/api/ask`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: t.q, lang: t.lang, site: t.site || null }),
    });
    const data = await r.json();
    if (!r.ok) err = `${r.status} ${data.error}${data.code ? ' / ' + data.code : ''}`;
    answer = data.answer || ''; sources = data.sources || [];
  } catch (e) { err = e.message; }
  const lower = answer.toLowerCase();
  const okAny = !t.any || t.any.some((s) => lower.includes(s.toLowerCase()));
  const okNone = !t.none || !t.none.some((s) => lower.includes(s.toLowerCase()));
  const ok = !err && okAny && okNone;
  ok ? pass++ : fail++;
  console.log(`\n${ok ? 'PASS' : 'FAIL'}  ${t.id}${t.needs ? `  (needs ${t.needs} sources)` : ''}  ${Date.now() - started} ms`);
  console.log(`  Q: ${t.q}${t.site ? `  [site=${t.site}]` : ''}`);
  if (err) console.log(`  ERROR: ${err}`);
  else {
    console.log(`  A: ${answer.replace(/\s+/g, ' ').slice(0, 400)}${answer.length > 400 ? '…' : ''}`);
    console.log(`  sources: ${sources.map((s) => `[${s.n}] ${s.official ? 'OFFICIAL ' : ''}${s.title.slice(0, 40)}${s.page ? ' p.' + s.page : ''}`).join(' | ')}`);
    if (!okAny) console.log(`  missing one of: ${t.any.join(', ')}`);
    if (!okNone) console.log(`  should not contain: ${t.none.join(', ')}`);
  }
}
console.log(`\n${pass}/${pass + fail} passed`);
