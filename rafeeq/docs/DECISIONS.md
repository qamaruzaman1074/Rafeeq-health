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
