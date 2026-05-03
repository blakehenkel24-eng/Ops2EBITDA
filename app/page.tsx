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
          <p className="font-mono-label text-stone">
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
        <div className="self-end border border-stone/30 bg-paper p-5">
          <p className="font-mono-label text-stone">
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
        <div className="divide-y divide-stone/30 border border-stone/30 bg-paper">
          {operatingAgendas.map((agenda) => (
            <Link
              key={agenda.title}
              href={agenda.href}
              className="grid gap-3 p-5 transition-all duration-200 ease-in-out cursor-pointer hover:bg-bone hover:border-l-2 hover:border-l-ochre md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]"
            >
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

      <section className="mt-10 border border-stone/30 bg-paper p-5">
        <div>
          <p className="font-mono-label text-stone">
            Value creation logic
          </p>
          <h2 className="mt-3 font-newsreader text-2xl text-ink">
            From operating issue to exit narrative.
          </h2>
        </div>
        <ol className="mt-5 grid gap-3 md:grid-cols-5">
          {["Problem", "Diagnostic", "Action", "KPI", "Enterprise value"].map(
            (step, index) => (
              <li key={step} className="border border-stone/30 bg-bone p-4">
                <p className="font-mono-label text-ochre">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <p className="mt-3 text-base font-newsreader text-ink">
                  {step}
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
          <Link href="/playbooks" className="font-mono-label text-ochre hover:opacity-80 transition-opacity">
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
          <Link href="/industries" className="font-mono-label text-ochre hover:opacity-80 transition-opacity">
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
            className="border border-stone/30 bg-paper p-6 font-newsreader text-xl text-ink transition-all duration-200 ease-in-out cursor-pointer hover:border-ochre hover:bg-bone hover:-translate-y-1"
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
      <dd className="mt-1 font-newsreader text-3xl text-ink">
        {value}
      </dd>
    </div>
  );
}
