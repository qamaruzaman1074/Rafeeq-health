> **How to use this file.** This is the single source of truth for Cursor Composer. Put this file in the repo at `/docs/MASTER.md` and the rules block from Section 12 in `.cursor/rules/rafeeq.mdc`. In every Composer session start with: *"Read /docs/MASTER.md fully. Then do only the task below."* Composer must never invent endpoints, fields, genes, numbers, citations or clinical statements that are not in this file or in `/content`.

# 1. What we are building (one paragraph)

**Rafeeq** (working name, Arabic *rafeeq* = companion; rename freely) is a bilingual (Arabic/English, RTL/LTR), privacy-preserving web platform that takes a couple's (synthetic) premarital/preconception carrier-screening result and: (1) explains it in plain, non-stigmatizing language with exact, code-computed numbers; (2) checks understanding with teach-back; (3) lets each partner control what is shared with the other and with the clinic; (4) routes complex, ambiguous or high-impact cases to a human genetics professional with a pre-visit brief; (5) tracks the care path from result to counselling to confirmatory testing to specialised services; (6) shows de-identified equity and access KPIs to health-system users. It is **education + decision support + navigation. It never diagnoses, never recommends a reproductive decision, never replaces a counsellor.**

# 2. Non-negotiable rules (anti-hallucination contract)

1. **Numbers come only from the deterministic risk kernel** (`apps/api/app/kernel`). No LLM, template or frontend code may compute, round or invent a probability.
2. **The LLM never sees genotypes, names, IDs or free-text identifiers.** It receives only a pre-built, de-identified "fact card" ID list and the user's question text after PII scrubbing.
3. **The LLM does not write new medical content.** It may only (a) classify intent, (b) select approved content blocks, (c) lightly rephrase an approved block at a stated reading level. Output must pass the verifier (Section 7) or a fixed fallback is shown.
4. **Hard routes bypass the LLM** and go to a human (Section 7.3).
5. **All clinical-facing text lives in `/content/*.json`**, bilingual, with `status: "draft" | "clinician_reviewed"`. Composer may not edit wording of `clinician_reviewed` blocks. Draft blocks display a "prototype content - not clinically validated" badge.
6. **All data is synthetic.** No real person, genome or Emirati Genome Programme data. Carrier frequencies in `/content/genes.json` are marked `illustrative: true` until replaced by cited values.
7. If a requirement is missing or ambiguous, **stop and write `OPEN_QUESTION:` in the PR description** instead of guessing.
8. No new dependency, endpoint, table or env var outside this file without a note in `/docs/DECISIONS.md`.
9. Every task ends with: tests green, lint green, `/docs/CHANGELOG.md` line added, acceptance checklist ticked.
10. Never use red as a "danger" colour for carrier status; never use words *defective, abnormal, bad, risky couple, incompatible* (see banned-terms list, Section 10).

# 3. Tech stack (fixed)

| Layer | Choice | Reason |
| --- | --- | --- |
| Web | React 18, Vite, TypeScript (strict), Tailwind CSS, Radix UI primitives + shadcn/ui, react-router, TanStack Query, react-hook-form + Zod, react-i18next, Recharts | Fast, accessible, well known to Composer |
| API | Python 3.11, FastAPI, Pydantic v2, SQLAlchemy 2, Alembic, pytest, httpx | Exact `fractions.Fraction` arithmetic for the kernel |
| DB | PostgreSQL 15/16 (Azure Database for PostgreSQL Flexible Server); SQLite allowed only for local unit tests | Transactions + audit integrity |
| LLM | Azure OpenAI in Microsoft Foundry (chat deployment name from env `AOAI_CHAT_DEPLOYMENT`) | Hackathon requirement to use Azure |
| Retrieval | Azure AI Search index over `/content` approved blocks (hybrid keyword + vector) | Grounding |
| Safety | Azure AI Content Safety (+ our own routes) | Defence in depth |
| Speech | Azure AI Speech neural TTS (Arabic + English voices), cached in Blob | Low-literacy voice-first |
| Hosting | Azure Static Web Apps (web), Azure Container Apps (API), Key Vault, Managed Identity, Application Insights | Azure requirement |
| IaC | Bicep in `/infra` | Reproducible |
| Auth | Own JWT (HS256 from Key Vault secret) with roles + **Guest mode**; Entra External ID documented as production path | Template requires guest option |

# 4. Repository layout (create exactly this)

```
rafeeq/
  docs/ MASTER.md DECISIONS.md CHANGELOG.md SAFETY.md ASSUMPTIONS_AND_LIMITATIONS.md
  content/ genes.json blocks.ar.json blocks.en.json faq.json banned_terms.json
           routes.json personas.json
  apps/
    api/  app/{main.py, config.py, deps.py, db.py, models/, schemas/, routers/, services/,
              kernel/, safety/, llm/, audit/}   alembic/  tests/  pyproject.toml  Dockerfile
    web/  src/{main.tsx, app/, pages/, components/, features/, i18n/, lib/api.ts, styles/}
          index.html  vite.config.ts
  packages/contracts/  openapi.json  (generated)  types.ts (generated by openapi-typescript)
  eval/   personas_eval.py  readability.py  routing_redteam.jsonl  binding_test.py  fairness.py  reports/
  infra/  main.bicep  modules/  deploy.ps1
  .github/workflows/ ci.yml  deploy-api.yml  deploy-web.yml
```

# 5. Data model (PostgreSQL) - canonical

| Table | Key columns |
| --- | --- |
| `users` | id uuid pk, role enum(couple, counsellor, analyst, admin, guest), display_alias, language enum(ar,en), literacy_mode enum(standard, simple, voice), created_at |
| `couples` | id, partner_a_user_id, partner_b_user_id, relationship_kind enum(unrelated, second_cousin, first_cousin, double_first_cousin, other_related, unknown), status |
| `screening_results` | id, couple_id, panel_version, issued_at, signature (HMAC of canonical JSON), payload_enc (AES-GCM encrypted JSON: per-partner carrier list), lab_detection_json |
| `gene_catalog` | gene_symbol pk, condition_en, condition_ar, inheritance='AR', carrier_freq (numeric, nullable), freq_source, illustrative bool, early_treatment_pathway bool, severity_band enum(a,b,c), review_status |
| `content_blocks` | id, locale, topic, text, reading_level, status, source_refs[] |
| `consents` | id, user_id, scope enum(view_own, share_overlap_with_partner, share_with_clinic, research_aggregate), granted bool, version, created_at |
| `consent_events` | id, consent_id, prev_hash, hash, event enum(grant, revoke), at (hash chain) |
| `shares` | id, from_user_id, to_party enum(partner, clinic), fields_json (whitelist), expires_at, revoked_at |
| `audit_log` | id, at, actor_user_id, actor_role, action, object_type, object_id, outcome, prev_hash, hash |
| `comprehension_events` | id, user_id, item_id, correct bool, attempt int, latency_ms, locale, literacy_mode |
| `referrals` | id, couple_id, tier enum(T1_info, T2_counsel_routine, T3_counsel_priority, T4_urgent_human), reason_codes[], status enum(created, sent, booked, attended, confirmatory_ordered, closed), created_at |
| `referral_events` | id, referral_id, status, at, actor_role |
| `counsellor_briefs` | id, referral_id, summary_json (shared-gene list, user questions, comprehension gaps, preferences stated), generated_at |
| `eval_runs` | id, kind, started_at, metrics_json, git_sha |

Rules: soft FK integrity; every write to consents/shares/referrals also writes `audit_log`; `payload_enc` is only decrypted inside `services/results.py`.

# 6. API contract (canonical; `/api/v1`)

| Method + path | Role | Purpose |
| --- | --- | --- |
| POST `/auth/guest` | public | Create guest session bound to a chosen persona (`persona_id`) |
| POST `/auth/login`, `/auth/register` | public | Email + password (demo accounts) |
| GET `/me` | any | Profile, role, language, literacy mode |
| PATCH `/me/preferences` | any | language, literacy_mode |
| GET `/results/mine` | couple | Own result summary (own carrier list) |
| GET `/results/overlap` | couple | Only genes both partners carry, **only if both consented** |
| POST `/explain/overlap` | couple | Returns fact cards + rendered explanation text blocks + numbers (from kernel) |
| GET `/explain/glossary/{term}` | any | Approved glossary block |
| POST `/ask` | couple | Question to assistant: routes -> retrieval -> select/rephrase -> verify -> answer or human hand-off |
| GET `/comprehension/items` | couple | Teach-back items for current result |
| POST `/comprehension/answer` | couple | Record answer, returns feedback block + next item |
| GET/POST `/consents` | couple | List, grant, revoke consents (writes hash-chained event) |
| POST `/shares` / DELETE `/shares/{id}` | couple | Create/revoke a whitelisted share |
| GET `/consents/receipt/{id}` | couple | Signed receipt JSON |
| GET `/pathway` | couple | Personal care pathway with current step |
| POST `/referrals` | couple | Request counselling (creates referral + brief) |
| GET `/counsellor/queue` | counsellor | Referrals with tier + due-by (only consented content) |
| GET `/counsellor/referrals/{id}/brief` | counsellor | Pre-visit brief |
| PATCH `/counsellor/referrals/{id}` | counsellor | Update status |
| GET `/insights/kpis` | analyst | Aggregated, k-anonymity >= 5, no row-level data |
| GET `/insights/equity` | analyst | KPIs by language and literacy_mode |
| GET `/audit` | admin / counsellor(own) | Audit entries filtered by actor |
| POST `/tts` | any | Text block id -> cached audio URL |
| GET `/health`, `/version` | public | Probes |

All responses use the envelope `{ "data": ..., "meta": { "request_id": "..." } }`; errors `{ "error": { "code": "...", "message_key": "...", "request_id": "..." } }` with i18n `message_key`, never raw exceptions.

# 7. Safety architecture

## 7.1 Risk kernel (`app/kernel`)
- Use `fractions.Fraction` everywhere; convert to display only at the edge via a documented `format_probability()` returning `{fraction:"1/4", percent:"25%", natural_frequency:"1 in 4"}`.
- Autosomal recessive, both partners carry P/LP variants in the same gene: per pregnancy 1/4 affected, 1/2 carrier, 1/4 neither. Present as a chance for **each pregnancy**, independent of earlier children.
- Multiple shared genes: chance of at least one affected = 1 - product(1 - 1/4) across shared genes, assuming independence; return the formula in the payload.
- One carrier only: residual risk for the untested/negative partner = `c(1-s)/(1-c*s)` where `c` = carrier frequency, `s` = lab detection rate; affected chance = 1/4 x residual. If `s` or `c` missing return a **range** and the flag `assumption_missing`.
- Relatedness prior (only when one partner's carrier status is unknown): P(partner carries the same allele) = `r + (1-r)*c` with r = 1/8 first cousins, 1/32 second cousins, 1/4 double first cousins (documented in `/docs/ASSUMPTIONS_AND_LIMITATIONS.md`).
- Out of scope and always disclosed: X-linked, dominant, mitochondrial, polygenic, de-novo, variants of uncertain significance (VUS), family history, non-genetic causes.
- Tests: a hand-calculated table of >= 25 cases in `tests/test_kernel.py`; property tests (probabilities in [0,1], monotonic in carrier frequency). CI fails if coverage of kernel < 95%.

## 7.2 Explanation layer
Approved blocks per topic (what is a carrier / what the result means / risk vs diagnosis / uncertainty / what options exist (information only) / what happens next / your privacy). Assembled by deterministic templates keyed by `fact_card_id`. Reading level target: English <= grade 8; Arabic plain MSA with short sentences (<= 18 words average) - measured in `eval/readability.py`.

## 7.3 Hard routes (always human, never LLM) - `content/routes.json`
distress or self-harm language; pregnancy termination questions; religious rulings (fatwa) requests; requests about another person's results; blame ("whose fault"); diagnosis requests ("does my child have..."); medication/treatment advice; requests to decide for the user ("should we marry / not marry"); legal/immigration questions; minors. Response: empathic fixed text + offer counsellor booking + (distress) crisis-line text approved by the team's clinician.

## 7.4 Verifier (`app/safety/verifier.py`)
For every LLM output: (a) every sentence must cite >= 1 approved block id; (b) every number in the text must equal a number in the supplied fact cards (regex + normalisation for Arabic-Indic digits); (c) banned terms absent; (d) no imperative decisions ("you should marry/avoid/terminate"); (e) no certainty language about a child ("will have", "is going to"); (f) Content Safety pass; (g) reading-level check. Fail -> deterministic fallback block + `verifier_failed` metric.

# 8. Privacy model

Roles: couple member sees **own** result always; sees **partner's** data only for the *overlap* (genes both carry) and only if **both** granted `share_overlap_with_partner`. Clinic sees only what the user shares via a whitelisted `shares` row. Counsellor sees brief + shared fields, never raw results unless shared. Analyst sees aggregates only (k >= 5). Every access to results/shares/consents writes `audit_log` (hash-chained). Consent revocation takes effect immediately and is shown to the user. Data minimisation: store the least; delete guest sessions after 24 h.

# 9. Personas (synthetic; `content/personas.json`)

| ID | Story | Tests |
| --- | --- | --- |
| P1 Noor & Khalid | First cousins; both carry the same gene (hearing-loss example) | Overlap explanation, consanguinity wording, counselling T2 |
| P2 Mariam & Saeed | Unrelated; no shared genes; each carries different genes | Reassurance without false certainty, residual-risk wording |
| P3 Huda & Omar | One carrier only | Residual risk range, T1/T2 |
| P4 Fatima & Rashid | Both carry same gene with **early-treatment pathway** (e.g., SMA example) | Priority routing T3 |
| P5 Aisha & Hamad | Partner B declines sharing | Privacy: overlap hidden, user can still use own info |
| P6 Salma & Yousef | Result includes VUS flag | Ambiguity -> T4 human, no numbers |
| P7 Low-literacy voice-first user | Any result, voice mode | TTS + simple mode + teach-back |

# 10. Language and tone

Banned terms (`content/banned_terms.json`; both languages): defective, abnormal, mutant, bad genes, risky couple, incompatible, genetic disease couple, high-risk person, dangerous, "you must", "you should not marry". Preferred: "carries a change in a gene", "you both carry the same change", "chance for each pregnancy", "a result is not a diagnosis", "options you may wish to discuss with a genetic counsellor". Arabic copy must be reviewed by a native speaker (team) and, ideally, an Emirati counsellor; mark `status` accordingly.

# 11. Definition of done (every task)

Typed, linted, tested; a11y checked (keyboard, focus, contrast >= 4.5:1, `lang` and `dir` attributes); i18n keys for every string; no hard-coded text; no console errors; OpenAPI regenerated; docs updated; acceptance list ticked in PR description.

# 12. Cursor rules file (`.cursor/rules/rafeeq.mdc`)

```
---
description: Rafeeq project rules
alwaysApply: true
---
- Source of truth: /docs/MASTER.md. If something is not there, write OPEN_QUESTION and stop.
- Never compute or hard-code probabilities outside apps/api/app/kernel.
- Never send genotype, names, ids to any LLM call. LLM prompts are built only in apps/api/app/llm/prompt_builder.py.
- Clinical wording lives in /content only. Do not paraphrase clinician_reviewed blocks.
- All UI strings via i18n keys (ar, en). Support RTL via logical CSS (ms-*, me-*, ps-*, pe-*).
- No new dependency/endpoint/table without a line in /docs/DECISIONS.md.
- TypeScript strict; Python typed (mypy clean); small functions; tests for every service.
- Banned words list in /content/banned_terms.json must be enforced in CI (scripts/check_banned_terms).
- Use only Azure services listed in MASTER.md Section 3. Secrets only via env/Key Vault; never commit secrets.
- Output after each task: files changed, how to run tests, acceptance checklist.
```

# 13. How Composer sessions are organised

Work in **small tasks (one prompt = one PR-sized change)** from the three prompt packs: Frontend (doc 06), Backend (doc 07), Integration (doc 08). Order is fixed by the supervisor tracker (doc 03). After each task: run tests, commit, and only then paste the next prompt. If Composer output drifts, reply: *"Revert to MASTER.md Section X; list every place you deviated; fix only those."*

# 14. Prompt template (use for any new request)

```
CONTEXT: Read /docs/MASTER.md and /docs/DECISIONS.md.
TASK: <one sentence>
INPUTS: <files / endpoints / content keys>
OUTPUTS: <exact files to create or edit>
CONSTRAINTS: <from Section 2 that apply>
ACCEPTANCE: <3-6 checkable bullets>
DO NOT: <what is out of scope>
FINISH BY: running <commands> and pasting the output
```
