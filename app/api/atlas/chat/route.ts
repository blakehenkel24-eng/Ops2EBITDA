import { streamAtlasText } from "@/lib/atlas/llm";
import { createAtlasTextStreamResponse } from "@/lib/atlas/text-stream";
import {
  getSystemPrompt,
  buildMarketPrompt,
  buildCompanyPrompt,
  ATLAS_COMMANDS,
} from "@/lib/atlas/prompts";
import { searchOperatingLibrary, buildLibraryContext } from "@/lib/atlas/library";
import { buildDealContext } from "@/lib/atlas/deal";
import {
  gatherSources,
  getMarketQueries,
  getCompanyQueries,
  fetchPageText,
  searchEdgarCompany,
} from "@/lib/atlas/research";
import { rankSources, buildSourceDigest } from "@/lib/atlas/scoring";

export const maxDuration = 120;

// Progress event prefix. The client strips these before displaying text.
const PROGRESS_PREFIX = "§§P";

const DEFAULT_SEARCH_RESULTS_PER_QUERY = 8;
const DEFAULT_MAX_ENRICHED_SOURCES = 40;
const DEFAULT_EDGAR_QUERY_LIMIT = 5;
const DEFAULT_EDGAR_RESULTS_PER_QUERY = 4;
const DEFAULT_COMPANY_EDGAR_RESULTS = 5;
const DEFAULT_DIGEST_SOURCE_LIMIT = 24;
const DEFAULT_DIGEST_EXCERPT_CHARS = 850;

function getMaxOutputTokens(envName: string, fallback: number) {
  const value = Number(process.env[envName]);
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : fallback;
}

/** Parse `[mode:market]` or `[mode:company]` prefix from message text */
function parseMode(text: string): { mode: string; clean: string } {
  const match = text.match(/^\[mode:(market|company)]\s*/);
  if (match) {
    return { mode: match[1], clean: text.slice(match[0].length) };
  }
  return { mode: "chat", clean: text };
}

export async function POST(req: Request) {
  const { messages: rawMessages, mode: bodyMode = "chat", dealId = null } = await req.json();

  const messages = rawMessages.map(
    (m: { role: string; content?: string; parts?: { type: string; text: string }[] }) => ({
      role: m.role,
      content:
        m.content ??
        (m.parts
          ?.filter((p: { type: string }) => p.type === "text")
          .map((p: { text: string }) => p.text)
          .join("") || ""),
    })
  );

  const lastMessage = messages[messages.length - 1]?.content || "";
  const { mode: parsedMode, clean: cleanQuery } = parseMode(lastMessage);
  const mode = parsedMode !== "chat" ? parsedMode : bodyMode;
  const isReport = mode === "market" || mode === "company";

  if (parsedMode !== "chat") {
    messages[messages.length - 1].content = cleanQuery;
  }

  const command = ATLAS_COMMANDS.find(
    (cmd) => cleanQuery.startsWith(`/${cmd.name}`)
  );

  let systemPrompt = getSystemPrompt(mode as "market" | "company" | "chat");

  if (command) {
    systemPrompt += `\n\nThe user has invoked the ${command.label} command. ${command.prompt} Use the conversation context to generate the requested output.`;
  }

  const dealContext = await buildDealContext(dealId);

  // ── Report mode: full research pipeline with live progress ─────────
  if (isReport) {
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        const emit = (stage: string, label: string, status: "active" | "done") => {
          controller.enqueue(
            encoder.encode(`${PROGRESS_PREFIX}${JSON.stringify({ stage, label, status })}\n`)
          );
        };

        try {
          // 1. Search queries
          emit("search_plan", "Building search plan", "active");
          const queries =
            mode === "market"
              ? getMarketQueries(cleanQuery)
              : getCompanyQueries(cleanQuery);
          emit("search_plan", `${queries.length} targeted queries`, "done");

          // 2. Gather sources (web + SEC EDGAR)
          emit("source_gathering", "Searching the web and SEC filings", "active");
          const tavilyKey = process.env.TAVILY_API_KEY;
          const searchLimit = getMaxOutputTokens(
            "ATLAS_SEARCH_RESULTS_PER_QUERY",
            DEFAULT_SEARCH_RESULTS_PER_QUERY
          );
          const edgarQueryLimit = getMaxOutputTokens(
            "ATLAS_EDGAR_QUERY_LIMIT",
            DEFAULT_EDGAR_QUERY_LIMIT
          );
          const edgarResultLimit = getMaxOutputTokens(
            "ATLAS_EDGAR_RESULTS_PER_QUERY",
            DEFAULT_EDGAR_RESULTS_PER_QUERY
          );
          const maxEnrichedSources = getMaxOutputTokens(
            "ATLAS_MAX_ENRICHED_SOURCES",
            DEFAULT_MAX_ENRICHED_SOURCES
          );

          const [webSources, edgarCompanySources] = await Promise.all([
            gatherSources(queries, tavilyKey, mode as "market" | "company", {
              searchLimit,
              edgarQueryLimit,
              edgarResultLimit,
            }),
            mode === "company"
              ? searchEdgarCompany(
                  cleanQuery,
                  getMaxOutputTokens("ATLAS_COMPANY_EDGAR_RESULTS", DEFAULT_COMPANY_EDGAR_RESULTS)
                )
              : Promise.resolve([]),
          ]);
          const rawSources = [...webSources, ...edgarCompanySources];
          emit("source_gathering", `${rawSources.length} source candidates found`, "done");

          // 3. Enrich source content
          emit("page_extraction", "Extracting source content", "active");
          const enriched = await Promise.all(
            rawSources.slice(0, maxEnrichedSources).map(async (source) => {
              if (source.snippet.length < 600 && source.url) {
                const pageText = await fetchPageText(source.url);
                if (pageText.length > source.snippet.length) {
                  return { ...source, snippet: pageText };
                }
              }
              return source;
            })
          );
          emit("page_extraction", `${enriched.length} pages processed`, "done");

          // 4. Score and rank
          emit("source_ranking", "Ranking and scoring sources", "active");
          const ranked = rankSources(enriched);
          const sourceDigest = buildSourceDigest(ranked, {
            maxSources: getMaxOutputTokens("ATLAS_DIGEST_SOURCE_LIMIT", DEFAULT_DIGEST_SOURCE_LIMIT),
            maxExcerptChars: getMaxOutputTokens(
              "ATLAS_DIGEST_EXCERPT_CHARS",
              DEFAULT_DIGEST_EXCERPT_CHARS
            ),
          });
          const sourceCount = ranked.filter((s) => s.type !== "placeholder").length;
          emit("source_ranking", `${sourceCount} sources ranked`, "done");

          // 5. Operating library
          emit("operating_library", "Checking operating library", "active");
          const libraryChunks = await searchOperatingLibrary(cleanQuery, 8);
          const libraryContext = buildLibraryContext(libraryChunks);
          let fullDigest = sourceDigest;
          if (libraryContext) {
            fullDigest += `\n\nOperating library context (private, do not cite as a source):\n${libraryContext}`;
          }
          if (dealContext) {
            fullDigest += `\n\n${dealContext}`;
          }
          emit(
            "operating_library",
            libraryChunks.length > 0
              ? `${libraryChunks.length} operating insights`
              : "No matches found",
            "done"
          );

          // 6. Synthesis
          emit("synthesis", "Writing source-backed memo", "active");
          const reportPrompt =
            mode === "market"
              ? buildMarketPrompt(cleanQuery, fullDigest, sourceCount)
              : buildCompanyPrompt(cleanQuery, fullDigest, sourceCount);

          messages[messages.length - 1].content = reportPrompt;

          const result = streamAtlasText({
            system: systemPrompt,
            messages,
            temperature: 0.3,
            maxOutputTokens: getMaxOutputTokens("ATLAS_REPORT_MAX_TOKENS", 16000),
            model: process.env.OPENROUTER_REPORT_MODEL || "deepseek/deepseek-v4-pro",
          });

          let wroteText = false;

          // Stream LLM text. No final progress emit after this.
          // (client exits progress mode when LLM text starts)
          for await (const chunk of result) {
            if (chunk) {
              wroteText = true;
            }
            controller.enqueue(encoder.encode(chunk));
          }

          if (!wroteText) {
            controller.enqueue(
              encoder.encode(
                "Atlas IQ did not receive any visible text from the configured model. Check the model setting and try again."
              )
            );
          }
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Unknown error";
          controller.enqueue(encoder.encode(`\n\nResearch pipeline error: ${msg}`));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "X-Atlas-Mode": mode,
      },
    });
  }

  // ── Chat mode ──────────────────────────────────────────────────────
  const libraryChunks = await searchOperatingLibrary(cleanQuery, 4);
  const libraryContext = buildLibraryContext(libraryChunks);
  if (libraryContext) {
    systemPrompt += `\n\n${libraryContext}`;
  }
  if (dealContext) {
    systemPrompt += `\n\n${dealContext}`;
  }

  const result = streamAtlasText({
    system: systemPrompt,
    messages,
    temperature: 0.2,
    maxOutputTokens: getMaxOutputTokens("ATLAS_CHAT_MAX_TOKENS", 8000),
  });

  return createAtlasTextStreamResponse({ textStream: result });
}
