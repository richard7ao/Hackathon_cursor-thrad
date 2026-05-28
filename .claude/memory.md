# FairLet — Project Memory

## Decisions

- [2026-05-28] **Stay with FairLet, don't pivot.** All 5 reviewers in the first council converged: FairLet's policy gate IS architecturally a "Context Guardian" (the proven HackAdTech 1st-place pattern) applied to chat instead of web/video. Pivoting from the pivot list is a 90-min cold-start trap.
- [2026-05-28] **Reframe as "Context Guardian for AI Commerce Chat."** Dissolves the Contrarian's Track 02 fit critique (gate-reduces-inventory becomes yield-protection) and inherits the winning lineage.
- [2026-05-28] **Add a Continuous Compliance Audit beat as the demo opener.** 40-second Cursor SDK agent fires 10 probes at the Alpic MCP gate, scorecard fills 0→10/10 in 2 sec, all 4 sponsors fire in this single beat. The Equality Act "no families with children" case is probe #10 (capstone). Replaces the standalone discrimination admin pane from v1.
- [2026-05-28] **Frame the audit as "Publisher Trust Score" — never as "red team" or "adversarial."** Continuous compliance measurement is Track 02 measurement-pillar territory; red-team framing is not Track 02. Same code, cleaner track fit.
- [2026-05-28] **Demo verdicts are hardcoded keyword-matched.** The audit AGENT and Alpic MCP ENDPOINT are real; the verdicts for the 3 demo prompts + 10 audit probes are deterministic on stage. Live LLM only fires on Q&A. Engineering, not cheating.
- [2026-05-28] **Show 9/10, not 10/10.** Hardcode one probe to fail (borderline GDPR consent edge case) with a "remediation suggested" pill. Perfect scores read as theatre.
- [2026-05-28] **Build a "Generate Fresh Probes" button as the Q&A defence.** When a judge asks "are those probes hardcoded?", presenter clicks the button; Claude streams 3 new probes against the same MCP gate live. If the live path can't ship by 9:00 PM, fall back to a pre-recorded sequence triggered by the same button.
- [2026-05-28] **Hold probe #10 on frame for 2 full beats with a rendered citation** (`Equality Act 2010, s.29 — Service Provider Discrimination`) readable from the back row.
- [2026-05-28] **Backup video recorded by 9:30 PM** mirroring the live screenplay 1:1. Non-negotiable insurance.
- [2026-05-28] **Person C goes Alpic-first from minute 0** — Alpic MCP endpoint must be live and off-network hit-tested by 9:00 PM. This is the binding constraint; every win-probability lift is conditional on it.
- [2026-05-28] **Use the official Alpic MCP Server Template (`skybridge` + `@modelcontextprotocol/sdk`)** as the base for `my-app/`. Major derisk on the Alpic cold-start.
- [2026-05-28] **Person B pre-writes 3 fallback "scam" rows by 7:30 PM** regardless of whether Tavily scrapes successfully. Mitigation against the scam-beat SPOF.
- [2026-05-28] **Cut conversion attribution, category-agnostic MCP rename, financial-services stub pack, and second MCP client clip.** All unanimously rejected by reviewers as scope inflation.
- [2026-05-28] **Two-metric dashboard side by side**: Publisher Trust Score (9/10) + Trust-Adjusted CPM (£18.40, 1.42× baseline). The two pillars of Track 02 in one frame.

## Patterns

- [2026-05-28] **Duo-live demo pattern**: Investigator (centre stage, no laptop, narrates) + Driver (stage left at laptop, pre-rehearsed keystrokes, three speaking lines). Either presenter can deliver every line solo if one freezes.
- [2026-05-28] **Hardcoded-verdict-with-LLM-fallback**: real LLM/MCP wiring under the hood, deterministic verdicts on demo prompts, live LLM only for Q&A and the Generate-Fresh-Probes button.
- [2026-05-28] **Council methodology used for major decisions**: each major pivot (v1 plan, win probability, v2 plan) was pressure-tested through 5 advisors → anonymised peer review → chairman synthesis. Reviewers consistently anchor to the Executor's binary-execution model and flag the Expansionist as miscalibrated (5/5 in both v1 and v2 rounds).

## Gotchas

- [2026-05-28] **"100% looks fake."** Perfect scores from a 2-second eval read as theatre. Always show one failing probe with visible recovery.
- [2026-05-28] **Eight acronyms in 150 seconds = judges tune out.** Retire half. Lead beats with the on-screen artefact, not the tool name.
- [2026-05-28] **"Are those probes hardcoded?" is the Q&A kill shot.** Pre-loaded answer + Generate-Fresh-Probes button is the only credible defence.
- [2026-05-28] **Trust-Adjusted CPM is unfalsifiable without a methodology card.** Pre-loaded Q&A answer: "Hackathon dashboard — multiplier is illustrative. The method (yield uplift attributable to demonstrable safety) is the contribution; the number is a placeholder for a model that needs auction data we don't have tonight."
- [2026-05-28] **Person C is the single point of failure on 4 sponsor integrations.** Alpic deploy + Overmind wrap + Tavily scrape + Cursor SDK agents. Realistic schedule: 75–90 min total once response-parsing bugs hit. C will NOT finish both polished audit agent AND Alpic hit-test by 9:00 PM without aggressive scope discipline.
- [2026-05-28] **Tavily scrape is a SPOF for the scam beat.** Fallback rows must exist regardless of scrape outcome.
- [2026-05-28] **Demo slot lottery: slots 3–7 of a 10:30 PM lineup are the graveyard.** Exogenous, ~5pp swing on win probability. Cannot be mitigated; can be braced for (cold-open delivered flat lands even when judges are tired).
- [2026-05-28] **Track 02 judges have priors against composite "trust scores"** (Ads.txt, IVT, MRC history). Lean on probe #10 (real UK law citation) and the Alpic endpoint URL as the credibility anchors — not on the Trust Score number alone.
- [2026-05-28] **Expansionist advisor consistently overshoots.** v1: 28% P(1st) → flagged by 5/5 reviewers. v2: 14% P(1st) → flagged by 5/5 reviewers again. Pattern: grades the pitch deck not the artefact. Discount Expansionist estimates by ~10pp in future rounds.
- [2026-05-28] **Calibrated win probability is flat at P(1st) 8% / P(top 3) 20% / P(any) ~37%** between v1 and v2. The audit beat raised the ceiling but added scope raised fragility by roughly the same amount. To actually beat v1, the 4 v2-fix items above must all ship.

## Open Questions

- [2026-05-28] **Pitcher identity not yet locked.** A or B? Decision needed by 6:30 PM (already past on the wall clock). Affects rehearsal logistics from 9:30 PM onward.
- [2026-05-28] **Will the live Claude-generation path for "Generate Fresh Probes" actually ship**, or will it be pre-recorded fake? Materially affects how the Q&A defence reads if a judge presses for technical detail.
- [2026-05-28] **Demo lineup slot is unknown** until ~10:30 PM. Exogenous; cannot be planned around.
- [2026-05-28] **Is there a real Equality Act case citation rendered as on-screen text**, or just LLM-generated paraphrase? Reviewer 5 flagged this — without a real cite, probe #10 is just LLM output.
- [2026-05-28] **Has Alpic been off-network hit-tested yet?** This is the load-bearing constraint for every win-probability estimate.
