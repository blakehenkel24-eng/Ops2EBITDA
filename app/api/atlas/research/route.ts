import { streamText } from "ai";
import { getAtlasModel } from "@/lib/atlas/llm";
import { getSystemPrompt, buildMarketPrompt, buildCompanyPrompt } from "@/lib/atlas/prompts";
import { gatherSources, getMarketQueries, getCompanyQueries } from "@/lib/atlas/research";
import { rankSources, buildSourceDigest } from "@/lib/atlas/scoring";
import { searchOperatingLibrary, buildLibraryContext } from "@/lib/atlas/library";
import type { ResearchMode } from "@/lib/atlas/types";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { query, mode }: { query: string; mode: ResearchMode } = await req.json();

  const queries = mode === "market"
    ? getMarketQueries(query)
    : getCompanyQueries(query);

  const tavilyKey = process.env.TAVILY_API_KEY;
  const rawSources = await gatherSources(queries, tavilyKey);
  const sources = rankSources(rawSources);
  const sourceDigest = buildSourceDigest(sources);

  const libraryChunks = await searchOperatingLibrary(query, 6);
  const libraryContext = buildLibraryContext(libraryChunks);

  let userPrompt = mode === "market"
    ? buildMarketPrompt(query, sourceDigest)
    : buildCompanyPrompt(query, sourceDigest);

  if (libraryContext) {
    userPrompt = libraryContext + "\n\n" + userPrompt;
  }

  const systemPrompt = getSystemPrompt(mode);

  const result = streamText({
    model: getAtlasModel(),
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
    temperature: 0.2,
    maxOutputTokens: 8000,
  });

  const response = result.toTextStreamResponse();
  const headers = new Headers(response.headers);
  headers.set(
    "X-Atlas-Sources",
    Buffer.from(JSON.stringify(sources.slice(0, 20))).toString("base64")
  );
  headers.set("X-Atlas-Mode", mode);
  headers.set("X-Atlas-Query", encodeURIComponent(query));

  return new Response(response.body, {
    status: response.status,
    headers,
  });
}
