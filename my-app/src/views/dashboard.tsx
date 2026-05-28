import "@/index.css";

import { useToolInfo } from "../helpers.js";

export default function Dashboard() {
  const { output, isPending } = useToolInfo<"show-dashboard">();

  if (isPending && !output) return null;
  if (!output) return null;

  const lastAudit = formatStamp(output.lastAuditISO);

  return (
    <div className="bg-dotgrid text-ink rounded-2xl border border-rule overflow-hidden">
      <div className="mx-auto max-w-5xl px-8 md:px-12 py-10 md:py-12 flex flex-col gap-10">
        <header>
          <div className="eyebrow flex items-center gap-3">
            <span>Publisher · Yield Ledger</span>
            <span className="text-rule-2">·</span>
            <time className="font-mono normal-case tracking-normal">
              last audit {lastAudit}
            </time>
          </div>
          <h1 className="serif-display mt-3 text-[clamp(2rem,4vw,3rem)] font-medium leading-[1.05] text-ink">
            Tonight's yield.
          </h1>
          <p className="serif-display italic mt-3 text-[17px] text-ink-mute leading-snug max-w-[44ch]">
            Two numbers every AI publisher needs to show advertisers, side by side.
          </p>
        </header>

        <section className="grid md:grid-cols-2 gap-x-12 gap-y-8 rule-top pt-8">
          <Stat
            eyebrow="Measurement"
            value={`${output.trustScore.caught}/${output.trustScore.total}`}
            label="Publisher Trust Score"
            footnote={`${output.trustScore.percent}% caught · ${output.trustScore.total - output.trustScore.caught} remediation suggested`}
          />
          <Stat
            eyebrow="Sell-side"
            value={`£${output.trustAdjustedCpmGBP.toFixed(2)}`}
            label="Trust-Adjusted CPM"
            footnote={`${output.multiplier.toFixed(2)}× baseline (£${output.baselineCpmGBP.toFixed(2)})`}
            accent
          />
        </section>

        <section className="rule-top pt-8">
          <div className="eyebrow mb-4">Tonight's traffic</div>
          <dl className="grid grid-cols-3 gap-6 md:gap-12">
            <Counter
              n={output.servedCount}
              label="Served"
              note="passed gate"
              hue="sage"
            />
            <Counter
              n={output.flaggedCount}
              label="Flagged"
              note="human review"
              hue="amber"
            />
            <Counter
              n={output.blockedCount}
              label="Blocked"
              note="policy block"
              hue="crimson"
            />
          </dl>
        </section>

        <footer className="rule-top pt-5 flex flex-wrap justify-between gap-3 text-[12px]">
          <span className="text-ink-mute serif-display italic">
            A publisher's report card. Audited every minute, billed every hour.
          </span>
          <span className="font-mono text-ink-mute text-[11px]">
            overmind · alpic · cursor · tavily
          </span>
        </footer>
      </div>
    </div>
  );
}

function Stat({
  eyebrow,
  value,
  label,
  footnote,
  accent,
}: {
  eyebrow: string;
  value: string;
  label: string;
  footnote: string;
  accent?: boolean;
}) {
  return (
    <article>
      <div className="eyebrow flex items-center gap-2">
        <span
          className={`h-1.5 w-1.5 rounded-full ${accent ? "bg-crimson" : "bg-ink"}`}
        />
        {eyebrow}
      </div>
      <div
        className={`serif-display mt-3 text-[clamp(3.5rem,8vw,6rem)] leading-[0.9] font-medium tabular-nums ${
          accent ? "text-crimson" : "text-ink"
        }`}
        style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
      >
        {value}
      </div>
      <div className="mt-2 serif-display text-[19px] font-medium text-ink">
        {label}
      </div>
      <p className="mt-1 serif-display italic text-[13.5px] text-ink-mute max-w-[36ch]">
        {footnote}
      </p>
    </article>
  );
}

function Counter({
  n,
  label,
  note,
  hue,
}: {
  n: number;
  label: string;
  note: string;
  hue: "sage" | "amber" | "crimson";
}) {
  const dot =
    hue === "sage"
      ? "bg-emerald-600"
      : hue === "amber"
        ? "bg-amber-600"
        : "bg-crimson";
  return (
    <div className="flex items-baseline gap-4">
      <span
        className="serif-display text-[44px] md:text-[56px] leading-none font-medium tabular-nums text-ink"
        style={{ fontVariationSettings: '"opsz" 96' }}
      >
        {n}
      </span>
      <div>
        <div className="serif-display text-[16px] text-ink flex items-center gap-2">
          <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
          {label}
        </div>
        <div className="font-mono text-[11px] text-ink-mute lowercase mt-0.5">
          {note}
        </div>
      </div>
    </div>
  );
}

function formatStamp(iso?: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.toISOString().slice(0, 10)} · ${d.toTimeString().slice(0, 5)} BST`;
}
