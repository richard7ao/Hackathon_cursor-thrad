import type { Listing } from "./types.js";

// Builds a Rightmove search URL for a postcode + bedrooms. Real, clickable,
// returns actual UK rental inventory. Better than a fake specific-listing
// URL we can't keep alive.
function rightmoveSearchUrl(postcode: string, bedrooms: number): string {
  const outcode = postcode.split(" ")[0];
  return `https://www.rightmove.co.uk/property-to-rent/find.html?searchType=RENT&locationIdentifier=POSTCODE%5E${encodeURIComponent(
    outcode,
  )}&minBedrooms=${bedrooms}&maxBedrooms=${bedrooms}&radius=0.25`;
}

// 12 seeded London rentals. 3 around London Bridge (one sponsored) for the
// demo's legitimate query. 1 planted scam. Others for variety / unscripted
// queries. Every listing carries a real Rightmove search URL so the "view
// listing ↗" link in the UI is genuinely clickable.
export const LISTINGS: Listing[] = decorateWithSourceUrls([
  // ── Beat 2: legitimate London-Bridge results ───────────────────────────
  {
    id: "L-001",
    title: "Westminster Court",
    address: "Park Street",
    postcode: "SE1 9AB",
    bedrooms: 2,
    monthlyRentGBP: 1850,
    petFriendly: true,
    imageEmoji: "🏛️",
  },
  {
    id: "L-002",
    title: "Pemberton & Co — Riverside",
    address: "Bankside Lofts",
    postcode: "SE1 9BU",
    bedrooms: 2,
    monthlyRentGBP: 1950,
    petFriendly: true,
    imageEmoji: "🌆",
    sponsoredBy: "Pemberton & Co",
  },
  {
    id: "L-003",
    title: "Riverside Apartments",
    address: "Hopton Street",
    postcode: "SE1 9JH",
    bedrooms: 2,
    monthlyRentGBP: 1890,
    petFriendly: true,
    imageEmoji: "🏢",
  },

  // ── Variety / filler ───────────────────────────────────────────────────
  {
    id: "L-004",
    title: "Tower Bridge Heights",
    address: "Queen Elizabeth Street",
    postcode: "SE1 2LP",
    bedrooms: 1,
    monthlyRentGBP: 1400,
    petFriendly: false,
    imageEmoji: "🌉",
  },
  {
    id: "L-005",
    title: "Borough Market Lofts",
    address: "Stoney Street",
    postcode: "SE1 9AA",
    bedrooms: 2,
    monthlyRentGBP: 2100,
    petFriendly: true,
    imageEmoji: "🏬",
  },
  {
    id: "L-006",
    title: "Greenwich Park Mews",
    address: "Maze Hill",
    postcode: "SE10 8XJ",
    bedrooms: 2,
    monthlyRentGBP: 1700,
    petFriendly: true,
    imageEmoji: "🌳",
  },
  {
    id: "L-007",
    title: "Southbank View",
    address: "Belvedere Road",
    postcode: "SE1 8XR",
    bedrooms: 3,
    monthlyRentGBP: 2400,
    petFriendly: false,
    imageEmoji: "🎡",
  },
  {
    id: "L-008",
    title: "Canary Wharf Tower",
    address: "Marsh Wall",
    postcode: "E14 9SH",
    bedrooms: 2,
    monthlyRentGBP: 2200,
    petFriendly: true,
    imageEmoji: "🏙️",
  },
  {
    id: "L-009",
    title: "Bermondsey Square",
    address: "Tower Bridge Road",
    postcode: "SE1 3UN",
    bedrooms: 2,
    monthlyRentGBP: 1800,
    petFriendly: true,
    imageEmoji: "🏘️",
  },
  {
    id: "L-010",
    title: "Shad Thames Wharf",
    address: "Butler's Wharf",
    postcode: "SE1 2YA",
    bedrooms: 1,
    monthlyRentGBP: 1650,
    petFriendly: false,
    imageEmoji: "⚓",
  },
  {
    id: "L-011",
    title: "Elephant Park Residences",
    address: "Walworth Road",
    postcode: "SE17 1RL",
    bedrooms: 2,
    monthlyRentGBP: 1750,
    petFriendly: true,
    imageEmoji: "🐘",
  },

  // ── Beat 3: planted scam ───────────────────────────────────────────────
  {
    id: "L-012",
    title: "Cosy 2-bed · Bermondsey",
    address: "Spa Road",
    postcode: "SE16 3SE",
    bedrooms: 2,
    monthlyRentGBP: 950, // 56% below SE16 median of £2,180
    petFriendly: true,
    imageEmoji: "🛏️",
    isScam: true,
    scamSignal:
      "Off-platform deposit demanded ('wire to verify, viewing this evening only'). Listed 56% below postcode median.",
    source: "Synthetic scam pattern · modeled on Bermondsey wire-deposit scams",
  },
]);

function decorateWithSourceUrls(items: Listing[]): Listing[] {
  return items.map((l) => ({
    ...l,
    sourceUrl: l.sourceUrl ?? rightmoveSearchUrl(l.postcode, l.bedrooms),
  }));
}

// Median rent per postcode, used by the scam-detector sub-agent to compute
// price deviation. Numbers approximate UK 2025 market data.
export const POSTCODE_MEDIAN_GBP: Record<string, number> = {
  "SE1": 2150,
  "SE10": 1850,
  "SE16": 2180,
  "SE17": 1700,
  "E14": 2350,
};

export function getListing(id: string): Listing | undefined {
  return LISTINGS.find((l) => l.id === id);
}

// The canonical demo query terms — the screenplay's beat 2 prompt
// ("2-bed under £2k near London Bridge, pet-friendly") and close variants.
// Only matches against this canonical inventory; off-script queries return
// an empty array so the server can fall through to Claude live generation.
export function searchListings(query: string): Listing[] {
  const q = query.toLowerCase();
  const wantsLondonBridge =
    q.includes("london bridge") ||
    q.includes("se1") ||
    q.includes("southwark") ||
    q.includes("bankside");
  if (!wantsLondonBridge) return [];

  const wants2Bed = q.includes("2-bed") || q.includes("2 bed") || q.includes("two bed");
  const wantsPets =
    q.includes("pet") || q.includes("dog") || q.includes("cat");
  const budgetMatch = q.match(/(?:under|max|<=?)\s*£?(\d[\d,.]*)\s*(k|m)?/i);
  let budget = 2000;
  if (budgetMatch) {
    const num = Number(budgetMatch[1].replace(/,/g, ""));
    const suffix = budgetMatch[2]?.toLowerCase();
    budget = suffix === "k" ? num * 1000 : suffix === "m" ? num * 1_000_000 : num;
  }

  return LISTINGS.filter((l) => !l.isScam)
    .filter((l) => l.monthlyRentGBP <= budget)
    .filter((l) => (wants2Bed ? l.bedrooms === 2 : true))
    .filter((l) => (wantsPets ? l.petFriendly : true))
    .filter((l) => l.postcode.startsWith("SE1 "))
    .slice(0, 3);
}
