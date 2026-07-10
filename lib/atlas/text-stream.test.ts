import { expect, test } from "vitest";
import { createAtlasTextStreamResponse } from "./text-stream";

async function readResponse(response: Response) {
  return response.text();
}

async function* chunks(values: string[]) {
  for (const value of values) {
    yield value;
  }
}

async function* failingStream(): AsyncIterable<string> {
  throw new Error("provider failed");
}

test("streams non-empty model text", async () => {
  const response = createAtlasTextStreamResponse({
    textStream: chunks(["Hel", "", "lo"]),
  });

  await expect(readResponse(response)).resolves.toBe("Hello");
});

test("returns a visible fallback when the model stream is empty", async () => {
  const response = createAtlasTextStreamResponse({
    textStream: chunks([""]),
    emptyMessage: "No visible text.",
  });

  await expect(readResponse(response)).resolves.toBe("No visible text.");
});

test("returns a visible fallback when the model stream fails", async () => {
  const response = createAtlasTextStreamResponse({
    textStream: failingStream(),
    errorMessage: "Model failed.",
  });

  await expect(readResponse(response)).resolves.toBe("Model failed.");
});
