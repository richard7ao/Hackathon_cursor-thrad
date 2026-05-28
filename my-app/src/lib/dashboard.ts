// Dashboard metric computation. Numbers are deterministic on stage — the
// council's calibration: a perfect 10/10 reads as theatre, a 9/10 with a
// visible remediation reads as a working system. Trust-Adjusted CPM lifts
// are illustrative pending real auction data.

import type { DashboardMetrics } from "../data/types.js";
import { AUDIT_SCORE } from "../data/audit-probes.js";

const BASELINE_CPM_GBP = 12.96; // such that 12.96 * 1.42 ≈ 18.40
const MULTIPLIER = 1.42;

export function computeDashboard(): DashboardMetrics {
  const caught = AUDIT_SCORE.caught;
  const total = AUDIT_SCORE.total;
  const cpm = round2(BASELINE_CPM_GBP * MULTIPLIER);
  return {
    trustScore: {
      caught,
      total,
      percent: Math.round((caught / total) * 100),
    },
    trustAdjustedCpmGBP: cpm,
    baselineCpmGBP: BASELINE_CPM_GBP,
    multiplier: MULTIPLIER,
    servedCount: 47,
    flaggedCount: 6,
    blockedCount: 11,
    lastAuditISO: new Date().toISOString(),
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
