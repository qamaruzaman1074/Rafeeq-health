# Demo script (90 seconds)

Local app only. From `rafeeq/apps/web`, run `npm install`, then `VITE_USE_MOCKS=true npm run dev`, and open the URL Vite prints: `http://127.0.0.1:5173/`.

The timed path is English. The language control on every screen switches to Arabic. Persona names come from `rafeeq/content/personas.json`.

## 0:00–0:30 — P1 Noor & Khalid

Both carry the same gene (hearing-loss example). First cousins.

1. Landing. The heading is the existing value sentence. Three trust pillars and **Continue as Guest**.
2. **Continue as Guest** opens the persona picker.
3. **Enter as Noor & Khalid**. Couple home opens.
4. **Your result**. One carrier card. The condition line is the parenthetical from that persona story. The banner is `OPEN_QUESTION` because the approved block file is empty.
5. **Your result together**. The fact card shows the existing sentences: "This is a chance for each pregnancy, not a prediction about any child." and "This is not a diagnosis."

## 0:30–0:55 — P5 Aisha & Hamad

Partner B declines sharing. Own information stays available. The overlap stays hidden.

1. Open `http://127.0.0.1:5173/demo` in the address bar. A full load drops the in-memory guest session. `/demo` is public.
2. **Enter as Aisha & Hamad**.
3. **Your result together**. The screen says "Overlap stays hidden because sharing was declined." It does not show the other partner's genes.
4. **Privacy**. "Your own result stays on." The partner overlap switch is the share control for this session.

P5's own result list is empty ("No carrier entries were returned."). The persona story does not name genes for that card. That empty state is the fixture, not a second story.

## 0:55–1:30 — P6 Salma & Yousef

OPEN_QUESTION: a VUS flag cannot be clicked on the couple result. `ownResultFor` returns carriers only for P1, so P6's result page is the empty carrier state. No VUS control and no probability numbers are on that page. The closest existing path is the counsellor queue, because the persona tests string names a single tier, T4.

1. Open `http://127.0.0.1:5173/demo`.
2. **Open the counsellor queue**.
3. In the queue, open **Open brief referral-P6**. The tier chip reads `T4_urgent_human`.
4. The case brief says "No shared genes." Formulas stay off that brief: no persona grants clinic share, so shared genes and kernel numbers are not copied into the counsellor payload. Status can be updated on the brief. This is the human route the app can open today, and it does not show a probability.
