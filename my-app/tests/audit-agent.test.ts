import { describe, expect, it } from "vitest";
import { runAudit } from "../src/lib/audit-agent.js";

describe("runAudit — the demo's opening 'wow' beat", () => {
  it("returns exactly 10 probe rows", () => {
    const result = runAudit();
    expect(result.rows).toHaveLength(10);
  });

  it("scores 9 caught / 1 remediation (the council's '100% looks fake' fix)", () => {
    const result = runAudit();
    expect(result.score.caught).toBe(9);
    expect(result.score.total).toBe(10);
    expect(result.score.percent).toBe(90);
  });

  it("the remediation row is probe #6 (GDPR consent edge case)", () => {
    const result = runAudit();
    const remediation = result.rows.find(
      (r) => r.verdictPill === "REMEDIATION",
    );
    expect(remediation).toBeDefined();
    expect(remediation?.probe.id).toBe(6);
    expect(remediation?.probe.category).toBe("gdpr");
  });

  it("the capstone (final row) is probe #10 with the Equality Act citation", () => {
    const result = runAudit();
    const last = result.rows[result.rows.length - 1];
    expect(last.probe.id).toBe(10);
    expect(last.verdictPill).toBe("CAUGHT");
    expect(last.citation).toContain("Equality Act 2010, s.33");
    expect(last.citationFull).toBeTruthy();
    expect(last.citationFull?.length).toBeGreaterThan(50);
  });

  it("every CAUGHT row produces a non-serve decision", () => {
    const result = runAudit();
    const caughtRows = result.rows.filter((r) => r.verdictPill === "CAUGHT");
    expect(caughtRows).toHaveLength(9);
    for (const row of caughtRows) {
      expect(row.decision).not.toBe("serve");
    }
  });

  it("returns an Alpic MCP endpoint URL", () => {
    const result = runAudit();
    expect(result.endpointUrl).toMatch(/^https?:\/\//);
    expect(result.endpointUrl).toContain("check_placement");
  });

  it("returns a valid ISO timestamp for the generated run", () => {
    const result = runAudit();
    expect(new Date(result.generatedAtISO).toString()).not.toBe("Invalid Date");
  });

  it("all rows report a finite latencyMs", () => {
    const result = runAudit();
    for (const row of result.rows) {
      expect(Number.isFinite(row.latencyMs)).toBe(true);
      expect(row.latencyMs).toBeGreaterThan(0);
    }
  });

  it("covers all six probe categories at least once across the 10 probes", () => {
    const result = runAudit();
    const categories = new Set(result.rows.map((r) => r.probe.category));
    expect(categories.has("discrimination")).toBe(true);
    expect(categories.has("fraud")).toBe(true);
    expect(categories.has("brand-safety")).toBe(true);
    expect(categories.has("security")).toBe(true);
    expect(categories.has("gdpr")).toBe(true);
    expect(categories.has("quality")).toBe(true);
  });
});
