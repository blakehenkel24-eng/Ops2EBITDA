import { labelForType } from "@/lib/format";
import { hrefFor } from "@/lib/routes";
import Link from "next/link";
import type { Route } from "next";
import type { CSSProperties } from "react";
import { ContentCard } from "@/components/Cards";
import { SearchPanel } from "@/components/SearchPanel";
import {
  getAllContent,
  getContentStats,
  getIndustries,
  getPlaybooks,
} from "@/lib/content";

const operatingAgendas = [
  {
    title: "Underwrite the value creation agenda",
    detail: "Start with sources of return, diligence, thesis quality, and the first 100 days.",
    href: "/fundamentals/value-creation-planning" as Route,
  },
  {
    title: "Pressure-test operating levers",
    detail: "Move from problem diagnosis to action, KPI movement, EBITDA logic, and buyer narrative.",
    href: "/playbooks" as Route,
  },
  {
    title: "Read industries like an operator",
    detail: "Understand business model quality, cost structure, operating issues, and exit readiness.",
    href: "/industries" as Route,
  },
];

const valueSteps = [
  { label: "Problem", tint: "var(--color-accent-soft)", color: "text-accent" },
  { label: "Diagnostic", tint: "var(--color-teal-soft)", color: "text-teal" },
  { label: "Action", tint: "var(--color-amber-soft)", color: "text-amber" },
  { label: "KPI", tint: "var(--color-plum-soft)", color: "text-plum" },
  { label: "Enterprise value", tint: "var(--color-accent-soft)", color: "text-accent" },
];

export default function Home() {
  const stats = getContentStats();
  const playbooks = getPlaybooks().slice(0, 4);
  const industries = getIndustries().slice(0, 4);
  const allContent = getAllContent();

  return (
    <div>
      <section className="home-hero grid gap-8 p-6 md:p-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div>
          <p className="font-mono-label flex items-center gap-3 text-accent">
            <span className="signal-dot" aria-hidden="true" />
            Private Equity Operations
          </p>
          <h1 className="mt-4 max-w-3xl font-newsreader text-4xl leading-tight md:text-5xl text-ink">
            A field guide for operating partner thinking.
          </h1>
          <p className="mt-5 text-lg leading-8 text-stone font-geist">
            Deep-dive briefings on value creation, industry dynamics, portfolio
            company operations, KPI logic, and the projects that move EBITDA,
            cash flow, risk, and exit quality.
          </p>
        </div>
        <div className="self-end border border-line/80 bg-paper/85 p-5 shadow-[0_18px_44px_oklch(31%_0.038_248_/_0.08)]">
          <p className="font-mono-label text-accent">
            Static corpus
          </p>
          <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5">
            <Metric label="Fundamentals" value={stats.fundamentals} />
            <Metric label="Playbooks" value={stats.playbooks} />
            <Metric label="Industries" value={stats.industries} />
            <Metric label="KPIs" value={stats.kpis} />
          </dl>
        </div>
      </section>

      <div className="mt-10">
        <SearchPanel items={allContent} />
      </div>

      <section className="mt-10 grid gap-5 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <div>
          <p className="font-mono-label text-stone">
            Operator agenda
          </p>
          <h2 className="mt-3 font-newsreader text-2xl text-ink leading-tight">
            Start from the decision, not the module.
          </h2>
        </div>
        <div className="divide-y divide-line/80 border border-line/80 bg-paper">
          {operatingAgendas.map((agenda, index) => (
            <Link
              key={agenda.title}
              href={agenda.href}
              className="grid gap-3 p-5 transition-all duration-200 ease-in-out cursor-pointer hover:bg-accent-soft md:grid-cols-[3rem_minmax(0,0.8fr)_minmax(0,1.2fr)]"
            >
              <span className="font-mono-label text-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="font-newsreader text-xl text-ink">
                {agenda.title}
              </h3>
              <p className="text-sm leading-7 text-stone font-geist">
                {agenda.detail}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10 border border-line/80 bg-paper p-5">
        <div>
          <p className="font-mono-label text-accent">
            Value creation logic
          </p>
          <h2 className="mt-3 font-newsreader text-2xl text-ink">
            From operating issue to exit narrative.
          </h2>
        </div>
        <ol className="mt-5 grid gap-3 md:grid-cols-5">
          {valueSteps.map(
            (step, index) => (
              <li
                key={step.label}
                className="step-card border border-line/80 p-4"
                style={
                  { "--step-tint": step.tint } as CSSProperties &
                    Record<"--step-tint", string>
                }
              >
                <p className={`font-mono-label ${step.color}`}>
                  {String(index + 1).padStart(2, "0")}
                </p>
                <p className="mt-3 text-base font-newsreader text-ink">
                  {step.label}
                </p>
              </li>
            ),
          )}
        </ol>
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 className="font-newsreader text-2xl text-ink">
            Featured briefings
          </h2>
          <Link href="/playbooks" className="font-mono-label text-accent hover:opacity-80 transition-opacity">
            View value creation
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {playbooks.map((item) => (
            <ContentCard key={item.slug} title={item.title} description={item.summary} href={hrefFor(item)} tag={labelForType(item.type)} />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 className="font-newsreader text-2xl text-ink">
            Industry intelligence
          </h2>
          <Link href="/industries" className="font-mono-label text-accent hover:opacity-80 transition-opacity">
            View industries
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {industries.map((item) => (
            <ContentCard key={item.slug} title={item.title} description={item.summary} href={hrefFor(item)} tag={labelForType(item.type)} />
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        {[
          ["KPI Reference", "/kpis" as Route],
          ["AI Opportunity Lens", "/playbooks/ai-opportunity-identification" as Route],
          ["100-Day Plan", "/playbooks/100-day-value-creation-plan" as Route],
        ].map(([label, href]) => (
          <Link
            key={label}
            href={href}
            className="pressable border border-line/80 bg-paper p-6 font-newsreader text-xl text-ink cursor-pointer hover:border-accent/45 hover:bg-accent-soft"
          >
            {label}
          </Link>
        ))}
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <dt className="font-mono-label text-stone">
        {label}
      </dt>
      <dd className="mt-1 font-newsreader text-3xl text-accent">
        {value}
      </dd>
    </div>
  );
}
