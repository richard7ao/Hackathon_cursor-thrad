import { describe, expect, it } from "vitest";
import {
  LISTINGS,
  POSTCODE_MEDIAN_GBP,
  getListing,
  searchListings,
} from "../src/data/listings.js";

describe("seed listings inventory", () => {
  it("seeds exactly 12 listings", () => {
    expect(LISTINGS).toHaveLength(12);
  });

  it("contains exactly one planted scam (L-012)", () => {
    const scams = LISTINGS.filter((l) => l.isScam);
    expect(scams).toHaveLength(1);
    expect(scams[0].id).toBe("L-012");
    expect(scams[0].postcode).toMatch(/^SE16/);
    expect(scams[0].monthlyRentGBP).toBe(950);
  });

  it("contains exactly one sponsored listing (Pemberton, L-002)", () => {
    const sponsored = LISTINGS.filter((l) => l.sponsoredBy);
    expect(sponsored).toHaveLength(1);
    expect(sponsored[0].id).toBe("L-002");
    expect(sponsored[0].sponsoredBy).toBe("Pemberton & Co");
  });

  it("getListing returns the listing by id", () => {
    expect(getListing("L-001")?.title).toBe("Westminster Court");
    expect(getListing("L-NOPE")).toBeUndefined();
  });

  it("provides medians for the postcodes referenced in seed data", () => {
    expect(POSTCODE_MEDIAN_GBP["SE1"]).toBeDefined();
    expect(POSTCODE_MEDIAN_GBP["SE16"]).toBeDefined();
    expect(POSTCODE_MEDIAN_GBP["E14"]).toBeDefined();
  });
});

describe("searchListings — Beat 2's renter query", () => {
  it("the canonical demo query returns 3 listings, all SE1, 2-bed, pet-friendly, under £2K", () => {
    const results = searchListings(
      "2-bed under £2k near London Bridge, pet-friendly",
    );
    expect(results).toHaveLength(3);
    for (const r of results) {
      expect(r.bedrooms).toBe(2);
      expect(r.petFriendly).toBe(true);
      expect(r.monthlyRentGBP).toBeLessThanOrEqual(2000);
      expect(r.postcode).toMatch(/^SE1\s/);
      expect(r.isScam).not.toBe(true);
    }
  });

  it("includes the Pemberton sponsored listing in the demo query results", () => {
    const results = searchListings(
      "2-bed under £2k near London Bridge, pet-friendly",
    );
    const sponsored = results.find((r) => r.sponsoredBy);
    expect(sponsored?.sponsoredBy).toBe("Pemberton & Co");
  });

  it("never returns the scam listing through normal search", () => {
    const results = searchListings("2-bed Bermondsey under £1000");
    for (const r of results) {
      expect(r.isScam).not.toBe(true);
    }
  });

  it("respects a budget extracted from the query", () => {
    const results = searchListings("under £1600");
    for (const r of results) {
      expect(r.monthlyRentGBP).toBeLessThanOrEqual(1600);
    }
  });

  it("filters by pet-friendliness when the renter mentions a dog", () => {
    const results = searchListings("2-bed with my dog");
    for (const r of results) {
      expect(r.petFriendly).toBe(true);
    }
  });
});
