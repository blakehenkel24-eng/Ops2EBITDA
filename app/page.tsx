import { labelForType } from "@/lib/format";
import { hrefFor } from "@/lib/routes";
import Link from "next/link";
import type { Route } from "next";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { ContentCard } from "@/components/Cards";
import { SearchPanel } from "@/components/SearchPanel";
import { featuredOfferings, productLines } from "@/lib/offerings";
import { absoluteUrl, pageMetadata, siteDescription, siteName } from "@/lib/seo";
import {
  getAllContent,
  getContentStats,
  getIndustries,
  getPlaybooks,
} from "@/lib/content";

const homeDescription =
  "A private equity operations field guide for value creation, KPI logic, industry dynamics, portfolio company playbooks, and AI-enabled operating assets.";

export const metadata: Metadata = pageMetadata({
  title: "Private Equity Operations Field Guide",
  description: homeDescription,
  path: "/",
  keywords: [
    "private equity operating partner",
    "value creation playbooks",
    "PE operating assets",
    "portfolio operations",
  ],
});

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
  { 
    label: "Identify Leakage", 
    desc: "Pinpoint margin degradation or trapped working capital.", 
    tint: "var(--color-accent-soft)", 
    color: "text-accent" 
  },
  { 
    label: "Root Cause", 
    desc: "Isolate the operational friction or data gap.", 
    tint: "var(--color-teal-soft)", 
    color: "text-teal" 
  },
  { 
    label: "Execute Playbook", 
    desc: "Deploy standard operating procedures and tech.", 
    tint: "var(--color-amber-soft)", 
    color: "text-amber" 
  },
  { 
    label: "Track Impact", 
    desc: "Measure EBITDA lift and cash conversion.", 
    tint: "var(--color-plum-soft)", 
    color: "text-plum" 
  },
  { 
    label: "Exit Narrative", 
    desc: "Frame the fix as a de-risked, scalable capability.", 
    tint: "var(--color-accent-soft)", 
    color: "text-accent" 
  },
];

export default function Home() {
  const stats = getContentStats();
  const playbooks = getPlaybooks().slice(0, 4);
  const industries = getIndustries().slice(0, 4);
  const allContent = getAllContent();
  const leadOffering = featuredOfferings[0];
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${absoluteUrl("/")}#organization`,
        name: siteName,
        url: absoluteUrl("/"),
        description: siteDescription,
      },
      {
        "@type": "WebSite",
        "@id": `${absoluteUrl("/")}#website`,
        name: siteName,
        url: absoluteUrl("/"),
        description: siteDescription,
        publisher: {
          "@id": `${absoluteUrl("/")}#organization`,
        },
      },
      {
        "@type": "WebPage",
        "@id": `${absoluteUrl("/")}#webpage`,
        name: "Private Equity Operations Field Guide",
        url: absoluteUrl("/"),
        description: homeDescription,
        isPartOf: {
          "@id": `${absoluteUrl("/")}#website`,
        },
        about: [
          "Private equity operations",
          "Value creation",
          "Operating partner workflows",
          "EBITDA improvement",
          "Portfolio company KPIs",
        ],
      },
      {
        "@type": "ItemList",
        "@id": `${absoluteUrl("/offerings")}#paid-operating-assets`,
        name: "Paid operating assets for private equity value creation",
        itemListElement: productLines.map((line, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: line.title,
          description: line.description,
          url: absoluteUrl("/offerings"),
        })),
      },
    ],
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
          <div className="mt-7 grid gap-3 sm:grid-cols-4">
            <Metric label="Fundamentals" value={stats.fundamentals} />
            <Metric label="Playbooks" value={stats.playbooks} />
            <Metric label="Industries" value={stats.industries} />
            <Metric label="KPIs" value={stats.kpis} />
          </div>
        </div>
        <div className="self-end border border-line/80 bg-paper/90 p-5 shadow-[0_18px_44px_oklch(31%_0.038_248_/_0.08)]">
          <p className="font-mono-label text-accent">Paid operating assets</p>
          <h2 className="mt-4 font-newsreader text-2xl leading-tight text-ink">
            {leadOffering.title}
          </h2>
          <p className="mt-3 text-sm leading-6 text-stone font-geist">
            {leadOffering.description}
          </p>
          <div className="mt-4 flex items-end justify-between gap-4 border-t border-line/80 pt-4">
            <p className="font-newsreader text-3xl text-accent">
              {leadOffering.price}
            </p>
            <Link
              href="/offerings#toolkit"
              className="font-mono-label text-accent hover:opacity-80 transition-opacity"
            >
              Get the toolkit
            </Link>
          </div>
        </div>
      </section>

      <div className="mt-10">
        <SearchPanel items={allContent} />
      </div>

      <section className="mt-10 border border-line/80 bg-paper p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono-label text-accent">
              Tools to do the work
            </p>
            <h2 className="mt-3 font-newsreader text-2xl text-ink">
              Paid assets for the workflows behind the briefings.
            </h2>
          </div>
          <Link
            href="/offerings#toolkit"
            className="font-mono-label text-accent hover:opacity-80 transition-opacity"
          >
            Shop bundles
          </Link>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {productLines.map((line) => (
            <article
              key={line.title}
              className="border border-line/80 bg-bone/45 p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-newsreader text-xl text-ink">
                  {line.title}
                </h3>
                <p className="shrink-0 font-mono-label text-accent">
                  {line.price}
                </p>
              </div>
              <p className="mt-3 text-sm leading-6 text-stone font-geist">
                {line.description}
              </p>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-stone font-geist">
                {line.examples.slice(0, 2).map((example) => (
                  <li key={example} className="border-t border-line/70 pt-2">
                    {example}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

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
                <p className="mt-2 text-sm leading-5 text-stone font-geist">
                  {step.desc}
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
      <p className="font-mono-label text-stone">
        {label}
      </p>
      <p className="mt-1 font-newsreader text-3xl text-accent">
        {value}
      </p>
    </div>
  );
}
