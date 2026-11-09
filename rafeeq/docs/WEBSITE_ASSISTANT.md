# Website assistant (Gemini File Search RAG)

Public-site floating **Rafeeq Assistant**. It is separate from the couple product route **POST `/api/v1/ask`** (MASTER.md Azure stack). This assistant answers only from approved marketing/education knowledge.

## Architecture

| Piece | Role |
| --- | --- |
| `apps/web/knowledge/sources/*.md` | Approved knowledge files (built from `/content` + `en/public.json`) |
| `scripts/build-knowledge.mjs` | Regenerates markdown + `knowledge/manifest.json` |
| `scripts/index-gemini-knowledge.mjs` | One-shot / incremental upload to Gemini File Search store |
| `server/website-assistant/*.mjs` | Validation, rate limit, Gemini `generateContent` + `fileSearch` tool |
| `api/assistant/chat.js` | Vercel serverless entry (secrets stay server-side) |
| `src/features/website-assistant/*` | Floating widget on public pages only |
| MSW `*/api/assistant/chat` | Local demo when `VITE_USE_MOCKS=true` |

## Environment variables (server only)

Set in Vercel → Project → Settings → Environment Variables. **Never** prefix with `VITE_`.

| Variable | Purpose |
| --- | --- |
| `GEMINI_API_KEY` | Gemini API key |
| `GEMINI_FILE_SEARCH_STORE` | Store resource name from indexing script (e.g. `fileSearchStores/...`) |
| `GEMINI_MODEL` | Optional; default `gemini-2.5-flash` |

## Indexing

```bash
cd rafeeq/apps/web
npm ci
npm run knowledge:build
export GEMINI_API_KEY=...   # PowerShell: $env:GEMINI_API_KEY='...'
npm run knowledge:index
```

Copy the printed `GEMINI_FILE_SEARCH_STORE` into Vercel env. Re-run index after content changes; unchanged files are skipped via `knowledge/.upload-state.json` (gitignored).

## Local development

**Mock (default):**

```bash
VITE_USE_MOCKS=true npm run dev
```

**Live Gemini:** terminal A — `npm run dev:assistant` (needs env vars). Terminal B — `VITE_USE_MOCKS=false npm run dev`.

## Vercel deployment

1. Set root directory to `rafeeq/apps/web` (or deploy this folder as the project root).
2. `vercel.json` serves `dist` and exposes `api/assistant/chat.js`.
3. Add the three Gemini env vars on Production + Preview.
4. Run indexing from a secure machine; do not index on each chat request.

## Limitations

- English UI only for the widget (`website-assistant` namespace); Arabic `TODO_AR`.
- `docs/ASSUMPTIONS_AND_LIMITATIONS.md` is sparse; platform limits doc is synthetic.
- Firebase static hosting does not run Vercel functions — use Vercel for this feature or add a separate API host.
- MASTER.md production LLM remains Azure OpenAI for in-app Ask; this widget is marketing education only.

## Acceptance

- Off-topic and personal-genetic prompts are blocked before the model call.
- No API key in client bundles (see Vitest `bundle-secrets.test.ts`).
- Couple dashboards unchanged; widget mounts only on `PublicSiteFrame`.
