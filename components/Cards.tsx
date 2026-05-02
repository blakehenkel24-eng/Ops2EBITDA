import Link from "next/link";
import type { Route } from "next";
import { labelForType } from "@/lib/format";
import { hrefFor } from "@/lib/routes";
import type { AnyContent } from "@/lib/types";

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

export function ContentCard({ item, className = "" }: { item: AnyContent; className?: string }) {
  return (
    <Link
      href={hrefFor(item) as Route}
      className={`group flex min-h-52 flex-col justify-between rounded-[24px] border border-[var(--line)] bg-[var(--panel)] p-6 transition-all duration-200 ease-in-out cursor-pointer hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] hover:shadow-lg hover:-translate-y-1 ${className}`}
    >
      <div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">
            {labelForType(item.type)}
          </span>
          {"difficulty" in item ? (
            <span className="text-xs font-medium text-[var(--muted)]">
              {item.difficulty}
            </span>
          ) : null}
        </div>
        <h2 className="mt-4 text-2xl font-semibold leading-tight tracking-[-0.02em]">
          {item.title}
        </h2>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
          {item.summary}
        </p>
      </div>
      <span className="mt-5 text-sm font-semibold text-[var(--accent)]">
        Open briefing
      </span>
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
