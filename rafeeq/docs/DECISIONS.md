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

`vitest.config.ts` sets `test.env.VITE_API_BASE_URL=http://127.0.0.1:4010` so Vitest can intercept the fetch wrapper. That address is a test sink, not the API origin. A local `.env.test` may mirror the same value but is not tracked in Git.

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

## 2026-11-08 — ask page and human handoff

No new package.

POST `/ask` is the only answer source for `/app/ask`. The screen does not classify a question and does not write answer text.

OPEN_QUESTION: MASTER Section 6 names POST `/ask` and the envelope, not the body. The mock accepts `{ "question", "locale" }`. A missing or blank question is HTTP 400, `message_key` `missingQuestion`. A question longer than 500 characters is HTTP 400, `message_key` `questionTooLong`. The response is `{ "route": "human" | "content", "reason", "source_ids", "text" }`.

OPEN_QUESTION: `content/routes.json` is `{}` and has no schema. The mock maps the Section 7.3 categories (distress or self-harm, pregnancy termination, religious ruling, another person's results, blame, diagnosis, a decision for the user, medication or treatment, legal or immigration, a minor) to `route: "human"`. Those responses set `text` to null and `source_ids` to an empty list. No answer sentence is attached.

OPEN_QUESTION: `content/faq.json` is `{}`. Suggested-question chips are an empty list. No clinical question was written. A content answer is returned only when that file names the question and at least one source id. The answer text is read from the content blocks for the first source id. Those blocks are empty, so `text` stays null. An ordinary question with no faq match returns `route: "content"`, empty `source_ids`, and `text: null`.

The screen renders answer text only when `route` is `content` and at least one source id is present. Otherwise it shows the blocked state, or a handoff when `route` is `human`. The handoff uses `--lilac-100` and links to the existing `/app/care` placeholder. It does not build the care page.

OPEN_QUESTION: Section 7.3 calls for clinician-approved crisis-line text on a distress handoff. No such block is in `/content`. The card shows the existing `OPEN_QUESTION` marker. No phone number was added.

The boundary line is the ask catalog sentence that the assistant only shows approved content and a hard question goes to a person. It is not an accuracy or outcome claim. Arabic ask strings are `TODO_AR`.

`tsconfig.node.json` includes `e2e` and previously had no DOM lib, so `tsc -b` failed on the existing check overflow callback (`document` inside `page.evaluate`). The DOM lib is added for that project. No check behaviour was changed.

## 2026-11-08 — privacy shares, receipts, and audit

No new package.

OPEN_QUESTION: `/content` does not define a finer share-item list. Matrix rows are the Section 5 scopes: `view_own`, `share_overlap_with_partner`, `share_with_clinic`, `research_aggregate`.

OPEN_QUESTION: planning Section 7 names columns me, partner, and clinic. `research_aggregate` has no column. The row is shown and each of those three cells is the existing `OPEN_QUESTION` marker. No fourth party was added, and the screen does not grant or revoke that scope.

OPEN_QUESTION: Section 6 does not define the GET or POST `/consents` body. The unscoped GET stays the partner-row list the couple page already uses. `?mine=true` returns the signed-in user's scopes (`id`, `scope`, `granted`, `version`, `created_at`). POST accepts `{ "scope", "granted" }` and returns that same list. A missing body is HTTP 400, `message_key` `missingConsent`. Setting `view_own` to `granted: false` is HTTP 400, `message_key` `viewOwnPermanent`.

OPEN_QUESTION: personas have no user id, so the signed-in user is partner "a". That is the overlap row the privacy toggle updates. P5 records the decline on partner "b", so the session user's overlap toggle starts off.

OPEN_QUESTION: Section 6 lists GET `/audit` for admin and counsellor, not for a couple. This screen calls GET `/audit?mine=true`. Without that flag the mock still returns `data: null`.

OPEN_QUESTION: the receipt signing scheme is not specified. GET `/consents/receipt/{id}` returns the consent snapshot plus `prev_hash: null` and `hash: null`. No signature was invented. An unknown id is HTTP 404, `message_key` `unknownReceipt`.

OPEN_QUESTION: audit action and outcome vocabularies are not enumerated. Seed rows use action `read` for an access to `results`, `shares`, or `consents` (Section 8), the same three rows for every persona, with no gene and no person. Consent writes append `grant` or `revoke` from `consent_events`. `outcome` is `allowed`.

`share_with_clinic` and `research_aggregate` start not granted. No persona story grants them. Revoking overlap updates partner "a", so the couple overlap gate closes on the next read.

Arabic privacy strings are `TODO_AR` except the non-word matrix dash. When a timeline label is `TODO_AR`, the English data code is shown beside it so actor, action, and time stay readable. Times use the existing `formatDate` helper.

## 2026-11-08 — care pathway and referral

No new package.

GET `/pathway` and POST `/referrals` now return a draft pathway when a guest persona is active, and `data: null` when it is not. Section 6 names the routes and the envelope only.

OPEN_QUESTION: the pathway body is not specified. The mock lists the planning Section 7 steps in order: Result received, Counselling, Confirmatory assessment (if advised by a counsellor), Specialised reproductive-genomics services, Follow-up. `current_step` is `result_received` until a referral exists, then `counselling`. `status` is null until then, then `created`.

OPEN_QUESTION: `tier` and `due_by` are counsellor-only (GET `/counsellor/queue` in Section 6). The mock still puts them on the pathway and referral payloads. The couple client keeps only `current_step`, `steps`, and `status` (and `id` plus `status` on the referral ack). Those fields are never shown, and they are never labelled as a risk level.

OPEN_QUESTION: the consent scope for "Send my questions and what I understood to the counsellor" is not named. MASTER Section 8 says the clinic sees only what is shared via `share_with_clinic`. The control stays disabled until that scope is granted. POST `/referrals` without it is HTTP 403, `message_key` `clinicShareRequired`. The request body is `{}`. No question text is sent, because where those questions and teach-back answers are read from is not specified.

OPEN_QUESTION: Section 6 has no booking route. The four slots are local component state. Choosing one does not call the API and does not change referral status.

OPEN_QUESTION: `/content/blocks.en.json` and `/content/blocks.ar.json` have no body for confirmatory assessment or specialised reproductive-genomics services. The cards show the step title, the label "Information only", and the existing `OPEN_QUESTION` marker with lookup ids `care.confirmatory-assessment` and `care.specialised-reproductive-genomics`. No description of those services was written.

Arabic care strings, and the new error string, are `TODO_AR`.

## 2026-11-08 — counsellor queue and case brief

No new package.

GET `/counsellor/queue`, GET `/counsellor/referrals/{id}/brief`, and PATCH `/counsellor/referrals/{id}` return data only after a counsellor session. GET `/audit` without `?mine=true` returns that counsellor's own read entries. `?mine=true` is unchanged and still serves the couple timeline.

OPEN_QUESTION: how a counsellor signs in is not specified. POST `/auth/login` stays empty unless the body is `{ "role": "counsellor" }`. No email, password, or token is invented. The demo page has "Open the counsellor queue", which stores the role the same way a guest session stores `guest`. There is no logout route.

OPEN_QUESTION: response bodies are not in Section 6. The queue columns are the planning Section 7 list. Tier is set only when `content/personas.json` `tests` names exactly one of T1, T2, T3, or T4, mapped to the Section 5 enum (`T1_info`, `T2_counsel_routine`, `T3_counsel_priority`, `T4_urgent_human`). P1, P4, and P6 qualify. P3 names both T1 and T2, so that persona is not queued. P5 is queued with `tier: null` so the declined-share brief can be opened. The chip text is the enum name. It is not labelled as a risk level.

OPEN_QUESTION: language, literacy mode, due-by, reason codes, comprehension gaps, user questions, and stated preferences are not in the persona file. Those fields are null or empty. No due date was invented. The former P7 persona (low-literacy voice-first user) was removed from the persona picker; voice and simple-language modes remain available to every persona.

OPEN_QUESTION: `share_with_clinic` starts off for every persona. Shared genes and formula lines are copied from the existing overlap payload only when that scope is on and overlap consent is allowed. The web UI prints those strings. It does not calculate them. P5 partner B declines sharing, so the brief stays empty of genes and formulas even after clinic share is granted.

OPEN_QUESTION: `content/genes.json` is empty. The P5 raw store uses the markers `P5_PARTNER_B_UNSHARED` and `P5_OVERLAP_UNSHARED`. They are not catalog symbols. They are never copied into a counsellor payload.

OPEN_QUESTION: `/content/blocks.en.json` and `/content/blocks.ar.json` have no talking-point or cultural-note text. The brief carries `clinic.talking-points` and `clinic.cultural-notes` with `text: null`. The screen labels talking points as prompts, not advice, shows the block id, and does not render a talking-point body.

OPEN_QUESTION: the audit action for a status change is not in the vocabulary already used (`read`, `grant`, `revoke`). PATCH updates the referral status and does not append an audit row. Reading a brief appends `read` on `shares` for that referral id. `actor_user_id` is not in the existing audit entry shape.

OPEN_QUESTION: the default sort column is not specified. The table stays in seed order until a header button is used. Empty values stay at the end of that column.

Arabic clinic strings, and the new error strings, are `TODO_AR`. Tier enum names are the same in both catalogs.

## 2026-11-08 — insights KPIs and equity charts

No new package. `recharts` 3.10.1 is already a dependency of `apps/web` (MASTER.md Section 3 names Recharts). No chart library was added.

OPEN_QUESTION: how an analyst signs in is not specified. POST `/auth/login` stays empty unless the body is `{ "role": "analyst" }`. No email, password, or token is invented. The demo page has "Open insights", which stores the role the same way a counsellor session stores `counsellor`.

OPEN_QUESTION: GET `/insights/kpis` and GET `/insights/equity` bodies are not in Section 6. The mock returns data only after an analyst session, and otherwise `data: null`.

OPEN_QUESTION: KPI formulas are not specified (completion of explanation, teach-back pass rate, counselling uptake, median time from result to referral booked, privacy events). Those cards render from payload fields. The fixture leaves `value`, `n`, `ci`, `granted`, and `revoked` null, and the card shows the existing `OPEN_QUESTION` marker. No rate, duration, or consent count was invented.

OPEN_QUESTION: which KPI the equity charts stratify is not specified. `metric_id` is null and the screen shows `OPEN_QUESTION`. The cells are synthetic display fixtures so the screen can show a supplied count, a supplied 95% interval (bounds are strings on the payload), and suppression. They are not measurements. The component does not add, divide, or round them. A count is passed through the existing numeral formatter. Interval bounds are printed as supplied.

Suppression follows MASTER: k-anonymity floor 5. A cell with `n` below 5, or `suppressed: true`, renders "Not shown (small group)" and does not render that cell's count or interval.

Arabic insights strings are `TODO_AR`, except `suppressed`, which is the English sentence in both catalogs so the small-group state stays the same string. `chart.suppressedLine` in Arabic is `TODO_AR` plus that same sentence.

## 2026-11-08 — accessibility scan and performance budgets

New devDependencies in `apps/web`. None of these names are in MASTER.md. They exist so the scan and the shell-only service worker can be built and checked.

- `@axe-core/playwright` 4.14.0 — axe-core inside the existing Playwright run.
- `vite-plugin-pwa` 2.0.0 — web manifest and `generateSW`. This line accepts Vite 8.
- `workbox-build` 7.4.1 and `workbox-window` 7.4.1 — the plugin's workbox peers.

The generated worker precaches the app shell and uses a navigation fallback of `index.html`. The navigation route denylist is `/^\/api\//`. `runtimeCaching` is empty, so `/api` responses are not cached. `mockServiceWorker.js` is left out of the precache.

The document head preloads IBM Plex weights 400, 500, and 600 for the active family only. Weight 700 stays in CSS and is not preloaded. No stylesheet or script requests Google Fonts.

The HTML description, theme colour, and manifest description reuse the existing English landing sentence and `--teal-900` (`#0B3F45`). The document boots in `en`. A localized meta description is not specified.

OPEN_QUESTION: `/admin` has no mock session. POST `/auth/login` accepts counsellor and analyst only. The axe run did not scan that screen. See `docs/A11Y.md`.

OPEN_QUESTION: reviewed Arabic headings are not in `/content`. Named regions whose visible heading is `TODO_AR` put the existing English catalog string in the accessible name so the landmarks stay unique. Visible text is unchanged.

Planning Section 12 also asks for Lighthouse >= 90 and LCP under 2.5 s. The measured home scores are in `docs/PERF.md`. The task acceptance (performance >= 85, accessibility >= 95 on `/`) is what this change checks.

## 2026-11-08 — empty states and banned-term check

No new package. Empty, error, and loading states use the components already allowed by the design system (button, toast). Skeletons are CSS bars with `motion-safe:animate-pulse`. `--danger-600` stays on system errors and delete. `components/error-state.tsx` is the system-error panel, so it is on that allow-list with the badge, delete button, and error toast. It is not used for carrier status.

`rafeeq/content/banned_terms.json` was `{}`. It is seeded with the English terms named in MASTER Section 10. `rafeeq/scripts/check_banned_terms.mjs` reads that file and fails `npm run lint` in `apps/web` when one of those terms appears in `apps/web/src/i18n/locales`.

OPEN_QUESTION: Arabic banned terms are not listed in MASTER Section 10. The `ar` list is empty.
