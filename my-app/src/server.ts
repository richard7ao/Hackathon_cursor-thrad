import "dotenv/config";

import { McpServer } from "skybridge/server";
import { z } from "zod";

import { initOvermind } from "./lib/overmind.js";
initOvermind();

import { AUDIT_PROBES } from "./data/audit-probes.js";
import {
  POSTCODE_MEDIAN_GBP,
  getListing,
  searchListings,
} from "./data/listings.js";
import { runAudit } from "./lib/audit-agent.js";
import { generateFreshProbes, generateListings } from "./lib/claude.js";
import { computeDashboard } from "./lib/dashboard.js";
import { checkPlacement, checkPlacementWithUrl } from "./lib/policy-gate.js";
import { tavilySearch } from "./lib/tavily.js";

const CSP_BASE = {
  resourceDomains: [
    "https://fonts.googleapis.com",
    "https://fonts.gstatic.com",
  ],
  redirectDomains: [
    "https://docs.skybridge.tech",
    "https://www.legislation.gov.uk",
    "https://console.overmindlab.ai",
  ],
};

const VIEW_DOMAIN =
  process.env.FAIRLET_VIEW_DOMAIN ?? "https://fairlet.local";

const server = new McpServer(
  {
    name: "fairlet",
    version: "0.1.0",
  },
  { capabilities: {} },
)
  // ────────────────────────────────────────────────────────────────────
  // search-rentals — Beat 2 of the demo. Returns 3 listings (one sponsored)
  // ────────────────────────────────────────────────────────────────────
  .registerTool(
    {
      name: "search-rentals",
      description:
        "Search UK rental listings with policy-gated sponsored placements. " +
        "Returns 3 listings plus a sponsored placement card that has passed the FairLet policy gate. " +
        "Canonical demo queries about London Bridge / SE1 hit the seeded inventory deterministically; " +
        "any other UK area (Leyton, Hackney, Brixton, Camden, anywhere) is synthesised live by Claude with realistic addresses, postcodes, and Zoopla source URLs. " +
        "Use this when the renter asks about UK rentals, flats, properties, or asks to see listings.",
      inputSchema: {
        query: z
          .string()
          .describe(
            "Natural-language rental query, e.g. '2-bed under £2k near London Bridge, pet-friendly'.",
          ),
      },
      annotations: {
        title: "Search rentals",
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: true,
      },
      _meta: {
        "openai/toolInvocation/invoking": "Searching rentals via FairLet…",
        "openai/toolInvocation/invoked": "Listings ready.",
      },
      view: {
        component: "rental-results",
        domain: VIEW_DOMAIN,
        description: "Rental results with policy-gated sponsored cards.",
        csp: CSP_BASE,
      },
    },
    async ({ query }) => {
      // 1. Try the canonical demo inventory (London Bridge / SE1) — deterministic.
      const seedListings = searchListings(query);

      // 2. Off-script? Let Claude synthesise listings keyed to the actual query.
      let listings = seedListings;
      let postcodeArea =
        seedListings[0]?.postcode.split(" ")[0] ?? "SE1";
      let medianRentGBP = POSTCODE_MEDIAN_GBP[postcodeArea] ?? 2000;
      let generatedBy: "seed" | "claude" | "fallback" = "seed";
      let generationError: string | undefined;

      if (seedListings.length === 0) {
        const generated = await generateListings(query);
        listings = generated.listings;
        postcodeArea = generated.postcodeArea;
        medianRentGBP = generated.medianRentGBP;
        generatedBy = generated.source;
        generationError = generated.errorReason;
      }

      // Tavily search for actual listing URLs in the area. We use the top
      // result URLs to override each listing's sourceUrl so the "view ↗"
      // link goes to a real property page (Zoopla/Rightmove/OpenRent),
      // not a postcode search.
      const tavily = await tavilySearch(
        `${query} site:zoopla.co.uk OR site:rightmove.co.uk OR site:openrent.co.uk`,
        { maxResults: 6 },
      );
      const realUrls = tavily.results
        .map((r) => r.url)
        .filter((u) => /zoopla\.co\.uk|rightmove\.co\.uk|openrent\.co\.uk/.test(u));
      listings = listings.map((l, i) => ({
        ...l,
        sourceUrl: realUrls[i] ?? l.sourceUrl,
      }));
      const sponsored = listings.find((l) => l.sponsoredBy);

      return {
        structuredContent: {
          query,
          listings,
          tavily,
          postcodeArea,
          medianRentGBP,
          sponsoredId: sponsored?.id,
          generatedBy,
          generationError,
        },
        content: [
          {
            type: "text",
            text: `${listings.length} listing${listings.length === 1 ? "" : "s"} ${generatedBy === "claude" ? "synthesised live by Claude" : "from inventory"} near ${postcodeArea}. Median rent: £${medianRentGBP}/mo.`,
          },
        ],
        isError: false,
      };
    },
  )
  // ────────────────────────────────────────────────────────────────────
  // run-audit — Beat 1 of the demo. The wow beat. 10 probes, 9 caught.
  // ────────────────────────────────────────────────────────────────────
  .registerTool(
    {
      name: "run-audit",
      description:
        "Run a continuous compliance audit against the FairLet policy gate. Fires 10 adversarial probes and returns a Publisher Trust Score with full traces.",
      inputSchema: {},
      annotations: {
        title: "Run compliance audit",
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
      _meta: {
        "openai/toolInvocation/invoking":
          "Firing 10 compliance probes at the policy gate…",
        "openai/toolInvocation/invoked": "Audit complete.",
      },
      view: {
        component: "audit-panel",
        domain: VIEW_DOMAIN,
        description: "Live scorecard for the continuous compliance audit.",
        csp: CSP_BASE,
      },
    },
    async () => {
      const result = runAudit();
      return {
        structuredContent: result,
        content: [
          {
            type: "text",
            text: `Audit: ${result.score.caught}/${result.score.total} caught (${result.score.percent}%). Endpoint: ${result.endpointUrl}`,
          },
        ],
        isError: false,
      };
    },
  )
  // ────────────────────────────────────────────────────────────────────
  // generate-fresh-probes — the Q&A defence. Council's #1 v2 recommendation.
  // Calls Claude live (falls back to deterministic probes if API unavailable).
  // ────────────────────────────────────────────────────────────────────
  .registerTool(
    {
      name: "generate-fresh-probes",
      description:
        "Generate fresh adversarial probes via Claude and run them through the policy gate live. Use this in Q&A to prove the gate is not just passing a curated regression suite.",
      inputSchema: {
        count: z.number().int().min(1).max(5).default(3).optional(),
      },
      annotations: {
        title: "Generate fresh probes",
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: true,
      },
      _meta: {
        "openai/toolInvocation/invoking":
          "Claude is generating fresh probes…",
        "openai/toolInvocation/invoked": "Fresh probes complete.",
      },
      view: {
        component: "fresh-probes",
        domain: VIEW_DOMAIN,
        description: "Live Claude-generated probes running through the gate.",
        csp: CSP_BASE,
      },
    },
    async ({ count }) => {
      const result = await generateFreshProbes(count ?? 3);
      return {
        structuredContent: result,
        content: [
          {
            type: "text",
            text: `Fresh probes: ${result.probes.length} generated via ${result.source}. ${result.verdicts.filter((v) => v.decision !== "serve").length}/${result.verdicts.length} caught.`,
          },
        ],
        isError: false,
      };
    },
  )
  // ────────────────────────────────────────────────────────────────────
  // show-dashboard — Beat 4. Two metrics: Publisher Trust Score + CPM.
  // ────────────────────────────────────────────────────────────────────
  .registerTool(
    {
      name: "show-dashboard",
      description:
        "Show the FairLet publisher dashboard — Publisher Trust Score (measurement) and Trust-Adjusted CPM (sell-side yield).",
      inputSchema: {},
      annotations: {
        title: "Open dashboard",
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
      _meta: {
        "openai/toolInvocation/invoking": "Loading dashboard…",
        "openai/toolInvocation/invoked": "Dashboard ready.",
      },
      view: {
        component: "dashboard",
        domain: VIEW_DOMAIN,
        description: "Two-metric publisher dashboard.",
        csp: CSP_BASE,
      },
    },
    async () => {
      const metrics = computeDashboard();
      return {
        structuredContent: metrics,
        content: [
          {
            type: "text",
            text: `Trust Score ${metrics.trustScore.caught}/${metrics.trustScore.total} · Trust-Adjusted CPM £${metrics.trustAdjustedCpmGBP} (${metrics.multiplier}× baseline).`,
          },
        ],
        isError: false,
      };
    },
  )
  // ────────────────────────────────────────────────────────────────────
  // check-placement — the policy gate exposed directly. Accepts one of
  // four inputs and returns the gate's verdict.
  // ────────────────────────────────────────────────────────────────────
  .registerTool(
    {
      name: "check-placement",
      description:
        "Evaluate a sponsored ad placement against the FairLet policy gate. " +
        "Pass ONE of these inputs:\n" +
        "  • url — a real property listing URL (Zoopla, Rightmove, OpenRent). Tavily scrapes it live and the gate audits the page it has never seen.\n" +
        "  • listingId — a seeded inventory ID (L-001 to L-012).\n" +
        "  • advertiserConfig — test an ad-targeting config for discrimination (e.g. { advertiserName: 'Test', targetingExclude: ['families_with_children'] }).\n" +
        "  • probeId — re-run a specific audit probe by ID (1 to 10).\n" +
        "Use this whenever asked to check if an ad placement is safe, test discrimination, verify a listing URL, or inspect a placement decision. " +
        "Returns serve / flag / block plus reasons, statutory citations where applicable, and per-category scores.",
      inputSchema: {
        url: z
          .string()
          .url()
          .optional()
          .describe(
            "A real property listing URL. Tavily extract scrapes the page; the gate parses price + postcode + description and runs all checks against the live content.",
          ),
        listingId: z
          .string()
          .optional()
          .describe("ID of a seeded listing (L-001 to L-012)."),
        advertiserConfig: z
          .object({
            advertiserName: z.string(),
            targetingExclude: z.array(z.string()).optional(),
            targetingInclude: z.array(z.string()).optional(),
          })
          .optional()
          .describe(
            "Advertiser targeting configuration. Use to test discrimination — set targetingExclude to e.g. ['families_with_children'], ['over_65'], ['non_british'] to see Equality Act enforcement.",
          ),
        probeId: z
          .number()
          .int()
          .optional()
          .describe(
            "Run a specific audit probe by ID (1-10). Used by the audit agent.",
          ),
      },
      annotations: {
        title: "Check placement",
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: true,
      },
      _meta: {
        "openai/toolInvocation/invoking": "Evaluating placement…",
        "openai/toolInvocation/invoked": "Decision returned.",
      },
      view: {
        component: "placement-decision",
        domain: VIEW_DOMAIN,
        description: "Single-placement verdict card.",
        csp: CSP_BASE,
      },
    },
    async ({ url, listingId, advertiserConfig, probeId }) => {
      let result;
      let scrapeCtx;
      if (url) {
        const out = await checkPlacementWithUrl(url);
        result = out.result;
        scrapeCtx = out.ctx;
      } else {
        result = checkPlacement({ listingId, advertiserConfig, probeId });
      }
      const listing = listingId ? getListing(listingId) : undefined;
      const probe =
        typeof probeId === "number"
          ? AUDIT_PROBES.find((p) => p.id === probeId)
          : undefined;
      return {
        structuredContent: {
          ...result,
          listing,
          probe,
          advertiserConfig,
          scrape: scrapeCtx,
        },
        content: [
          {
            type: "text",
            text: `${result.decision.toUpperCase()}: ${result.reasons[0] ?? "(no reasons)"}`,
          },
        ],
        isError: false,
      };
    },
  );

if (process.env.NODE_ENV === "production") {
  const { default: manifest } = await import("./vite-manifest.js");
  server.setViteManifest(manifest);
}

export default await server.run();

export type AppType = typeof server;
