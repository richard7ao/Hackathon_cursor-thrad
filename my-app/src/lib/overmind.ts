// Overmind tracing wrapper. Every policy-gate decision is sent to Overmind so
// judges can watch the live trace stream in console.overmindlab.ai during the
// demo. Fire-and-forget — the gate never blocks on the trace, and the trace
// failing never alters the verdict.
//
// The Overmind ingest endpoint is configurable so the team can point at
// whatever URL the Overmind console expects. Defaults to a sensible guess
// that the team can override via env at deploy time.

import type { PlacementResult } from "../data/types.js";

const ENDPOINT_DEFAULT = "https://api.overmindlab.ai/v1/traces";

let warnedAboutKey = false;

export type TraceContext = {
  tool: string; // e.g. "check-placement" | "run-audit" | "generate-fresh-probes"
  input: unknown;
  result?: PlacementResult;
  probeId?: number;
  source?: "claude" | "fallback";
  startedAt: number;
};

export function startTrace(
  tool: string,
  input: unknown,
  extras: { probeId?: number; source?: "claude" | "fallback" } = {},
): TraceContext {
  return {
    tool,
    input,
    probeId: extras.probeId,
    source: extras.source,
    startedAt: Date.now(),
  };
}

export function finishTrace(
  ctx: TraceContext,
  result: PlacementResult | undefined,
): void {
  const latencyMs = Date.now() - ctx.startedAt;
  const payload = {
    tool: ctx.tool,
    input: ctx.input,
    probeId: ctx.probeId,
    source: ctx.source,
    decision: result?.decision,
    reasons: result?.reasons,
    citation: result?.citation,
    scores: result?.scores,
    forfeitedRevenueGBP: result?.forfeitedRevenueGBP,
    latencyMs,
    timestampISO: new Date().toISOString(),
  };

  // Always log to stderr — visible in `yarn dev` and Skybridge devtools.
  // Format matches what the judges will see on the wall.
  // eslint-disable-next-line no-console
  console.log(
    `[overmind] ${payload.tool}${
      payload.probeId ? `[probe=${payload.probeId}]` : ""
    } → ${payload.decision ?? "n/a"} (${latencyMs}ms)${
      payload.citation ? ` ${payload.citation}` : ""
    }`,
  );

  const apiKey = process.env.OVERMIND_API_KEY;
  if (!apiKey) {
    if (!warnedAboutKey) {
      // eslint-disable-next-line no-console
      console.warn(
        "[overmind] OVERMIND_API_KEY not set — traces are local-only.",
      );
      warnedAboutKey = true;
    }
    return;
  }

  const endpoint = process.env.OVERMIND_TRACE_ENDPOINT ?? ENDPOINT_DEFAULT;

  // Fire-and-forget. The gate must not block on tracing.
  void fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  }).catch((err) => {
    // eslint-disable-next-line no-console
    console.error("[overmind] trace POST failed:", err?.message ?? err);
  });
}

// Convenience wrapper. Used by tool handlers in server.ts:
//   const result = withTrace("check-placement", input, () => checkPlacement(input));
export function withTrace<T extends PlacementResult>(
  tool: string,
  input: unknown,
  fn: () => T,
  extras: { probeId?: number; source?: "claude" | "fallback" } = {},
): T {
  const ctx = startTrace(tool, input, extras);
  const result = fn();
  finishTrace(ctx, result);
  return result;
}
