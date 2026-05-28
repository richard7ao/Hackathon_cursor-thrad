# FairLet

**The policy-gate-plus-continuous-audit MCP server that lets AI publishers monetise chat-based ad placements without breaking UK housing law.**

[![Live](https://img.shields.io/badge/MCP-live-c0392b)](https://fairlet-7af52db6.alpic.live) [![Playground](https://img.shields.io/badge/playground-open-2d6a4f)](https://fairlet-7af52db6.alpic.live/try) [![Track](https://img.shields.io/badge/Track%2002-Sell--Side%20%26%20Measurement-8860b) ](#) [![Tests](https://img.shields.io/badge/tests-58%20passing-2d6a4f)](#testing)

---

## Why this exists

In 2022, Meta paid $115m to settle a US Department of Justice case for letting advertisers target housing ads by protected characteristics. The UK Equality Act 2010 applies the same constraint to UK housing inventory — but as advertising moves into conversational AI surfaces (ChatGPT, Claude, Thrad-powered apps, agentic shopping assistants), **nobody is enforcing housing-ad compliance at the LLM layer.**

FairLet is the layer that does. Every sponsored placement an AI publisher serves passes through the gate; every gate decision is auditable; the audit produces a *Publisher Trust Score* advertisers can verify before they bid. AI publishers monetise inventory advertisers can trust; advertisers get verifiable brand safety; renters never see discriminatory or fraudulent placements.

| Track 02 pillar | What FairLet ships |
|---|---|
| **Sell-side** — gate ad eligibility, flag suspicious traffic | Policy gate (`serve` / `flag` / `block`) with UK Equality Act, scam-pattern, and brand-safety enforcement |
| **Measurement** — prove ROI to advertisers | Continuous compliance audit + Publisher Trust Score + Trust-Adjusted CPM dashboard |

Housing is the wedge because the law is sharpest there. The gate architecture is category-agnostic — healthcare, financial services, gambling, alcohol, political — same enforcement spine.

---

## Live endpoints

| Surface | URL |
|---|---|
| **MCP server** (production, judges hit this) | `https://fairlet-7af52db6.alpic.live` |
| **Playground** (chat with the server) | `https://fairlet-7af52db6.alpic.live/try` |
| **Local DevTools** (the editorial views — `yarn dev` then) | `http://localhost:3000/` |

---

## What it does — five MCP tools

```
                              ┌──────────────────────────────────────┐
                              │   checkPlacement() — the policy gate │
                              │   ┌────────────────────────────────┐ │
                              │   │ probe shortcut → AUDIT_PROBES  │ │
                              │   │ targetingExclude → protected   │ │
                              │   │ listingId → scam + price devn  │ │
                              │   │ attackPayload → 7 patterns     │ │
                              │   │ url → Tavily extract + scan    │ │
                              │   └─────┬──────────────────────────┘ │
                              │         │ every decision             │
                              │         ▼                            │
                              │   Overmind trace (OTLP)              │
                              └────────────▲─────────────────────────┘
                                           │
   ┌───────────────┬───────────────────────┼───────────────────────┬───────────────────┐
   │               │                       │                       │                   │
┌──┴──────────┐ ┌──┴───────────────┐ ┌─────┴────────────┐ ┌────────┴───────────┐ ┌─────┴──────────┐
│ run-audit   │ │ generate-fresh-  │ │ check-placement  │ │ search-rentals     │ │ show-dashboard │
│             │ │ probes           │ │                  │ │                    │ │                │
│ 10-probe    │ │ Claude live      │ │ url|listingId|   │ │ canonical → seed   │ │ Publisher      │
│ compliance  │ │ generates 3      │ │ advertiserConfig │ │ off-script →       │ │ Trust Score    │
│ audit       │ │ probes, runs     │ │ |probeId         │ │ Claude live        │ │ +              │
│             │ │ each through     │ │                  │ │ + Tavily URLs      │ │ Trust-Adjusted │
│             │ │ the gate         │ │                  │ │                    │ │ CPM            │
└──────┬──────┘ └────────┬─────────┘ └────────┬─────────┘ └──────────┬─────────┘ └────────┬───────┘
       ▼                 ▼                    ▼                      ▼                    ▼
 audit-panel       fresh-probes         placement-              rental-results        dashboard
   view              view                decision                 view                  view
                                          view
```

| Tool | Input | Behaviour | View |
|---|---|---|---|
| **`run-audit`** | — | Cursor SDK-style programmatic agent fires 10 probes (5 protected characteristics + fraud + brand-safety + security + GDPR + quality) at the policy gate. Returns a Publisher Trust Score and per-probe traces. | `audit-panel` |
| **`search-rentals`** | `query: string` | Canonical London Bridge / SE1 queries hit the seeded inventory deterministically. Anywhere else (Leyton, Hackney, Brixton…) is synthesised live by Claude with realistic addresses, postcodes, and per-listing Zoopla URLs grounded via Tavily. | `rental-results` |
| **`check-placement`** | one of `url` ╲ `listingId` ╲ `advertiserConfig` ╲ `probeId` | The gate exposed directly. `url` runs Tavily extract → scan; `advertiserConfig` enforces protected-characteristic targeting; reputable-publisher fallback when Tavily can't scrape. | `placement-decision` |
| **`generate-fresh-probes`** | `count = 3` | Claude generates 3 fresh adversarial probes (different every run), gate evaluates each, view shows verdict with statutory citation. The Q&A defence against "is the audit hardcoded?" | `fresh-probes` |
| **`show-dashboard`** | — | Two-metric publisher dashboard: Publisher Trust Score (measurement) and Trust-Adjusted CPM (sell-side yield), plus served / flagged / blocked counters. | `dashboard` |

---

## Quick start

### Prerequisites

- Node.js ≥ 24.14.1
- Yarn 1.x or pnpm
- API keys for: Tavily, Anthropic, Overmind, Alpic (see `.env.example` for grab-from-Discord instructions)

### Local development

```bash
cd my-app
cp .env.example .env       # fill in the four API keys
yarn install
yarn dev                   # Skybridge DevTools at http://localhost:3000
```

### Test suite

```bash
yarn test                  # 49 vitest unit + integration tests
yarn smoke                 # 9 end-to-end HTTP probes against the running server
```

### Deploy to Alpic

```bash
yarn deploy                # alpic deploy — pushes to the configured project
```

Environment variables are managed on Alpic via `alpic environment-variable add --env-file .env --environment-id <env_id>`. The deploy bundles the Skybridge build output and routes the MCP transport.

---

## Project structure

```
my-app/
├── src/
│   ├── server.ts                  # MCP server + 5 registered tools
│   ├── helpers.ts                 # Typed Skybridge hooks (useToolInfo, useCallTool)
│   ├── data/
│   │   ├── types.ts               # Listing, AuditProbe, PlacementResult
│   │   ├── listings.ts            # 12 seeded UK rentals + Zoopla URL helper
│   │   └── audit-probes.ts        # 10 hardcoded probes for the audit beat
│   ├── lib/
│   │   ├── policy-gate.ts         # checkPlacement() + checkPlacementWithUrl()
│   │   ├── audit-agent.ts         # runAudit() — Cursor SDK programmatic agent
│   │   ├── claude.ts              # generateFreshProbes() + generateListings()
│   │   ├── tavily.ts              # tavilySearch() + tavilyExtract()
│   │   ├── dashboard.ts           # computeDashboard()
│   │   └── overmind.ts            # OpenTelemetry → Overmind OTLP exporter
│   ├── views/                     # 5 React views (editorial almanac style)
│   │   ├── audit-panel.tsx
│   │   ├── rental-results.tsx
│   │   ├── placement-decision.tsx
│   │   ├── fresh-probes.tsx
│   │   └── dashboard.tsx
│   └── index.css                  # Tokens: paper, ink, crimson; serif scale
├── tests/                         # vitest — 49 cases across 5 files
├── scripts/smoke.ts               # tsx-runnable end-to-end probe script
├── alpic.json                     # Alpic deployment config
└── package.json
```

---

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| **MCP framework** | [Skybridge](https://docs.skybridge.tech) | First-class MCP server + view rendering, ships native Alpic deployment |
| **Runtime** | Node 24, ESM, TypeScript 6 | Modern, type-safe, future-proof |
| **Bundler** | Vite 8 + `@vitejs/plugin-react` | Fast dev server + view bundling |
| **UI** | React 19 + Tailwind v4 + Fraunces / Inter / JetBrains Mono | Editorial typography, OKLCH palette, dot-grid background |
| **Observability** | `@opentelemetry/sdk-node` + `@opentelemetry/exporter-trace-otlp-proto` | Spans exported to Overmind OTLP endpoint with `X-API-TOKEN` auth |
| **Grounding** | Tavily search + Tavily extract | Live UK web data, real listing URLs, content scraping for URL audits |
| **LLM** | Anthropic Claude (Opus 4.7) via REST | Off-script rental synthesis + fresh-probe generation |
| **Validation** | Zod | Tool input schemas |
| **Tests** | Vitest (unit + integration) + custom HTTP smoke script | 58 cases total |

---

## API reference (selected)

### `check-placement`

The gate, callable directly. Pass exactly one of:

```typescript
// Audit a real listing URL — Tavily extracts the page, the gate scans content.
await client.callTool("check-placement", {
  url: "https://www.zoopla.co.uk/to-rent/details/73297730/",
});

// Test an advertiser-targeting config for protected-characteristic exclusion.
await client.callTool("check-placement", {
  advertiserConfig: {
    advertiserName: "Pemberton & Co",
    targetingExclude: ["families_with_children"], // → BLOCK + Equality Act s.33
  },
});

// Inspect a seeded listing.
await client.callTool("check-placement", { listingId: "L-012" });

// Run a specific audit probe by ID.
await client.callTool("check-placement", { probeId: 10 });
```

Returns:

```typescript
{
  decision: "serve" | "flag" | "block",
  reasons: string[],
  citation?: string,           // e.g. "Equality Act 2010, s.33"
  citationFull?: string,
  scores: {
    discrimination: number,    // 0-1
    fraud: number,
    brandSafety: number,
    quality: number,
  },
  forfeitedRevenueGBP?: number,
  scrape?: {                   // present when input.url was used
    scrapedFromUrl: string,
    scrapedAtISO: string,
    detectedPostcodeArea?: string,
    detectedPriceGBP?: number,
    scrapeErrorReason?: string,
  },
}
```

---

## Security & compliance

| Concern | Implementation |
|---|---|
| Statutory enforcement | UK Equality Act 2010 (ss. 5, 6, 9, 10, 12, 13, 33), UK GDPR Art. 7, ASA CAP Code, Tenant Fees Act 2019 |
| Secret management | Server-side env vars only; never exposed to view CSP; injected via Alpic `environment-variable add` |
| Trace authentication | Overmind OTLP exporter signs with `X-API-TOKEN`; never logged |
| LLM determinism on stage | Demo probes are keyword-matched to canned verdicts; live LLM fires on Q&A and the Generate Fresh Probes button |
| Anti-bot fallback | Tavily extract failures on reputable publisher domains (Zoopla / Rightmove / OpenRent etc.) return SERVE with explicit caveat rather than embarrassing FLAGs |
| Honest provenance | Synthetic seed data is labelled as such — no "Tavily-scraped" fibs |

---

## Testing

```bash
yarn test              # 49 vitest cases (unit + lib integration)
yarn test:watch        # iterative
yarn test:integration  # the full-flow demo sweep
yarn smoke             # 9 HTTP probes against the running MCP server
```

The smoke script can target a deployed Alpic URL:

```bash
FAIRLET_MCP_URL=https://fairlet-7af52db6.alpic.live/mcp yarn smoke
```

---

## Deployment

The Skybridge build produces a Node MCP server bundle. Alpic deploys it as a managed MCP host. See [`docs.alpic.ai`](https://docs.alpic.ai).

```bash
ALPIC_API_KEY=… yarn deploy --project-name fairlet
```

The Alpic CLI prints a deployment URL on success. To verify:

```bash
curl https://<deploy>.alpic.live/                            # SSE handshake
open  https://<deploy>.alpic.live/try                        # playground UI
yarn smoke FAIRLET_MCP_URL=https://<deploy>.alpic.live/mcp   # 9 invariants
```

---

## Roadmap

| Surface | Status |
|---|---|
| UK Equality Act + GDPR + ASA enforcement | ✅ shipped |
| Tavily-grounded listings + URL audit | ✅ shipped |
| Continuous compliance audit + Publisher Trust Score | ✅ shipped |
| Trust-Adjusted CPM dashboard | ✅ shipped (illustrative multiplier — pending real auction data) |
| Overmind OTLP tracing | ✅ shipped |
| Multiple jurisdictions (US Fair Housing Act, EU AI Act, AU NCC) | ⏳ next |
| Live counter aggregation across deploys | ⏳ next |
| Publisher SLA dashboard (% inventory served, mean time to block) | ⏳ next |
| Adversarial probe library expansion (currently 10 hardcoded + Claude-generated) | ⏳ ongoing |

---

## Acknowledgements

Built at the **Cursor × Thrad AdTech London Hackathon**, May 28 2026, Halkin Office, London.

- **[Cursor](https://cursor.com)** — Composer 2.5 + Cursor SDK for the audit agent and scam-detector sub-agent
- **[Thrad](https://thrad.ai)** — conversational AI ad infrastructure framing the use case
- **[Alpic](https://alpic.ai)** — MCP hosting + Skybridge framework + the `.alpic.live` runtime
- **[Overmind Labs](https://overmindlab.ai)** — supervision and observability
- **[Tavily](https://tavily.com)** — live web grounding + URL extraction

Judges: Pritam Soni, Rohit Gupta (Overmind), Giorgio Toledo (Thrad GTM), David Gelberg (10 Downing Street AI Innovation Fellow), John Sergeant (Strand Ventures), Umberto Belluzzo (Earlybird Ventures), Will Lewis (Duku AI).

---

## License

Proprietary, built for hackathon submission. Sponsor-licensed components (Tavily, Anthropic, Overmind, Alpic) retain their respective terms.
