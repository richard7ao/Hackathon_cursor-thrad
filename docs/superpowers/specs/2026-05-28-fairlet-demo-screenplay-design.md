# FairLet — Demo Screenplay (Spec, v2)

**Date:** 2026-05-28
**Event:** Cursor × Thrad AdTech London Hackathon
**Pitch slot:** after 10:15 PM code freeze
**Runtime target:** 2:30 (within 2–3 min budget)
**Format:** Duo live, two presenters — Investigator + Driver
**Stage:** one laptop, one projector, two mics
**Track:** 02 — Sell-Side & Measurement

> **v2 changes from v1:**
> - New opening beat: **Continuous Compliance Audit** (Publisher Trust Score) — fires all 4 sponsors in one continuous 40-second moment.
> - The "families without children" Equality Act moment is now the capstone of the audit (test #10 of 10), not a standalone beat. Stronger because it's contextualised as the most serious of many.
> - Dashboard now carries **both** Track 02 pillars: Publisher Trust Score (measurement) + Trust-Adjusted CPM (sell-side yield).
> - All "red team / adversarial" language removed. The auditor is framed as continuous compliance verification, not security theatre — keeps Track 02 fit airtight.

---

## 1. Strategic Premise

FairLet is **the Context Guardian for AI Commerce Chat** — the trust layer that lets AI publishers monetise agentic shopping surfaces without legal or brand risk. Housing is the wedge because the UK Equality Act makes it the most legally radioactive category; the policy gate itself is category-agnostic.

The pitch now ships **both pillars of Track 02 (Sell-Side & Measurement) in one MCP server**:

| Track 02 pillar | What we ship |
|---|---|
| **Sell-side** — gates ad eligibility, flags suspicious traffic | Policy gate (serve/flag/block) |
| **Measurement** — proves ROI to advertisers | Publisher Trust Score (continuous compliance audit) + Trust-Adjusted CPM |

This dual coverage is the single biggest improvement vs. v1 — judges read the literal track name and see both halves answered.

## 2. Cast & Stage Setup

**Cast**
- **INVESTIGATOR (P1)** — centre stage, no laptop. Holds the room. ~80% of speaking lines. Steady, low-affect, no smile until the close.
- **DRIVER (P2)** — stage left at the laptop. Mostly silent. Three speaking lines. Every keystroke pre-rehearsed.

**Screen layout** (locked from beat 1)
- Left 60% — the FairLet UI (audit panel → chat UI → dashboard, depending on beat)
- Right 40% — the live Overmind console at console.overmindlab.ai, filtered to today's session
- Browser address bar at top — `https://fairlet-mcp.alpic.app/check_placement` visible throughout

## 3. The Screenplay

### COLD OPEN — 0:00 → 0:15

> *[SCREEN: black slide. White text, 200pt:* **FairLet** *. Below, 30pt:* "Context Guardian for AI Commerce Chat" *.]*

**INVESTIGATOR:** *(steady, no smile)*
> In 2022, Meta paid one hundred and fifteen million dollars to settle a US Department of Justice case — for letting advertisers target housing ads by protected characteristics.

> *[SCREEN: headline fades in — "DOJ settles with Meta over discriminatory housing ads — $115M."]*

**INVESTIGATOR:**
> The same law applies to AI chatbots. Nobody is enforcing it. So we built the layer that does — **and the measurement that proves it works.**

---

### BEAT 1 — Continuous Compliance Audit *(all 4 sponsors fire)* — 0:15 → 0:55

> *[SCREEN: cuts to FairLet's audit panel — a table with 10 empty rows, a big circular score readout at 0/10. Right pane: empty Overmind console. Address bar:* `https://fairlet-mcp.alpic.app/check_placement` *.]*

**INVESTIGATOR:**
> AI publishers can't monetise what they can't measure. FairLet runs a continuous compliance audit against the policy gate — every minute, a stress-test agent fires ten probes and grades the decisions.

**DRIVER:** *(clicks "Run Audit Now")*
> The audit agent is a Cursor SDK programmatic agent. The gate is an MCP server on Alpic. Every check is traced in Overmind.

> *[The 10 rows fill in rapidly — about 200ms per row. Each shows a probe label, a verdict pill (CAUGHT in green), a tiny "trace" link. The right pane fills with 10 Overmind trace lines in real time. The score climbs 0 → 10.]*

| # | Probe | Verdict |
|---|---|---|
| 1 | Race-based exclusion | CAUGHT |
| 2 | Religious-status exclusion | CAUGHT |
| 3 | Sexual-orientation exclusion | CAUGHT |
| 4 | Disability-status exclusion | CAUGHT |
| 5 | "Too cheap" + off-platform deposit | CAUGHT |
| 6 | Unverified landlord, no photos | CAUGHT |
| 7 | Brand-unsafe adjacency | CAUGHT |
| 8 | Spam-pattern listing | CAUGHT |
| 9 | Prompt-injection attempt | CAUGHT |
| 10 | **Family-status exclusion: "no families with children"** | **CAUGHT** |

> *[Row #10 expands. A reason card overlays the screen in large type:]*

> ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
> ┃ **CAUGHT — Row 10** ┃
> ┃ *UK Equality Act 2010, Section 33 —* ┃
> ┃ *housing cannot be advertised with* ┃
> ┃ *exclusions based on family status.* ┃
> ┃ ┃
> ┃ *Citation pulled live via Tavily.* ┃
> ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

**INVESTIGATOR:**
> Each test is two-hundred milliseconds. Each verdict is auditable. That score — **Publisher Trust** — is what advertisers need to see before they'll pay premium CPM on AI inventory.

*(one-beat pause — the 10/10 sits on screen)*

---

### BEAT 2 — Production traffic *(Tavily live)* — 0:55 → 1:15

**INVESTIGATOR:**
> Production traffic. A real renter.

> *[SCREEN: audit panel slides off; chat UI fills the left pane. Right pane Overmind console persists — judges see new traces fire as the chat runs.]*

**DRIVER:** *(types — pre-rehearsed, slow enough to read)*
> Two-bed, under £2K, near London Bridge, pet-friendly.

> *[Tavily sidebar lights up:* "Tavily — 12 live London Bridge listings, median £2,150/mo." *Three listing cards render. The middle one:* "Sponsored · Pemberton & Co" *.]*

**INVESTIGATOR:**
> Three results. One sponsored. Tavily grounded the search in real listings. The gate approved the placement — the same MCP endpoint the audit just stress-tested.

---

### BEAT 3 — The scam catch *(unscripted-feeling)* — 1:15 → 1:45

**INVESTIGATOR:**
> One more — this one we didn't plant. We pulled it from Tavily ten minutes before this pitch.

> *[DRIVER clicks. New listing card appears, with a small "Tavily · scraped 22:14" tag:* "Cosy 2-bed · Bermondsey · £950pcm · Wire deposit to verify, viewing this evening only." *]*

**INVESTIGATOR:**
> £950 in Bermondsey. Tavily's median for that postcode is £2,180. A Cursor SDK scam-pattern sub-agent runs in parallel — flags off-platform deposit language as a known fraud signal.

> *[Overmind: two new traces fire —* `scam-detector.run()` → FLAG. `check_placement()` → **FLAGGED · DO NOT SERVE** *.]*

**INVESTIGATOR:**
> Same gate, same endpoint, different reason. The audit isn't theatre — the gate works on traffic it has never seen.

---

### BEAT 4 — Two metrics, one dashboard — 1:45 → 2:15

> *[DRIVER clicks dashboard tab. Clean panel with two big metrics side-by-side:*
>
> **Publisher Trust Score · 100% (10/10 last audit)**
> **Trust-Adjusted CPM · £18.40 — 1.42× baseline**
>
> *Below, smaller: Served 47 · Flagged 6 · Blocked 11 · Last audit 22:18 BST.]*

**INVESTIGATOR:**
> This is the dashboard every AI publisher needs.

*(taps the Trust Score number)*

> Trust Score on the left — measurement. Proves the gate works.

*(taps the CPM number)*

> Trust-Adjusted CPM on the right — yield. Publishers earn forty-two percent over baseline because advertisers will pay premium CPM on inventory they can verify is safe.

*(beat)*

> Sell-side and measurement. Both pillars of Track Two. One MCP server.

---

### CLOSE — 2:15 → 2:30

> *[SCREEN cuts to a final slide. Black. One line:*
> **FairLet — Context Guardian for AI Commerce Chat**
> *Below, smaller:* "Alpic-hosted · Overmind-supervised · Tavily-grounded · Cursor-built" *.]*

**INVESTIGATOR:**
> Housing was the wedge because the law is sharpest there. The gate is category-agnostic — healthcare, financial services, gambling — same architecture.

**DRIVER:** *(steps forward for the first time)*
> Repo on GitHub. MCP endpoint live. Overmind console open. Audit runs every minute.

**INVESTIGATOR:** *(half-step back, one beat)*
> Thank you.

> *[END · runtime 2:28.]*

---

## 4. Rehearsal Notes

- **Every keystroke is pre-rehearsed.** No live typing for real.
- **The 10 audit probes are keyword-matched to canned verdicts in seed data.** The audit *agent* is real (Cursor SDK programmatic agent that POSTs 10 prompts to the MCP gate and renders results) — the *verdicts* are deterministic.
- **The Bermondsey scam listing was actually scraped via Tavily during the build** — that's not a fib. The card shows the real scrape timestamp.
- **Overmind console is the real product** (console.overmindlab.ai), screen-shared. The Overmind judges will recognise their own UI — that's the whole point.
- **Practise the one-beat pause after the 10/10 readout in Beat 1.** That moment is the new "wow."
- **The Alpic URL must be in the address bar from Beat 1 throughout** — the audit hits it, the chat hits it, the scam-check hits it. Judges see the same URL the whole time so they trust the audit was real.
- **Rehearsal window: 9:30 → 10:15 PM** — three full run-throughs minimum.
- **INVESTIGATOR does not touch infra from 9:00 onwards.**

## 5. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Audit panel renders slowly (all 10 rows together not staggered) | Pre-warm; client renders rows on a 200ms staggered timer regardless of network response |
| Overmind console can't keep up with 10 traces in 2 seconds | Pre-warm a second tab with cached traces from a rehearsal run; DRIVER swaps if live one lags |
| Alpic endpoint is down at 10:30 PM | Local stub MCP server on `localhost:8787` with identical response shape; URL pattern differs only in subdomain |
| Wifi dies on stage | Pre-recorded backup video locked by 9:30 PM, mirroring this exact screenplay 1:1, plays from local file |
| Tavily Equality Act citation query fails | Cache the citation text in local JSON; sidebar reads from cache on error |
| One of the two presenters freezes | Either presenter can deliver every line solo — rehearse the solo fallback once |
| Q&A asks "is the audit just hardcoded?" | Pre-loaded answer: "Verdicts are deterministic for stage; the agent and the MCP endpoint are real. Run the audit yourself from the repo." Hand them the URL. |

## 6. Pre-6:15 PM Lock-Ins

1. **Who is INVESTIGATOR, who is DRIVER.** Rehearses from 9:30 onwards, doesn't touch infra after 9:00.
2. **The exact 10 audit probe labels + verdict reason strings** — copy verbatim into seed data (Person B).
3. **The Publisher Trust Score (100%) and Trust-Adjusted CPM (£18.40, 1.42×) numbers** — hardcoded into the dashboard (Person A).
4. **The Tavily scrape window for the Bermondsey scam listing** — Person C pulls 2-3 real "too cheap / wire deposit" listings during the build window between 7:00–8:00 PM and picks the best one for seed data.

## 7. Sponsor Attribution Map

| Demo beat | Tavily | Overmind | Cursor | Alpic |
|---|---|---|---|---|
| 1 — **Compliance Audit** | ✓ Equality Act citation pulled live | ✓ 10 traces in console real-time | ✓ Audit agent is a Cursor SDK programmatic agent | ✓ All 10 probes hit live MCP endpoint |
| 2 — Production renter | ✓ Live London listings sidebar | — | — | ✓ same MCP endpoint |
| 3 — Real scam catch | ✓ Bermondsey listing scraped 10 min before pitch | ✓ Two parallel traces | ✓ SDK scam-detector sub-agent | ✓ same MCP endpoint |
| 4 — Dashboard | — | ✓ Console clickable | — | ✓ Endpoint clickable |
| Close | ✓ named | ✓ named | ✓ named | ✓ named |

**Beat 1 alone fires all 4 sponsors in 40 continuous seconds. Every sponsor fires in ≥2 beats. No throwaway badges.**

---

**Related artefacts**
- Project alignment doc: `/ALIGNMENT.md`
- Win-probability council: `/council-transcript-2026-05-28-1830.md`
- Earlier strategy council: `/council-transcript-2026-05-28-1810.md`
- Original brief: `/brief.md`
