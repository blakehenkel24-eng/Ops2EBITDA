import { expect, test } from "vitest";
import { buildSourceDigest } from "./scoring";
import type { ResearchSource } from "./types";

function source(index: number): ResearchSource {
  return {
    title: `Source ${index}`,
    url: `https://example.com/${index}`,
    type: "web",
    signal: "test",
    snippet: "x".repeat(100),
    query: "query",
    rank: index,
    score: 10,
  };
}

test("buildSourceDigest can cap source count and excerpt length for report synthesis", () => {
  const digest = buildSourceDigest([source(1), source(2), source(3)], {
    maxSources: 2,
    maxExcerptChars: 12,
  });

  expect(digest).toContain("[1] Source 1");
  expect(digest).toContain("[2] Source 2");
  expect(digest).not.toContain("[3] Source 3");
  expect(digest).toContain("Excerpt: xxxxxxxxxxxx");
  expect(digest).not.toContain("x".repeat(13));
});
