import { createOpenAI } from "@ai-sdk/openai";

type AtlasChatMessage = {
  role: string;
  content: string;
};

const MIN_RETRY_TOKENS = 128;
const RETRY_TOKEN_BUFFER = 80;

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

export async function generateAtlasText({
  system,
  messages,
  temperature,
  maxOutputTokens,
  model,
}: {
  system: string;
  messages: AtlasChatMessage[];
  temperature: number;
  maxOutputTokens: number;
  model?: string;
}) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is required");
  }

  let requestedTokens = maxOutputTokens;
  let lastProviderMessage = "";

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const { response, body } = await requestOpenRouterText({
      apiKey,
      system,
      messages,
      temperature,
      maxOutputTokens: requestedTokens,
      model,
    });

    if (response.ok) {
      const message = body?.choices?.[0]?.message;
      return extractTextContent(message?.content);
    }

    const providerMessage = body?.error?.message || `OpenRouter returned ${response.status}`;
    lastProviderMessage = providerMessage;
    const retryTokens = getRetryTokenLimit(providerMessage, requestedTokens);
    if (retryTokens && retryTokens < requestedTokens) {
      requestedTokens = retryTokens;
      continue;
    }

    throw new Error(toPublicProviderError(providerMessage));
  }

  throw new Error(toPublicProviderError(lastProviderMessage));
}

export async function* streamAtlasText(options: Parameters<typeof generateAtlasText>[0]) {
  const text = await generateAtlasText(options);
  if (text) {
    yield text;
  }
}

function normalizeRole(role: string) {
  return role === "assistant" || role === "system" ? role : "user";
}

function extractTextContent(content: unknown): string {
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";

  return content
    .map((part) => {
      if (typeof part === "string") return part;
      if (
        part &&
        typeof part === "object" &&
        "text" in part &&
        typeof part.text === "string"
      ) {
        return part.text;
      }
      return "";
    })
    .join("");
}

async function requestOpenRouterText({
  apiKey,
  system,
  messages,
  temperature,
  maxOutputTokens,
  model,
}: {
  apiKey: string;
  system: string;
  messages: AtlasChatMessage[];
  temperature: number;
  maxOutputTokens: number;
  model?: string;
}) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: model || process.env.OPENROUTER_MODEL || "deepseek/deepseek-chat",
      messages: [
        { role: "system", content: system },
        ...messages
          .filter((message) => message.content.trim().length > 0)
          .map((message) => ({
            role: normalizeRole(message.role),
            content: message.content,
          })),
      ],
      temperature,
      max_tokens: maxOutputTokens,
    }),
  });

  const body = (await response.json().catch(() => null)) as
    | {
        choices?: { message?: { content?: unknown; reasoning?: unknown } }[];
        error?: { message?: string };
      }
    | null;

  return { response, body };
}

function getRetryTokenLimit(providerMessage: string, requestedTokens: number) {
  const match = providerMessage.match(/can only afford\s+(\d+)/i);
  if (!match) return null;

  const affordableTokens = Number(match[1]);
  if (!Number.isFinite(affordableTokens) || affordableTokens <= 0) return null;

  const retryTokens = Math.max(MIN_RETRY_TOKENS, affordableTokens - RETRY_TOKEN_BUFFER);
  return Math.min(retryTokens, requestedTokens - 1);
}

function toPublicProviderError(providerMessage: string) {
  if (/more credits|fewer max_tokens|can only afford/i.test(providerMessage)) {
    return "Atlas IQ needs a little more model budget for that response. Try a shorter prompt or raise the OpenRouter key limit.";
  }

  return providerMessage.replace(/https:\/\/\S+/g, "OpenRouter settings");
}
