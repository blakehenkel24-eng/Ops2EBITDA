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
        search_depth: "advanced",
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
      signal: AbortSignal.timeout(12_000),
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });
    if (!res.ok) return "";
    html = await res.text();
  } catch {
    return "";
  }

  const $ = cheerio.load(html);

  // Remove non-content elements
  $(
    "script, style, noscript, head, nav, footer, header, " +
    "aside, .sidebar, .nav, .footer, .header, .menu, .breadcrumb, " +
    ".cookie, .banner, .ad, .advertisement, .social-share, " +
    ".related-posts, .comments, form, iframe, [role='navigation'], " +
    "[role='banner'], [role='complementary']"
  ).remove();

  // Prefer article/main content selectors
  const articleSelectors = [
    "article",
    "[role='main']",
    "main",
    ".post-content",
    ".article-content",
    ".entry-content",
    ".content-body",
    "#content",
    ".prose",
  ];

  let text = "";
  for (const sel of articleSelectors) {
    const el = $(sel);
    if (el.length > 0) {
      text = el.text().replace(/\s+/g, " ").trim();
      if (text.length > 200) break;
    }
  }

  // Fallback to body if no article container found
  if (text.length < 200) {
    text = $("body").text().replace(/\s+/g, " ").trim();
  }

  return text.slice(0, 8000);
}

// ─── SEC EDGAR Full-Text Search ──────────────────────────────────────────────

interface EdgarSource {
  ciks?: string[];
  display_names?: string[];
  file_date?: string;
  form?: string;
  file_type?: string;
  file_description?: string;
  adsh?: string;
  period_ending?: string;
}

interface EdgarResponse {
  hits?: {
    hits?: { _source: EdgarSource; _id: string }[];
  };
}

function buildEdgarFilingUrl(cik: string, accession: string, filename: string): string {
  const cleanCik = cik.replace(/^0+/, "");
  return `https://www.sec.gov/Archives/edgar/data/${cleanCik}/${accession}/${filename}`;
}

export async function searchEdgar(
  query: string,
  limit = 5
): Promise<ResearchSource[]> {
  // Fetch more results and filter client-side for recent filings
  const fetchSize = limit * 10;
  const url = `https://efts.sec.gov/LATEST/search-index?q=${encodeURIComponent(query)}&forms=10-K,10-Q&size=${fetchSize}`;

  let data: EdgarResponse;
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(10_000),
      headers: {
        "User-Agent": "AtlasIQ/1.0 (blakehenkel24@gmail.com)",
        Accept: "application/json",
      },
    });
    if (!res.ok) return [];
    data = (await res.json()) as EdgarResponse;
  } catch {
    return [];
  }

  const hits = data.hits?.hits ?? [];
  const sources: ResearchSource[] = [];

  // Filter for recent filings (2022+) and primary documents (not exhibits)
  const recentHits = hits.filter((h) => {
    const fileDate = h._source.file_date ?? "";
    const fileType = h._source.file_type ?? h._source.form ?? "";
    return fileDate >= "2022-01-01" && /^10-[KQ]/.test(fileType);
  });

  // Deduplicate by company (keep most recent filing per company)
  const seenCompanies = new Set<string>();
  for (const hit of recentHits) {
    if (sources.length >= limit) break;
    const s = hit._source;
    const companyKey = s.ciks?.[0] ?? "";
    if (seenCompanies.has(companyKey)) continue;
    seenCompanies.add(companyKey);

    const idParts = hit._id.split(":");
    const accession = idParts[0] ?? "";
    const filename = idParts[1] ?? "";
    const cik = s.ciks?.[0] ?? "";
    const displayName = s.display_names?.[0]?.replace(/\s*\(CIK.*/, "") ?? "Unknown";

    const filingUrl = cik && accession && filename
      ? buildEdgarFilingUrl(cik, accession, filename)
      : "";

    sources.push({
      title: `[SEC] ${displayName} — ${s.form ?? s.file_type ?? "Filing"} (${s.file_date ?? ""})`,
      url: filingUrl,
      type: "registry" as const,
      signal: "sec-edgar",
      snippet: s.file_description ?? `${s.form} filing`,
      query,
      rank: 0,
      score: 0,
    });
  }

  return sources;
}

export async function searchEdgarCompany(
  companyName: string,
  limit = 3
): Promise<ResearchSource[]> {
  // Search for the company name in quotes to get exact matches, 10-K only for depth
  const url = `https://efts.sec.gov/LATEST/search-index?q=%22${encodeURIComponent(companyName)}%22&forms=10-K&size=${limit}`;

  let data: EdgarResponse;
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(10_000),
      headers: {
        "User-Agent": "AtlasIQ/1.0 (blakehenkel24@gmail.com)",
        Accept: "application/json",
      },
    });
    if (!res.ok) return [];
    data = (await res.json()) as EdgarResponse;
  } catch {
    return [];
  }

  const hits = data.hits?.hits ?? [];
  const sources: ResearchSource[] = [];

  for (const hit of hits.slice(0, limit)) {
    const s = hit._source;
    const idParts = hit._id.split(":");
    const accession = idParts[0] ?? "";
    const filename = idParts[1] ?? "";
    const cik = s.ciks?.[0] ?? "";
    const displayName = s.display_names?.[0]?.replace(/\s*\(CIK.*/, "") ?? companyName;

    const filingUrl = cik && accession && filename
      ? buildEdgarFilingUrl(cik, accession, filename)
      : "";

    // Extract filing text for richer snippets
    let snippet = s.file_description ?? `${s.form} filing by ${displayName}`;
    if (filingUrl) {
      const pageText = await fetchPageText(filingUrl);
      if (pageText.length > 200) {
        snippet = pageText;
      }
    }

    sources.push({
      title: `[SEC] ${displayName} — ${s.form ?? "10-K"} (${s.file_date ?? ""})`,
      url: filingUrl,
      type: "registry" as const,
      signal: "sec-edgar",
      snippet,
      query: companyName,
      rank: 0,
      score: 0,
    });
  }

  return sources;
}

// ─── Query Generators ─────────────────────────────────────────────────────────

export function getMarketQueries(market: string): string[] {
  return [
    `${market} market size growth CAGR forecast segments customer end markets`,
    `${market} value chain business model margins cost structure`,
    `${market} industry KPIs EBITDA margin gross margin benchmarks`,
    `${market} valuation multiples EV EBITDA transaction multiples public comps`,
    `${market} demand drivers regulation trends cyclicality`,
    `${market} leading companies competitors market share`,
    `${market} private equity acquisitions M&A sponsor-backed companies`,
    `${market} unit economics capex working capital retention churn utilization`,
  ];
}

export function getCompanyQueries(company: string): string[] {
  return [
    `${company} company overview products services customers`,
    `${company} competitors market positioning alternatives`,
    `${company} ownership funding investors acquisition private equity`,
    `${company} revenue growth employees locations leadership`,
    `${company} customer reviews case studies contracts partnerships`,
    `${company} industry market size growth drivers end markets`,
    `${company} risks lawsuits regulation complaints`,
    `${company} platform add-on acquisition sponsor fit`,
  ];
}

// ─── Gather Sources ───────────────────────────────────────────────────────────

export async function gatherSources(
  queries: string[],
  tavilyApiKey?: string,
  mode?: "market" | "company" | "chat"
): Promise<ResearchSource[]> {
  // Primary search: Tavily (preferred) or DuckDuckGo
  const primaryResults = await Promise.all(
    queries.map((q) =>
      tavilyApiKey
        ? searchTavily(q, tavilyApiKey)
        : searchDuckDuckGo(q)
    )
  );

  // SEC EDGAR: run sector/company-relevant queries in parallel
  const edgarQueries = queries
    .filter((q) =>
      /market size|revenue|margin|growth|M&A|acquisition|competitor/i.test(q)
    )
    .slice(0, 3);

  const edgarResults = await Promise.all(
    edgarQueries.map((q) => searchEdgar(q, 3))
  );

  const flat = [...primaryResults.flat(), ...edgarResults.flat()];

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
