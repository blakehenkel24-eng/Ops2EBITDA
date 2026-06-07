import { streamText } from "ai";
import { getAtlasModel } from "@/lib/atlas/llm";
import {
  getSystemPrompt,
  buildMarketPrompt,
  buildCompanyPrompt,
  ATLAS_COMMANDS,
} from "@/lib/atlas/prompts";
import { searchOperatingLibrary, buildLibraryContext } from "@/lib/atlas/library";

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

  // Operating library context
  const libraryChunks = await searchOperatingLibrary(cleanQuery, isReport ? 8 : 4);
  const libraryContext = buildLibraryContext(libraryChunks);

  // For reports, use the full prompt builders with source digest
  if (isReport) {
    const sourceDigest = libraryContext || "No operating library matches found. Rely on your training data and flag gaps.";

    const reportPrompt =
      mode === "market"
        ? buildMarketPrompt(cleanQuery, sourceDigest)
        : buildCompanyPrompt(cleanQuery, sourceDigest);

    // Inject the structured report prompt as the user message
    messages[messages.length - 1].content = reportPrompt;
  } else if (libraryContext) {
    systemPrompt += `\n\n${libraryContext}`;
  }

  const result = streamText({
    model: getAtlasModel(),
    system: systemPrompt,
    messages,
    temperature: isReport ? 0.3 : 0.2,
    maxOutputTokens: isReport ? 16000 : 4000,
  });

  return result.toTextStreamResponse();
}
