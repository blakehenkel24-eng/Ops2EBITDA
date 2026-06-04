import OpenAI from "openai";

interface LibraryChunk {
  id: string;
  source_title: string;
  location: string;
  text: string;
  similarity: number;
}

export async function searchOperatingLibrary(
  query: string,
  limit = 5
): Promise<LibraryChunk[]> {
  const openaiKey = process.env.OPENAI_API_KEY;
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

  if (!openaiKey || !supabaseUrl || !supabaseKey) return [];

  const openai = new OpenAI({ apiKey: openaiKey });
  const embeddingResponse = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: query,
  });
  const queryEmbedding = embeddingResponse.data[0].embedding;

  const response = await fetch(
    `${supabaseUrl}/rest/v1/rpc/match_operating_chunks`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({
        query_embedding: queryEmbedding,
        match_count: limit,
        match_threshold: 0.3,
      }),
    }
  );

  if (!response.ok) return [];
  return response.json();
}

export function buildLibraryContext(chunks: LibraryChunk[]): string {
  if (chunks.length === 0) return "";

  const blocks = chunks.map(
    (chunk, i) => `Context item ${i + 1}:\n${chunk.text.slice(0, 900)}`
  );

  return (
    "Private operating context:\n" +
    blocks.join("\n\n") +
    "\n\nUse this private operating context as a PE operating lens. " +
    "Do not mention books, chunks, retrieved context, embeddings, files, or internal sources. " +
    "Synthesize the ideas into your own operator-grade answer. " +
    "Push one level deeper than obvious advice: quantify the operating logic where possible."
  );
}
