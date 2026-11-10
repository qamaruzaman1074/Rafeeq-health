# Firebase setup (Spark plan)

RAFEEQ targets the **Firebase Spark (free) plan**. This pass adds configuration files and a client initialization layer only. **Nothing is deployed from this repository automatically.**

## What is prepared in the repo

| Item | Location |
|------|----------|
| Web client init | `apps/web/src/lib/firebase/` |
| Security rules | `apps/web/firebase/firestore.rules` |
| Indexes | `apps/web/firebase/firestore.indexes.json` |
| CLI config | `apps/web/firebase.json` |
| Data model | `docs/architecture/firebase-data-model.md` |

## Manual console steps

1. Create a Firebase project (Spark).
2. Add a **Web** app and copy the config object.
3. Enable **Authentication** → Email/Password (and Anonymous only if you later want it for personas).
4. Create a **Firestore** database (production mode).
5. Paste `firestore.rules` from this repo into the Firestore Rules tab (after review).
6. Deploy indexes when the console prompts (or use `firebase deploy --only firestore:indexes` when approved).
7. (Optional) Enable **Hosting** and deploy `dist/` after `npm run build` when approved.

## Local environment

Copy `apps/web/.env.example` to `apps/web/.env.local`.

- **Competition demo (default):** `VITE_USE_MOCKS=true`, `VITE_USE_FIREBASE=false` — no Firebase credentials required.
- **Firebase dev:** set `VITE_USE_FIREBASE=true` and fill all `VITE_FIREBASE_*` variables.

Never commit `.env.local` or service account keys.

## Emulator (optional)

From `rafeeq/apps/web` after installing [Firebase CLI](https://firebase.google.com/docs/cli):

```bash
npx firebase emulators:start
```

Use the Emulator UI (port 4000) to inspect Auth and Firestore while building the next integration phase.

## Out of scope for Spark in this repo

- Cloud Functions
- Firebase Admin SDK in the browser
- Paid-only APIs

Application wiring (login UI, Firestore services) is a **separate phase** after this cleanup.
