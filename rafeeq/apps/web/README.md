# Rafeeq web

## Run locally

From `rafeeq/apps/web`:

```bash
npm install
VITE_USE_MOCKS=true npm run dev
```

Vite prints:

```text
➜  Local:   http://127.0.0.1:5173/
```

The dev server listens on port 5173 (Vite's default) and is reachable at `http://127.0.0.1:5173/`. `server.host` is enabled for loopback and local preview tools. This repo does not publish a public site URL.

`VITE_USE_MOCKS=true` starts the mock service worker for `/api/v1`. Leave `VITE_API_BASE_URL` empty for this local mock run (see `.env.example`).

## Checks

```bash
npm run lint
npm test
npm run build
```

`npm run lint` includes `node ../../scripts/check_banned_terms.mjs` (`npm run check:banned-terms`). It fails when a term from `rafeeq/content/banned_terms.json` appears in `src/i18n/locales`.
