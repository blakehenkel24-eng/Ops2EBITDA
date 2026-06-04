import * as cheerio from "cheerio";
import type { ResearchSource } from "./types";

// ─── DuckDuckGo HTML Scraper ──────────────────────────────────────────────────

export async function searchDuckDuckGo(
  query: string,
  limit = 4
): Promise<ResearchSource[]> {
  const url = `https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`;

  let html: string;
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(10_000),
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; AtlasIQ/1.0; research-bot)",
      },
    });
    if (!res.ok) return [];
    html = await res.text();
  } catch {
    return [];
  }

  const $ = cheerio.load(html);
  const results: ResearchSource[] = [];

  $(".result").each((_i, el) => {
    if (results.length >= limit) return false;

    const titleEl = $(el).find(".result__title a");
    const snippetEl = $(el).find(".result__snippet");

    const rawHref = titleEl.attr("href") ?? "";
    const title = titleEl.text().trim();
    const snippet = snippetEl.text().trim();

    // Normalize DDG redirect URLs — extract `uddg` param
    let resolvedUrl = rawHref;
    try {
      const parsed = new URL(rawHref, "https://duckduckgo.com");
      const uddg = parsed.searchParams.get("uddg");
      if (uddg) resolvedUrl = decodeURIComponent(uddg);
    } catch {
      // keep rawHref
    }

    if (!resolvedUrl || !title) return;

    results.push({
      title,
      url: resolvedUrl,
      type: "web",
      signal: "duckduckgo",
      snippet,
      query,
      rank: 0,
      score: 0,
    });
  });

  return results;
}

// ─── Tavily REST Adapter ──────────────────────────────────────────────────────

interface TavilyResult {
  title: string;
  url: string;
  content: string;
  score?: number;
}

interface TavilyResponse {
  results?: TavilyResult[];
}

export async function searchTavily(
  query: string,
  apiKey: string,
  limit = 4
): Promise<ResearchSource[]> {
  let data: TavilyResponse;
  try {
    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      signal: AbortSignal.timeout(15_000),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        query,
        max_results: limit,
        search_depth: "basic",
        include_answer: false,
        include_raw_content: false,
      }),
    });
    if (!res.ok) return [];
    data = (await res.json()) as TavilyResponse;
  } catch {
    return [];
  }

  return (data.results ?? []).slice(0, limit).map((r) => ({
    title: r.title ?? "",
    url: r.url ?? "",
    type: "tavily" as const,
    signal: "tavily",
    snippet: r.content ?? "",
    query,
    rank: 0,
    score: 0,
  }));
}

// ─── Page Text Fetcher ────────────────────────────────────────────────────────

export async function fetchPageText(url: string): Promise<string> {
  let html: string;
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(10_000),
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; AtlasIQ/1.0; research-bot)",
      },
    });
    if (!res.ok) return "";
    html = await res.text();
  } catch {
    return "";
  }

  const $ = cheerio.load(html);
  $("script, style, noscript, head").remove();

  const text = $("body").text().replace(/\s+/g, " ").trim();
  return text.slice(0, 3000);
}

// ─── Query Generators ─────────────────────────────────────────────────────────

export function getMarketQueries(market: string): string[] {
  return [
    `${market} market size revenue growth 2024`,
    `${market} industry analysis private equity investment`,
    `${market} CAGR forecast market research report`,
    `${market} acquisition M&A deal activity`,
    `${market} market fragmentation competitors landscape`,
  ];
}

export function getCompanyQueries(company: string): string[] {
  return [
    `${company} company revenue EBITDA financials`,
    `${company} acquisition merger private equity sponsor`,
    `${company} business model market position competitors`,
    `${company} management team history founding`,
  ];
}

// ─── Gather Sources ───────────────────────────────────────────────────────────

export async function gatherSources(
  queries: string[],
  tavilyApiKey?: string
): Promise<ResearchSource[]> {
  const results = await Promise.all(
    queries.map((q) =>
      tavilyApiKey
        ? searchTavily(q, tavilyApiKey)
        : searchDuckDuckGo(q)
    )
  );

  const flat = results.flat();

  // Deduplicate by URL (prefer first occurrence), then by title if no URL
  const seenUrls = new Set<string>();
  const seenTitles = new Set<string>();
  const deduped: ResearchSource[] = [];

  for (const source of flat) {
    const urlKey = source.url.trim().toLowerCase();
    const titleKey = source.title.trim().toLowerCase();

    if (urlKey && seenUrls.has(urlKey)) continue;
    if (!urlKey && titleKey && seenTitles.has(titleKey)) continue;

    if (urlKey) seenUrls.add(urlKey);
    if (titleKey) seenTitles.add(titleKey);
    deduped.push(source);
  }

  return deduped;
}
