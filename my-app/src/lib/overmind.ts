// Overmind tracing — wires OpenTelemetry directly to Overmind's OTLP
// endpoint, skipping the broken @overmind-lab/trace-sdk wrapper.
// Endpoint + auth header reverse-engineered from the SDK's source:
//   POST https://api.overmindlab.ai/api/v1/traces/create
//   header X-API-TOKEN: <key>
//   body  OTLP/protobuf (binary, framed by the OTel proto exporter)
//
// Every checkPlacement() and Claude call goes through traceSync/traceAsync
// here and emits a span. Visible live in console.overmindlab.ai.

import { SpanStatusCode, trace as otelTrace } from "@opentelemetry/api";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { SimpleSpanProcessor } from "@opentelemetry/sdk-trace-base";
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from "@opentelemetry/semantic-conventions";
import type { PlacementResult } from "../data/types.js";

let initialised = false;
let sdk: NodeSDK | undefined;

export function initOvermind(): void {
  if (initialised) return;
  initialised = true;
  const apiKey = process.env.OVERMIND_API_KEY;
  if (!apiKey) {
    // eslint-disable-next-line no-console
    console.warn(
      "[overmind] OVERMIND_API_KEY not set — traces disabled.",
    );
    return;
  }
  try {
    const baseUrl =
      process.env.OVERMIND_TRACES_URL ?? "https://api.overmindlab.ai";
    const exporter = new OTLPTraceExporter({
      url: `${baseUrl}/api/v1/traces/create`,
      headers: { "X-API-TOKEN": apiKey },
    });
    const resource = resourceFromAttributes({
      [ATTR_SERVICE_NAME]: "FairLet",
      [ATTR_SERVICE_VERSION]: "0.1.0",
      "deployment.environment":
        process.env.DEPLOYMENT_ENVIRONMENT ?? "production",
    });
    sdk = new NodeSDK({
      resource,
      spanProcessors: [new SimpleSpanProcessor(exporter)],
      instrumentations: [],
    });
    sdk.start();
    // eslint-disable-next-line no-console
    console.log(
      "[overmind] OTLP tracer started → " +
        baseUrl +
        "/api/v1/traces/create",
    );
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
      for (let i = 0; i < result.reasons.length && i < 3; i += 1) {
        span.setAttribute(`fairlet.reason.${i}`, result.reasons[i]);
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
  if (sdk) {
    try {
      await sdk.shutdown();
    } catch {
      // ignore
    }
  }
}
