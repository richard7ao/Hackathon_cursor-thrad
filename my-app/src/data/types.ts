// FairLet — shared types for the policy gate, listings, audit probes, and dashboard.

export type Listing = {
  id: string;
  title: string;
  address: string;
  postcode: string;
  bedrooms: number;
  monthlyRentGBP: number;
  petFriendly: boolean;
  imageEmoji: string;
  sponsoredBy?: string;
  isScam?: boolean;
  scamSignal?: string;
  source?: string;
};

export type AdvertiserConfig = {
  advertiserName: string;
  targetingExclude?: string[];
  targetingInclude?: string[];
};

export type ProbeCategory =
  | "discrimination"
  | "fraud"
  | "brand-safety"
  | "security"
  | "gdpr"
  | "quality";

export type ProbeVerdict = "CAUGHT" | "REMEDIATION";

export type AuditProbe = {
  id: number;
  label: string;
  category: ProbeCategory;
  attackPayload: string;
  verdict: ProbeVerdict;
  reasonShort: string;
  citation?: string;
  citationFull?: string;
};

export type PlacementDecision = "serve" | "flag" | "block";

export type PlacementResult = {
  decision: PlacementDecision;
  reasons: string[];
  citation?: string;
  citationFull?: string;
  scores: {
    discrimination: number;
    fraud: number;
    brandSafety: number;
    quality: number;
  };
  forfeitedRevenueGBP?: number;
};

export type DashboardMetrics = {
  trustScore: { caught: number; total: number; percent: number };
  trustAdjustedCpmGBP: number;
  baselineCpmGBP: number;
  multiplier: number;
  servedCount: number;
  flaggedCount: number;
  blockedCount: number;
  lastAuditISO: string;
};
