import { describe, expect, it } from "vitest";
import { computeDashboard } from "../src/lib/dashboard.js";

describe("computeDashboard — Beat 4 the yield reveal", () => {
  it("Publisher Trust Score: 9 / 10 (90%)", () => {
    const m = computeDashboard();
    expect(m.trustScore.caught).toBe(9);
    expect(m.trustScore.total).toBe(10);
    expect(m.trustScore.percent).toBe(90);
  });

  it("Trust-Adjusted CPM is £18.40 (1.42× baseline £12.96)", () => {
    const m = computeDashboard();
    expect(m.trustAdjustedCpmGBP).toBe(18.4);
    expect(m.multiplier).toBe(1.42);
    expect(m.baselineCpmGBP).toBe(12.96);
  });

  it("CPM math holds: baseline × multiplier matches the displayed CPM", () => {
    const m = computeDashboard();
    const computed = Math.round(m.baselineCpmGBP * m.multiplier * 100) / 100;
    expect(computed).toBe(m.trustAdjustedCpmGBP);
  });

  it("Served / Flagged / Blocked counters are non-negative integers", () => {
    const m = computeDashboard();
    for (const c of [m.servedCount, m.flaggedCount, m.blockedCount]) {
      expect(Number.isInteger(c)).toBe(true);
      expect(c).toBeGreaterThanOrEqual(0);
    }
  });

  it("Total inventory (served+flagged+blocked) is the expected demo number", () => {
    const m = computeDashboard();
    expect(m.servedCount + m.flaggedCount + m.blockedCount).toBe(64);
  });

  it("lastAuditISO is a parseable ISO timestamp", () => {
    const m = computeDashboard();
    expect(new Date(m.lastAuditISO).toString()).not.toBe("Invalid Date");
  });
});
