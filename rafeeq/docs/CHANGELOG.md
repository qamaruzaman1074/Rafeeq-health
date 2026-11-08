# CHANGELOG

- 2026-11-08 fix: meet the accessibility and performance budgets (axe on en and ar, first-route split, font preload, shell-only service worker, meta and favicon).
- 2026-11-08 feat: add analyst insights at `/insights` (KPI cards, equity charts by language and reading mode, k-anonymity suppression). A metric with no payload value stays OPEN_QUESTION. Counts and confidence intervals render only when the payload supplies them.
- 2026-11-08 feat: add the counsellor queue at `/clinic/queue` and the case brief at `/clinic/case/:id` (filters, status update, audit tab). Shared genes and formulas are shown only when the brief payload includes them.
- 2026-11-08 feat: add the care pathway at `/app/care` (timeline, status, consent-gated referral, information cards, and on-device booking slots).
- 2026-11-08 feat: add privacy shares, receipts, and the personal audit timeline at `/app/privacy`.
- 2026-11-08 feat: add the ask page at `/app/ask` (transcript, 500-character question, source labels, lilac handoff to a person). Suggested questions stay empty while `content/faq.json` is empty.
- 2026-11-08 feat: add the teach-back check at `/app/check` (one item, pictorial options, gentle feedback, progress dots, skip) and a couple-home pathway mark when the set is finished or skipped.
- 2026-11-08 feat: add learn modules, glossary tooltips, and mock audio. Literacy mode persists as `rafeeq.literacy` (`standard`, `simple`, `voice`).
- 2026-11-08 feat: add the result and couple pages (own carrier cards, consent-gated overlap, fact card).
- 2026-11-08 feat: add the landing, trust centre, and guest persona demo.
- 2026-11-08 feat: add the app shell, lazy routes, role guard, and MSW handlers for `/api/v1`.
- 2026-11-08 feat: add bilingual i18n namespaces, locale persistence (`rafeeq.lang`), and numeral formatting.
- 2026-11-08 feat: add the web design system (tokens, self-hosted IBM Plex, shadcn components, `/dev/styleguide`).
- 2026-11-08 feat: scaffold `apps/web` toolchain (Vite, React 18, TypeScript strict, Tailwind, shadcn/ui, tests).
