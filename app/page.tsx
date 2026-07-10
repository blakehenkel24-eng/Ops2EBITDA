import { labelForType } from "@/lib/format";
import { hrefFor } from "@/lib/routes";
import Link from "next/link";
import type { Route } from "next";
import type { Metadata } from "next";
import { ContentCard } from "@/components/Cards";
import { ScrollReveal } from "@/components/ScrollReveal";
import { featuredOfferings, productLines } from "@/lib/offerings";
import { absoluteUrl, pageMetadata, siteDescription, siteName } from "@/lib/seo";
import {
  getAllContent,
  getContentStats,
  getIndustries,
  getPlaybooks,
} from "@/lib/content";
import { SearchPanel } from "@/components/SearchPanel";
import { ArrowRight, Sparkles, Package } from "lucide-react";

const homeDescription =
  "A private equity operations field guide for value creation, KPI logic, industry dynamics, portfolio company playbooks, and AI-enabled operating assets.";

const heroProofPoints = [
  "Source-backed research",
  "Model-ready assets",
  "PE workflow logic",
  "Board-ready outputs",
];

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
        publisher: { "@id": `${absoluteUrl("/")}#organization` },
      },
      {
        "@type": "WebPage",
        "@id": `${absoluteUrl("/")}#webpage`,
        name: "Private Equity Operations Field Guide",
        url: absoluteUrl("/"),
        description: homeDescription,
        isPartOf: { "@id": `${absoluteUrl("/")}#website` },
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
    <div className="home-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="home-hero-v2">
        <div className="home-hero-v2__inner">
          <div className="home-hero-v2__copy">
            <p className="home-hero-kicker font-mono-label">
              <span className="signal-dot" aria-hidden="true" />
              PE operating workbench
            </p>

            <h1 className="max-w-[18ch] font-newsreader text-[2.7rem] leading-[1.05] md:text-6xl lg:text-[4.35rem] text-ink">
              Private equity operations, from thesis to exit.
            </h1>
            <p className="mt-6 max-w-[50ch] text-lg leading-8 text-stone font-geist">
              Ops2EBITDA combines consulting-grade operating briefings, Atlas IQ
              research, and downloadable execution assets for teams turning value
              creation ideas into board-ready work.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3 md:mt-9">
              <Link href="/atlas-iq/chat" className="home-cta-primary">
                Try Atlas IQ
                <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
              </Link>
              <Link href="/fundamentals" className="home-cta-secondary">
                Explore the Knowledge Base
                <ArrowRight size={15} strokeWidth={1.8} aria-hidden="true" />
              </Link>
            </div>

            <div className="home-hero-proof" aria-label="Platform strengths">
              {heroProofPoints.map((point) => (
                <span key={point} className="home-hero-proof__item">
                  {point}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="home-section home-section--tight">
        <SearchPanel items={allContent} />
      </div>

      <ScrollReveal as="section" className="home-section">
        <div className="home-platform-header">
          <h2 className="font-newsreader text-3xl md:text-4xl text-ink leading-tight max-w-[28ch]">
            Knowledge, tools, and intelligence in one platform.
          </h2>
          <p className="home-platform-lede">
            Built around the actual PE operating cycle: diagnose the issue,
            understand the lever, generate the work product, and connect the
            output to EBITDA, cash, or exit value.
          </p>
        </div>

        <div className="mt-10 home-platform-grid">
          <Link href="/atlas-iq/chat" className="home-platform-feature group">
            <div className="home-platform-feature__badge">
              <Sparkles size={18} strokeWidth={1.6} aria-hidden="true" />
            </div>
            <h3 className="mt-6 font-newsreader text-2xl text-ink group-hover:text-accent transition-colors">
              Atlas IQ Research
            </h3>
            <p className="mt-3 text-sm leading-6 text-stone font-geist">
              AI-powered market and company research that delivers consulting-grade
              analysis with source verification and PDF export.
            </p>
            <span className="mt-auto pt-6 flex items-center gap-2 font-mono-label text-accent opacity-0 group-hover:opacity-100 transition-opacity">
              Try Atlas IQ
              <ArrowRight size={13} strokeWidth={1.8} aria-hidden="true" />
            </span>
          </Link>

          <div className="home-platform-secondary">
            <Link href="/fundamentals" className="home-platform-item group">
              <h3 className="font-newsreader text-lg text-ink group-hover:text-accent transition-colors">
                Knowledge Base
              </h3>
              <p className="mt-2 text-sm leading-6 text-stone font-geist">
                {stats.fundamentals} fundamentals, {stats.playbooks} playbooks, and {stats.industries} industry briefings on PE operations.
              </p>
              <ArrowRight size={14} strokeWidth={1.5} className="mt-3 text-stone/30 group-hover:text-accent transition-colors" aria-hidden="true" />
            </Link>

            <Link href="/offerings#toolkit" className="home-platform-item group">
              <h3 className="font-newsreader text-lg text-ink group-hover:text-accent transition-colors flex items-center gap-2.5">
                Operating Assets
                <Package size={15} strokeWidth={1.5} className="text-stone/40" />
              </h3>
              <p className="mt-2 text-sm leading-6 text-stone font-geist">
                Excel models, AI project kits, and skill packages for the workflows behind the briefings.
              </p>
              <ArrowRight size={14} strokeWidth={1.5} className="mt-3 text-stone/30 group-hover:text-accent transition-colors" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </ScrollReveal>

      <section className="home-showcase-dark">
        <ScrollReveal as="div" className="home-showcase">
          <div className="home-showcase__text">
            <span className="home-showcase__eyebrow font-mono-label">
              <span className="home-showcase__eyebrow-dot" aria-hidden="true" />
              Flagship · Atlas IQ
            </span>
            <h2 className="home-showcase__heading">
              AI-powered PE research, grounded in real sources.
            </h2>
            <p className="home-showcase__body mt-5 text-base leading-8 max-w-[52ch] font-geist">
              Atlas IQ delivers consulting-grade market landscape analysis and company
              deep-dives. Every claim is sourced. Export to PDF or Word when you need
              the deliverable, not the conversation.
            </p>
            <div className="home-showcase__feature-list">
              {[
                "Market landscape research with competitive positioning",
                "Company deep-dives across financials, operations, and strategy",
                "Source-verified analysis with confidence scoring",
                "PDF and Word export for board packs and memos",
              ].map((text, i) => (
                <div key={text} className="home-showcase__feature">
                  <span className="home-showcase__feature-num">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
            <Link href="/atlas-iq/chat" className="home-showcase__cta mt-8">
              Try Atlas IQ
              <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
            </Link>
          </div>

          <div className="home-showcase__visual">
            <div className="home-showcase__mock">
              <div className="home-showcase__mock-header">
                <span className="home-showcase__mock-tab">
                  <Sparkles size={9} strokeWidth={2} aria-hidden="true" />
                  Atlas IQ · Market Mode
                </span>
              </div>
              <div className="home-showcase__mock-body">
                <div className="home-showcase__mock-query">
                  <span className="home-showcase__mock-query-prompt">{">"}</span>
                  <span>Landscape: tech-enabled HCM platforms, mid-market</span>
                </div>

                <div className="home-showcase__mock-section">
                  <div className="home-showcase__mock-section-label">Executive Summary</div>
                  <div className="home-showcase__mock-line" style={{ width: "94%" }} />
                  <div className="home-showcase__mock-line" style={{ width: "88%" }} />
                  <div className="home-showcase__mock-line" style={{ width: "76%" }} />
                </div>

                <div className="home-showcase__mock-section">
                  <div className="home-showcase__mock-section-label">Competitive Map</div>
                  <div className="home-showcase__mock-line home-showcase__mock-line--accent" style={{ width: "72%" }} />
                  <div className="home-showcase__mock-line" style={{ width: "90%" }} />
                  <div className="home-showcase__mock-line" style={{ width: "82%" }} />
                  <div className="home-showcase__mock-citations">
                    <span className="home-showcase__mock-citation">[SEC 10-K]</span>
                    <span className="home-showcase__mock-citation">[Gartner]</span>
                    <span className="home-showcase__mock-citation">[S&P Cap IQ]</span>
                  </div>
                </div>

                <div className="home-showcase__mock-section">
                  <div className="home-showcase__mock-section-label">Operating Levers</div>
                  <div className="home-showcase__mock-line" style={{ width: "86%" }} />
                  <div className="home-showcase__mock-line" style={{ width: "70%" }} />
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <ScrollReveal as="section" className="home-section">
        <h2 className="font-newsreader text-3xl md:text-4xl text-ink leading-tight max-w-[28ch]">
          From operating issue to exit narrative.
        </h2>
        <div className="mt-10 home-value-steps">
          {[
            { label: "Identify Leakage", desc: "Pinpoint margin degradation or trapped working capital." },
            { label: "Root Cause", desc: "Isolate the operational friction or data gap." },
            { label: "Execute Playbook", desc: "Deploy standard operating procedures and tech." },
            { label: "Track Impact", desc: "Measure EBITDA lift and cash conversion." },
            { label: "Exit Narrative", desc: "Frame the fix as a de-risked, scalable capability." },
          ].map((step, index) => (
            <ScrollReveal key={step.label} delay={index * 80}>
              <div className="home-value-step">
                <span className="home-value-step__number font-mono-label text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-newsreader text-xl text-ink">{step.label}</h3>
                <p className="mt-2 text-sm leading-6 text-stone font-geist">{step.desc}</p>
                {index < 4 && (
                  <div className="home-value-step__connector" aria-hidden="true" />
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal as="section" className="home-section home-section--tight">
        <h2 className="font-newsreader text-3xl md:text-4xl text-ink leading-tight max-w-[28ch]">
          Operating agendas, not modules.
        </h2>
        <div className="mt-8 home-agenda-list">
          {[
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
          ].map((agenda, index) => (
            <Link
              key={agenda.title}
              href={agenda.href}
              className="home-agenda-item group"
            >
              <span className="font-mono-label text-accent shrink-0">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <h3 className="font-newsreader text-xl text-ink">{agenda.title}</h3>
                <p className="mt-1.5 text-sm leading-7 text-stone font-geist">{agenda.detail}</p>
              </div>
              <ArrowRight size={16} strokeWidth={1.5} className="shrink-0 text-stone/30 group-hover:text-accent transition-colors" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal as="section" className="home-section">
        <div className="flex items-end justify-between gap-4 mb-6">
          <h2 className="font-newsreader text-2xl md:text-3xl text-ink">
            Featured briefings
          </h2>
          <Link href="/playbooks" className="font-mono-label text-accent hover:opacity-80 transition-opacity whitespace-nowrap">
            View all
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {playbooks.map((item) => (
            <ContentCard key={item.slug} title={item.title} description={item.summary} href={hrefFor(item)} tag={labelForType(item.type)} />
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal as="section" className="home-section home-section--tight">
        <div className="flex items-end justify-between gap-4 mb-6">
          <h2 className="font-newsreader text-2xl md:text-3xl text-ink">
            Industry intelligence
          </h2>
          <Link href="/industries" className="font-mono-label text-accent hover:opacity-80 transition-opacity whitespace-nowrap">
            View all
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {industries.map((item) => (
            <ContentCard key={item.slug} title={item.title} description={item.summary} href={hrefFor(item)} tag={labelForType(item.type)} />
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal as="section" className="home-section home-section--generous">
        <div className="flex items-end justify-between gap-4 mb-8">
          <h2 className="font-newsreader text-3xl md:text-4xl text-ink leading-tight max-w-[24ch]">
            Paid assets for the workflows behind the briefings.
          </h2>
          <Link
            href="/offerings#toolkit"
            className="font-mono-label text-accent hover:opacity-80 transition-opacity whitespace-nowrap"
          >
            Shop bundles
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {productLines.map((line, i) => (
            <ScrollReveal key={line.title} as="article" delay={i * 100} className="home-product-card">
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-newsreader text-xl text-ink">{line.title}</h3>
                <p className="shrink-0 font-mono-label text-accent">{line.price}</p>
              </div>
              <p className="mt-3 text-sm leading-6 text-stone font-geist">{line.description}</p>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-stone font-geist">
                {line.examples.slice(0, 2).map((example) => (
                  <li key={example} className="border-t border-line/40 pt-2">{example}</li>
                ))}
              </ul>
            </ScrollReveal>
          ))}
        </div>

        {leadOffering && (
          <ScrollReveal delay={350}>
            <div className="mt-6 home-bundle-callout">
              <div>
                <h3 className="font-newsreader text-2xl text-ink">{leadOffering.title}</h3>
                <p className="mt-2 text-sm leading-6 text-stone font-geist max-w-[52ch]">{leadOffering.description}</p>
              </div>
              <div className="flex items-center gap-6">
                <p className="font-newsreader text-4xl text-accent">{leadOffering.price}</p>
                <Link href="/offerings#toolkit" className="home-cta-primary">
                  Get the Toolkit
                  <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </ScrollReveal>
        )}
      </ScrollReveal>

      <ScrollReveal as="section" className="home-section home-section--tight">
        <div className="grid gap-4 md:grid-cols-3">
          {([
            ["KPI Reference", "/kpis" as Route],
            ["AI Opportunity Lens", "/playbooks/ai-opportunity-identification" as Route],
            ["100-Day Plan", "/playbooks/100-day-value-creation-plan" as Route],
          ] as const).map(([label, href]) => (
            <Link
              key={label}
              href={href}
              className="home-quick-link group"
            >
              <span className="font-newsreader text-xl text-ink group-hover:text-accent transition-colors">{label}</span>
              <ArrowRight size={16} strokeWidth={1.5} className="text-stone/30 group-hover:text-accent transition-colors" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </ScrollReveal>

      <section className="home-closing-cta">
        <h2 className="font-newsreader text-3xl md:text-4xl text-ink leading-tight max-w-[24ch] mx-auto">
          Start building your operating edge.
        </h2>
        <p className="mt-5 text-base leading-7 text-stone font-geist max-w-[48ch] mx-auto">
          Explore the knowledge base for free, or get the full toolkit with models,
          projects, and skills for PE value creation.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link href="/fundamentals" className="home-cta-primary">
            Explore Knowledge Base
            <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
          </Link>
          <Link href="/offerings#toolkit" className="home-cta-secondary">
            Get the Toolkit
            <ArrowRight size={15} strokeWidth={1.8} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
