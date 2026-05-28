#!/usr/bin/env tsx
// FairLet end-to-end smoke test against a running Skybridge dev server.
//
// Usage:
//   yarn smoke                              # hits http://localhost:3000/mcp
//   FAIRLET_MCP_URL=https://… yarn smoke    # hits a deployed Alpic endpoint
//
// Exits 0 if all checks pass, 1 otherwise. Designed to be re-runnable.

const MCP = process.env.FAIRLET_MCP_URL ?? "http://localhost:3000/mcp";

let nextId = 1;

async function call(method: string, params: unknown = {}): Promise<any> {
  const res = await fetch(MCP, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
    },
    body: JSON.stringify({ jsonrpc: "2.0", id: nextId++, method, params }),
  });
  const ct = res.headers.get("content-type") ?? "";
  const text = await res.text();
  // Skybridge may stream SSE for tools/call; collapse to the last JSON-RPC payload.
  if (ct.includes("event-stream") || text.includes("data: ")) {
    const dataLines = text
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.startsWith("data:"))
      .map((l) => l.slice(5).trim());
    if (dataLines.length === 0) throw new Error(`empty SSE: ${text.slice(0, 200)}`);
    return JSON.parse(dataLines[dataLines.length - 1]);
  }
  return JSON.parse(text);
}

let passed = 0;
let failed = 0;

async function check(name: string, fn: () => Promise<void>): Promise<void> {
  const started = Date.now();
  try {
    await fn();
    const ms = Date.now() - started;
    console.log(`  \x1b[32m✓\x1b[0m ${name} \x1b[90m(${ms}ms)\x1b[0m`);
    passed++;
  } catch (e) {
    const ms = Date.now() - started;
    console.error(
      `  \x1b[31m✗\x1b[0m ${name} \x1b[90m(${ms}ms)\x1b[0m\n    ${
        e instanceof Error ? e.message : String(e)
      }`,
    );
    failed++;
  }
}

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

function structured(r: any): any {
  if (r?.error) throw new Error(`JSON-RPC error: ${JSON.stringify(r.error)}`);
  return r?.result?.structuredContent;
}

console.log(`\n\x1b[1mFairLet smoke test\x1b[0m → ${MCP}\n`);

await check("tools/list returns all 5 FairLet tools", async () => {
  const r = await call("tools/list");
  const names: string[] = (r.result.tools ?? []).map((t: any) => t.name).sort();
  const expected = [
    "check-placement",
    "generate-fresh-probes",
    "run-audit",
    "search-rentals",
    "show-dashboard",
  ];
  assert(
    JSON.stringify(names) === JSON.stringify(expected),
    `expected ${expected.join(",")} — got ${names.join(",")}`,
  );
});

await check("run-audit → score 9/10, capstone is probe #10 with Equality Act citation", async () => {
  const r = await call("tools/call", { name: "run-audit", arguments: {} });
  const sc = structured(r);
  assert(sc.score.caught === 9, `caught=${sc.score.caught}, expected 9`);
  assert(sc.score.total === 10, `total=${sc.score.total}, expected 10`);
  assert(sc.score.percent === 90, `percent=${sc.score.percent}, expected 90`);
  const capstone = sc.rows.at(-1);
  assert(capstone.probe.id === 10, `capstone id=${capstone.probe.id}, expected 10`);
  assert(
    String(capstone.citation ?? "").includes("Equality Act 2010, s.33"),
    `capstone citation: ${capstone.citation}`,
  );
  assert(
    typeof capstone.citationFull === "string" && capstone.citationFull.length > 50,
    "capstone citationFull missing or too short",
  );
  assert(sc.endpointUrl.startsWith("http"), `endpoint=${sc.endpointUrl}`);
});

await check("run-audit → exactly one REMEDIATION row (the GDPR consent probe)", async () => {
  const r = await call("tools/call", { name: "run-audit", arguments: {} });
  const sc = structured(r);
  const remediations = sc.rows.filter((row: any) => row.verdictPill === "REMEDIATION");
  assert(remediations.length === 1, `${remediations.length} remediations, expected 1`);
  assert(remediations[0].probe.id === 6, `remediation id=${remediations[0].probe.id}, expected 6`);
  assert(
    remediations[0].probe.category === "gdpr",
    `remediation category=${remediations[0].probe.category}`,
  );
});

await check("search-rentals (canonical demo query) → 3 listings, Pemberton sponsored", async () => {
  const r = await call("tools/call", {
    name: "search-rentals",
    arguments: { query: "2-bed under £2k near London Bridge, pet-friendly" },
  });
  const sc = structured(r);
  assert(sc.listings.length === 3, `${sc.listings.length} listings`);
  const sponsored = sc.listings.find((l: any) => l.sponsoredBy);
  assert(sponsored?.sponsoredBy === "Pemberton & Co", `sponsored=${sponsored?.sponsoredBy}`);
  assert(sc.postcodeArea === "SE1", `postcode area=${sc.postcodeArea}`);
  assert(sc.medianRentGBP === 2150, `median=${sc.medianRentGBP}`);
});

await check("check-placement with families-with-children exclusion → BLOCK + Equality Act s.33", async () => {
  const r = await call("tools/call", {
    name: "check-placement",
    arguments: {
      advertiserConfig: {
        advertiserName: "Pemberton & Co",
        targetingExclude: ["families_with_children"],
      },
    },
  });
  const sc = structured(r);
  assert(sc.decision === "block", `decision=${sc.decision}`);
  assert(
    String(sc.citation ?? "").includes("s.33"),
    `citation=${sc.citation}`,
  );
  assert(sc.forfeitedRevenueGBP > 0, `forfeited=${sc.forfeitedRevenueGBP}`);
  assert(sc.scores.discrimination > 0.9, `discrim score=${sc.scores.discrimination}`);
});

await check("check-placement on scam listing L-012 → FLAG with deviation reason", async () => {
  const r = await call("tools/call", {
    name: "check-placement",
    arguments: { listingId: "L-012" },
  });
  const sc = structured(r);
  assert(sc.decision === "flag", `decision=${sc.decision}`);
  const joined = sc.reasons.join(" ").toLowerCase();
  assert(/off-platform|wire/.test(joined), `reasons=${sc.reasons.join(" | ")}`);
  assert(/below|median/.test(joined), `reasons missing deviation`);
});

await check("check-placement on clean listing L-001 → SERVE", async () => {
  const r = await call("tools/call", {
    name: "check-placement",
    arguments: { listingId: "L-001" },
  });
  const sc = structured(r);
  assert(sc.decision === "serve", `decision=${sc.decision}`);
});

await check("show-dashboard → Trust Score 9/10, Trust-Adjusted CPM £18.40 (1.42×)", async () => {
  const r = await call("tools/call", { name: "show-dashboard", arguments: {} });
  const sc = structured(r);
  assert(sc.trustScore.caught === 9, `trust caught=${sc.trustScore.caught}`);
  assert(sc.trustScore.total === 10, `trust total=${sc.trustScore.total}`);
  assert(sc.trustAdjustedCpmGBP === 18.4, `CPM=£${sc.trustAdjustedCpmGBP}`);
  assert(sc.multiplier === 1.42, `multiplier=${sc.multiplier}`);
});

await check("generate-fresh-probes → 3 probes generated, all run through gate", async () => {
  const r = await call("tools/call", {
    name: "generate-fresh-probes",
    arguments: { count: 3 },
  });
  const sc = structured(r);
  assert(sc.probes.length === 3, `${sc.probes.length} probes`);
  assert(sc.verdicts.length === 3, `${sc.verdicts.length} verdicts`);
  assert(
    sc.source === "claude" || sc.source === "fallback",
    `source=${sc.source}`,
  );
  // At least one of the 3 should be caught (the fallback set has an age
  // exclusion that must BLOCK; Claude-generated probes should also catch).
  const caught = sc.verdicts.filter((v: any) => v.decision !== "serve").length;
  assert(caught >= 1, `only ${caught}/3 caught`);
});

console.log(
  `\n\x1b[1m${passed} passed · ${failed} failed\x1b[0m  (against ${MCP})\n`,
);

if (failed > 0) process.exit(1);
