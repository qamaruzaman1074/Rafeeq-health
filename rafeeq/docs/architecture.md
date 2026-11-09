# Rafeeq repository architecture

## Layout (this repo)

| Path | Role |
| --- | --- |
| `rafeeq/apps/web/` | **Frontend** — React 18, Vite, TypeScript, Vercel |
| `rafeeq/backend/azure-functions/` | **Backend (new)** — Azure Functions Node.js v4, TypeScript |
| `rafeeq/content/` | Approved bilingual content JSON (no LLM authorship) |
| `rafeeq/docs/MASTER.md` | Product source of truth (canonical API, kernel, Azure services) |

There is **no** `rafeeq/apps/api` (Python FastAPI) in the tree yet. The live demo uses **MSW** in the browser for `GET/POST /api/v1/*`.

## Runtime split

```text
[Vercel]  rafeeq/apps/web/dist  +  optional Vercel serverless (website assistant)
[Azure]   rafeeq/backend/azure-functions  →  GET /api/health (scaffold)
[Future]  Product REST  /api/v1/*  per MASTER.md Section 6
```

## Architectural decision (recorded)

| Topic | MASTER.md | This repo today |
| --- | --- | --- |
| Product API | Python FastAPI on Azure Container Apps | Not implemented |
| New scaffold | — | Azure Functions **TypeScript** for incremental HTTP APIs |
| Risk kernel | Python `app/kernel` only | **Not** in Functions; never compute probabilities in Node |

See `docs/DECISIONS.md` (2026-11-09 Azure Functions scaffold).

## Data flow (target)

1. Browser loads SPA from Vercel.
2. `VITE_API_BASE_URL` points at Azure host root (when mocks are off).
3. Client calls `/api/v1/...` via `apps/web/src/lib/api.ts` (envelope `{ data, meta }`).
4. Secrets (`GEMINI_API_KEY`, DB, JWT) live in **Azure** app settings / Key Vault — never in `VITE_*`.

## Conflicts to manage

| Conflict | Mitigation |
| --- | --- |
| MSW vs real API | Keep `VITE_USE_MOCKS=true` for demo; set base URL when Azure `/api/v1` lands |
| Vercel `api/assistant` vs Azure | Website assistant may stay on Vercel short-term; product API on Azure |
| Health shape vs product envelope | `GET /api/health` uses `{ success, message, service }`; `/api/v1/*` uses MASTER envelope later |
| Firebase hosting workflow | GitHub workflow builds web only; Azure deploy is separate (`docs/azure-deployment.md`) |
