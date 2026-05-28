import "@/index.css";

import { useCallTool, useToolInfo } from "../helpers.js";

export default function RentalResults() {
  const { input, output, isPending } = useToolInfo<"search-rentals">();
  const { callTool: checkPlacement } = useCallTool("check-placement");

  if (isPending && !output) {
    return (
      <Page>
        <p className="serif-display italic text-ink-mute text-[18px]">
          Searching rentals…
        </p>
      </Page>
    );
  }

  if (!output) return null;

  return (
    <Page>
      <header className="grid md:grid-cols-[1fr_220px] gap-x-10 gap-y-3 items-end">
        <div>
          <div className="eyebrow flex items-center gap-3">
            <span>FairLet · Concierge · query</span>
            <span className="text-rule-2">·</span>
            <SourceTag generatedBy={output.generatedBy} />
          </div>
          <h1 className="serif-display italic mt-3 text-[clamp(1.6rem,3vw,2.2rem)] font-medium leading-[1.1] text-ink">
            "{input.query}"
          </h1>
          <p className="serif-display mt-3 text-[15px] text-ink-mute leading-snug max-w-[52ch]">
            {output.listings.length} listings in{" "}
            <span className="font-medium text-ink">{output.postcodeArea}</span>
            ; the policy gate cleared all served placements.
            {output.generatedBy === "claude" ? (
              <>
                {" "}
                <span className="italic">
                  Listings synthesised live for this query.
                </span>
              </>
            ) : null}
          </p>
        </div>
        <TavilyCallout
          tavily={output.tavily}
          postcodeArea={output.postcodeArea}
          medianRentGBP={output.medianRentGBP}
        />
      </header>

      <ol className="flex flex-col rule-top pt-2">
        {output.listings.map((l, i) => (
          <ListingRow
            key={l.id}
            index={i + 1}
            listing={l}
            onInspect={() => checkPlacement({ listingId: l.id })}
          />
        ))}
        {output.listings.length === 0 ? (
          <li className="py-6 text-center serif-display italic text-ink-mute">
            No matching listings.
          </li>
        ) : null}
      </ol>
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

function SourceTag({ generatedBy }: { generatedBy?: string }) {
  if (generatedBy === "claude") {
    return (
      <span className="font-mono text-[11px] uppercase tracking-wider text-crimson flex items-center gap-1.5 normal-case tracking-[0.12em]">
        <span className="h-1.5 w-1.5 rounded-full bg-crimson animate-pulse-dot" />
        claude live
      </span>
    );
  }
  if (generatedBy === "fallback") {
    return (
      <span className="font-mono text-[11px] uppercase tracking-wider text-ink-mute flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-ink-mute" />
        fallback
      </span>
    );
  }
  return (
    <span className="font-mono text-[11px] uppercase tracking-wider text-ink-mute">
      inventory
    </span>
  );
}

type Listing = {
  id: string;
  title: string;
  address: string;
  postcode: string;
  bedrooms: number;
  monthlyRentGBP: number;
  petFriendly: boolean;
  imageEmoji: string;
  sponsoredBy?: string;
  sourceUrl?: string;
};

function ListingRow({
  index,
  listing,
  onInspect,
}: {
  index: number;
  listing: Listing;
  onInspect: () => void;
}) {
  const sponsored = Boolean(listing.sponsoredBy);
  return (
    <li
      className={`grid grid-cols-[28px_42px_1fr_auto] items-baseline gap-x-5 py-5 border-b border-rule ${
        sponsored ? "bg-amber-soft/30 -mx-2 px-2 rounded" : ""
      }`}
    >
      <span className="serif-display text-[15px] text-ink-mute tabular-nums">
        {String(index).padStart(2, "0")}
      </span>
      <span className="text-3xl" aria-hidden>
        {listing.imageEmoji}
      </span>
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="serif-display text-[19px] font-medium text-ink leading-tight">
            {listing.title}
          </span>
          {sponsored ? (
            <span className="font-mono text-[10px] uppercase tracking-wider text-crimson">
              ◆ sponsored · {listing.sponsoredBy}
            </span>
          ) : null}
        </div>
        <p className="mt-1 text-[13px] text-ink-mute leading-snug">
          {listing.address}
          <span className="text-rule-2 mx-2">·</span>
          <span className="font-mono">{listing.postcode}</span>
          <span className="text-rule-2 mx-2">·</span>
          {listing.bedrooms}-bed
          {listing.petFriendly ? (
            <>
              <span className="text-rule-2 mx-2">·</span>pet-friendly
            </>
          ) : null}
        </p>
      </div>
      <div className="text-right">
        <div
          className="serif-display text-[22px] font-medium tabular-nums text-ink leading-none"
          style={{ fontVariationSettings: '"opsz" 96' }}
        >
          £{listing.monthlyRentGBP.toLocaleString()}
          <span className="text-ink-mute text-[12px] ml-1 font-normal">
            /mo
          </span>
        </div>
        <div className="mt-1.5 flex justify-end gap-3 items-baseline">
          {listing.sourceUrl ? (
            <a
              href={listing.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[10px] uppercase tracking-wider text-crimson hover:underline"
            >
              view on zoopla ↗
            </a>
          ) : null}
          <button
            type="button"
            onClick={onInspect}
            className="font-mono text-[10px] uppercase tracking-wider text-ink-mute hover:text-ink"
          >
            inspect gate →
          </button>
        </div>
      </div>
    </li>
  );
}

function TavilyCallout({
  tavily,
  postcodeArea,
  medianRentGBP,
}: {
  tavily?: {
    query: string;
    ok: boolean;
    resultCount: number;
    scrapedAtISO: string;
    errorReason?: string;
  };
  postcodeArea: string;
  medianRentGBP: number;
}) {
  return (
    <aside className="border-l border-rule pl-5">
      <div className="eyebrow text-[10px] mb-2">Tavily · grounding</div>
      <dl className="text-[12px] space-y-2">
        <Row label="query">
          <span className="font-mono text-[10.5px] break-words">
            {tavily?.query ?? "—"}
          </span>
        </Row>
        <Row label={`${postcodeArea} median rent`}>
          <span className="font-mono tabular-nums">£{medianRentGBP}/mo</span>
        </Row>
        <Row label="live web">
          <span className="font-mono tabular-nums">
            {tavily?.ok ? `${tavily.resultCount} sources` : "cache"}
          </span>
        </Row>
      </dl>
      <div className="mt-3 font-mono text-[10px] text-ink-mute">
        {tavily?.scrapedAtISO?.replace("T", " ").slice(0, 16) ?? "—"}
      </div>
    </aside>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-ink-mute lowercase font-mono text-[10px] tracking-wider">
        {label}
      </dt>
      <dd className="text-ink mt-0.5">{children}</dd>
    </div>
  );
}
