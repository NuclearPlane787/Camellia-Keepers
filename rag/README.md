# The 4·3 question service

Visitors scan a QR code at a memorial site → `camelliakeepers.com/ask?site=<site>` → they ask a
question → `/api/ask` finds the most relevant passages in the collected documents and asks OpenAI
to answer from those passages only, with numbered citations.

| Piece | File |
| --- | --- |
| Chat page | `ask.html` |
| API (Netlify Function) | `netlify/functions/ask/ask.mjs` |
| Search, prompt, OpenAI calls | `netlify/functions/ask/lib.mjs` |
| Memorial sites and suggested questions | `netlify/functions/ask/sites.mjs` |
| Search index (generated) | `netlify/functions/ask/data/index.mjs` |
| Builds the index | `rag/ingest.mjs` |
| Local test server | `rag/dev-server.mjs` |
| Test questions | `rag/eval/` |
| QR codes + print sheet | `rag/make-qr.mjs` → `rag/qr/` |

Source documents live **outside** this folder, in `Jeju_4-3/sources/`, listed in `manifest.json`.

## The API key — read this first

The key goes in a file called `.env` in the **Jeju_4-3** folder — one level *above* this website
folder — never inside it:

```
Jeju_4-3/
  .env                     ← OPENAI_API_KEY=sk-...
  sources/
  camelliakeepers-upload/  ← this folder, uploaded to GitHub
```

This folder is uploaded to a public GitHub repository, and GitHub's upload page ignores
`.gitignore`. A key inside this folder could end up public. If one ever is, delete it on
platform.openai.com immediately and make a new one.

Before using the key, set a monthly budget on platform.openai.com (Settings → Limits).

## Running it on your Mac (needs Node.js 20 or newer, from nodejs.org)

```
cd ~/Desktop/ClaudeProjects/Jeju_4-3/camelliakeepers-upload
node rag/ingest.mjs --dry-run      # what will be indexed, and the cost (no API calls)
node rag/ingest.mjs                # build the index (~1 minute, well under $0.01 today)
node rag/dev-server.mjs            # then open http://localhost:8888/ask?site=bukchon
node rag/eval/run.mjs              # in a second Terminal window: run the 17 test questions
```

Without a key, add `--mock` to `ingest.mjs` and `dev-server.mjs` to try everything with fake
answers. Never upload a mock index (the API refuses to use one anyway).

## Adding a source document

1. Get a text version: `pdftotext report.pdf report.txt` keeps page breaks, which become page
   numbers in the citations.
2. Put it in `Jeju_4-3/sources/official/` and add an entry to `manifest.json`, with
   `"trust": "primary"` for official sources and `"secondary"` for everything else.
3. Run `node rag/ingest.mjs` again, restart the dev server, rerun the tests.

## Putting it live

Upload these to GitHub as before (drag into the repository page): `ask.html`, `netlify.toml`,
`.gitignore` and the `netlify` and `rag` folders. Then, in Netlify, add `OPENAI_API_KEY` under
Site configuration → Environment variables, and redeploy. The repository must already be linked
to Netlify for the function to deploy.

## Settings (optional, in .env or Netlify environment variables)

| Name | Default | |
| --- | --- | --- |
| `OPENAI_CHAT_MODEL` | `gpt-4o` | model that writes answers. `gpt-6-luna` is about 20× cheaper |
| `OPENAI_TEMPERATURE` | `0.2` | non-reasoning models only (e.g. gpt-4o); lower = more consistent |
| `OPENAI_REASONING_EFFORT` | `low` | reasoning models only (gpt-5/6, o-series): `none`/`low`/`medium` |
| `OPENAI_EMBED_MODEL` | `text-embedding-3-small` | changing it means rebuilding the index |
| `OPENAI_EMBED_DIMS` | `512` | same |
| `MAX_ANSWER_TOKENS` | `700` (`1200` for reasoning models) | cap on answer length; reasoning models count their thinking too |
