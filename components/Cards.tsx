import Link from "next/link";
import { ArrowRight } from 'lucide-react';
import type { Route } from "next";

interface CardProps {
  title: string;
  description: string;
  href: string;
  tag?: string;
}

export function PageHeader({
  eyebrow,
  title,
  summary,
}: {
  eyebrow: string;
  title: string;
  summary: string;
}) {
  return (
    <header className="mb-8 max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
        {eyebrow}
      </p>
      <h1 className="mt-3 text-4xl font-bold leading-tight tracking-[-0.03em] md:text-5xl text-brand-gradient">
        {title}
      </h1>
      <p className="mt-4 text-base leading-7 text-[var(--muted)]">
        {summary}
      </p>
    </header>
  );
}

export function ContentCard({ title, description, href, tag }: CardProps) {
  return (
    <Link href={href as Route} className="group block h-full">
      <article className="bg-paper border border-stone/30 h-full p-6 flex flex-col transition-all duration-200 hover:border-ochre">
        {tag && (
          <span className="font-mono-label text-stone mb-4 block group-hover:text-ochre transition-colors">
            {tag}
          </span>
        )}
        <h3 className="font-newsreader text-2xl mb-3 text-ink group-hover:text-ochre transition-colors">
          {title}
        </h3>
        <p className="text-stone text-sm font-geist leading-relaxed flex-1 mb-6">
          {description}
        </p>
        <div className="flex items-center text-ochre font-mono-label mt-auto opacity-0 group-hover:opacity-100 transition-opacity">
          Open briefing <ArrowRight size={14} className="ml-2" strokeWidth={1.5} />
        </div>
      </article>
    </Link>
  );
}

export function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-4">
      <p className="text-3xl font-semibold tracking-[-0.03em]">
        {value}
      </p>
      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
        {label}
      </p>
    </div>
  );
}

export function SectionBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-6">
      <h2 className="text-2xl font-semibold tracking-[-0.02em]">{title}</h2>
      <div className="mt-4 text-sm leading-7 text-[var(--muted)]">
        {children}
      </div>
    </section>
  );
}

export function PillList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full border border-[var(--line)] bg-[var(--panel)] px-3 py-1 text-xs font-bold text-[var(--muted)]"
        >
          {item}
        </span>
      ))}
    </div>
  );
}
