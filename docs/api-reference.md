# API reference (scaffold)

## Implemented (Azure Functions)

### `GET /api/health`

| | |
| --- | --- |
| Auth | Anonymous |
| CORS | Reflects `Origin` when listed in `ALLOWED_ORIGINS` |

**200 response**

```json
{
  "success": true,
  "message": "Rafeeq backend is running",
  "service": "azure-functions"
}
```

## Planned (MASTER.md Section 6)

Canonical product API under **`/api/v1`**. Not implemented on Azure yet. The web app mocks these routes with MSW (`apps/web/src/mocks/handlers.ts`).

Examples:

| Method | Path | Notes |
| --- | --- | --- |
| POST | `/api/v1/auth/guest` | Demo persona session |
| POST | `/api/v1/ask` | In-app assistant (Azure OpenAI per MASTER) |
| POST | `/api/v1/explain/overlap` | Kernel-computed numbers only |

Success envelope (target):

```json
{
  "data": {},
  "meta": { "request_id": "..." }
}
```

## Vercel-only (not Azure)

| Method | Path | Host |
| --- | --- | --- |
| POST | `/api/assistant/chat` | `apps/web/api/assistant/chat.js` (public Gemini RAG widget) |

Do not expose `GEMINI_API_KEY` to the browser.
