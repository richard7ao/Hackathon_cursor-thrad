// The audit agent — a Cursor SDK-style programmatic agent that fires the
// 10 hardcoded probes at the policy gate and aggregates a scorecard. Used by
// the run_audit tool to power the demo's opening "wow" beat.

import { AUDIT_PROBES } from "../data/audit-probes.js";
import { checkPlacement } from "./policy-gate.js";
import type { AuditProbe } from "../data/types.js";

export type AuditRowResult = {
  probe: AuditProbe;
  verdictPill: "CAUGHT" | "REMEDIATION";
  decision: "serve" | "flag" | "block";
  reasonShort: string;
  citation?: string;
  citationFull?: string;
  latencyMs: number;
};

export type AuditRunResult = {
  rows: AuditRowResult[];
  score: { caught: number; total: number; percent: number };
  generatedAtISO: string;
  endpointUrl: string;
};

const SIM_LATENCY_MS = 200;

export function runAudit(): AuditRunResult {
  const rows: AuditRowResult[] = AUDIT_PROBES.map((probe) => {
    const verdict = checkPlacement({ probeId: probe.id });
    return {
      probe,
      verdictPill: probe.verdict,
      decision: verdict.decision,
      reasonShort: probe.reasonShort,
      citation: probe.citation,
      citationFull: probe.citationFull,
      latencyMs: SIM_LATENCY_MS,
    };
  });
  const caught = rows.filter((r) => r.verdictPill === "CAUGHT").length;
  return {
    rows,
    score: {
      caught,
      total: rows.length,
      percent: Math.round((caught / rows.length) * 100),
    },
    generatedAtISO: new Date().toISOString(),
    endpointUrl: alpicEndpoint(),
  };
}

function alpicEndpoint(): string {
  return (
    process.env.ALPIC_PUBLIC_URL ??
    "https://fairlet-mcp.alpic.app/check_placement"
  );
}
