import "@/index.css";

import { useEffect, useState } from "react";
import { useLayout } from "skybridge/web";
import { useCallTool, useToolInfo } from "../helpers.js";

const ROW_DELAY_MS = 160;

const CATEGORY_CLASS: Record<string, string> = {
  discrimination: "cat-discrim",
  fraud: "cat-fraud",
  "brand-safety": "cat-brand",
  security: "cat-secure",
  gdpr: "cat-gdpr",
  quality: "cat-quality",
};

export default function AuditPanel() {
  useLayout(); // host environment — reserved for future adaptive layout
  const { output, isPending } = useToolInfo<"run-audit">();
  const { callTool: refresh, isPending: isRefreshing } = useCallTool("run-audit");
  const { callTool: generateFresh, isPending: isGenerating } =
    useCallTool("generate-fresh-probes");

  const [visibleRows, setVisibleRows] = useState(0);

  const rows = output?.rows ?? [];
  const score = output?.score;
  const totalCaught = score?.caught ?? 0;
  const totalProbes = score?.total ?? 10;
  const remediations = totalProbes - totalCaught;
  const caughtSoFar = rows
    .slice(0, visibleRows)
    .filter((r) => r.verdictPill === "CAUGHT").length;
  const displayedScore = visibleRows >= rows.length ? totalCaught : caughtSoFar;
  const allRowsVisible = visibleRows >= rows.length;
  const capstone = rows[rows.length - 1];

  useEffect(() => {
    if (!rows.length) return;
    setVisibleRows(0);
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setVisibleRows(i);
      if (i >= rows.length) clearInterval(interval);
    }, ROW_DELAY_MS);
    return () => clearInterval(interval);
  }, [rows.length, output?.generatedAtISO]);

  if (isPending && !output) {
    return (
      <Page>
        <Lede loading />
      </Page>
    );
  }

  return (
    <Page>
      <header className="grid md:grid-cols-[1fr_auto] gap-x-12 gap-y-4 items-end">
        <div>
          <div className="eyebrow flex items-center gap-3">
            <span>Continuous Audit</span>
            <span className="text-rule-2">·</span>
            <time className="text-ink-mute font-mono normal-case tracking-normal">
              {formatStamp(output?.generatedAtISO)}
            </time>
          </div>
          <h1 className="serif-display mt-3 text-[clamp(2rem,4vw,3rem)] font-medium leading-[1.05] text-ink">
            The policy gate held the line.
          </h1>
          <p className="serif-display italic mt-3 text-[17px] text-ink-mute leading-snug max-w-[42ch]">
            Ten stress probes against {endpointHost(output?.endpointUrl)}.
            <br />
            Verdicts traced in Overmind, citations grounded by Tavily.
          </p>
        </div>

        <ScoreFigure
          caught={displayedScore}
          total={totalProbes}
          remediations={remediations}
          settled={allRowsVisible}
        />
      </header>

      <div className="grid md:grid-cols-[1fr_320px] gap-x-10 gap-y-6 rule-top pt-6">
        <Ledger rows={rows} visibleRows={visibleRows} capstoneId={capstone?.probe.id} />
        <aside className="flex flex-col gap-5">
          <TraceLog rows={rows.slice(0, visibleRows)} live={!allRowsVisible} />
          <Sponsors />
        </aside>
      </div>

      {capstone?.citationFull && allRowsVisible ? (
        <Capstone
          citation={capstone.citation ?? ""}
          citationFull={capstone.citationFull}
          label={capstone.probe.label}
        />
      ) : null}

      <Foot
        onRefresh={() => refresh({})}
        onGenerateFresh={() => generateFresh({ count: 3 })}
        isRefreshing={isRefreshing}
        isGenerating={isGenerating}
      />
    </Page>
  );
}

function Page({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-dotgrid text-ink rounded-2xl border border-rule overflow-hidden">
      <div className="mx-auto max-w-5xl px-8 md:px-12 py-10 md:py-12 flex flex-col gap-8">
        {children}
      </div>
    </div>
  );
}

function Lede({ loading }: { loading?: boolean }) {
  return (
    <div className="animate-pulse">
      <div className="eyebrow">Continuous Audit</div>
      <div className="serif-display mt-3 text-4xl text-ink-mute">
        {loading ? "Calling the policy gate…" : "—"}
      </div>
    </div>
  );
}

function ScoreFigure({
  caught,
  total,
  remediations,
  settled,
}: {
  caught: number;
  total: number;
  remediations: number;
  settled: boolean;
}) {
  return (
    <figure className="md:text-right">
      <div
        className="serif-display text-[80px] md:text-[120px] leading-none font-medium tabular-nums text-ink"
        style={{
          fontVariationSettings: '"opsz" 144, "SOFT" 100',
        }}
      >
        {caught}
        <span className="text-rule-2 mx-1">/</span>
        <span className="text-ink-mute">{total}</span>
      </div>
      <figcaption className="mt-2 serif-display italic text-[14px] text-ink-mute">
        {settled ? (
          <>
            caught{" "}
            {remediations > 0 ? (
              <>
                <span className="text-rule-2">·</span> {remediations}{" "}
                remediation suggested
              </>
            ) : null}
          </>
        ) : (
          <>running probes…</>
        )}
      </figcaption>
    </figure>
  );
}

type Row = {
  probe: { id: number; label: string; category: string };
  verdictPill: "CAUGHT" | "REMEDIATION";
  reasonShort: string;
  citation?: string;
  decision: "serve" | "flag" | "block";
};

function Ledger({
  rows,
  visibleRows,
  capstoneId,
}: {
  rows: Row[];
  visibleRows: number;
  capstoneId?: number;
}) {
  return (
    <ol className="flex flex-col">
      {rows.map((row, i) => {
        const visible = i < visibleRows;
        const isCapstone = capstoneId === row.probe.id;
        const isFinalReveal = isCapstone && visibleRows > rows.length - 1;
        return (
          <li
            key={row.probe.id}
            className={[
              "grid grid-cols-[24px_1fr_auto] items-baseline gap-x-4 py-3 border-b border-rule",
              "transition-all duration-500",
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1",
              isFinalReveal ? "bg-crimson-soft/40 -mx-2 px-2 rounded" : "",
            ].join(" ")}
          >
            <span className="serif-display text-[15px] font-medium text-ink-mute tabular-nums">
              {String(row.probe.id).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="serif-display text-[18px] font-medium text-ink leading-tight">
                  {row.probe.label}
                </span>
                <span
                  className={`cat-chip ${CATEGORY_CLASS[row.probe.category] ?? ""}`}
                >
                  {row.probe.category}
                </span>
              </div>
              <p className="mt-1 text-[13px] text-ink-mute leading-snug max-w-[58ch]">
                {row.reasonShort}
              </p>
            </div>
            <Mark verdict={row.verdictPill} />
          </li>
        );
      })}
    </ol>
  );
}

function Mark({ verdict }: { verdict: "CAUGHT" | "REMEDIATION" }) {
  if (verdict === "CAUGHT") {
    return (
      <span className="serif-display italic text-[14px] text-ink animate-mark-in inline-flex items-center gap-1.5">
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
          <path
            d="M3 7.5 L6 10.5 L11 4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        caught
      </span>
    );
  }
  return (
    <span className="serif-display italic text-[14px] text-ink-mute animate-mark-in inline-flex items-center gap-1.5">
      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
        <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="1.4" />
      </svg>
      remediation
    </span>
  );
}

function TraceLog({
  rows,
  live,
}: {
  rows: Row[];
  live: boolean;
}) {
  return (
    <div className="bg-paper-2 rounded-lg border border-rule p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="eyebrow text-[10px]">Overmind · trace</span>
        <span className="flex items-center gap-1.5">
          <span
            className={`h-1.5 w-1.5 rounded-full bg-crimson ${live ? "animate-pulse-dot" : ""}`}
          />
          <span className="font-mono text-[10px] uppercase tracking-wider text-ink-mute">
            {live ? "streaming" : "idle"}
          </span>
        </span>
      </div>
      <div className="font-mono text-[10.5px] leading-relaxed space-y-1">
        {rows.length === 0 ? (
          <div className="text-ink-mute italic">waiting for audit…</div>
        ) : null}
        {rows.map((r) => (
          <div key={r.probe.id} className="grid grid-cols-[22px_1fr_auto] gap-2">
            <span className="text-ink-mute">{String(r.probe.id).padStart(2, "0")}</span>
            <span className="text-ink truncate">
              gate[{r.probe.category}]
            </span>
            <span
              className={
                r.verdictPill === "CAUGHT"
                  ? "text-crimson"
                  : "text-ink-mute"
              }
            >
              {r.verdictPill === "CAUGHT" ? "✓" : "○"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Sponsors() {
  return (
    <div className="border-t border-rule pt-4">
      <div className="eyebrow text-[10px] mb-2">Wired to</div>
      <ul className="flex flex-col gap-1.5 text-[12px]">
        {[
          ["Tavily", "live citations"],
          ["Overmind", "supervision"],
          ["Cursor SDK", "audit agent"],
          ["Alpic", "MCP host"],
        ].map(([name, role]) => (
          <li key={name} className="flex items-baseline justify-between border-b border-rule/60 pb-1">
            <span className="serif-display font-medium text-ink">{name}</span>
            <span className="font-mono text-[10.5px] text-ink-mute lowercase">
              {role}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Capstone({
  citation,
  citationFull,
  label,
}: {
  citation: string;
  citationFull: string;
  label: string;
}) {
  return (
    <figure className="rule-top pt-6 animate-fade-up">
      <div className="eyebrow flex items-center gap-2 mb-3">
        <span className="h-1.5 w-1.5 rounded-full bg-crimson" />
        <span>Capstone violation</span>
        <span className="text-rule-2 normal-case tracking-normal">·</span>
        <span className="normal-case tracking-normal font-mono text-[11px]">
          citation by Tavily
        </span>
      </div>
      <blockquote className="grid md:grid-cols-[auto_1fr] gap-x-8 gap-y-3 items-start">
        <div className="serif-display text-[34px] md:text-[44px] leading-[1.05] font-medium text-crimson whitespace-nowrap">
          {citation}
        </div>
        <div>
          <p className="serif-display text-[17px] leading-snug text-ink max-w-[60ch]">
            {citationFull}
          </p>
          <p className="mt-2 text-[12px] text-ink-mute font-mono">
            probe → {label}
          </p>
        </div>
      </blockquote>
    </figure>
  );
}

function Foot({
  onRefresh,
  onGenerateFresh,
  isRefreshing,
  isGenerating,
}: {
  onRefresh: () => void;
  onGenerateFresh: () => void;
  isRefreshing: boolean;
  isGenerating: boolean;
}) {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-4 rule-top pt-5 text-[12px]">
      <p className="text-ink-mute serif-display italic max-w-[50ch]">
        Verdicts are deterministic on stage. The agent is live, the endpoint is
        live, the audit is auditable.
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="font-mono text-[11px] uppercase tracking-wider px-3 py-2 border border-rule rounded-sm hover:bg-paper-2 disabled:opacity-50"
        >
          {isRefreshing ? "running" : "re-run"}
        </button>
        <button
          type="button"
          onClick={onGenerateFresh}
          disabled={isGenerating}
          className="font-mono text-[11px] uppercase tracking-wider px-3 py-2 bg-ink text-paper rounded-sm hover:bg-ink/90 disabled:opacity-50"
        >
          {isGenerating ? "claude…" : "generate fresh"}
        </button>
      </div>
    </footer>
  );
}

function endpointHost(url?: string): string {
  if (!url) return "the policy gate";
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

function formatStamp(iso?: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const date = d.toISOString().slice(0, 10);
  const time = d.toTimeString().slice(0, 5);
  return `${date} · ${time} BST`;
}
