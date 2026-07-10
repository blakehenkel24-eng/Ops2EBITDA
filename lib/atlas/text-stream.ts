const DEFAULT_EMPTY_MESSAGE =
  "Atlas IQ did not receive any visible text from the configured model. Check the model setting and try again.";

const DEFAULT_ERROR_MESSAGE =
  "Atlas IQ could not get a response from the configured model. Check the model setting and try again.";

export function createAtlasTextStreamResponse({
  textStream,
  headers,
  emptyMessage = DEFAULT_EMPTY_MESSAGE,
  errorMessage = DEFAULT_ERROR_MESSAGE,
}: {
  textStream: AsyncIterable<string>;
  headers?: HeadersInit;
  emptyMessage?: string;
  errorMessage?: string;
}) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let wroteText = false;

      try {
        for await (const chunk of textStream) {
          if (!chunk) continue;
          wroteText = true;
          controller.enqueue(encoder.encode(chunk));
        }

        if (!wroteText) {
          controller.enqueue(encoder.encode(emptyMessage));
        }
      } catch {
        controller.enqueue(encoder.encode(errorMessage));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      ...headers,
    },
  });
}
