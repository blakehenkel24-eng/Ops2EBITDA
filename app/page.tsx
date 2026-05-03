import { labelForType } from "@/lib/format";
import { hrefFor } from "@/lib/routes";
import Link from "next/link";
import type { Route } from "next";
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

export default function Home() {
  const stats = getContentStats();
  const playbooks = getPlaybooks().slice(0, 4);
  const industries = getIndustries().slice(0, 4);
  const allContent = getAllContent();

  return (
    <div>
      <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
            Private Equity Operations
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight tracking-[-0.03em] md:text-5xl text-brand-gradient">
            A field guide for operating partner thinking.
          </h1>
          <p className="mt-5 text-lg leading-8 text-[var(--muted)]">
            Deep-dive briefings on value creation, industry dynamics, portfolio
            company operations, KPI logic, and the projects that move EBITDA,
            cash flow, risk, and exit quality.
          </p>
        </div>
        <div className="self-end rounded-[24px] border border-[var(--line)] bg-[var(--panel)] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
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
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
            Operator agenda
          </p>
          <h2 className="mt-3 text-2xl font-semibold leading-tight tracking-[-0.02em]">
            Start from the decision, not the module.
          </h2>
        </div>
        <div className="divide-y divide-[var(--line)] rounded-[24px] border border-[var(--line)] bg-[var(--panel)]">
          {operatingAgendas.map((agenda) => (
            <Link
              key={agenda.title}
              href={agenda.href}
              className="grid gap-3 p-5 transition-all duration-200 ease-in-out cursor-pointer hover:bg-[var(--accent-soft)] md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]"
            >
              <h3 className="text-xl font-semibold tracking-[-0.01em]">
                {agenda.title}
              </h3>
              <p className="text-sm leading-7 text-[var(--muted)]">
                {agenda.detail}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-[24px] border border-[var(--line)] bg-[var(--panel)] p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
            Value creation logic
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.02em]">
            From operating issue to exit narrative.
          </h2>
        </div>
        <ol className="mt-5 grid gap-3 md:grid-cols-5">
          {["Problem", "Diagnostic", "Action", "KPI", "Enterprise value"].map(
            (step, index) => (
              <li key={step} className="rounded-lg border border-[var(--line)] bg-[var(--paper)] p-4">
                <p className="text-xs font-semibold text-[var(--accent)]">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <p className="mt-3 text-base font-semibold">
                  {step}
                </p>
              </li>
            ),
          )}
        </ol>
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-[-0.02em]">
            Featured briefings
          </h2>
          <Link href="/playbooks" className="font-semibold text-[var(--accent)]">
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
          <h2 className="text-2xl font-semibold tracking-[-0.02em]">
            Industry intelligence
          </h2>
          <Link href="/industries" className="font-semibold text-[var(--accent)]">
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
            className="rounded-[24px] border border-[var(--line)] bg-[var(--panel)] p-6 text-xl font-semibold transition-all duration-200 ease-in-out cursor-pointer hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] hover:-translate-y-1 hover:shadow-lg"
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
      <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
        {label}
      </dt>
      <dd className="mt-1 text-3xl font-semibold tracking-[-0.03em]">
        {value}
      </dd>
    </div>
  );
}
