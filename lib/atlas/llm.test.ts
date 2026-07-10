import { afterEach, expect, test, vi } from "vitest";
import { generateAtlasText } from "./llm";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

test("generateAtlasText calls OpenRouter chat completions and returns content", async () => {
  vi.stubEnv("OPENROUTER_API_KEY", "test-key");
  vi.stubEnv("OPENROUTER_MODEL", "test-model");
  const fetchMock = vi.fn(async () =>
    Response.json({
      choices: [{ message: { content: "Hello from Atlas IQ" } }],
    })
  );
  vi.stubGlobal("fetch", fetchMock);

  const text = await generateAtlasText({
    system: "System prompt",
    messages: [{ role: "user", content: "Hello" }],
    temperature: 0.2,
    maxOutputTokens: 100,
  });

  expect(text).toBe("Hello from Atlas IQ");
  expect(fetchMock).toHaveBeenCalledWith(
    "https://openrouter.ai/api/v1/chat/completions",
    expect.objectContaining({
      method: "POST",
      headers: expect.objectContaining({
        Authorization: "Bearer test-key",
      }),
    })
  );
  const [, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
  const request = JSON.parse(init.body as string);
  expect(request).toMatchObject({
    model: "test-model",
    max_tokens: 100,
    messages: [
      { role: "system", content: "System prompt" },
      { role: "user", content: "Hello" },
    ],
  });
});

test("generateAtlasText can override the model per request", async () => {
  vi.stubEnv("OPENROUTER_API_KEY", "test-key");
  vi.stubEnv("OPENROUTER_MODEL", "default-model");
  const fetchMock = vi.fn(async () =>
    Response.json({
      choices: [{ message: { content: "Report model answer" } }],
    })
  );
  vi.stubGlobal("fetch", fetchMock);

  const text = await generateAtlasText({
    system: "System prompt",
    messages: [{ role: "user", content: "Hello" }],
    temperature: 0.2,
    maxOutputTokens: 100,
    model: "report-model",
  });

  expect(text).toBe("Report model answer");
  const [, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
  const request = JSON.parse(init.body as string);
  expect(request.model).toBe("report-model");
});

test("generateAtlasText throws a readable provider error", async () => {
  vi.stubEnv("OPENROUTER_API_KEY", "test-key");
  const fetchMock = vi.fn(async () =>
    Response.json({ error: { message: "No route for model" } }, { status: 400 })
  );
  vi.stubGlobal("fetch", fetchMock);

  await expect(
    generateAtlasText({
      system: "System prompt",
      messages: [{ role: "user", content: "Hello" }],
      temperature: 0.2,
      maxOutputTokens: 100,
    })
  ).rejects.toThrow("No route for model");
});

test("generateAtlasText retries below the available OpenRouter token budget", async () => {
  vi.stubEnv("OPENROUTER_API_KEY", "test-key");
  const fetchMock = vi
    .fn()
    .mockResolvedValueOnce(
      Response.json(
        {
          error: {
            message:
              "This request requires more credits, or fewer max_tokens. You requested up to 1000 tokens, but can only afford 880. To increase, visit https://openrouter.ai/workspaces/default/keys/example",
          },
        },
        { status: 402 }
      )
    )
    .mockResolvedValueOnce(
      Response.json({
        choices: [{ message: { content: "Recovered answer" } }],
      })
    );
  vi.stubGlobal("fetch", fetchMock);

  const text = await generateAtlasText({
    system: "System prompt",
    messages: [{ role: "user", content: "Hello" }],
    temperature: 0.2,
    maxOutputTokens: 1000,
  });

  expect(text).toBe("Recovered answer");
  const [, retryInit] = fetchMock.mock.calls[1] as unknown as [string, RequestInit];
  const retryRequest = JSON.parse(retryInit.body as string);
  expect(retryRequest.max_tokens).toBe(800);
});

test("generateAtlasText does not expose reasoning text when content is empty", async () => {
  vi.stubEnv("OPENROUTER_API_KEY", "test-key");
  const fetchMock = vi.fn(async () =>
    Response.json({
      choices: [{ message: { content: null, reasoning: "Reasoned memo text" } }],
    })
  );
  vi.stubGlobal("fetch", fetchMock);

  const text = await generateAtlasText({
    system: "System prompt",
    messages: [{ role: "user", content: "Hello" }],
    temperature: 0.2,
    maxOutputTokens: 100,
  });

  expect(text).toBe("");
});

test("generateAtlasText sanitizes OpenRouter budget URLs", async () => {
  vi.stubEnv("OPENROUTER_API_KEY", "test-key");
  const fetchMock = vi.fn(async () =>
    Response.json(
      {
        error: {
          message:
            "This request requires more credits, or fewer max_tokens. You requested up to 100 tokens, but can only afford 50. To increase, visit https://openrouter.ai/workspaces/default/keys/example",
        },
      },
      { status: 402 }
    )
  );
  vi.stubGlobal("fetch", fetchMock);

  await expect(
    generateAtlasText({
      system: "System prompt",
      messages: [{ role: "user", content: "Hello" }],
      temperature: 0.2,
      maxOutputTokens: 100,
    })
  ).rejects.toThrow("Atlas IQ needs a little more model budget");
});
