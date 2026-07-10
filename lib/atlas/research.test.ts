import { afterEach, expect, test, vi } from "vitest";
import { gatherSources, getCompanyQueries, getMarketQueries } from "./research";

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

test("market query plan covers deeper public evidence lanes", () => {
  const queries = getMarketQueries("industrial sanitation");

  expect(queries.length).toBeGreaterThanOrEqual(14);
  expect(queries.some((q) => /trade association/i.test(q))).toBe(true);
  expect(queries.some((q) => /regulatory compliance/i.test(q))).toBe(true);
  expect(queries.some((q) => /public companies.*10-K/i.test(q))).toBe(true);
  expect(queries.some((q) => /fragmentation.*roll-up/i.test(q))).toBe(true);
});

test("company query plan covers ownership, operations, regulatory, and news signals", () => {
  const queries = getCompanyQueries("StartKleen");

  expect(queries.length).toBeGreaterThanOrEqual(12);
  expect(queries.some((q) => /official website/i.test(q))).toBe(true);
  expect(queries.some((q) => /parent company.*press release/i.test(q))).toBe(true);
  expect(queries.some((q) => /regulatory compliance/i.test(q))).toBe(true);
  expect(queries.some((q) => /jobs hiring/i.test(q))).toBe(true);
});

test("gatherSources honors deep research search and EDGAR limits", async () => {
  const fetchMock = vi.fn(async (input: string | URL | Request, init?: RequestInit) => {
    const url = input.toString();

    if (url.includes("api.tavily.com")) {
      const body = JSON.parse(String(init?.body));
      return Response.json({
        results: Array.from({ length: body.max_results }, (_value, index) => ({
          title: `${body.query} result ${index + 1}`,
          url: `https://example.com/${encodeURIComponent(body.query)}/${index + 1}`,
          content: "A source discussing revenue, margin, growth, and market structure.",
        })),
      });
    }

    if (url.includes("efts.sec.gov")) {
      return Response.json({
        hits: {
          hits: [
            {
              _id: "0000123456:primary-document.htm",
              _source: {
                ciks: ["0000123456"],
                display_names: ["Reference Public Co (CIK 0000123456)"],
                file_date: "2025-02-01",
                form: "10-K",
                file_type: "10-K",
                file_description: "Annual report with industry and risk discussion",
              },
            },
          ],
        },
      });
    }

    return new Response("", { status: 404 });
  });

  vi.stubGlobal("fetch", fetchMock);

  const sources = await gatherSources(
    [
      "industrial sanitation market size growth",
      "industrial sanitation public companies annual report 10-K competitors",
      "industrial sanitation private equity acquisitions M&A",
      "industrial sanitation customer renewal trends",
    ],
    "tavily-key",
    "market",
    { searchLimit: 6, edgarQueryLimit: 2, edgarResultLimit: 3 }
  );

  const tavilyCalls = fetchMock.mock.calls.filter(([input]) =>
    input.toString().includes("api.tavily.com")
  );
  const edgarCalls = fetchMock.mock.calls.filter(([input]) =>
    input.toString().includes("efts.sec.gov")
  );

  expect(tavilyCalls).toHaveLength(4);
  expect(edgarCalls).toHaveLength(2);
  for (const [, init] of tavilyCalls) {
    expect(JSON.parse(String(init?.body)).max_results).toBe(6);
  }
  expect(sources.length).toBeGreaterThan(20);
});
