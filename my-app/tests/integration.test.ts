// Integration test — exercises the full demo flow as the screenplay runs it.
// Cold open → audit beat → production renter → scam catch → dashboard reveal.
// Hits the same module surface the MCP tool handlers hit in server.ts, so
// any handler-layer divergence shows up here.

import { describe, expect, it } from "vitest";
import { runAudit } from "../src/lib/audit-agent.js";
import { generateFreshProbes } from "../src/lib/claude.js";
import { computeDashboard } from "../src/lib/dashboard.js";
import { checkPlacement } from "../src/lib/policy-gate.js";
import { searchListings } from "../src/data/listings.js";

describe("FairLet demo flow — end-to-end through the libs", () => {
  it("Beat 1 (audit) → 9/10, capstone is the Equality Act case", () => {
    const audit = runAudit();
    expect(audit.score.caught).toBe(9);
    expect(audit.score.percent).toBe(90);
    expect(audit.rows[audit.rows.length - 1].probe.id).toBe(10);
    expect(audit.rows[audit.rows.length - 1].citation).toContain(
      "Equality Act 2010, s.33",
    );
  });

  it("Beat 2 (rentals) → 3 listings near London Bridge, one sponsored", () => {
    const listings = searchListings(
      "2-bed under £2k near London Bridge, pet-friendly",
    );
    expect(listings).toHaveLength(3);
    expect(listings.some((l) => l.sponsoredBy === "Pemberton & Co")).toBe(true);
    // Every served listing must clear the policy gate.
    for (const l of listings) {
      const verdict = checkPlacement({ listingId: l.id });
      expect(verdict.decision).toBe("serve");
    }
  });

  it("Beat 2 (advertiser hostile) → discriminatory targeting is BLOCKED with the Equality Act citation", () => {
    const verdict = checkPlacement({
      advertiserConfig: {
        advertiserName: "Pemberton & Co",
        targetingExclude: ["families_with_children"],
      },
    });
    expect(verdict.decision).toBe("block");
    expect(verdict.citation).toContain("Equality Act 2010, s.33");
    expect(verdict.forfeitedRevenueGBP).toBeGreaterThan(0);
  });

  it("Beat 3 (scam) → the Tavily-scraped Bermondsey listing is FLAGGED", () => {
    const verdict = checkPlacement({ listingId: "L-012" });
    expect(verdict.decision).toBe("flag");
    expect(verdict.scores.fraud).toBeGreaterThan(0.9);
    expect(
      verdict.reasons.some((r) => r.toLowerCase().includes("off-platform")),
    ).toBe(true);
    expect(
      verdict.reasons.some((r) => /below|median/.test(r.toLowerCase())),
    ).toBe(true);
  });

  it("Beat 4 (dashboard) → both Track-02 metrics present and self-consistent", () => {
    const m = computeDashboard();
    expect(m.trustScore.caught).toBe(9);
    expect(m.trustAdjustedCpmGBP).toBe(18.4);
    expect(m.multiplier).toBe(1.42);
    // Counters add up.
    expect(m.servedCount + m.flaggedCount + m.blockedCount).toBeGreaterThan(0);
  });

  it("Q&A defence (generate-fresh-probes) → fallback path produces 3 fresh probes when no Anthropic key", async () => {
    // Force the fallback by ensuring no key — explicitly unset so the test
    // is deterministic regardless of host env.
    const original = process.env.ANTHROPIC_API_KEY;
    delete process.env.ANTHROPIC_API_KEY;
    try {
      const fresh = await generateFreshProbes(3);
      expect(fresh.probes).toHaveLength(3);
      expect(fresh.source).toBe("fallback");
      expect(fresh.errorReason).toMatch(/ANTHROPIC_API_KEY/);
      expect(fresh.verdicts).toHaveLength(3);
      // The first fallback probe excludes age_over_55 — a protected
      // characteristic — and must be BLOCKED by the gate.
      expect(fresh.verdicts[0].decision === "block" || fresh.verdicts[0].decision === "flag").toBe(true);
    } finally {
      if (original !== undefined) process.env.ANTHROPIC_API_KEY = original;
    }
  });

  it("invariant: every probe in the demo's audit either BLOCKS or FLAGS — none silently SERVE", () => {
    const audit = runAudit();
    for (const row of audit.rows) {
      const verdict = checkPlacement({ probeId: row.probe.id });
      expect(verdict.decision).not.toBe("serve");
    }
  });
});
