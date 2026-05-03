import Link from "next/link";
import { aiNavLinks } from "@/lib/aiForPE";

export function AIPillarNav() {
  return (
    <nav className="mb-8 border-y border-line/80 py-3" aria-label="AI for PE Professionals sections">
      <div className="flex flex-wrap gap-2">
        {aiNavLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="border border-line/80 bg-paper px-3 py-2 font-mono-label text-stone transition-colors hover:border-accent/40 hover:bg-accent-soft/60 hover:text-ink"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export function SourceList({
  sources,
}: {
  sources: Array<{ label: string; href: string }>;
}) {
  return (
    <section className="mt-8 border border-line/80 bg-paper p-5">
      <p className="font-mono-label text-stone">Sources</p>
      <div className="mt-4 grid gap-3 text-sm leading-6 text-stone font-geist md:grid-cols-2">
        {sources.map((source) => (
          <a
            key={source.href}
            href={source.href}
            target="_blank"
            rel="noreferrer"
            className="border-b border-line/80 pb-2 hover:text-ink"
          >
            {source.label}
          </a>
        ))}
      </div>
    </section>
  );
}
