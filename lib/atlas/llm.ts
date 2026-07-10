import { createOpenAI } from "@ai-sdk/openai";

type AtlasChatMessage = {
  role: string;
  content: string;
};

type AtlasTextOptions = {
  system: string;
  messages: AtlasChatMessage[];
  temperature: number;
  maxOutputTokens: number;
  model?: string;
  signal?: AbortSignal;
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
  signal,
}: AtlasTextOptions) {
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
      signal,
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

export async function* streamAtlasText(options: AtlasTextOptions) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is required");
  }

  let requestedTokens = options.maxOutputTokens;
  let lastProviderMessage = "";

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        buildOpenRouterRequest({
          ...options,
          maxOutputTokens: requestedTokens,
          stream: true,
        })
      ),
      signal: options.signal,
    });

    if (response.ok) {
      yield* readOpenRouterStream(response);
      return;
    }

    const body = (await response.json().catch(() => null)) as
      | { error?: { message?: string } }
      | null;
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
  signal,
}: AtlasTextOptions & { apiKey: string }) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(
      buildOpenRouterRequest({ system, messages, temperature, maxOutputTokens, model })
    ),
    signal,
  });

  const body = (await response.json().catch(() => null)) as
    | {
        choices?: { message?: { content?: unknown; reasoning?: unknown } }[];
        error?: { message?: string };
      }
    | null;

  return { response, body };
}

function buildOpenRouterRequest({
  system,
  messages,
  temperature,
  maxOutputTokens,
  model,
  stream,
}: AtlasTextOptions & { stream?: boolean }) {
  return {
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
    ...(stream ? { stream: true } : {}),
  };
}

async function* readOpenRouterStream(response: Response) {
  if (!response.body) {
    throw new Error("OpenRouter returned an empty response stream");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let finished = false;

  try {
    while (!finished) {
      const { done, value } = await reader.read();
      finished = done;
      buffer += decoder.decode(value, { stream: !done });

      let boundary = findSseBoundary(buffer);
      while (boundary) {
        const event = buffer.slice(0, boundary.index);
        buffer = buffer.slice(boundary.index + boundary.length);
        yield* parseOpenRouterEvent(event);
        boundary = findSseBoundary(buffer);
      }
    }

    if (buffer.trim()) {
      yield* parseOpenRouterEvent(buffer);
    }
  } finally {
    if (!finished) {
      await reader.cancel().catch(() => undefined);
    }
    reader.releaseLock();
  }
}

function findSseBoundary(buffer: string) {
  const match = /\r\n\r\n|\n\n|\r\r/.exec(buffer);
  return match ? { index: match.index, length: match[0].length } : null;
}

function* parseOpenRouterEvent(event: string) {
  const data = event
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.slice(5).trimStart())
    .join("\n")
    .trim();

  if (!data || data === "[DONE]") return;

  let body: {
    choices?: { delta?: { content?: unknown; reasoning?: unknown } }[];
    error?: { message?: string };
  };
  try {
    body = JSON.parse(data);
  } catch {
    throw new Error("OpenRouter returned an invalid response stream");
  }

  if (body.error) {
    throw new Error(toPublicProviderError(body.error.message || "OpenRouter stream failed"));
  }

  const content = extractTextContent(body.choices?.[0]?.delta?.content);
  if (content) yield content;
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
