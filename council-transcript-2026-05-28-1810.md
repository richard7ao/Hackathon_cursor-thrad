# LLM Council Transcript — FairLet Hackathon Plan

**Timestamp:** 2026-05-28, ~18:10 BST (before 6:15 PM hacking start)
**Subject:** FairLet — Cursor × Thrad AdTech London Hackathon battle plan
**Method:** 5 advisors (Contrarian, First Principles, Expansionist, Outsider, Executor) → anonymized peer review → chairman synthesis

---

## 1. Original Question

The user asked: *"@brief.md read this brief and let me know how it puts out"* followed by `/llm-council`.

## 2. Mid-Council Context Updates

Two messages arrived after the advisors responded:

1. **"this is a team event we need to split front and backend for this"** — confirms 2-3 person team and explicit FE/BE separation.
2. **Pivot interest** — user listed 8 previously-winning adtech hackathon patterns (Halftime, IndigoOwl, Context Guardians, ZK Clean Rooms, dAds, Blockchain Influencer Payments, Vasilkoff, Predictive Push Recommenders) and asked whether to pivot.
3. **Sponsor visibility** — user clarified all 4 sponsors (Tavily, Overmind, Cursor, Alpic) must be visibly and well-used, with sponsor-specific judging criteria provided.

**Key observation surfaced in peer review:** FairLet's policy gate is architecturally a "Context Guardian" applied to chat instead of web/video — it already inherits the proven winning lineage without pivoting.

## 3. Framed Question (sent to advisors)

> "FairLet" is the hackathon plan for tonight's Cursor × Thrad AdTech London Hackathon (May 28, 2026). Hacking is 6:15 PM → 10:15 PM (4 hours, hard code freeze). Team size unstated (solo or up to 3).
>
> The plan: Build a conversational rental concierge with a trust-gated ad layer targeting Track 02 (Sell-Side & Measurement). User asks for rentals in chat → assistant returns mixed organic + sponsored listings → every sponsored placement passes through a policy gate that decides serve/flag/block + logs reasons → live oversight dashboard shows decisions in real time.
>
> Should they execute this plan as written tonight? What is the highest-leverage change to make in the next ~90 minutes before hacking starts at 6:15 PM, and the strongest specific risk to mitigate?

---

## 4. Advisor Responses

### The Contrarian

This plan is a beautiful trap and you're walking straight into it.

The fatal flaw: you're building a compliance demo for a sell-side track at an AdTech hackathon. The judges include the Thrad GTM lead and the Overmind founders — people whose job is to monetize and scale, not police. "Housing compliance in AI chat" is a regulatory feature, not a sell-side product. You're entering Track 02 with a Track-that-doesn't-exist solution. Re-read what sell-side means: it's about publishers/supply maximizing yield. Your gate REDUCES inventory. That's a buy-side trust play dressed in sell-side clothing.

Second fatal risk: the 4-bucket sponsor grab is the trap. Overmind + Tavily + Alpic + Cursor SDK in 4 hours is four integration surfaces, each with auth, deploy, and debugging. Real hackathon math: you'll get 2 working, fake 1, and the 4th will eat 90 minutes at 8:30 PM when you should be polishing the demo. The 40% sponsor score assumes integrations actually work on stage. They won't all work.

Third: "planted bad data" demos die when the LLM judge non-deterministically lets the "blocked" listing through on stage. You have no time to harden the policy LLM against its own stochasticity.

Highest-leverage next 90 min change: **Pivot the framing, not the build.** Same code, reposition as "Brand Safety & Yield Protection for AI Commerce" — sponsors pay MORE because their ads can't appear next to scams/illegal targeting. That's sell-side. That's revenue. That's what these judges fund.

Strongest risk to mitigate NOW: hard-code the demo's three beats. No live LLM judge on stage. Deterministic. Record a backup video by 9:30.

### The First Principles Thinker

You're asking "should we execute this plan?" The actual question is: **what does winning this hackathon require, and does the plan optimize for that?**

Strip it down. Winning = judge votes. Judge votes = a memorable demo that makes the room lean forward + sponsor checkboxes. That's it. Everything else is decoration.

Now look at FairLet through that lens. The thesis is doing real work — "housing compliance in AI chat" is a genuine wedge the judges (Downing Street fellow, VCs, Overmind founders who care about oversight) will immediately grok. The 4-sponsor grab is mathematically correct. The scripted bad-data demo is the right shape: a binary, visible, "holy shit it caught that" moment.

But you've confused **the product** with **the demo**. In 4 hours you cannot build a rental concierge. You can build a 90-second film of one. The chat UI, the 12 listings, the ranking, the attribution stretch goal — those exist to serve ONE shot: the moment "families without children" hits the screen and the gate slams shut with an Equality Act citation logged live in the Overmind trace.

That is the entire product. Everything that doesn't make that moment hit harder is overhead.

**Highest-leverage change in the next 90 minutes:** Write the demo script — verbatim, with timings — *before* writing any code. Three queries, three outcomes, dashboard reveal. ~75 seconds. Then build backwards from it. Cut anything that doesn't appear on screen.

**Strongest specific risk:** The policy-judge LLM is non-deterministic. On stage, in front of 10 Downing Street, it will hallucinate or pass the discriminatory query. **Hardcode the demo cases.** Keyword-match the planted strings, return canned verdicts, let the LLM judge run on everything else. This is not cheating. This is engineering.

### The Expansionist

Execute the plan. Then make it 3x bigger in the next 90 minutes.

You're sitting on a much larger thesis than "compliance gate for chat ads" and you're pitching it small. The real story isn't FairLet. It's **the policy layer for every AI shopping surface that's about to exist.** Housing is just the wedge — the most legally radioactive vertical, which is exactly why it's the smartest beachhead. Financial services, healthcare ads, alcohol, gambling, political — they all need this. You're not building a feature. You're building the *Stripe Radar of agentic commerce.*

Highest-leverage change before 6:15: **Rename the MCP server something category-agnostic** (e.g. `ad-policy-mcp` or `compliance-gate`) and ship it with housing as the *first registered policy pack*, with a stub second pack (financial services — "no targeting by credit score proxy") visible in the code. Cost: 20 minutes. Payoff: judges see a platform, not a demo. The 10 Downing Street fellow and the VCs will pattern-match immediately. Thrad GTM lead sees a roadmap they can sell.

Second expansion: in beat 4 of the demo, show the **counterfactual revenue** — "blocked $X, served $Y, compliance-safe yield = Z%." You just invented a metric the entire industry will need. Name it. "Trust-Adjusted CPM." Put it on the dashboard in big type.

Stretch ambition: pre-record a 15-second clip of a *second* MCP client (Claude Desktop, anything) hitting the same gate. Proves it's infrastructure, not a toy.

The risk to mitigate isn't technical. It's **pitching defensively.** Don't say "we prevent bad ads." Say "we unlock the $80B housing ad market for AI." Frame as expansion, not restriction.

### The Outsider

I don't work in adtech. I read this twice and still had to guess at half of it. That is your problem.

You have eight names in your stack — Overmind, Tavily, Cursor, Alpic, MCP, Claude, Equality Act, "policy judge" — and the demo is four minutes. A 10 Downing Street fellow and two VCs do not know what an MCP server is and do not care which sponsor wrapped which tool call. They will hear "compliance dashboard for chatbot ads" and decide in the first 30 seconds whether they get it.

The highest-leverage move in the next 90 minutes is not code. It is writing the 15-second opener and the on-screen labels. Right now your demo beat 2 says "discriminatory targeting blocked with Equality Act reason." A non-expert sees a red box and a paragraph of legalese. They need to see: **the ad the user almost saw**, then **the specific phrase that's illegal** ("families without children"), then **the law in plain English** ("UK Equality Act, Section 33 — you can't advertise housing this way"). Make the violation legible to someone's mother.

The strongest specific risk: your blocked-ad demo is the entire pitch, and you are generating the bad ad yourself. Judges will smell the planted data. Mitigate by showing the policy gate catching something you did *not* hand-craft — pull one real Facebook Marketplace listing via Tavily, run it through the gate live, let it flag a real scam pattern. One unscripted catch beats three scripted ones.

Cut the conversion attribution stretch goal. Nobody remembers beat 5.

### The Executor

Execute it. The plan has a real critical path and a working fallback. Stop debating.

Critical path tonight, in order: (1) one seeded JSON file of 12 listings with 3 planted bad rows tagged for the demo beats, (2) a single Next.js or Vite page with a chat box that calls one Claude endpoint, (3) the policy-judge function as a second Claude call returning `{decision, reasons, scores}` — same model, different system prompt, no fine-tuning, no embeddings, (4) a dashboard route that reads from an in-memory array. That's the spine. Everything else is garnish.

Highest-leverage change in the next 90 minutes, before 6:15: **pre-write the demo script and the three planted listing rows right now.** Not the code — the exact user prompts, the exact listing IDs that trip the gate, and the exact reason strings the judge should return. If you know what the screen says at minute 3 of the pitch, you build backwards to it. Teams that skip this rewrite their seed data at 9:50 PM and miss the freeze.

Strongest specific risk: **the Alpic MCP deploy.** Deploying an MCP server to a hosted platform you've never used, during a 4-hour clock, with Overmind wrapping its calls, is the single thing most likely to eat 90 minutes and break your sponsor sweep. Mitigation: stub the policy gate as a local function first, get the full demo working end-to-end by 8:30, *then* port it to MCP-on-Alpic between 8:30 and 9:15. If Alpic fights you at 9:15, you ship the local version and still have 4/4 sponsors via a credible MCP repo + Overmind on the local calls. Don't let the cleverest part of the plan kill the demo.

Parallelize: if you have 2-3 people, one owns chat+UI, one owns judge+seed data, one owns Alpic+Overmind from minute one.

---

## 5. Anonymization Mapping (for peer review)

- Response A = The Outsider
- Response B = The Executor
- Response C = The Contrarian
- Response D = The First Principles Thinker
- Response E = The Expansionist

## 6. Peer Reviews (post-context update)

### Reviewer 1
1. **Strongest: D.** Names what actually wins (judge votes = memorable demo + sponsor checkboxes), correctly identifies the load-bearing 10 seconds, gives the single highest-ROI engineering call: hardcode demo cases, let LLM run on the rest.
2. **Biggest blind spot: C.** Misreads the room — Overmind explicitly funds oversight, Downing Street fellow is more interested in compliance than yield. Smart-sounding, most wrong on judge fit.
3. **Missed by all:** Team split (Alpic-MCP risk becomes trivial with parallel ownership), who pitches, and that FairLet already inherits the Context Guardians lineage.
4. **Verdict:** (a) STAY, reframe as Context Guardian for AI chat. Inherit lineage explicitly.

### Reviewer 2
1. **Strongest: D.** Solves the on-stage non-determinism problem.
2. **Biggest blind spot: E.** "3x bigger" in a 4-hour clock is the classic killer. Right narrative, wrong build instructions.
3. **Missed by all:** Team parallelization. Also: C's reframe + E's Trust-Adjusted CPM + D's hardcoded demo are *complementary*, not competing.
4. **Verdict:** (a) STAY. Pivoting wastes sunk cost; housing/Equality Act angle too sharp to abandon. Adopt C's reframe, D's hardcoded demo, B's discipline, E's "Trust-Adjusted CPM" tagline only.

### Reviewer 3
1. **Strongest: D.** Strategy compounds harder than execution in 4-hour hackathons.
2. **Biggest blind spot: E.** Scope inflation disguised as ambition.
3. **Missed by all:** No one noticed FairLet IS a Context Guardian — that reframe moots C's track-fit critique (brand safety = yield protection).
4. **Verdict:** (a) STAY, reframe hard as "Context Guardian for AI Commerce." Pitch inherits winning lineage, dissolves C's monetization objection. Execute D's tactics, split team B's way, drop Alpic if not live by 8:30.

### Reviewer 4
1. **Strongest: D.** Assumes the right target (legible narrative), not working software.
2. **Biggest blind spot: E.** Mistakes scope for sophistication.
3. **Missed by all:** Parallelization, merge schedule, demo-recording ownership. Also: demo script IS the deliverable — lock it by 7:00 PM.
4. **Verdict:** (a) STAY. Pivot list = 90-min cold-start trap. Combine D + B + C's backup video by 9:30. Ignore E entirely.

### Reviewer 5
1. **Strongest: D.** Identifies the actual victory condition.
2. **Biggest blind spot: E.** Scope discipline IS the winning move.
3. **Missed by all:** Task-to-team mapping. With 2-3 people, binding constraint becomes coordination, not time. Trust-Adjusted CPM is the single judge-facing artifact that converts policy demo into yield story — steal that one E element.
4. **Verdict:** (a) STAY, reframe as "Context Guardian for AI Commerce Chat." Keep D's demo spine, bolt on E's Trust-Adjusted CPM, ignore E's expansion. Split: one chat+UI, one judge+seed+script, one Alpic with B's 8:30 fallback.

---

## 7. Chairman Synthesis

### Where the Council Agrees
- **STAY. Do not pivot.** All 5 reviewers and 4 of 5 advisors converge.
- **The demo IS the deliverable.** Write the script before writing code. Three beats, ~75 seconds, locked by 7:00 PM.
- **Hardcode the demo path.** Keyword-match planted listings, canned verdicts, let live LLM judge run on everything else.
- **Backup video recorded by 9:30 PM.** Non-negotiable.
- **Alpic is a fallback, not a gate.** *(NOTE: revised after sponsor-visibility requirement — see Section 8.)*
- **Make the violation legible to a non-technical judge.**
- **Cut the conversion-attribution stretch goal.**

### Where the Council Clashes
- **Track fit (Sell-Side vs. Buy-Side).** Contrarian sees regulatory feature; reviewers see brand safety = yield protection. **Resolution:** reframe the pitch, keep the code.
- **Expansionist's scope.** All 5 reviewers reject the scope expansion. **Resolution:** keep ONE artifact — the Trust-Adjusted CPM number on the dashboard.
- **Outsider's "use a real Tavily-pulled listing live."** Reintroduces non-determinism. **Resolution:** pre-pull 3 real Marketplace listings during the build, plant them, demo them as "real listings we scraped tonight."

### Blind Spots the Council Caught
- **FairLet already IS a Context Guardian** applied to chat instead of web/video. Caught by 3 reviewers independently.
- **Team event = coordination is the binding constraint**, not time.
- **Nobody named the pitcher.** Pick now.
- **Trust-Adjusted CPM** is the bridge from policy → yield narrative.

### The Recommendation
**STAY and reframe.** Execute FairLet substantially as written, with surgical changes.

**The reframe:** *"Context Guardian for AI Commerce Chat — the trust layer that lets publishers monetize agentic shopping surfaces without legal or brand risk."*

**Team split (3 people; collapse roles if 2):**
- **Person A — Frontend + Pitcher.** React/Next page, chat box, dashboard render. Owns demo script + rehearsal from 9:30. Does NOT touch infra after 9:00.
- **Person B — Backend / Policy Judge + Seed Data.** 12 listings (3 planted bad), keyword-match hardcoded verdicts, policy-judge Claude call, canned reason strings, demo script co-author.
- **Person C — Sponsor Integrations (Alpic + Overmind + Tavily + Cursor SDK).** Stubs gate as local function FIRST, pulls 3 real Marketplace listings via Tavily, ports gate to Alpic, wires Overmind tracing.

**Tactical spine:**
1. **By 7:00 PM:** Demo script locked verbatim. Seed data committed.
2. **By 8:30 PM:** End-to-end working LOCAL. Overmind tracing live.
3. **8:30–9:15 PM:** Person C ports gate to Alpic MCP. A+B start rehearsal.
4. **By 9:30 PM:** Backup video recorded against local build.
5. **9:30–10:15 PM:** Rehearse, polish, freeze.

**Cut:** Conversion attribution, Expansionist's category-agnostic rename, financial-services stub pack, second MCP client.

**Keep from Expansionist (only this):** Trust-Adjusted CPM metric on dashboard with one tagline.

**One-line pitch:** *"FairLet is the Context Guardian for AI commerce chat — we make agentic ad surfaces safe to monetize. Housing is the wedge because the UK Equality Act makes it the most legally radioactive category. Watch."*

### The One Thing to Do First
**Open a shared doc right now and write the 75-second demo script verbatim — three user prompts, three exact policy-gate verdicts, the final dashboard reveal line — and the three planted listing rows that will produce those verdicts.** Nothing else. Script + seed data locked on paper before 6:15.

---

## 8. Post-Synthesis Update: Sponsor Visibility (added after chairman delivered)

User clarified that all 4 sponsors must be visibly and well-used per published criteria. This REVISES the Alpic fallback posture: Alpic must ship, not be optional.

### Sponsor-by-sponsor production plan

**Tavily — grounding, retrieval, live data**
- Pre-pull 3 real UK rental listings during the build (Rightmove / Zoopla / Marketplace) → seed data.
- Pull live comparable-rent medians per postcode → policy gate uses this as a numeric "this listing is £400 below market" signal for the scam beat.
- Pull a real Equality Act case-law citation → shown in the BLOCK reason text.
- Visible Tavily query trace in the UI sidebar during demo.

**Overmind — real work, not a throwaway badge**
- `overmind.init()` wraps every policy-gate call.
- Live Overmind console screen-shared during the demo (split window with chat UI) so judges literally see the trace of the BLOCKED query appearing in their own product.
- Overmind in-flight supervision is the actual decision mechanism, not just observability.

**Cursor — Composer 2.5 + Cursor SDK programmatic agents**
- Entire build in Cursor (table stakes).
- One programmatic Cursor SDK sub-agent owned by Person C: the "scam-pattern detector" that the policy gate calls for the scam beat. Show the agent code in pitch.
- Drop a Composer 2.5 screenshot or 5-second clip into the pitch.

**Alpic — MCP server, live endpoint judges can trace from repo to URL**
- Policy gate deployed as MCP server on Alpic. NOT optional.
- Person C goes Alpic-first from minute 0 in parallel with local stub.
- Live endpoint URL displayed during demo. Repo → endpoint trace visible.

### Demo script sponsor-attribution overlay
Every demo beat names 1-2 sponsors visibly so judges check boxes in real time:

1. **Normal query** → Tavily-fetched comparable rent appears in sidebar; sponsored listing serves. *(Tavily + Cursor)*
2. **Discriminatory targeting BLOCKED** → Alpic MCP endpoint receives call; Overmind console pops up live showing in-flight supervision; Equality Act citation (Tavily-pulled) appears in plain English. *(Alpic + Overmind + Tavily)*
3. **Scam listing FLAGGED** → Cursor SDK scam-pattern sub-agent runs; Tavily price-comparison data shown; Alpic MCP returns FLAGGED; Overmind traces decision. *(All four sponsors fire in this beat.)*
4. **Dashboard reveal** → "Trust-Adjusted CPM" metric; "all decisions traceable in Overmind console at console.overmindlab.ai"; Alpic endpoint URL clickable.

---

**Files produced this session:**
- `/Users/richardlao/Documents/Github/Personal/Hackathons/Hackathon_cursor-thrad/council-transcript-2026-05-28-1810.md` (this file)
- `/Users/richardlao/Documents/Github/Personal/Hackathons/Hackathon_cursor-thrad/council-report-2026-05-28-1810.html` (visual report)
