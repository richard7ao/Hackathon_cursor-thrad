// Overmind tracing — uses the real @overmind-lab/trace-sdk (which wraps
// OpenTelemetry + an OTLP exporter pointing at api.overmindlab.ai). We
// manually create spans around the policy gate and Claude calls so each
// shows up in console.overmindlab.ai's trace stream.

import { trace as otelTrace, SpanStatusCode } from "@opentelemetry/api";
import { OvermindClient } from "@overmind-lab/trace-sdk";
import type { PlacementResult } from "../data/types.js";

let initialised = false;
let client: OvermindClient | undefined;

export function initOvermind(): void {
  if (initialised) return;
  initialised = true;
  const apiKey = process.env.OVERMIND_API_KEY;
  if (!apiKey) {
    // eslint-disable-next-line no-console
    console.warn("[overmind] OVERMIND_API_KEY not set — traces disabled.");
    return;
  }
  try {
    client = new OvermindClient({ apiKey, appName: "FairLet" });
    // enableBatching false → spans export immediately, demo-friendly.
    // We don't instrument OpenAI (we use Anthropic via fetch); our manual
    // spans on policy-gate + claude calls do the work. Pass empty providers
    // and cast — the SDK only branches on the `openai` field's truthiness.
    client.initTracing({
      enableBatching: false,
      enabledProviders: {} as never,
    });
    // eslint-disable-next-line no-console
    console.log("[overmind] tracing initialised → api.overmindlab.ai");
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[overmind] init failed:", err);
  }
}

const tracer = otelTrace.getTracer("fairlet", "0.1.0");

export function traceSync<T extends PlacementResult>(
  spanName: string,
  attrs: Record<string, string | number | boolean>,
  fn: () => T,
): T {
  return tracer.startActiveSpan(spanName, (span) => {
    try {
      for (const [k, v] of Object.entries(attrs)) span.setAttribute(k, v);
      const result = fn();
      span.setAttribute("fairlet.decision", result.decision);
      if (result.citation) span.setAttribute("fairlet.citation", result.citation);
      if (typeof result.forfeitedRevenueGBP === "number") {
        span.setAttribute("fairlet.forfeited_gbp", result.forfeitedRevenueGBP);
      }
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (err) {
      span.recordException(err as Error);
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: err instanceof Error ? err.message : String(err),
      });
      throw err;
    } finally {
      span.end();
    }
  });
}

export async function traceAsync<T>(
  spanName: string,
  attrs: Record<string, string | number | boolean>,
  fn: () => Promise<T>,
): Promise<T> {
  return tracer.startActiveSpan(spanName, async (span) => {
    try {
      for (const [k, v] of Object.entries(attrs)) span.setAttribute(k, v);
      const result = await fn();
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (err) {
      span.recordException(err as Error);
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: err instanceof Error ? err.message : String(err),
      });
      throw err;
    } finally {
      span.end();
    }
  });
}

export async function shutdownOvermind(): Promise<void> {
  if (client) {
    try {
      await client.shutdown();
    } catch {
      // ignore
    }
  }
}
