import { streamText } from "ai";
import { getAtlasModel } from "@/lib/atlas/llm";
import { getSystemPrompt, ATLAS_COMMANDS } from "@/lib/atlas/prompts";
import { searchOperatingLibrary, buildLibraryContext } from "@/lib/atlas/library";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages, mode = "chat" } = await req.json();
  const lastMessage = messages[messages.length - 1]?.content || "";

  const command = ATLAS_COMMANDS.find(
    (cmd) => lastMessage.startsWith(`/${cmd.name}`)
  );

  let systemPrompt = getSystemPrompt(mode as "market" | "company" | "chat");

  if (command) {
    systemPrompt += `\n\nThe user has invoked the ${command.label} command. ${command.prompt} Use the conversation context to generate the requested output.`;
  }

  const libraryChunks = await searchOperatingLibrary(lastMessage, 4);
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
