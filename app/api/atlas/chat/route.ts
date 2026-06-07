import { streamText } from "ai";
import { getAtlasModel } from "@/lib/atlas/llm";
import {
  getSystemPrompt,
  buildMarketPrompt,
  buildCompanyPrompt,
  ATLAS_COMMANDS,
} from "@/lib/atlas/prompts";
import { searchOperatingLibrary, buildLibraryContext } from "@/lib/atlas/library";
import {
  gatherSources,
  getMarketQueries,
  getCompanyQueries,
  fetchPageText,
} from "@/lib/atlas/research";
import { rankSources, buildSourceDigest } from "@/lib/atlas/scoring";

export const maxDuration = 120;

// Progress event prefix — client strips these before displaying text
const PROGRESS_PREFIX = "§§P";

/** Parse `[mode:market]` or `[mode:company]` prefix from message text */
function parseMode(text: string): { mode: string; clean: string } {
  const match = text.match(/^\[mode:(market|company)]\s*/);
  if (match) {
    return { mode: match[1], clean: text.slice(match[0].length) };
  }
  return { mode: "chat", clean: text };
}

export async function POST(req: Request) {
  const { messages: rawMessages, mode: bodyMode = "chat" } = await req.json();

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

          // 2. Gather sources
          emit("source_gathering", "Searching the web", "active");
          const tavilyKey = process.env.TAVILY_API_KEY;
          const rawSources = await gatherSources(queries, tavilyKey);
          emit("source_gathering", `${rawSources.length} sources found`, "done");

          // 3. Enrich source content
          emit("page_extraction", "Extracting source content", "active");
          const enriched = await Promise.all(
            rawSources.slice(0, 12).map(async (source) => {
              if (source.snippet.length < 200 && source.url) {
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
          const sourceDigest = buildSourceDigest(ranked);
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

          const result = streamText({
            model: getAtlasModel(),
            system: systemPrompt,
            messages,
            temperature: 0.3,
            maxOutputTokens: 16000,
          });

          // Stream LLM text — no final progress emit after this
          // (client exits progress mode when LLM text starts)
          for await (const chunk of result.textStream) {
            controller.enqueue(encoder.encode(chunk));
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

  const result = streamText({
    model: getAtlasModel(),
    system: systemPrompt,
    messages,
    temperature: 0.2,
    maxOutputTokens: 4000,
  });

  return result.toTextStreamResponse();
}
