# FairLet — Cursor × Thrad AdTech Hackathon Battle Plan

**Event:** Cursor AdTech London Hackathon — Halkin Office, 1–2 Paris Garden, London
**Date:** Thursday, 28 May 2026 · Hacking 6:15 PM → Code freeze 10:15 PM (~4 hrs)
**Team size:** Solo or up to 3
**Goal:** Win. (Top 3 = Cursor Ultra + Thrad credits + swag; 4th/5th = Thrad credits)

---

## The Idea: FairLet

A **conversational rental concierge with a trust-gated ad layer.**

A renter says: *"2-bed under £2k near London Bridge, pet-friendly."* The assistant returns
matching listings — a mix of organic results and **native sponsored placements** (promoted
listings + adjacent services: renters insurance, movers, broadband). But every paid placement
passes through a **supervision gate** before it's shown. The gate decides **serve / flag / block**
and logs *why*. A live oversight panel shows the decisions in real time — that panel is the money shot.

### Why this wins
Housing is the most legally constrained category in all of advertising. You can't target housing
ads by protected characteristics (UK Equality Act 2010: race, sex, disability, religion,
pregnancy/family status, sexual orientation, etc.). AdTech has been burned on exactly this — Meta
had to gut its housing ad-targeting after a US DOJ fair-housing settlement. As ads move into AI
chat, **nobody is enforcing housing compliance there yet.** FairLet builds the layer that does, which
is a direct, concrete answer to the hackathon's headline question: *"What does trustworthy AI-native
advertising look like?"*

It also sits dead-center between the judges: Overmind (supervision/oversight) + Thrad (in-chat
monetization) + 10 Downing Street (AI governance) + VCs ("is this real?"). It turns the two usually-
weakest rubric lines — Safety & oversight and Real-world applicability — into the strongest.

---

## Track Decision: TRACK 02 — Sell-Side & Measurement

FairLet maps almost line-for-line to Track 02, which asks for agents that **score prompt-level
intent**, **gate ad eligibility**, and answer *"when is intent strong enough to monetize, and which
conversions need a human-confirmed audit?"* That **is** FairLet's trust gate. The renter concierge is
the AI *publisher*; the compliance/oversight layer is the *sell-side governance*.

**Why not Track 01 (Buy-Side):** buy-side is auto-bidding, budget pacing, creative rotation — heavier
on agent autonomy, but the trust story becomes a bolt-on rather than the spine, the user (a letting
agent) is less sympathetic on stage than a renter, and you'd have to simulate an auction — the hardest
thing to make convincing in four hours.

---

## Scoring Math (the part that shapes the build)

Max score is **10**. There are **four sponsor buckets** worth up to a point each. So almost certainly:

> **6 rubric points + 4 sponsor-bucket points = 10**

**40% of the score is tool integration.** You must architect to grab all four buckets:

| Bucket | How FairLet grabs it |
|---|---|
| **Overmind** | The policy/supervision gate. Trace the agent's calls; run in-flight pass/flag/block. Two judges built this — do it properly, no throwaway badge. |
| **Tavily** | Ground listings and comparable-rent data in live web results so it's not fully mocked. |
| **Cursor** | Build in it. Show Composer 2.5 + ideally one programmatic Cursor SDK agent (e.g. the creative/scam-check sub-agent). |
| **Alpic** | **Design around this.** Alpic hosts/deploys/routes MCP servers. Ship the compliance gate as an **MCP server deployed live on Alpic** — any agent calls `check_placement()` → serve/flag/block + reasons. Grabs the point, reinforces "we built infrastructure," and lets Overmind wrap the MCP tool calls naturally. Judges can trace repo → live endpoint. |

**Note on Thrad:** it's the host and framing, NOT a bonus bucket. There's no "Thrad point" to chase, but
serving placements in Thrad's native format still feeds Real-world applicability + Product thinking and
keeps the Thrad judge happy. Don't over-invest there — invest in the four that score.

---

## Architecture

```
Renter chat (React UI)
      │
      ▼
Concierge agent ──► Tavily (ground listings / market rents)
      │
      ▼
MCP compliance gate  ◄── deployed on ALPIC (live endpoint)
  check_placement() → { decision: serve|flag|block, reasons[], scores{} }
      │
      ▼
OVERMIND supervision (traces calls, in-flight pass/flag/block)
      │
      ▼
Served / Blocked placements  +  live Oversight Dashboard  +  attribution thread
```

**Stack:** React chat UI · seeded JSON of ~12 listings (3–4 sponsored, 2 planted "bad") · one LLM call
for assistant response/ranking · a second structured LLM call as the *policy judge* returning
`{decision, reasons, scores}` per candidate ad · Claude API for both · Tavily for grounding · gate
exposed as MCP server on Alpic · Overmind tracing/supervision.

---

## The Demo (scripted — this is what wins)

Plant the "bad" listings and the bad targeting config in seed data ahead of time so beats 2–3 fire
reliably on stage.

1. **Normal query** → a clearly-labelled sponsored listing is served. *Monetization works.*
2. **Discriminatory targeting** — an advertiser config tries to target "families without children" (or
   the model drifts) → **BLOCKED**, with an Equality Act reason. *Oversight works.*
3. **Scam listing** — too-cheap, "wire the deposit off-platform" → **FLAGGED / BLOCKED.** *Tenant protection.*
4. **Dashboard tally** — served / flagged / blocked + revenue. *It's infrastructure, not a toy.*
5. **(Stretch) Attribution** — chat → click → conversion on a sponsored listing, covering the
   "Measurement" half of Track 02.

---

## Time-Box (6:15 PM – 10:15 PM)

| Time | Task |
|---|---|
| 6:15–6:45 | Scaffold UI, seed listings (incl. planted bad ones), API keys wired |
| 6:45–7:45 | Assistant loop: prefs → ranked listing cards (pizza ~7) |
| 7:45–9:00 | Policy gate: per-ad evaluation, serve/flag/block + reasons; deploy as MCP server on Alpic; Overmind tracing in |
| 9:00–9:45 | Oversight dashboard + all 3 demo beats working end-to-end |
| 9:45–10:15 | Polish, Tavily grounding, attribution stretch if time, rehearse the 2-min pitch, FREEZE |

**Lean fallback if time is tight:** build just the ranking + policy gate (skip full concierge chrome) —
same winning beats, less surface area.

---

## Rubric Coverage (6 dimensions)

- **Technical execution** — real policy engine + LLM ranking + live MCP server.
- **Product thinking** — vertical with genuine stakes, clear user.
- **Agent autonomy** — assistant autonomously matches, ranks, monetizes.
- **UX clarity** — clean chat + transparent oversight panel.
- **Real-world applicability** — housing ad compliance is a live legal problem.
- **Safety & oversight design** — the entire spine of the product.

---

## Judges (build for the room)

- **Pritam Soni** — Founding Engineer, Overmind (supervision/oversight)
- **Rohit Gupta** — Founding Engineer, Overmind (supervision/oversight)
- **Giorgio Toledo** — Lead GTM, Thrad (conversational ads / monetization)
- **David Gelberg** — AI Innovation Fellow, 10 Downing Street (governance / trust)
- **John Sergeant** — Founder & GP, Strand Ventures (market / real-world)
- **Umberto Belluzzo** — Investor, Earlybird Ventures (market / real-world)
- **Will Lewis** — Founder & CTO, Duku AI

---

## Sponsor Tool Reference

- **Thrad** — AI-native ad infrastructure for LLM chats. Real-time prompt-intent analysis → serves
  native answers / recommendation / CTA units matched to the conversation. SDK + REST API; grab keys
  from the thrad.ai Discord channel on the night. Mimic the format if the API is flaky.
- **Overmind** — supervision/observability for agentic AI. SDK does in-flight action checks
  (pass/flag/stop) + tracing + prompt/model optimization. `overmind.init()`. Console at
  console.overmindlab.ai.
- **Tavily** — search/research API built for agents: grounding, retrieval, live data.
- **Cursor** — build here. Composer 2.5 + Cursor SDK for programmatic agents.
- **Alpic** — host / deploy / route MCP servers and agent tools; repo → live endpoint.

---

## Prizes

| Place | Reward |
|---|---|
| 1st | 6 mo Cursor Ultra · $7,000 Thrad credits · hoodie & cap |
| 2nd | 4 mo Cursor Ultra · $3,000 Thrad credits · hoodie & cap |
| 3rd | 2 mo Cursor Ultra · $1,000 Thrad credits · hoodie & cap |
| 4th | $750 Thrad credits |
| 5th | $500 Thrad credits |

---

**One-line pitch:** *FairLet is the trust layer for conversational rental ads — an Alpic-hosted MCP
compliance gate, supervised by Overmind, grounded by Tavily, built in Cursor, that decides when an
AI publisher can monetize a rental conversation without breaking housing law.*