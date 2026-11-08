> Purpose: decide **what the site is, who it is for, how it looks and feels, and every page and component** before any code is written. Doc 06 turns this into Composer prompts.

# 1. Product surfaces

| Surface | Audience | Shape | Priority |
| --- | --- | --- | --- |
| **Couple companion** | Individuals and couples (and, later, family members) | Mobile-first responsive web app (PWA-ready), Arabic/English | P0 |
| **Counsellor console** | Accredited genetics professionals / counselling coordinators | Desktop-first dashboard | P0 |
| **Health-system insights** | DoH / public-health analysts | Desktop dashboard (aggregated only) | P1 |
| **Public landing + trust centre** | Judges, public, partners | Marketing-style landing with demo entry | P0 |
| **Admin/audit view** | Admin | Table views | P2 |

A single React app with role-based routes; one design system; one i18n layer.

# 2. Reference research: what we borrow from leading health sites

We could not objectively rank "the world's top 10"; we selected ten widely recognised healthcare/health-tech experiences and extracted **patterns**, not assets. We will not copy logos, images, text or code. Team should open each and screenshot patterns for the moodboard (Manual, Phase 2).

| # | Reference | What to study | What we borrow |
| --- | --- | --- | --- |
| 1 | NHS.uk and the NHS design system (service-manual.nhs.uk) | Plain language, accessibility, content design | Content patterns, error/help patterns, a11y discipline |
| 2 | Cleveland Clinic | Trust cues, clear navigation, patient-education layout | Information hierarchy, calm trust layout |
| 3 | Mayo Clinic | Symptom and condition education pages | "Overview > What it means > Next steps" structure |
| 4 | Ada Health | Conversational triage with clear boundaries | Step-by-step assessment UX, progress, human hand-off |
| 5 | One Medical / 1Life | Modern, warm, bookable care | Booking card, clear status chips |
| 6 | Oscar Health | Friendly language, soft colours | Tone, illustration use, empty states |
| 7 | Zocdoc | Search-and-book flows | Appointment list pattern |
| 8 | Apple Health / Health Records | Privacy-forward data presentation | Granular data cards, "who can see this" patterns |
| 9 | Headspace / Calm | Gentle, low-anxiety onboarding | Pace, breathing room, motion restraint |
| 10 | Abu Dhabi government digital services (e.g., TAMM) and DoH public sites | Local trust cues and conventions | Locale conventions, RTL, tone (no brand assets) |

**Decision.** Primary blend = **NHS (clarity + accessibility) + Ada (conversation with boundaries) + Apple Health (privacy controls) + Oscar (warmth)**, with a Gulf-appropriate palette and typography.

# 3. Design principles

1. **Calm, not clinical-cold; trustworthy, not alarming.** No red for carrier status. No scary icons. Generous whitespace.
2. **One idea per screen** on mobile; progressive disclosure for detail ("show me the maths").
3. **Plain language first, precision on demand.** Every number has a "how was this calculated" drawer and a "what this does not tell you" line.
4. **Always show the human option.** A persistent "Talk to a genetic counsellor" action.
5. **User controls the data.** A "Who can see this?" chip on every data card.
6. **Bilingual parity.** Arabic is designed first-class (not a mirrored afterthought): RTL layout, proper Arabic typography, Arabic numerals toggle.
7. **Accessible by default:** WCAG 2.2 AA, keyboard, screen reader, reduced motion, 16px minimum body, 44px touch targets.
8. **Low-literacy path:** Simple mode (shorter text, icons, audio) and Voice mode.

# 4. Colour system (decision with rationale)

Palette is "Gulf coast calm": deep teal (trust, medical), sand (warmth, local landscape), muted gold (restrained heritage accent), soft lilac/amber for attention states (never red for carrier status).

| Token | Hex | Use |
| --- | --- | --- |
| `--teal-900` | #0B3F45 | Headings, nav background |
| `--teal-700` | #0F5C63 | Primary buttons, links |
| `--teal-500` | #1F8A8F | Hover, accents |
| `--teal-100` | #D7EEEE | Soft panels |
| `--sand-50` | #FBF8F2 | Page background |
| `--sand-100` | #F6F1E7 | Cards |
| `--gold-500` | #B8893B | Accent lines, highlights (sparingly) |
| `--lilac-100` | #ECE8F6 | "Needs a conversation" state |
| `--amber-100` | #FBEFD5 | "Please read" notices |
| `--green-600` | #2F7D5B | Positive completion |
| `--ink-900` | #1B2B2E | Body text (contrast >= 12:1 on sand-50) |
| `--ink-600` | #4B5A5D | Secondary text (>= 7:1) |
| `--danger-600` | #B3261E | **Only** for system errors and destructive actions (delete data), never for results |

Check every pair for 4.5:1 (text) and 3:1 (UI components) using a contrast checker; record results in `docs/A11Y.md`.

# 5. Typography

- Arabic: **IBM Plex Sans Arabic** (alt: Noto Sans Arabic). English/Latin: **IBM Plex Sans** (harmonised metrics). Both free (Google Fonts); self-host to avoid external requests.
- Scale (rem): 0.875 / 1 / 1.125 / 1.25 / 1.5 / 2 / 2.5. Body 1rem (16px) min; Arabic body +1px optical size; line-height 1.7 (Arabic) / 1.55 (English).
- Numerals: user toggle for Arabic-Indic vs Western digits; default follows locale.

# 6. Information architecture (sitemap)

```
/                         Landing (trust, how it works, Continue as Guest, Sign in)
/trust                    Trust centre: privacy, how AI is used and limited, who reviews content
/demo                     Persona picker (guest entry)
/app                      Couple home (next best step, pathway)
  /app/result             "Your result" (own) 
  /app/couple             "Your result together" (overlap; consent-gated)
  /app/learn              Learn: carrier, risk vs diagnosis, uncertainty, options (info only)
  /app/check              Teach-back check ("Did this make sense?")
  /app/ask                Ask a question (assistant with boundaries + hand-off)
  /app/privacy            Consents, shares, receipts, revoke, audit view for me
  /app/care               Care pathway + book counsellor
  /app/settings           Language, literacy mode, numerals, audio
/clinic                   Counsellor console
  /clinic/queue  /clinic/case/:id (brief)  /clinic/audit
/insights                 Analyst dashboards (KPIs, equity)
/admin                    Audit and system (P2)
/legal                    Terms, privacy notice, assumptions and limitations
```

# 7. Page-by-page spec (content and behaviour)

### Landing `/`
Hero: one sentence value ("Understand your genetic result - in your language, at your pace, with a counsellor one tap away."). Three trust pillars: *Plain language*, *You control sharing*, *Humans for the big questions*. How it works (4 steps). CTA: **Continue as Guest** (primary), Sign in (secondary), language switcher. Footer: prototype notice ("synthetic data, not medical advice"). Judge-friendly: "Evaluation guide" link opens a 1-page walkthrough of personas.

### Guest persona picker `/demo`
Seven persona cards (Section 9 of Master). Each shows "what you will see" + language toggle + literacy mode. Reset button.

### Couple home `/app`
"Your next step" card (single), progress through pathway (Result > Understand > Check > Decide who sees what > Counselling > Next), unread notices, counsellor CTA.

### Your result `/app/result`
Own carrier list as calm cards: gene + plain-language condition name + "carrier" meaning. A banner: "Being a carrier is common and usually does not affect your own health" (approved block). Each card: Learn more, Who can see this chip.

### Together `/app/couple`
Consent gate screen first (what is shared, with whom, how to revoke). After both consent: shared-gene cards with the **Fact Card**: "For each pregnancy: 1 in 4 chance ... 1 in 2 ... 1 in 4 ..." drawn as an array of 100 person-icons (icon array) + the sentence "This is a chance for each pregnancy, not a prediction about any child." Drawer: "How this was calculated" (formula, inputs, assumptions). Section "What this does not tell us" (limits). Banner: "This is not a diagnosis."

### Learn `/app/learn`
Short illustrated modules (60-90s read each); audio button; glossary tooltips. Modules: What is a carrier; What the result means for a couple; Risk vs diagnosis; Uncertainty; Family relatedness and risk (non-judgemental, includes cultural context and the evidence that added risk is modest in absolute terms but real and gene-specific - wording clinician-reviewed); Options people may discuss with a counsellor (information only, no ranking); What happens next.

### Check `/app/check`
3-5 teach-back items ("In your own words: if both of you carry the same change, what is the chance for each pregnancy?" multiple choice with pictorial options). Wrong answer -> gentle re-explanation, never "wrong!". Gaps recorded for the counsellor (if consented).

### Ask `/app/ask`
Chat UI with boundary banner. Suggested questions chips. Answer cards show source labels (e.g., "Approved content #B-017") and "Talk to a person" button. Hard-route responses are visually distinct (lilac) and offer booking.

### Privacy `/app/privacy`
Matrix: data item x who (me, partner, clinic) with toggles; receipts list with revoke; "audit: who accessed my data" timeline (from audit_log).

### Care `/app/care`
Pathway timeline: Result received - Counselling - Confirmatory assessment (if advised by counsellor) - Specialised reproductive-genomics services (information card: what these are, who decides) - Follow-up. Status chips; counsellor booking (mock slots); "Send my questions to the counsellor" (consent-gated).

### Counsellor queue `/clinic/queue`
Table: tier chip, reason codes, due-by, language, literacy mode, comprehension gaps flag, consented-share status. Filters. Click -> case brief.

### Case brief `/clinic/case/:id`
Shared genes, numbers (from kernel with formulas), user questions, teach-back gaps, preferences stated, cultural/language notes, suggested talking points (from approved content, labelled as prompts not advice), status update controls, audit trail.

### Insights `/insights`
Cards: completion of explanation; teach-back pass rate; counselling uptake; median time result -> referral booked; privacy events (consents granted/revoked); equity charts (by language and literacy mode) with confidence intervals; k-anonymity notice. Synthetic-data badge.

# 8. Component inventory (design system)

AppShell, LocaleSwitcher, LiteracyModeToggle, NumeralToggle, StepProgress, CalmCard, ResultCard, FactCard (icon array + sentence + drawer), BoundaryBanner, ConsentGate, ShareMatrix, ReceiptCard, AuditTimeline, TeachBackItem, AssistantMessage, HandoffCard, PathwayTimeline, StatusChip, TierChip, QueueTable, BriefPanel, KpiCard, EquityChart, AudioButton, GlossaryTerm, EmptyState, ErrorState, SyntheticBadge, SkipLink, Toast.

# 9. States to design for every screen

Loading (skeleton), empty, error (with retry and human contact), offline (PWA notice), partial consent, revoked consent, language fallback, long Arabic strings, 200% zoom, dark mode (P2).

# 10. Content design rules

Short sentences; one fact per sentence; active voice; define a term once and link thereafter; no stacked negatives; avoid percentages alone - pair with natural frequencies ("25 in 100"); always say *for each pregnancy*; always pair a number with its limits; avoid "risk" as a noun for a person (use "chance"); never imply blame; use "you both" and "your family" thoughtfully; honour religious sensitivity by not asserting or denying religious positions (route to a person).

# 11. Motion and imagery

Subtle fades only (respect `prefers-reduced-motion`). Illustration style: abstract geometric patterns inspired by regional geometry (generic, no religious symbols, no faces); icon set: Lucide. No stock photos of couples (avoids stereotyping).

# 12. Performance and quality budgets

LCP < 2.5 s on mid-range mobile over 4G; JS < 250 KB gz for first route (code-split clinic/insights); Lighthouse >= 90 (a11y 100 target); axe-core zero serious violations; no layout shift on language switch.

# 13. Website acceptance gates (supervisor)

- Landing + guest flow demo-able in < 90 s.
- All pages in `ar` and `en`, RTL verified with screenshots.
- Zero banned terms (CI).
- Every number on screen traceable to a kernel response (spot-check 10).
