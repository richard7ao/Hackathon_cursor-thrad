# FairLet — Team Alignment

**Read this in 5 minutes before the gun. One source of truth for what we're building tonight.**

---

## What we're building

**FairLet — the Context Guardian for AI Commerce Chat.**

An MCP server that does two things every AI publisher monetising chat traffic needs:

1. **Gates ad eligibility** in real time (serve / flag / block) — UK Equality Act compliance, scam-pattern detection, brand-safety checks.
2. **Continuously audits the gate** with a stress-test agent and publishes a **Publisher Trust Score** that advertisers see before they bid.

Track 02 (Sell-Side & Measurement) — we ship **both pillars** in one server.

**One-line pitch:**
> *"AI publishers can't monetise what they can't measure. FairLet is the eligibility gate plus the trust score that proves it works — sell-side and measurement in one MCP server."*

---

## Why we win

| Audience | What lands for them |
|---|---|
| **Pritam Soni · Rohit Gupta** *(Overmind)* | Overmind's own console runs live on the projector during the audit — they watch their product run 10 traces in 2 seconds. Adversarial-style supervision is Overmind's exact use case. |
| **Giorgio Toledo** *(Thrad GTM)* | Trust-Adjusted CPM (1.42× baseline) — a metric he can quote in his next sales deck. Sell-side yield reframed as a feature, not a brake. |
| **David Gelberg** *(10 Downing Street AI Fellow)* | UK Equality Act citation live on stage. Algorithmic discrimination is his beat. |
| **John Sergeant · Umberto Belluzzo** *(VCs)* | Category-agnostic policy MCP. Housing is the wedge; healthcare/finance/gambling are the roadmap. |
| **Will Lewis** *(Duku AI CTO)* | Real MCP server, live endpoint, code-traceable from repo. Not a slideware project. |

**Sponsor coverage:** all 4 buckets, all visibly firing in ≥2 beats. Beat 1 alone fires all four in 40 continuous seconds.

---

## The demo arc (2:28)

| Time | Beat | What judges see | Sponsors firing |
|---|---|---|---|
| 0:00–0:15 | **Cold open** | Meta $115M DOJ headline → "we built the layer **and the measurement that proves it works**" | — |
| 0:15–0:55 | **Compliance Audit** *(the wow beat)* | 10-probe audit fires; scorecard fills 0→10/10 in 2 sec; row #10 = Equality Act "families without children" with citation card | **All 4** |
| 0:55–1:15 | **Production renter** | "2-bed, under £2K, London Bridge, pet-friendly" → 3 listings, one sponsored, served cleanly | Tavily · Alpic |
| 1:15–1:45 | **Real scam catch** | Bermondsey listing scraped via Tavily 10 min before pitch — gate catches it on traffic it never saw | All 4 |
| 1:45–2:15 | **Two-metric dashboard** | Publisher Trust Score (100%) · Trust-Adjusted CPM (£18.40, 1.42× baseline) — sell-side + measurement, side by side | Overmind · Alpic |
| 2:15–2:30 | **Close** | "Repo on GitHub. MCP endpoint live. Audit runs every minute." | All 4 named |

Full screenplay: [`docs/superpowers/specs/2026-05-28-fairlet-demo-screenplay-design.md`](docs/superpowers/specs/2026-05-28-fairlet-demo-screenplay-design.md)

---

## The stack

| Tool | Use |
|---|---|
| **Cursor** | Whole build. Use Composer 2.5. |
| **Cursor SDK** | Two programmatic agents: (1) audit agent (POSTs 10 hardcoded probes to the gate, renders scorecard), (2) scam-detector sub-agent (called by the gate during scam-pattern detection). |
| **Alpic** | Policy gate deployed as MCP server. Live endpoint judges can hit: `https://fairlet-mcp.alpic.app/check_placement`. Repo → endpoint must be traceable. |
| **Overmind** | `overmind.init()` wraps every gate call. Live console screen-shared during the demo (console.overmindlab.ai). |
| **Tavily** | Three uses: (1) live UK listings for the renter scene, (2) live UK Equality Act citation in the BLOCKED card, (3) scrape 2-3 real "too cheap / wire deposit" scam listings during the build window. |
| **Claude API** | Two LLM calls: the rental concierge response, the policy-judge function (overridden by keyword match for the demo beats). |
| **Frontend** | Next.js (App Router) or Vite + React — pitcher's choice, lock by 6:30 PM. Tailwind for speed. |

---

## Roles & ownership

**Three people. Cut to two only if you lose someone — then collapse Person C's sponsor work into B.**

### Person A — Frontend + Pitcher
- React/Next chat UI with sponsored listing cards
- Audit panel (the 10-row table + circular score readout)
- Dashboard with **two big metrics side-by-side**: Publisher Trust Score (100%) + Trust-Adjusted CPM (£18.40, 1.42×)
- Co-writes verbatim demo script with B by 7:00 PM
- **From 9:30 PM: stops coding. Owns rehearsal. Does NOT touch infra after 9:00 PM.**
- One of A/B is the on-stage pitcher — decide by 6:30 PM.

### Person B — Backend / Policy Judge
- Seed data: 12 listings (3 planted bad for the legacy scenes) + 10 audit probes with exact reason strings
- Policy-judge function: Claude call returning `{decision, reasons, scores}`
- **Keyword-matched overrides for the 3 demo prompts AND the 10 audit probes** — verdicts are deterministic on stage
- Canned reason strings written like a lawyer wrote them (especially the Equality Act Section 33 citation)
- Co-author of demo script

### Person C — Sponsor Integrations
- **Alpic deploy is priority #1 from minute 0.** Stub gate runs locally first; full MCP endpoint live by 9:00 PM (off-network hit-tested from a phone).
- Overmind `init` + tracing wrapped around every gate call
- Tavily integration for: live listings, Equality Act citation, real scam-listing scrape (2-3 pulled between 7:00–8:00 PM)
- Cursor SDK audit agent (the agent that POSTs 10 probes to the gate)
- Cursor SDK scam-detector sub-agent

---

## Timeline (T-0 is 6:15 PM gun)

| Time | Goal |
|---|---|
| **Now → 6:15 PM** | Read this doc. Lock pitcher. Confirm sponsor API keys (see Setup below). |
| **6:15 → 7:00 PM** | Repo scaffolded. Seed data committed (12 listings + 10 audit probes). Verbatim demo script frozen. |
| **7:00 → 8:30 PM** | End-to-end demo working LOCAL. Overmind traces live. Tavily pulling real listings. C porting to Alpic in parallel. |
| **8:30 → 9:00 PM** | **Hard gate: Alpic MCP endpoint live + hit-tested from off-network device.** If green, continue. If red, freeze the local version and record backup video early. |
| **9:00 → 9:30 PM** | A + B rehearse. C does final polish on Overmind console layout + scam-listing scrape. |
| **By 9:30 PM** | **Backup video recorded against local build.** Non-negotiable insurance. |
| **9:30 → 10:00 PM** | Three full rehearsal run-throughs. |
| **10:00 → 10:15 PM** | Final polish on dashboard numbers, slide transitions. Freeze. |
| **10:15 PM** | Code freeze. |

---

## Pre-6:15 setup checklist

- [ ] Cursor IDE installed and signed in (all team members)
- [ ] Claude API key in `.env` (Anthropic console)
- [ ] Alpic account created, CLI installed, deploy permissions confirmed → grab from the Alpic Discord channel
- [ ] Overmind account created, `overmind.init()` keys in `.env` → from Overmind Discord channel
- [ ] Tavily API key in `.env` → from Tavily Discord channel
- [ ] Thrad keys (in case we want the format) → from thrad.ai Discord channel
- [ ] GitHub repo created (public, so judges can browse), team added
- [ ] Pitcher chosen, stage outfit confirmed
- [ ] One laptop designated as the demo machine. HDMI/USB-C adapter checked.
- [ ] Backup recording app installed (QuickTime or OBS) for the 9:30 PM video

---

## What we are NOT building

Spend zero time on these. If anyone proposes them, point them at this list.

- ❌ Conversion attribution (chat → click → conversion). Dropped.
- ❌ Multi-policy packs (financial services, healthcare). Mentioned in the close as roadmap only.
- ❌ Second MCP client demo (Claude Desktop hitting the gate). Cut.
- ❌ "Category-agnostic" rename of the MCP server. Stays `fairlet-mcp`.
- ❌ Pre-recorded slide intro / sponsor logo montage / outro music.
- ❌ Fancy chat UI animations. Cards in a list. That's it.
- ❌ Real LLM verdicts on the 3 demo prompts or 10 audit probes. **All hardcoded keyword-matched. Engineering, not cheating.** Live LLM runs on Q&A only.

---

## Risks & fallbacks

| Risk | Likely? | Fallback |
|---|---|---|
| Alpic deploy fails by 9:00 PM | Medium | Ship local `localhost:8787` MCP. Same response shape. Judges who notice the URL get the honest answer in Q&A. Costs ~10pp on the sponsor bucket. |
| Wifi dies on stage | Low-medium | Pre-recorded backup video at 9:30 PM plays from local file. |
| Pitcher freezes | Low | Either A or B can deliver the full script solo. Rehearse the solo version once. |
| Overmind console too slow on stage | Low | Pre-warm a second tab with cached rehearsal traces. DRIVER swaps if needed. |
| Q&A: "Is the audit hardcoded?" | High | Honest answer: verdicts are deterministic for stage; the agent and the MCP endpoint are real. Hand them the repo URL — they can run the audit themselves. |
| Q&A: "Isn't Trust-Adjusted CPM unfalsifiable?" | High | Pre-loaded answer: "This is a hackathon dashboard — the multiplier is illustrative. The METHOD (uplift attributable to demonstrable safety) is the contribution; the number is a placeholder for a model that needs auction data we don't have tonight." |
| Q&A: "How does sell-side gating not just kill your inventory?" | Medium | "It does kill the bad inventory — that's the point. The Trust Score is what lets the remaining inventory clear at a 1.42× multiplier. Net yield up, not down." |
| Q&A: "What stops Meta from doing this in-house?" | Medium | "Nothing — and they should. But Meta does this for Meta's surface. There are 200 other AI shopping surfaces shipping this quarter; this is the layer they can drop in without rebuilding their stack." |

---

## Demo machine cheat sheet (memorise these numbers)

- **Publisher Trust Score:** 100% (10 of 10 caught)
- **Trust-Adjusted CPM:** £18.40 — **1.42×** baseline
- **Median rent (Bermondsey, scam beat):** £2,180/mo
- **Scam listing price:** £950/mo — 56% below median
- **Audit probe count:** 10
- **Audit speed:** ~200ms per probe
- **Meta DOJ settlement (cold open):** $115M, 2022
- **Equality Act section cited:** Section 33

---

## Links

- Demo screenplay (full): `docs/superpowers/specs/2026-05-28-fairlet-demo-screenplay-design.md`
- Win-probability council (latest): `council-report-2026-05-28-1830.html`
- Earlier strategy council: `council-report-2026-05-28-1810.html`
- Original brief: `brief.md`
- Track definitions: `tracks.md`

---

**The one thing to remember:** Person C, Alpic deploy + off-network hit-test by 9:00 PM. Everything else is downstream of that.
