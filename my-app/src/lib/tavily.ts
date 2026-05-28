// Minimal Tavily REST wrapper. Used by FairLet for two purposes:
//   1. ground the rental query — show judges that real UK web data is in
//      the loop (sidebar shows query + median count, not raw results).
//   2. pull the Equality Act citation text once at boot — cached so the
//      demo doesn't depend on a live call mid-pitch.
//
// All Tavily calls are best-effort. The seed data carries the demo regardless.

const TAVILY_ENDPOINT = "https://api.tavily.com/search";
const TAVILY_EXTRACT_ENDPOINT = "https://api.tavily.com/extract";

export type TavilyExtract = {
  ok: boolean;
  url: string;
  rawContent: string;
  errorReason?: string;
  scrapedAtISO: string;
};

// Scrape a single URL via Tavily's extract endpoint. Returns the raw markdown
// content of the page; downstream parsing pulls price/postcode/description.
export async function tavilyExtract(url: string): Promise<TavilyExtract> {
  const apiKey = process.env.TAVILY_API_KEY;
  const scrapedAtISO = new Date().toISOString();
  if (!apiKey) {
    return {
      ok: false,
      url,
      rawContent: "",
      errorReason: "TAVILY_API_KEY not set",
      scrapedAtISO,
    };
  }
  try {
    // extract_depth: "advanced" uses a headless browser — bypasses Zoopla,
    // Rightmove, and most listing-site anti-bot walls. ~2x slower but the
    // demo needs to actually scrape these sites.
    const res = await fetch(TAVILY_EXTRACT_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        urls: [url],
        include_images: false,
        extract_depth: "advanced",
      }),
    });
    if (!res.ok) {
      return {
        ok: false,
        url,
        rawContent: "",
        errorReason: `HTTP ${res.status}`,
        scrapedAtISO,
      };
    }
    const data = (await res.json()) as {
      results?: Array<{ url: string; raw_content?: string }>;
      failed_results?: Array<{ url: string; error: string }>;
    };
    const first = data.results?.[0];
    if (!first?.raw_content) {
      const failedReason =
        data.failed_results?.[0]?.error ?? "Tavily returned no content";
      return {
        ok: false,
        url,
        rawContent: "",
        errorReason: failedReason,
        scrapedAtISO,
      };
    }
    return {
      ok: true,
      url: first.url,
      rawContent: first.raw_content,
      scrapedAtISO,
    };
  } catch (err) {
    return {
      ok: false,
      url,
      rawContent: "",
      errorReason: err instanceof Error ? err.message : "unknown",
      scrapedAtISO,
    };
  }
}

export type TavilyResult = {
  url: string;
  title: string;
  snippet: string;
};

export type TavilyMetadata = {
  query: string;
  answer?: string;
  resultCount: number;
  results: TavilyResult[];
  ok: boolean;
  errorReason?: string;
  scrapedAtISO: string;
};

export async function tavilySearch(
  query: string,
  opts: { maxResults?: number; includeAnswer?: boolean } = {},
): Promise<TavilyMetadata> {
  const apiKey = process.env.TAVILY_API_KEY;
  const scrapedAtISO = new Date().toISOString();
  if (!apiKey) {
    return {
      query,
      ok: false,
      resultCount: 0,
      results: [],
      errorReason: "TAVILY_API_KEY not set",
      scrapedAtISO,
    };
  }
  try {
    const res = await fetch(TAVILY_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        query,
        max_results: opts.maxResults ?? 5,
        include_answer: opts.includeAnswer ?? false,
        search_depth: "basic",
      }),
    });
    if (!res.ok) {
      return {
        query,
        ok: false,
        resultCount: 0,
        results: [],
        errorReason: `HTTP ${res.status}`,
        scrapedAtISO,
      };
    }
    const data = (await res.json()) as {
      answer?: string;
      results?: Array<{
        url?: string;
        title?: string;
        content?: string;
      }>;
    };
    const results: TavilyResult[] = (data.results ?? [])
      .filter((r) => typeof r.url === "string" && r.url.startsWith("http"))
      .map((r) => ({
        url: String(r.url),
        title: String(r.title ?? ""),
        snippet: String(r.content ?? "").slice(0, 200),
      }));
    return {
      query,
      answer: data.answer,
      resultCount: results.length,
      results,
      ok: true,
      scrapedAtISO,
    };
  } catch (err) {
    return {
      query,
      ok: false,
      resultCount: 0,
      results: [],
      errorReason: err instanceof Error ? err.message : "unknown",
      scrapedAtISO,
    };
  }
}
