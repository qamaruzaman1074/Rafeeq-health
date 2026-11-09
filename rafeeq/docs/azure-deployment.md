# Deploy Azure Functions

## 1. Create resources (once)

```bash
az login
az group create --name rg-rafeeq-dev --location uaenorth
az storage account create --name <storage> --resource-group rg-rafeeq-dev --sku Standard_LRS
az functionapp create \
  --resource-group rg-rafeeq-dev \
  --consumption-plan-location uaenorth \
  --runtime node \
  --runtime-version 22 \
  --functions-version 4 \
  --name <rafeeq-fn-app> \
  --storage-account <storage>
```

## 2. Configure app settings

In Azure Portal (or CLI), set the variables from `docs/environment-variables.md`. Use Key Vault references for secrets in production.

## 3. Deploy from `rafeeq/backend/azure-functions`

```powershell
cd rafeeq\backend\azure-functions
npm ci
npm run build
func azure functionapp publish <rafeeq-fn-app>
```

Ensure `dist/` and `host.json` are published (see `.funcignore`).

## 4. Verify

```http
GET https://<rafeeq-fn-app>.azurewebsites.net/api/health
```

## 5. Connect Vercel frontend

1. Vercel → **Environment Variables** → `VITE_API_BASE_URL` = `https://<rafeeq-fn-app>.azurewebsites.net` (no trailing slash).
2. Set `VITE_USE_MOCKS=false` only when Azure implements the routes you need.
3. Redeploy the Vercel project (`rafeeq/apps/web` root directory).

Until `/api/v1/*` exists on Azure, keep mocks enabled for the couple demo.

## CI (optional, not configured)

Add a GitHub workflow that runs `npm ci`, `npm run build`, `npm test` in `rafeeq/backend/azure-functions` and publishes on tag or manual dispatch.
