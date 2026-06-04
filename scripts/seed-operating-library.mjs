/**
 * One-time migration: seed Supabase atlas_operating_chunks table
 * from the existing AtlasIQ Python index.json.
 *
 * Usage:
 *   SUPABASE_URL=... SUPABASE_SERVICE_KEY=... node scripts/seed-operating-library.mjs [path-to-index.json]
 *
 * Requires: npm install @supabase/supabase-js (not in project deps — one-time script)
 */

import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("SUPABASE_URL and SUPABASE_SERVICE_KEY required");
  process.exit(1);
}

const INDEX_PATH =
  process.argv[2] ||
  "../AtlasIQ - PE Market Research/.atlasiq/operating-library/index.json";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const data = JSON.parse(readFileSync(INDEX_PATH, "utf-8"));
const chunks = data.chunks;

console.log(`Uploading ${chunks.length} chunks...`);

const BATCH_SIZE = 50;
for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
  const batch = chunks.slice(i, i + BATCH_SIZE).map((c) => ({
    id: c.chunk_id,
    source_title: c.source_title,
    location: c.location || "",
    text: c.text,
    embedding: c.embedding,
    primary_tags: c.primary_tags || [],
    secondary_tags: c.secondary_tags || [],
  }));

  const { error } = await supabase
    .from("atlas_operating_chunks")
    .upsert(batch);

  if (error) {
    console.error(`Batch ${i} failed:`, error.message);
  } else {
    console.log(
      `Uploaded ${Math.min(i + BATCH_SIZE, chunks.length)} / ${chunks.length}`
    );
  }
}

console.log("Done.");
