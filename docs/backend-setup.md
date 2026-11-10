# Azure Functions backend — local setup

## Prerequisites

- Node.js **22.12+** (matches `apps/web`)
- [Azure Functions Core Tools](https://learn.microsoft.com/azure/azure-functions/functions-run-local) v4
- [Azure CLI](https://learn.microsoft.com/cli/azure/install-azure-cli) (for deployment)

## First-time setup

```powershell
cd rafeeq\backend\azure-functions
npm ci
copy local.settings.example.json local.settings.json
npm run build
```

Edit `local.settings.json` with placeholder values only. **Do not commit** `local.settings.json`.

## Run locally

```powershell
npm run build
npm start
```

Default URL:

```http
GET http://localhost:7071/api/health
```

## Test

```powershell
npm test
npm run lint
```

## Add a new HTTP function

1. Create `src/functions/<name>.ts` and register with `app.http(...)` in a `register*Function()` helper.
2. Import and call that registrar from `src/index.ts`.
3. Add Vitest coverage under `test/`.
4. Document the route in `docs/api-reference.md`.

Put shared logic in `src/services/`, validation in `src/middleware/validate.ts`, responses in `src/utils/http-response.ts`.
