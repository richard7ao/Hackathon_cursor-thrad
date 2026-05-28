import "@/index.css";

import { useToolInfo } from "../helpers.js";

export default function PlacementDecision() {
  const { output, isPending } = useToolInfo<"check-placement">();

  if (isPending && !output) return null;
  if (!output) return null;

  const verdictColor =
    output.decision === "serve"
      ? "text-ink"
      : output.decision === "flag"
        ? "text-amber-700"
        : "text-crimson";

  return (
    <div className="bg-dotgrid text-ink rounded-2xl border border-rule overflow-hidden">
      <div className="mx-auto max-w-3xl px-8 md:px-12 py-10 flex flex-col gap-8">
        <header>
          <div className="eyebrow flex items-center gap-3">
            <span>Policy gate · verdict</span>
            <span className="text-rule-2">·</span>
            <span className="font-mono normal-case tracking-normal">
              case {caseId(output)}
            </span>
          </div>
          <div className="mt-4 grid md:grid-cols-[auto_1fr] gap-x-10 gap-y-3 items-baseline">
            <div
              className={`serif-display text-[80px] md:text-[110px] leading-[0.85] font-medium uppercase tracking-tight ${verdictColor}`}
              style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
            >
              {output.decision}
            </div>
            <div>
              {output.listing ? (
                <ListingHeader listing={output.listing} />
              ) : null}
              {output.probe ? (
                <p className="serif-display text-[16px] text-ink">
                  Probe:{" "}
                  <span className="italic">{output.probe.label}</span>
                </p>
              ) : null}
              {output.advertiserConfig ? (
                <p className="serif-display text-[15px] text-ink">
                  Advertiser:{" "}
                  <span className="italic">
                    {output.advertiserConfig.advertiserName}
                  </span>
                </p>
              ) : null}
            </div>
          </div>
        </header>

        <section className="rule-top pt-6">
          <div className="eyebrow mb-3">Reasoning</div>
          <ol className="flex flex-col gap-2">
            {output.reasons.map((r, i) => (
              <li
                key={i}
                className="grid grid-cols-[24px_1fr] gap-x-3 serif-display text-[16px] leading-snug text-ink"
              >
                <span className="text-ink-mute italic tabular-nums">{i + 1}.</span>
                <span>{r}</span>
              </li>
            ))}
          </ol>
        </section>

        {output.citationFull ? (
          <section className="rule-top pt-6">
            <div className="eyebrow flex items-center gap-2 mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-crimson" />
              <span>Statutory citation</span>
            </div>
            <div className="grid md:grid-cols-[auto_1fr] gap-x-6 gap-y-2 items-baseline">
              <div className="serif-display text-[24px] md:text-[32px] leading-[1.05] font-medium text-crimson whitespace-nowrap">
                {output.citation}
              </div>
              <p className="serif-display text-[15px] text-ink leading-snug">
                {output.citationFull}
              </p>
            </div>
          </section>
        ) : null}

        {output.advertiserConfig ? (
          <section className="rule-top pt-6">
            <div className="eyebrow mb-3">Advertiser config</div>
            <pre className="font-mono text-[11px] text-ink-mute bg-paper-2 border border-rule rounded p-3 overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {JSON.stringify(output.advertiserConfig, null, 2)}
            </pre>
          </section>
        ) : null}

        <footer className="rule-top pt-5 grid grid-cols-4 gap-4 text-[11px] font-mono">
          <ScoreCell label="discrim" v={output.scores.discrimination} />
          <ScoreCell label="fraud" v={output.scores.fraud} />
          <ScoreCell label="brand-safety" v={output.scores.brandSafety} />
          <ScoreCell label="quality" v={output.scores.quality} />
        </footer>

        {typeof output.forfeitedRevenueGBP === "number" ? (
          <div className="text-[12px] text-ink-mute serif-display italic">
            Sponsor revenue forfeited:{" "}
            <span className="font-mono not-italic">
              £{output.forfeitedRevenueGBP.toFixed(2)}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ListingHeader({
  listing,
}: {
  listing: {
    title: string;
    address: string;
    postcode: string;
    monthlyRentGBP: number;
    imageEmoji: string;
  };
}) {
  return (
    <p className="serif-display text-[18px] text-ink leading-snug">
      <span className="text-2xl mr-2" aria-hidden>
        {listing.imageEmoji}
      </span>
      <span className="font-medium">{listing.title}</span>
      <span className="text-rule-2 mx-2">·</span>
      <span className="text-ink-mute italic">{listing.address}</span>
      <span className="text-rule-2 mx-2">·</span>
      <span className="font-mono not-italic text-[14px]">
        £{listing.monthlyRentGBP.toLocaleString()}/mo
      </span>
    </p>
  );
}

function ScoreCell({ label, v }: { label: string; v: number }) {
  return (
    <div>
      <div className="h-1 bg-rule overflow-hidden">
        <div
          className="h-full bg-ink"
          style={{ width: `${Math.min(100, Math.round(v * 100))}%` }}
        />
      </div>
      <div className="mt-1 flex items-baseline justify-between">
        <span className="text-ink-mute lowercase tracking-wide">{label}</span>
        <span className="text-ink tabular-nums">{v.toFixed(2)}</span>
      </div>
    </div>
  );
}

function caseId(output: any): string {
  if (output?.listing?.id) return output.listing.id;
  if (typeof output?.probe?.id === "number")
    return `P${String(output.probe.id).padStart(2, "0")}`;
  if (output?.advertiserConfig?.advertiserName)
    return output.advertiserConfig.advertiserName.toLowerCase().replace(/\s+/g, "-");
  return "ad-hoc";
}
