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
  className = "",
}: {
  eyebrow: string;
  title: string;
  summary: string;
  className?: string;
}) {
  return (
    <header className={`mb-8 max-w-3xl ${className}`}>
      <div className="page-header-content">
        <p className="font-mono-label text-stone mb-3">
          {eyebrow}
        </p>
        <h1 className="font-newsreader text-4xl leading-tight md:text-5xl text-ink">
          {title}
        </h1>
        <p className="mt-4 text-base leading-7 text-stone font-geist">
          {summary}
        </p>
      </div>
    </header>
  );
}

export function ContentCard({ title, description, href, tag }: CardProps) {
  return (
    <Link href={href as Route} className="group block h-full">
      <article className="pressable bg-paper border border-line/80 h-full p-6 flex flex-col hover:border-accent/45">
        {tag && (
          <span className="font-mono-label text-stone mb-4 block group-hover:text-accent transition-colors">
            {tag}
          </span>
        )}
        <h3 className="font-newsreader text-2xl mb-3 text-ink group-hover:text-accent transition-colors">
          {title}
        </h3>
        <p className="text-stone text-sm font-geist leading-relaxed flex-1 mb-6">
          {description}
        </p>
        <div className="flex items-center text-accent font-mono-label mt-auto opacity-0 group-hover:opacity-100 transition-opacity">
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
    <div className="border border-line/80 bg-paper p-4">
      <p className="font-newsreader text-3xl text-ink">
        {value}
      </p>
      <p className="mt-2 font-mono-label text-stone">
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
    <section className="border border-line/80 bg-paper p-6">
      <h2 className="font-newsreader text-2xl text-ink">{title}</h2>
      <div className="mt-4 text-sm leading-7 text-stone font-geist">
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
          className="border border-line/80 bg-paper px-3 py-1 font-mono-label text-stone"
        >
          {item}
        </span>
      ))}
    </div>
  );
}
