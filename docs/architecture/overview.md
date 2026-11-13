# Application architecture

## Runtime modes

| Mode                    | Trigger                                     | Behaviour                                                                                                                      |
| ----------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **Mock demo**           | `VITE_USE_MOCKS=true` (development)         | MSW intercepts `/api/v1/*`; guest persona via `POST /auth/guest`.                                                              |
| **Static production**   | `npm run build`                             | SPA assets only; no MSW unless configured at host.                                                                             |
| **Firebase (future)**   | `VITE_USE_FIREBASE=true` + valid config     | Client initializes Auth/Firestore (`src/lib/firebase/`). Not wired to UI yet.                                                  |
| **Supabase foundation** | Supabase URL and publishable key configured | Auth, profiles, consent, and private signed-in report storage use Supabase; other product API flows retain MSW/Azure adapters. |

## Frontend structure (`apps/web/src`)

- **`app/`** — router, session role guards, providers
- **`pages/`** — route-level screens (public + `/app/*` + clinic + insights)
- **`features/`** — domain views, API adapters, demo reducers (partner, notifications)
- **`mocks/`** — MSW handlers and fixtures (dev/Playwright)
- **`i18n/locales/en/`** — English copy namespaces
- **`lib/`** — shared utilities, HTTP client, Firebase init
- **`utils/`** — Supabase browser client

## Persistence today

| Data                 | Storage                                                       |
| -------------------- | ------------------------------------------------------------- |
| Guest role / persona | In-memory session (`app/session.ts`)                          |
| Partner demo UI      | `sessionStorage` (`rafeeq.demo.partner`); simulated only      |
| Notifications demo   | `sessionStorage`                                              |
| Privacy consents     | Supabase for authenticated users; MSW/Azure for demo sessions |
| Theme, literacy      | `localStorage`                                                |

## Supabase setup

The browser client is `apps/web/src/utils/supabase.ts`. Set
`VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in the local environment.
In the Supabase dashboard, open **SQL Editor**, create a query, and run
`supabase/migrations/20261113203900_initial_rafeeq_schema.sql` once before using the
schema. Every table has row-level security enabled. Clinic access requires a trusted
`app_metadata.role = "counsellor"` claim; never let a browser client assign that
claim. Email/password registration and sign-in are available at `/auth`; configure
the project's email confirmation and redirect URL settings in Supabase Auth.

The initial migration creates profiles, consent records, partner-sharing metadata,
care pathway progress, referrals, notifications, and clinic audit records. Later
migrations add a private `screening_reports` metadata table and the `report_rafeeq`
Storage bucket. This prototype stores only a small, app-generated synthetic
plain-text demonstration file at `{user_id}/{filename}`; it does not accept or store
real genetic, medical, or personal health reports. Storage object policies and table
RLS restrict access to the authenticated owner. RAFEEQ does not parse or analyze the
synthetic file. The report access code is an owner-scoped identifier, not an
authentication credential. Profile deletion removes only the `profiles` row; it does
not delete the Supabase Auth account or the user's other rows.

Email/password auth and profile records use Supabase when configured. Authenticated
privacy consent preferences and receipts use the RLS-protected consent tables.
Signed-in synthetic demonstration uploads use the private bucket and owner-scoped
report table. Guest report and partner demonstrations remain local and use fictional
sample content only; partner sharing does not grant access to uploaded files.
The generic audit timeline remains on the existing API adapter because the consent
events table does not store its actor role or non-consent audit actions. Guest/demo
consent behavior remains on the existing MSW/Azure adapters. Partner-sharing, care,
notifications, and clinic API flows are not switched to Supabase by this integration.
Keep `VITE_USE_MOCKS=true` for the demo.

Apply `20261114032000_private_screening_reports.sql` and
`20261114032100_allow_own_profile_insert.sql` after the initial schema migration
before using private synthetic demonstration storage or profile edits. The report
bucket is private, allows `text/plain` files up to 10 MB, and has owner-only
policies; the client uses only the publishable key.

## Existing Firebase reference

See `firebase-data-model.md` for the earlier Firestore proposal. The Supabase
migration above is the current backend foundation; the Firebase client and rules
remain in the repository but are not used by product data flows.
