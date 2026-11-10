# Environment variables

## Frontend (Vercel / `apps/web`)

| Variable | Public? | Purpose |
| --- | --- | --- |
| `VITE_API_BASE_URL` | **Yes** (bundled) | Origin for API calls, e.g. `https://<your-fn-app>.azurewebsites.net` — **no secrets** |
| `VITE_USE_MOCKS` | Yes | `true` = MSW intercepts `/api/v1` |
| `VITE_USE_FIREBASE` | Yes | Optional Firebase client |
| `VITE_FIREBASE_*` | Yes | Firebase **public** web config only (not service secrets) |

Set in **Vercel → Project → Environment Variables**. Never put `GEMINI_API_KEY`, DB strings, or JWT signing keys in `VITE_*`.

Example file: `rafeeq/apps/web/.env.example`

## Backend (Azure Functions)

Stored in **`local.settings.json`** locally and **Azure Portal → Function App → Configuration** in production.

Copy from `rafeeq/backend/azure-functions/local.settings.example.json`.

| Variable | Purpose |
| --- | --- |
| `AzureWebJobsStorage` | Required for Functions runtime |
| `FUNCTIONS_WORKER_RUNTIME` | `node` |
| `APP_ENV` | `local` \| `staging` \| `production` |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins (Vercel preview + production URLs) |
| `GEMINI_API_KEY` | Future server-side Gemini (website assistant or shared bridge) |
| `GEMINI_MODEL` | Default model name |
| `GEMINI_FILE_SEARCH_STORE` | File Search store resource name |
| `DATABASE_CONNECTION_STRING` | Future PostgreSQL (Azure Flexible Server) |

## Where secrets must not appear

- Git (use `.gitignore` on `local.settings.json`, `.env`)
- `apps/web/src/**` client bundles
- Vercel **public** env vars (`VITE_*` prefix)
