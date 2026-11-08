# Performance

Measured on 2026-11-08 from the production build of `apps/web` (`npm run build`).

## Method

Vite preview does not gzip. The scores below are from a local static server that gzip-encodes every response, which is how Azure Static Web Apps serves the build. Lighthouse 12.8.2, mobile form factor, default simulated throttling, Playwright Chromium (`chromium-1254`), headless. Categories: performance and accessibility.

Role-gated routes redirect to `/` on a cold load. The session lives in memory, and Lighthouse starts a fresh browser, so `/app`, `/clinic`, `/insights`, and `/admin` were not scored as themselves.

## Lighthouse (mobile)

| Route | Performance | Accessibility | LCP |
| --- | --- | --- | --- |
| `/` | 88 | 100 | 3.7 s |
| `/trust` | 91 | 100 | 3.2 s |
| `/demo` | 86 | 100 | 3.8 s |
| `/legal` | 92 | 100 | 3.2 s |
| `/dev/styleguide` | 75 | 100 | 4.8 s |

On `/`, first contentful paint was 2.1 s, total blocking time was 0 ms, and cumulative layout shift was 0. The task acceptance is performance >= 85 and accessibility >= 95 on `/`. Both are met (88 and 100).

Planning Section 12 also asks for Lighthouse >= 90 and LCP under 2.5 s. Measured `/` is 88 with an LCP of 3.7 s (the landing heading). Those two planning numbers are not met. `/dev/styleguide` is a development route and scored 75.

## First-route JavaScript

`apps/web/scripts/check-first-route.mjs` reads `dist/.vite/manifest.json`. It starts at `index.html` and `src/pages/landing-page.tsx` and follows static `imports`. It does not follow `dynamicImports`. Gzip of those `.js` files: **163891 bytes** across 14 modules. The budget in the script is 250 KB gzip. Clinic, insights, and recharts are outside that set.

## Fonts

IBM Plex Sans and IBM Plex Sans Arabic are self-hosted woff2 (weights 400, 500, 600, 700) under `apps/web/src/styles/fonts`. The built HTML does not request `fonts.googleapis.com` or `fonts.gstatic.com`. The head preloads only the active family's 400, 500, and 600, which are the weights the first route uses. Weight 700 is not preloaded. The files are not subset further: the shipped Arabic file already includes Latin glyphs, and the font tests require these filenames.

## Shell

`vite-plugin-pwa` writes a service worker with a navigation fallback of `index.html` and a denylist of `/^\/api\//`. Runtime caching is empty. The worker does not use CacheFirst, NetworkFirst, or StaleWhileRevalidate, and it does not precache `mockServiceWorker.js`. An offline visit can open the shell. API responses and clinical content are not cached.
