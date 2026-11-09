# Application architecture

## Runtime modes

| Mode | Trigger | Behaviour |
|------|---------|-----------|
| **Mock demo** | `VITE_USE_MOCKS=true` (development) | MSW intercepts `/api/v1/*`; guest persona via `POST /auth/guest`. |
| **Static production** | `npm run build` | SPA assets only; no MSW unless configured at host. |
| **Firebase (future)** | `VITE_USE_FIREBASE=true` + valid config | Client initializes Auth/Firestore (`src/lib/firebase/`). Not wired to UI yet. |

## Frontend structure (`apps/web/src`)

- **`app/`** — router, session role guards, providers
- **`pages/`** — route-level screens (public + `/app/*` + clinic + insights)
- **`features/`** — domain views, API adapters, demo reducers (partner, notifications)
- **`mocks/`** — MSW handlers and fixtures (dev/Playwright)
- **`i18n/locales/en/`** — English copy namespaces
- **`lib/`** — shared utilities, HTTP client, Firebase init

## Persistence today

| Data | Storage |
|------|---------|
| Guest role / persona | In-memory session (`app/session.ts`) |
| Partner demo UI | `sessionStorage` (`rafeeq.demo.partner`) |
| Notifications demo | `sessionStorage` |
| Privacy consents | MSW in-memory + `/api/v1/consents` |
| Theme, literacy | `localStorage` |

## Planned Firebase mapping

See `firebase-data-model.md`. Integration will move consents, invitations, and notifications into Firestore while preserving mock mode for competition judging.
