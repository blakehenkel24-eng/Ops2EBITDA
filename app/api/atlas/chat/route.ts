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

  // v6 useChat sends {role, parts: [{type:"text", text:"..."}]}
  // streamText expects {role, content: "..."}
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

  // Extract mode from message prefix (preferred) or transport body (fallback)
  const { mode: parsedMode, clean: cleanQuery } = parseMode(lastMessage);
  const mode = parsedMode !== "chat" ? parsedMode : bodyMode;
  const isReport = mode === "market" || mode === "company";

  // Replace the raw message with the cleaned version (strip mode prefix)
  if (parsedMode !== "chat") {
    messages[messages.length - 1].content = cleanQuery;
  }

  // Slash commands
  const command = ATLAS_COMMANDS.find(
    (cmd) => cleanQuery.startsWith(`/${cmd.name}`)
  );

  // Build system prompt
  let systemPrompt = getSystemPrompt(mode as "market" | "company" | "chat");

  if (command) {
    systemPrompt += `\n\nThe user has invoked the ${command.label} command. ${command.prompt} Use the conversation context to generate the requested output.`;
  }

  // ── Report mode: full research pipeline ────────────────────────────
  if (isReport) {
    // 1. Generate search queries
    const queries =
      mode === "market"
        ? getMarketQueries(cleanQuery)
        : getCompanyQueries(cleanQuery);

    // 2. Gather web sources (Tavily if key available, else DDG)
    const tavilyKey = process.env.TAVILY_API_KEY;
    const rawSources = await gatherSources(queries, tavilyKey);

    // 3. Fetch page text for top sources (enrich snippets)
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

    // 4. Score, rank, and build source digest
    const ranked = rankSources(enriched);
    const sourceDigest = buildSourceDigest(ranked);
    const sourceCount = ranked.filter((s) => s.type !== "placeholder").length;

    // 5. Add operating library context to source digest
    const libraryChunks = await searchOperatingLibrary(cleanQuery, 8);
    const libraryContext = buildLibraryContext(libraryChunks);
    let fullDigest = sourceDigest;
    if (libraryContext) {
      fullDigest += `\n\nOperating library context (private, do not cite as a source):\n${libraryContext}`;
    }

    // 6. Build the full structured prompt
    const reportPrompt =
      mode === "market"
        ? buildMarketPrompt(cleanQuery, fullDigest, sourceCount)
        : buildCompanyPrompt(cleanQuery, fullDigest, sourceCount);

    // Inject as user message
    messages[messages.length - 1].content = reportPrompt;

    const result = streamText({
      model: getAtlasModel(),
      system: systemPrompt,
      messages,
      temperature: 0.3,
      maxOutputTokens: 16000,
    });

    return result.toTextStreamResponse();
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
