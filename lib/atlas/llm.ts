import { createOpenAI } from "@ai-sdk/openai";

export function getAtlasProvider() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is required");
  }

  return createOpenAI({
    apiKey,
    baseURL: "https://openrouter.ai/api/v1",
  });
}

export function getAtlasModel() {
  const provider = getAtlasProvider();
  const modelId = process.env.OPENROUTER_MODEL || "deepseek/deepseek-chat";
  // .chat() forces Chat Completions API — OpenRouter doesn't support the Responses API
  return provider.chat(modelId);
}
