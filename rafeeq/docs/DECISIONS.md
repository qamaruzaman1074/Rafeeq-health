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
