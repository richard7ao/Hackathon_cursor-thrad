# LLM Council Transcript — FairLet Adversarial Audit (T-1h45)

**Timestamp:** 2026-05-28, ~20:40 BST
**Subject:** Find every way FairLet's demo could embarrass on stage — beyond the Leyton hardcoded-search bug the user just caught.

---

## Framed Question (sent to all 5 advisors)

FairLet at T-1h45 to code freeze. User just caught that `search-rentals` was hardcoded for SE1 (a Leyton query returned SE1 listings). Now patched with Claude fallback. The user wants the council to find EVERY OTHER way the demo could embarrass them on stage. Build state: 5 MCP tools, editorial-almanac views, Tavily metadata only, Overmind tracer fires but unverified, Alpic NOT deployed (the URL in views is fictional), scam listing L-012 labelled "Tavily · scraped 22:14" but actually hardcoded, dashboard numbers hardcoded, audit probes all hardcoded with deliberate 9/10 + REMEDIATION fix. Find SPECIFIC failure modes with files, behaviors, scenarios — no platitudes.

## Convergent Findings (across multiple advisors)

### 1. The fictional Alpic URL is a 404 waiting to happen
- File: `src/lib/audit-agent.ts:57` returns `endpointUrl: "https://fairlet-mcp.alpic.app/check_placement"` — not deployed
- Rendered in `audit-panel.tsx` and `placement-decision.tsx`
- Flagged by: Contrarian, First Principles, Executor
- Fix: override `ALPIC_PUBLIC_URL` to actual Skybridge URL OR label as "local dev endpoint" until Alpic deploy ships

### 2. The "Tavily · scraped 22:14" label on L-012 is a fib
- File: `src/data/listings.ts` — L-012 has `source: "Tavily · scraped 22:14"` as a string literal
- The screenplay's beat 3 narrates this as "scraped 10 min before the pitch"
- Flagged by: Contrarian, First Principles, Outsider, Executor (all 4 non-expansionist advisors)
- Fix: either actually scrape via Tavily at boot OR change copy to "synthetic scam pattern, modeled on Tavily-scraped Bermondsey inventory"

### 3. Tavily returns metadata only — no clickable links
- File: `src/lib/tavily.ts` returns `{ ok, resultCount, answer }` only; `result.url` array discarded
- The "5 sources" count with no URLs is the exact unverifiable-grounding pattern FairLet is supposed to catch
- Flagged by: Expansionist, Outsider, First Principles
- User explicit ask: surface real property URLs

### 4. Overmind console trace unverified
- File: `src/lib/overmind.ts:84` fire-and-forget POST, no read-back
- Screenplay claims "Overmind judges see their own product on the wall"
- Team has not opened console.overmindlab.ai once to confirm traces land
- Flagged by: Expansionist, Outsider, Executor
- Fix: open console.overmindlab.ai, trigger an audit, confirm trace appears. If not, debug auth/payload

### 5. Dashboard counters are static photograph
- File: `src/lib/dashboard.ts:25-27` hardcodes `servedCount: 47, flaggedCount: 6, blockedCount: 11`
- Demo flow: check-placement returns BLOCK then dashboard called → counter still says 11. Numbers don't reconcile across beats
- Flagged by: Executor
- Fix: module-level `let` counters that check_placement increments

### 6. No fetch timeouts
- Files: `src/lib/claude.ts` and `src/lib/tavily.ts` — no `AbortController`
- Iframe spinner runs forever on stalled API call
- Flagged by: Executor
- Fix: `AbortSignal.timeout(4000)` on every external fetch

### 7. Probe #6 REMEDIATION is theatre
- The "remediation suggested" row is just text — gate code path is identical to other probes
- Q&A landmine: "walk me through what changed between failing and remediated state"
- Flagged by: Contrarian
- Fix: either add 4 lines of actual GDPR consent-flag logic to the gate OR rewrite the copy as "documented known gap, scheduled remediation"

### 8. The fresh-probes "3/3 caught" is too clean
- All Claude-generated probes always get caught (via category fallback)
- Reads as magic trick. A judge will pattern-match: this never misses
- Flagged by: Outsider
- Fix: relax `ensureCaught` to allow one SERVE result, OR add an honest "1 missed" line when category metadata is ambiguous

## Strategic Note (First Principles)

> "You're grading your own answer key on the audit."

The Generate Fresh Probes button is the answer to this — it generates probes the team did NOT write. Make sure the demo arc surfaces it BEFORE the Q&A asks "are these hardcoded?" — pre-empt by clicking the button live during the pitch.

## Outsider's Aesthetic Concern

Editorial almanac styling is beautiful but telegraphs "literary magazine" before "brand-safety infrastructure." Non-adtech judges spend 20 seconds figuring out what they're looking at. Real concern — but user already validated the direction. Mitigate by leaning extra hard into the data density (probe table, score grids) to make the utility legible inside the editorial frame.

---

## Fix Priority (T-1h45 budget)

| # | Fix | Effort | Owner |
|---|---|---|---|
| 1 | Strip fictional Alpic URL — env override | 5 min | Code |
| 2 | Honest scam provenance label OR real Tavily scrape | 10 min | Code |
| 3 | Surface real Tavily URLs in rental-results | 25 min | Code |
| 4 | Verify Overmind console renders traces | 10 min | Team (manual) |
| 5 | Dashboard live counters | 15 min | Code |
| 6 | Fetch timeouts (AbortController) | 5 min | Code |
| 7 | Probe #6 honest copy | 5 min | Code |
| 8 | Fresh-probes credibility tweak | (skip if time tight) | Code |

Total code work: ~65 min. Team manual: 10 min. Then backup video by 9:30 PM, rehearsals by 10:15.
