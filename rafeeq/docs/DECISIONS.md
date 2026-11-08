# DECISIONS

## 2026-11-08 — apps/web scaffold

The web toolchain follows MASTER.md Section 3 and the scaffold task. Packages below are not named there; they exist so the named toolchain can install, typecheck, lint, and test.

- `react-dom` — React 18 DOM renderer.
- `i18next` 27.0.1 — required peer of `react-i18next` (`i18next` >= 27).
- `clsx`, `tailwind-merge` — shadcn/ui `cn` helper in `src/lib/utils.ts`, referenced by `components.json`. No shadcn component is added in this scaffold.
- `@vitejs/plugin-react` — official Vite React plugin.
- `typescript` pinned to 5.9.3 — `typescript-eslint` 8.72 accepts TypeScript >= 4.8.4 and < 6.1.0. npm `typescript@latest` is 7.0, which is outside that range, so the lint script could not load the parser. 5.9.3 also satisfies the MSW 3 peer (`typescript` >= 5.9).
- `react-router` pinned to 7.18.5 — this line accepts the React 18 peer required by MASTER.md Section 3. `react-router` 8 declares a React 19 peer.
- `tailwindcss` pinned to 3.4.19 — the scaffold requires `tailwind.config.ts`. Tailwind 4's default setup is CSS-first.
- `@types/react` 18, `@types/react-dom` 18, `@types/node` 22 — typings for the strict program. Node types match the Vitest 5 engine (Node >= 22.12).
- `postcss`, `autoprefixer` — required to process Tailwind 3.
- ESLint toolchain: `eslint`, `@eslint/js`, `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-config-prettier`, `globals`.
- Package names for named tools: `@tanstack/react-query` (TanStack Query), `@playwright/test` (Playwright).

`tailwindcss-animate` is omitted. Its stock keyframes use physical left/right offsets, and this scaffold has no component that needs them. Logical properties (`ms-` / `me-` / `ps-` / `pe-` / `start-` / `end-`) stay the spacing model.

No Radix package is installed yet. Radix primitives are allowed with shadcn/ui and can land when a component is added. This scaffold initializes `components.json`, CSS variables, and `cn`.

The shadcn `--destructive` token is the stock palette variable in `globals.css`. Nothing in this scaffold applies it to carrier status.

`VITE_API_BASE_URL` is required by the scaffold task and is not listed in MASTER.md. `.env.example` leaves it empty. The local API origin is an OPEN_QUESTION.

i18next `fallbackLng` is `en` so the scaffold can boot. The product default locale is an OPEN_QUESTION, not a product decision.

`.env.test` sets `VITE_API_BASE_URL=http://127.0.0.1:4010` so Vitest can intercept the fetch wrapper. That address is a test sink, not the API origin.

## 2026-11-08 — web design system

Radix primitives for the shadcn components. MASTER.md Section 3 names Radix UI. These packages were not installed in the scaffold; versions are pinned here:

- `@radix-ui/react-dialog` 1.3.1 — dialog, and the drawer (a dialog pinned to the inline end).
- `@radix-ui/react-slot` 1.5.0 — shadcn `asChild` on buttons and triggers.
- `@radix-ui/react-switch` 1.4.1
- `@radix-ui/react-tabs` 1.2.1
- `@radix-ui/react-toast` 1.3.1
- `@radix-ui/react-tooltip` 1.4.1

`vaul` and `sonner` are not added. `tailwindcss-animate` stays omitted because its keyframes use physical offsets. Motion is a fade in `tailwind.config.ts`, and `prefers-reduced-motion` is handled in `tokens.css`. `class-variance-authority` and `lucide-react` are not added.

IBM Plex Sans and IBM Plex Sans Arabic are self-hosted as woff2 (weights 400, 500, 600, 700) under `apps/web/src/styles/fonts`, with the SIL Open Font License in `OFL.txt`. The planning doc names the families and not the weights. Those four roman weights are the files shipped for each family. No italics.

`--radius` stays `0.5rem` from the scaffold. Sections 4–5 do not specify a radius.

`--danger-600` is wired only to the delete button, the system-error badge, and the system-error toast. The default Tailwind palette is replaced so stock `red-*` utilities are not generated.

The numeral toggle from website planning Section 5 was out of scope for the design-system task. It is specified in the bilingual i18n section below.

OPEN_QUESTION: planning Section 9 marks dark mode as P2 and Sections 4–5 give no dark hex values. No dark theme is implemented.

OPEN_QUESTION: `--ink-600` on `--sand-50` measures 6.79:1. Section 4 describes secondary text as at least 7:1. The specified hex is unchanged. See `docs/A11Y.md`.

## 2026-11-08 — bilingual i18n and numerals

No new package. `react-i18next` and its `i18next` peer are already in the scaffold.

`localStorage` key `rafeeq.lang` stores `en` or `ar` after the user switches language. When the key is absent, i18next still boots with `en`. The product default locale remains the OPEN_QUESTION in the scaffold section.

`localStorage` key `rafeeq.numerals` stores `latn` (Western digits) or `arab` (Arabic-Indic, Unicode numbering system U+0660–U+0669) only when the user chooses a system other than the active locale's default. Removing the key means "follow the locale": Arabic uses `arab`, English uses `latn` (website planning Section 5).

`formatNumber` and `formatDate` call `Intl` and do not calculate probabilities. `formatNumber` sets `useGrouping: false` because a grouping style is not specified. `formatDate` uses the Gregorian calendar, UTC, and a numeric year-month-day skeleton.

OPEN_QUESTION: the calendar and the long-form date pattern are not specified. Hijri is not implemented.

OPEN_QUESTION: approved copy for `landing`, `result`, `couple`, `learn`, `check`, `ask`, `privacy`, `care`, `clinic`, `insights`, and `errors` is not in MASTER.md or `/content`. Those namespaces are registered with empty catalogs. No clinical strings were added.

OPEN_QUESTION: Section 4 assigns `--teal-500` to hover. `--sand-50` on `--teal-500` is 3.89:1, below 4.5:1, so hover does not replace a text-bearing fill with teal-500. Hover uses a 3px teal-500 outline offset 2px. Confirm this treatment.

## 2026-11-08 — app shell, routes, and mock API

No new package. `msw` 3.0.4 is already a devDependency. `apps/web/public/mockServiceWorker.js` is the worker script from `msw init`, and `package.json` records `msw.workerDirectory` as `public`. The browser worker loads only when `VITE_USE_MOCKS` is the string `true`. The Vitest node server mounts the same handlers so tests can call them without that flag.

`VITE_USE_MOCKS` is not listed in MASTER.md. It exists because this task requires the mock API to toggle with that variable.

OPEN_QUESTION: `content/personas.json` is `{}`, and MASTER Section 9 does not define a JSON schema. Every Section 6 handler returns `{ "data": null, "meta": { "request_id" } }`. No persona, gene, or story was added.

OPEN_QUESTION: request and response bodies beyond the Section 6 envelope are not specified. `data` stays null rather than an invented object.

OPEN_QUESTION: how the shell learns the signed-in role is not specified (JWT claim shape, demo accounts). The session starts with no role, so guarded routes redirect to `/`. Guest is treated as couple only after a role is set. Mock handlers do not invent a token or reject by role.

OPEN_QUESTION: role-to-route mapping beyond the obvious split is not in MASTER. Couple and guest use `/app/**`. Counsellor uses `/clinic/**`. Analyst uses `/insights`. Admin uses `/admin`. Other combinations redirect to `/`. `/`, `/trust`, `/demo`, and `/legal` stay public. There is no `admin`, `settings`, `trust`, `demo`, or `legal` i18n namespace. Settings and admin titles are in `common`. The other public titles are in `landing`.

The toggle starts at `standard` when stored literacy is absent. Persistence is recorded in the learn-modules section below.

## 2026-11-08 — landing, trust centre, and guest demo

No new package.

`content/personas.json` was `{}`. MASTER Section 9 does not define a JSON schema. The file is now seven draft synthetic fixtures. Each entry has `id`, `names`, `story`, and `tests` from the Section 9 table, plus `status: "draft"` and `synthetic: true`. The file has the same two marks. `docs/MASTER.md` on this branch is still the placeholder heading, so the rows were taken from the composer source named in the task.

OPEN_QUESTION: the formal persona schema (field names, nesting) is not specified.

POST `/auth/guest` reads `{ "persona_id" }` and, when that id is in the fixture file, returns `{ "data": { "role": "guest", "persona_id" }, "meta": { "request_id" } }`. The web app then sets the in-memory session role to `guest`, which the existing role guard already treats as couple, and navigates to `/app`. No JWT is invented. Other Section 6 handlers still return `data: null`.

OPEN_QUESTION: Section 6 does not define the guest response body or error codes. Unknown or missing `persona_id` uses HTTP 400, `code: "unknown_persona"`, and `message_key: "unknownPersona"`.

OPEN_QUESTION: Continue as Guest opens `/demo`. It does not call POST `/auth/guest`, because that call needs a `persona_id` and no default persona is specified.

OPEN_QUESTION: planning Section 7 lists Sign in, and Section 6 lists POST `/auth/login`, but neither names a route or a form. The secondary control is shown and does not navigate or call the endpoint.

OPEN_QUESTION: planning Section 7 says "how it works (4 steps)" and does not name the steps. The four sentences are the first four functions in MASTER Section 1: plain-language explanation, teach-back, control of sharing, and a human for complex cases. They are not new outcome claims.

OPEN_QUESTION: Reset on `/demo` clears the in-memory guest role and sets literacy mode back to `standard`. It does not clear `rafeeq.lang`. Whether reset should also clear the stored language is not specified.

The trust page uses only the privacy, model-limit, and review statements already in MASTER Sections 1, 2, 7.3, 8, and 10. Hard-route categories are listed without adding policy. Arabic sentences that are not short UI chrome stay `TODO_AR`. Persona story and tests stay the English fixture text, with `lang="en"`, because Section 9 is English and Section 10 requires Arabic copy to be reviewed.

Playwright starts Vite with the existing `VITE_USE_MOCKS=true` so the guest call hits MSW. That variable was already introduced for the mock API. It is not turned on for a normal `npm run dev`.

## 2026-11-08 — result and couple pages

No new package.

The FactCard DTO lives in the web app (`src/features/couple/fact-card-dto.ts`). `packages/contracts/types.ts` is still the empty openapi-typescript placeholder, so there is no generated schema to import.

OPEN_QUESTION: Section 6 does not say how a request after POST `/auth/guest` names the persona. The mock remembers the last successful guest `persona_id` in the worker. The web session keeps that id in memory so TanStack Query keys change when another persona is entered. No header, token, or new endpoint was added.

OPEN_QUESTION: `/content/blocks.en.json` and `/content/blocks.ar.json` are empty, and neither MASTER nor the planning doc assigns block ids. Every block id in the mock is the marker `OPEN_QUESTION`. The own-result banner reads only those files, so the page shows the marker and the id. The planning sentence about being a carrier was not copied into the banner.

The both-carriers fact card (persona P1) puts the Section 7.1 proportions and the planning Section 7 sentences in the mock only. `src/features/couple` renders that payload and does not contain those literals. Arabic sentence and diagnosis text stay null until a block exists, and the page shows `OPEN_QUESTION` instead of an unreviewed translation.

OPEN_QUESTION: `content/genes.json` is empty. Personas do not name a gene symbol. P1's condition label is the parenthetical already in that persona's story (`hearing-loss example`). The symbol is null. P5's story names no gene, so the own carrier list is empty. No other persona is given a gene or a frequency.

OPEN_QUESTION: Section 9 names consanguinity wording for P1, and Section 7.1's relatedness prior applies only when one partner's carrier status is unknown. Both partners' statuses are known for the both-carriers card, so that prior is not applied, and no consanguinity sentence was written.

OPEN_QUESTION: P5 says partner B declines sharing and does not say whether partner A has granted it. The mock records only partner B as `granted: false` for `share_overlap_with_partner`. Partner labels are `a` and `b` because the persona file has no user ids.

OPEN_QUESTION: the HTTP status for a refused overlap explanation is not in Section 6. POST `/explain/overlap` uses 403 with `message_key` `sharingDeclined` or `consentMissing` when the gate is closed. Unknown or absent personas still return `data: null`.

Couple-area links were added on the couple home, result, and together pages so a guest can open those routes without a reload. The in-memory session does not survive a full page load. That storage choice is unchanged from the shell task.

## 2026-11-08 — learn modules and audio

No new package.

`localStorage` key `rafeeq.literacy` stores `standard`, `simple`, or `voice` after the user changes reading mode. When the key is absent or the value is anything else, the shell starts at `standard`. Demo reset still selects `standard`, and that choice is now written to the same key.

OPEN_QUESTION: `/content/blocks.en.json`, `/content/blocks.ar.json`, and `/content/faq.json` are empty. MASTER Section 7.2 names explanation topics and does not assign block ids or a JSON shape. The learn page looks up stable ids (`learn.{topic}.full`, `learn.{topic}.short`, `glossary.{term}`). A missing body renders the existing `OPEN_QUESTION` marker and the id. No clinical paragraph was written. FAQ entries are not rendered. The planning sentence about family relatedness (cultural context and the size of added risk) is clinician-reviewed wording and is not in the content files, so it is not shown.

GET `/explain/glossary/{term}` reads the locale file (`?locale=en` or `?locale=ar`; anything else is treated as `en`) and returns `{ term, block_id, locale, text }`. `text` is null when the block is empty.

POST `/tts` accepts `{ "block_id", "locale" }` and returns `{ block_id, locale, url, text }`. It does not synthesize speech. When the block has no `audio_url`, `url` is the stable path `/mock-audio/{block_id}`. A missing `block_id` is HTTP 400 with `message_key` `missingBlock`.

OPEN_QUESTION: Section 6 does not define the glossary or TTS response bodies, the locale parameter, or where audio files live.

## 2026-11-08 — teach-back check

No new package.

GET `/comprehension/items` and POST `/comprehension/answer` now return a draft teach-back set when a guest persona is active, and `data: null` when it is not. Section 6 names the routes and the envelope only. The item and answer bodies are an OPEN_QUESTION. The mock body carries `correct_option_id`. The screen reads `matched` from the answer response and does not keep a chosen id of its own.

POST `/comprehension/answer` requires `item_id`, `option_id`, `latency_ms` (integer, zero or greater), and `attempt` (integer, 1 or greater). `locale` and `literacy_mode` are accepted when present. A body that omits the time or the attempt is HTTP 400, `message_key` `missingAnswer`. An unknown item is `unknownItem`. A picture id that is not on that item is `unknownOption`.

OPEN_QUESTION: `/content` has no teach-back items. The only item sentence is the English example from website planning Section 7, marked `draft`, and only for personas P1 and P4 (both carry the same change). Arabic prompt text is null. The other two items have no approved sentence, so their prompt text is null and the block id is `OPEN_QUESTION`. Feedback uses the same block id. When the content file has no text, the screen shows a short non-clinical sentence from the check catalog.

OPEN_QUESTION: skip has no Section 6 route. "Skip for now" moves to the next item in the browser and does not write a comprehension event. Finishing the last item, or skipping past it, sets one in-memory flag the couple home reads. A reload clears it, the same way the guest session works. Whether a skip should be stored differently from a finished set is not specified.

The couple home shows the planning order Result, Understand, Check, Decide who sees what, Counselling, Next. Understand links to `/app/learn`. Only the Check step reads the completion flag. The home page is otherwise unchanged.

OPEN_QUESTION: the pathway step "Understand" is not a route name in the sitemap. This task maps it to `/app/learn`.
