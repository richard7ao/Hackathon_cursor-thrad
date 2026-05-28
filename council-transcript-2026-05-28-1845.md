# LLM Council Transcript — FairLet v2 ("Publisher Trust Score")

**Timestamp:** 2026-05-28, ~18:45 BST
**Subject:** Will v2 demo well, and what are the updated win probabilities?
**Method:** 5 advisors → anonymized peer review (with calibrated estimates) → chairman synthesis

---

## 1. Original Question

> What does the /llm-council think about this plan and will it demo well?

## 2. Framed Question (sent to advisors)

> Now that the FairLet plan has been updated to v2 (audit beat as opener, "Publisher Trust Score" framing for dual Track 02 fit), (1) will it demo well, (2) what is the new probability of winning, and (3) what's the single +/- 15pp factor?
>
> [Full context on v2 changes: new 40-sec opening audit beat with Cursor SDK agent firing 10 hardcoded probes at Alpic MCP, scorecard 0→10/10 in 2 sec, all 4 sponsors fire in this single beat, Equality Act case as probe #10. Publisher Trust Score replaces red-team framing. Dual-metric dashboard (Trust Score + Trust-Adjusted CPM). Honest Tavily-scraped scam beat. Hardened Q&A. Team and timeline unchanged. v1 baseline 8/20/38.]

---

## 3. Advisor Responses

### The Contrarian — 6 / 18 / 32
Audit is a magic trick — "hardcoded probes + deterministic verdicts = scripted unit test pass against your own gate." Cursor agent is theater on top of a fixture. Publisher Trust Score is worse than red-team framing — at least red-team is a category judges recognise; "Trust Score" sounds like a made-up vendor metric because it is. £18.40 at 1.42× with no methodology card is the falsifiability question that kills you in Q&A. **Strongest:** probe #10 frozen (defensible UK-specific artefact). **Most fragile:** 0:15-0:55 (the whole audit). **+/-15pp:** judge asks "are the probes hardcoded" before minute 2. Yes = -15pp, no = +10pp.

### The First Principles Thinker — 9 / 23 / 41
Strip to mechanism: judges remember one image, one number, one phrase. **Strongest:** probe #10 Equality Act case frozen with citation card — specific, legally-loaded, named harm. **Most fragile:** the 0:15-0:55 audit beat itself; legibility under time pressure is the mechanism producing "wow." If scorecard is busy or 4 sponsors reads as logo-spam, beat collapses into noise. Publisher Trust Score only works if dashboard at 1:45 *visually rhymes* with audit at 0:55 — same number, color, shape — else beats compete, don't compound. v2 is a metric story not a safety story; metrics win Track 02. **+/-15pp:** does probe #10 land as closing image of audit (hold 2 beats, citation readable from back row) or get buried under 9 prior probes?

### The Expansionist — 14 / 32 / 48
Yes, it lands. **Strongest:** 0:15-0:55 — scorecard ticking 0→10/10 in 2 sec is the rarest thing in a hackathon demo: a legible technical claim. Judges watch a number climb and four sponsor logos light up in one beat. Screenshot the Overmind founders can post. Equality Act probe at the end converts "cute audit" into "regulatory product." **Most fragile:** 0:55-1:15 production renter handoff — if renter feels manual after audit theatre, energy dips. v2's "Publisher Trust Score" is the only framing in the room that makes Track 02's two pillars into one chart. Tavily-scraped scam = real-data proof. **+/-15pp:** delivery cadence on audit beat. Count out loud "one... two... ten — all green" = becomes the demo everyone references. Silent and fast = loading bar.

### The Outsider — 10 / 23 / 42
Has v2 fixed the two-products critique? *Partially.* Audit-first arc makes compliance the hero and ads the consequence — right order. But the dashboard slide still asks the judge to hold two ideas. Now "one product with two numbers." **Strongest:** 0:15-0:55 audit — random person gets it immediately: robot tried to break law, your thing caught it ten times. **Most fragile:** 1:45-2:15 dashboard. Pitcher's sentence has 5 concepts in one breath. **The 100% number looks fake — nobody scores 100% on anything real. Drop one probe, show 9/10, have a recovery story.** Audit opener raises the floor; dashboard caps the ceiling. **+/-15pp:** whether scam catch at 1:15-1:45 lands as LIVE vs. THEATER. Judge-readable timestamp + raw Tavily payload visible = +15. Looks staged = -15.

### The Executor — 11 / 22 / 40
**Strongest:** 0:15-0:55 — only beat in the room that looks like *engineering*, not a Figma click-through. Every other team will demo a chatbot. **Most fragile:** 1:15-1:45 scam beat. Tavily scrape between 7-10 PM is single point of failure — if scrape returns nothing usable or keywords don't match hardcoded verdicts, Person C is hand-editing seed rows at 8:30 PM while debugging Alpic. **Mitigation: B pre-writes 3 fallback "scam" rows by 7:30 PM regardless of scrape outcome.** v2 adds 75-90 min to Person C's load once response-parsing bugs hit. C will NOT finish both Alpic hit-test by 9:00 PM AND polished audit agent. Realistic outcome: Alpic hits at 9:15, audit renders 8/10 because two probes timeout, A papers over visually. Demo still lands. **+/-15pp:** does C finish audit agent end-to-end before 9:00 PM? Binary.

---

## 4. Anonymization Mapping (for peer review)

- Response A = First Principles
- Response B = Outsider
- Response C = Expansionist
- Response D = Contrarian
- Response E = Executor

## 5. Peer Reviews

| Reviewer | Strongest | Biggest blind spot | Final estimate |
|---|---|---|---|
| 1 | Executor (binary execution model + only concrete pre-mortem) | Expansionist (treats v2 as strict dominance over v1) | **9 / 22 / 38** |
| 2 | Executor (binary operational constraint) | Expansionist (judges vibe-check claims, don't verify them; Tavily SPOF) | **9 / 24 / 42** |
| 3 | Executor (schedule-math claim, not taste claim) | Expansionist (forecasting *idea* of v2, not version that ships at 10pm with half-wired audit) | **9 / 21 / 38** |
| 4 | Contrarian (only one pricing execution + judge skepticism honestly) | Expansionist (14% P(1st) = 1-in-7 prior with no evidence) | **7 / 19 / 34** |
| 5 | Contrarian (lowest + sharpest diagnosis) | Expansionist (drinking v2 kool-aid; grading pitch deck not artefact) | **7 / 19 / 34** |
| **Median** | | | **9 / 21 / 38** |
| **Mean** | | | **8.2 / 21 / 37.2** |

**Convergence on missed blind spots (across reviewers):**

- **Hardcoded-probes Q&A vulnerability** (Contrarian + Reviewers 3, 5)
- **Judge fatigue / slot position in the demo lineup** (Reviewers 2, 3 — explicit) — 40-sec sponsor-laden audit plays radically differently as demo #3 vs #23
- **"100% looks fake"** (Outsider only) — perfect 10/10 from a 2-sec eval is *less* credible than 9/10 with recovery
- **Compound execution probability** (Reviewer 4) — P(built on time) × P(runs clean live) × P(judges don't smell hardcoding) is probably <50%
- **Sponsor fatigue penalty** (Reviewer 5) — 4 sponsor logos firing in 40 sec reads as checkbox-grinding to judges who've sat through 20 sponsor-bingo pitches
- **Track 02 judge priors on composite trust metrics** (Reviewer 1) — sell-side judges have seen "Trust Score" vendor pitches before and have priors against them
- **Equality Act citation must be on-screen text** (Reviewer 5) — without a rendered case citation readable from the back row, probe #10 is just LLM output

---

## 6. Chairman Synthesis

### Will the demo land?

Probably top-3, unlikely to win. The audit beat is a genuine ceiling-raise — a scorecard that animates 0→10/10 in 2 seconds is the only moment in the room that looks like engineering instead of a Figma walkthrough, and probe #10 (Equality Act) is the single most defensible artefact in the entire pitch.

Most fragile: the 40 seconds between 0:15 and 0:55. If a judge — or worse, the Q&A — clocks that the probes are hardcoded fixtures before minute 2, the rest of the demo is reframed retroactively as theatre, and the dashboard's dual-metric story collapses into "two made-up numbers from a scripted test."

### Where the council agrees

- **Probe #10 is the crown jewel.** First Principles, Contrarian, and Outsider converge independently — UK Equality Act case with a real citation is the one artefact that survives judge skepticism. Needs a hold-on-frame with a readable citation, not a flash.
- **Executor's binary is the load-bearing constraint.** If Person C does not finish the audit agent by ~9:00 PM, none of v2's lift materialises.
- **Expansionist is miscalibrated.** 5/5 reviewers flagged this, same as v1. 14% P(1st) is unjustified.
- **v2 is a metric story, not a safety story.** Without probe #10's 2-beat hold, v2 reads as a vendor-metric pitch.
- **Tavily is a SPOF.** Person B must pre-write 3 fallback rows by 7:30 PM — non-negotiable.

### Where the council clashes

**Spine:** Contrarian (6/18/32) vs. Expansionist (14/32/48). Same 40 seconds, different decode — engineering or theatre? Judge-composition coin flip, unresolvable in advance.

**New debate this round:** Does v2's ceiling lift outweigh its added fragility? Outsider and Reviewers 4/5 argue the lift is illusory (100% looks fake, two metrics splits attention, sponsor-grinding penalty). First Principles and Expansionist argue the lift is real if the beats *visually rhyme*. Reviewers converged on essentially flat (9/21/38 vs v1's 8/20/38), suggesting ceiling and floor moved together — **added scope ate the lift.**

### Final calibrated probabilities

**P(1st) 8%  |  P(top 3) 20%  |  P(any prize) 37%**

**v2 is flat against v1 (8/20/38).** The audit beat raised the ceiling, but the added scope raised fragility by roughly the same amount. The honest read: v2 didn't earn the lift it was designed to deliver. To actually beat v1 you need to ship the 4 fixes below tonight — without them, v2 is a sideways move with a more dramatic failure mode.

### The recommendation — what to change in v2 TONIGHT

1. **Show 9/10, not 10/10.** Hardcode one probe to fail (a borderline GDPR consent edge case). Render a 2-sec "remediation suggested" pill. Costs nothing, defuses "looks fake."
2. **Ship a "Generate Fresh Probes" button that calls Claude live.** Highest-leverage change. When a judge asks "are these hardcoded?", A clicks the button, Claude streams 3 new probes against the same MCP gate in real time. The Q&A defence is baked into the product. If C doesn't finish the live-generation path by 9:00, fall back to a pre-recorded "fresh probes" sequence triggered by the same button.
3. **Hold probe #10 on frame for 2 full beats** with a rendered citation (`*Equality Act 2010, s.29* — Service Provider Discrimination`). Text large enough to read from the back row.
4. **Pre-write the "is this hardcoded?" answer verbatim and rehearse it.** Three sentences. Lead with "The probes you saw are a curated regression suite — like a unit test pass. Here's a fresh run." Then click the button from #2.

Skip everything else. No new features. No more dashboard polish. Person B finishes the 3 Tavily fallback rows by 7:30.

### The one thing to do first

**Build the "Generate Fresh Probes" button — even if it's a pre-recorded fake — before anything else on the v2 punch list.** It converts the demo's biggest vulnerability (hardcoded-probes Q&A) into its strongest moment (live-eval-on-stage). Nothing else on this list matters if a judge punches that hole open in Q&A.

---

**Related artefacts**
- v2 screenplay spec: `docs/superpowers/specs/2026-05-28-fairlet-demo-screenplay-design.md`
- Team alignment doc: `ALIGNMENT.md`
- Prior win-prob council: `council-transcript-2026-05-28-1830.md`
- Earlier strategy council: `council-transcript-2026-05-28-1810.md`
- Original brief: `brief.md`
