# RAFEEQ

RAFEEQ is an English-only **competition demo** for genetic-health education, consent-based partner sharing, and pathways to qualified genetic counselling. All people, screening results, and referrals in the app are **fictional**.

## Repository layout

```text
Rafeeq/
├── README.md                 # This file
├── CONTRIBUTING.md
├── rafeeq/
│   ├── apps/web/             # React + Vite application (primary product)
│   ├── content/              # Personas and shared JSON fixtures
│   ├── docs/                 # Safety, legal review, architecture, screenshots
│   └── scripts/              # Shared tooling (e.g. banned-term check)
```

## Features

- Public marketing website and legal pages
- Persona-based demo entry and couple dashboard (`/app/*`)
- Synthetic screening report, partner invitations, consent controls, notifications
- Learn, check, ask, privacy, and care journeys
- Counsellor clinic queue and case brief (`/clinic/*`)
- Analyst insights dashboard (`/insights`)
- Progressive Web App (service worker)
- **Mock development** via MSW (`VITE_USE_MOCKS=true`)

## Technology stack

| Layer | Choice |
|-------|--------|
| UI | React 18, TypeScript, React Router 7 |
| Build | Vite 8, Tailwind CSS |
| i18n | i18next (English namespaces) |
| Demo API | MSW + in-memory mock handlers |
| Tests | Vitest, Playwright, axe |
| Backend (planned) | Firebase Auth, Cloud Firestore, Firebase Hosting (Spark) |

Firebase client initialization and security rules live in the repo; **application data is not wired to Firestore yet**. See `rafeeq/docs/setup/firebase.md`.

## Quick start

Requirements: **Node.js ≥ 22.12**.

```bash
cd rafeeq/apps/web
cp .env.example .env.local
# Default demo — no Firebase credentials needed:
# VITE_USE_MOCKS=true
# VITE_USE_FIREBASE=false
npm ci
npm run dev
```

Open `http://127.0.0.1:5173`, choose **Get Started**, pick a demo persona.

## Commands (`rafeeq/apps/web`)

| Command | Purpose |
|---------|---------|
| `npm run dev` | Vite dev server |
| `npm run lint` | ESLint, Prettier, TypeScript, i18n and banned-term checks |
| `npm run test` | Vitest unit tests |
| `npm run e2e` | Playwright (starts dev server with mocks) |
| `npm run build` | Production build + first-route budget check |

## Environment variables

See `rafeeq/apps/web/.env.example`. Important switches:

- `VITE_USE_MOCKS=true` — enables MSW for `/api/v1` in development.
- `VITE_USE_FIREBASE=false` — keeps Firebase uninitialized (default).

## Firebase (preparation only)

- Config layer: `rafeeq/apps/web/src/lib/firebase/`
- Rules: `rafeeq/apps/web/firebase/firestore.rules`
- Setup guide: `rafeeq/docs/setup/firebase.md`
- Data model: `rafeeq/docs/architecture/firebase-data-model.md`

Do not commit secrets. Deployment to Firebase is manual and requires explicit approval.

## Documentation

| Document | Purpose |
|----------|---------|
| `rafeeq/docs/SAFETY.md` | Synthetic data and clinical boundaries |
| `rafeeq/docs/LEGAL_REVIEW.md` | Pre-publication legal checklist |
| `rafeeq/docs/DECISIONS.md` | Historical implementation decisions |
| `rafeeq/docs/screens/` | Regenerable UI screenshots (English) |

## Known limitations

- No real sign-in, email delivery, or backend persistence in production builds without Firebase integration.
- Partner demo state on `/app/partner` uses `sessionStorage`; privacy consents use MSW until Firestore wiring lands.
- Placeholder phone numbers on the contact page.
- Terms and privacy copy await legal review (`LEGAL_REVIEW.md`).

## License

See repository license files. IBM Plex Sans is under the SIL Open Font License (`apps/web/src/styles/fonts/OFL.txt`).
