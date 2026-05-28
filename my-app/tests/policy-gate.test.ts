import { describe, expect, it } from "vitest";
import { checkPlacement } from "../src/lib/policy-gate.js";

describe("checkPlacement — protected-token discrimination", () => {
  it("BLOCKS when advertiser excludes families_with_children", () => {
    const result = checkPlacement({
      advertiserConfig: {
        advertiserName: "Pemberton & Co",
        targetingExclude: ["families_with_children"],
      },
    });
    expect(result.decision).toBe("block");
    expect(result.citation).toContain("Equality Act 2010, s.33");
    expect(result.citationFull).toMatch(/protected characteristic/i);
    expect(result.scores.discrimination).toBeGreaterThan(0.9);
    expect(result.forfeitedRevenueGBP).toBeGreaterThan(0);
  });

  it("BLOCKS on race-based exclusion (non_british token)", () => {
    const result = checkPlacement({
      advertiserConfig: {
        advertiserName: "X",
        targetingExclude: ["non_british"],
      },
    });
    expect(result.decision).toBe("block");
  });

  it("BLOCKS on religious-status exclusion", () => {
    const result = checkPlacement({
      advertiserConfig: {
        advertiserName: "X",
        targetingExclude: ["non_muslim_tenants"],
      },
    });
    expect(result.decision).toBe("block");
  });

  it("BLOCKS on sexual-orientation exclusion (same_sex)", () => {
    const result = checkPlacement({
      advertiserConfig: {
        advertiserName: "X",
        targetingExclude: ["same_sex_couples"],
      },
    });
    expect(result.decision).toBe("block");
  });

  it("BLOCKS on disability-status exclusion", () => {
    const result = checkPlacement({
      advertiserConfig: {
        advertiserName: "X",
        targetingExclude: ["no_assistance_animals"],
      },
    });
    expect(result.decision).toBe("block");
  });

  it("SERVES when advertiser config has no protected-token exclusions", () => {
    const result = checkPlacement({
      advertiserConfig: {
        advertiserName: "X",
        targetingExclude: ["smokers"], // not a protected characteristic
      },
    });
    expect(result.decision).toBe("serve");
  });

  it("SERVES with no advertiser config and no listing", () => {
    const result = checkPlacement({});
    expect(result.decision).toBe("serve");
  });
});

describe("checkPlacement — listing-level checks", () => {
  it("FLAGS the planted scam listing (L-012) with the deviation reason", () => {
    const result = checkPlacement({ listingId: "L-012" });
    expect(result.decision).toBe("flag");
    expect(result.scores.fraud).toBeGreaterThan(0.9);
    const joined = result.reasons.join(" ").toLowerCase();
    expect(joined).toMatch(/off-platform|wire/);
    expect(joined).toMatch(/below|median/);
  });

  it("SERVES a clean listing (L-001 Westminster Court)", () => {
    const result = checkPlacement({ listingId: "L-001" });
    expect(result.decision).toBe("serve");
  });

  it("SERVES the sponsored Pemberton listing (L-002)", () => {
    const result = checkPlacement({ listingId: "L-002" });
    expect(result.decision).toBe("serve");
  });

  it("SERVES gracefully when listingId is unknown", () => {
    const result = checkPlacement({ listingId: "L-DOES-NOT-EXIST" });
    expect(result.decision).toBe("serve");
    expect(result.reasons[0]).toMatch(/not found/i);
  });
});

describe("checkPlacement — probe shortcut (audit agent path)", () => {
  it("returns BLOCK for the Equality Act capstone (probe #10)", () => {
    const result = checkPlacement({ probeId: 10 });
    expect(result.decision).toBe("block");
    expect(result.citation).toContain("Equality Act 2010, s.33");
    expect(result.citationFull).toBeTruthy();
  });

  it("returns FLAG for the GDPR remediation probe (probe #6)", () => {
    const result = checkPlacement({ probeId: 6 });
    expect(result.decision).toBe("flag");
    const joined = result.reasons.join(" ").toLowerCase();
    expect(joined).toMatch(/remediation|human review/);
  });

  it("returns BLOCK for prompt-injection (probe #9, security category)", () => {
    const result = checkPlacement({ probeId: 9 });
    expect(result.decision).toBe("block");
  });

  it("returns BLOCK for brand-unsafe adjacency (probe #7)", () => {
    const result = checkPlacement({ probeId: 7 });
    expect(result.decision).toBe("block");
  });

  it("returns FLAG for fraud-category probe (probe #5)", () => {
    const result = checkPlacement({ probeId: 5 });
    expect(result.decision).toBe("flag");
  });

  it("falls through to default SERVE when probeId is unknown", () => {
    const result = checkPlacement({ probeId: 999 });
    expect(result.decision).toBe("serve");
  });
});
