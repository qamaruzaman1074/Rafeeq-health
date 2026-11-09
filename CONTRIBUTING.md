# Contributing to RAFEEQ

## Principles

- All user-visible clinical information must stay **fictional** and clearly labelled as a demo where appropriate.
- Do not imply diagnoses, compatibility scores, or real hospital integrations.
- Never commit API keys, Firebase service accounts, or `.env.local`.
- Keep mock mode working: `VITE_USE_MOCKS=true` must continue to support persona selection and dashboard flows without Firebase.

## Commits

Use conventional commits: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`.

## Development

```bash
cd rafeeq/apps/web
npm ci
cp .env.example .env.local
VITE_USE_MOCKS=true npm run dev
```

Before opening a pull request:

```bash
npm run lint
npm run test
npm run build
npm run e2e
```

## Pull requests

Use the template in `.github/pull_request_template.md`. Include:

- What changed and why
- Test evidence (command output or summary)
- Whether demo/mock behaviour was exercised
- Confirmation that no secrets or real PHI were added

## Firebase work

- Client code belongs in `src/lib/firebase/` and future `src/services/*`.
- Update `firebase/firestore.rules` and `docs/architecture/firebase-data-model.md` when the schema changes.
- Do not deploy rules or enable paid Firebase services from CI without maintainer approval.

## Screenshots

English screenshots under `rafeeq/docs/screens/` may be regenerated with:

```bash
cd rafeeq/apps/web
npm run e2e -- e2e/screens.spec.ts
```
