// Minimal Tavily REST wrapper. Used by FairLet for two purposes:
//   1. ground the rental query — show judges that real UK web data is in
//      the loop (sidebar shows query + median count, not raw results).
//   2. pull the Equality Act citation text once at boot — cached so the
//      demo doesn't depend on a live call mid-pitch.
//
// All Tavily calls are best-effort. The seed data carries the demo regardless.

const TAVILY_ENDPOINT = "https://api.tavily.com/search";

export type TavilyMetadata = {
  query: string;
  answer?: string;
  resultCount: number;
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
        errorReason: `HTTP ${res.status}`,
        scrapedAtISO,
      };
    }
    const data = (await res.json()) as {
      answer?: string;
      results?: unknown[];
    };
    return {
      query,
      answer: data.answer,
      resultCount: data.results?.length ?? 0,
      ok: true,
      scrapedAtISO,
    };
  } catch (err) {
    return {
      query,
      ok: false,
      resultCount: 0,
      errorReason: err instanceof Error ? err.message : "unknown",
      scrapedAtISO,
    };
  }
}
