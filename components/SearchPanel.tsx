"use client";

import Link from "next/link";
import type { Route } from "next";
import { useDeferredValue, useState } from "react";
import { labelForType } from "@/lib/format";
import { hrefFor } from "@/lib/routes";
import type { AnyContent } from "@/lib/types";

export function SearchPanel({ items }: { items: AnyContent[] }) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.toLowerCase().trim());

  const results =
    deferredQuery.length < 2
      ? items.slice(0, 8)
      : items
          .filter((item) =>
            [item.title, item.summary, item.type, item.tags?.join(" ")]
              .join(" ")
              .toLowerCase()
              .includes(deferredQuery),
          )
          .slice(0, 10);

  return (
    <section className="border border-stone/30 bg-paper p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex-1">
          <p className="font-mono-label text-stone">
            Search the knowledge base
          </p>
          <h2 className="font-newsreader text-4xl mb-4 text-ink mt-2">
            Find a lever, KPI, or industry
          </h2>
        </div>
        <label className="sr-only" htmlFor="knowledge-search">
          Search PE operations topics
        </label>
        <input
          id="knowledge-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try: churn, procurement, SaaS, DSO..."
          className="w-full border border-stone bg-paper px-4 py-3 text-sm text-ink placeholder:text-stone md:max-w-md focus:outline focus:outline-2 focus:outline-ochre"
        />
      </div>
      <div className="mt-5 grid gap-2 md:grid-cols-2">
        {results.map((item) => (
          <Link
            key={`${item.type}-${item.slug}`}
            href={hrefFor(item) as Route}
            className="border border-stone/30 bg-paper p-4 transition-all duration-200 ease-in-out cursor-pointer hover:border-ochre hover:bg-bone"
          >
            <span className="font-mono-label text-stone">
              {labelForType(item.type)}
            </span>
            <p className="mt-2 text-lg font-newsreader text-ink">
              {item.title}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
