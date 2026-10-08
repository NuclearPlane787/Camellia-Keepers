// Loads settings from Jeju_4-3/.env — the folder ABOVE the website folder — so the API key
// can never end up in the GitHub upload. Values already set in the environment win.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const ENV_FILE = path.resolve(REPO_ROOT, '..', '.env');

export function loadEnv() {
  if (fs.existsSync(path.join(REPO_ROOT, '.env'))) {
    console.warn('WARNING: found a .env inside the website folder. Move it up one level to Jeju_4-3/.env,\n' +
                 '         or it may be uploaded to the public GitHub repo with your API key in it.');
  }
  if (!fs.existsSync(ENV_FILE)) return false;
  for (const line of fs.readFileSync(ENV_FILE, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (!m || line.trim().startsWith('#')) continue;
    const val = m[2].replace(/^['"]|['"]$/g, '');
    if (!process.env[m[1]]) process.env[m[1]] = val;
  }
  return true;
}
