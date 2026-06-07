import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Landmark,
  Building2,
  MessageCircle,
  Zap,
  BookOpen,
  Shield,
} from "lucide-react";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Atlas IQ — PE Research Intelligence",
  description:
    "Sponsor-ready market research and company analysis, powered by PE-specific AI intelligence. Ask a question. Get a memo.",
  path: "/atlas-iq",
  keywords: [
    "private equity AI",
    "PE market research",
    "investment thesis AI",
    "company analysis tool",
    "sponsor diligence",
  ],
});

const capabilities = [
  {
    icon: Landmark,
    label: "Market Reports",
    kicker: "Sector memo",
    description:
      "Sector sizing, fragmentation, M&A patterns, buyer universe, and sponsor thesis angles assembled into an IC pre-read.",
  },
  {
    icon: Building2,
    label: "Company Reports",
    kicker: "Target screen",
    description:
      "LMM sponsor lens on business quality, red flags, platform fit, diligence agenda, and where value creation has to prove out.",
  },
  {
    icon: MessageCircle,
    label: "Research Chat",
    kicker: "Deal room",
    description:
      "A PE copilot for follow-ups: challenge assumptions, dig into subsectors, and pressure-test investment logic before it reaches the memo.",
  },
];

const differentiators = [
  {
    icon: BookOpen,
    label: "Operating Library",
    description:
      "Grounded in 1,100+ curated PE operating patterns, value creation playbooks, and diligence frameworks, not generic web summaries.",
  },
  {
    icon: Zap,
    label: "Workflow Commands",
    description:
      "Use /brief, /thesis, /redflags, and /diligence to turn raw research into deal-ready work product.",
  },
  {
    icon: Shield,
    label: "Source Aware",
    description: "Distinguishes sourced facts from hypotheses. Flags weak evidence and converts gaps to diligence items.",
  },
];

export default function AtlasIQPage() {
  return (
    <div className="atlas-page mx-auto max-w-5xl">
      <section className="atlas-hero overflow-hidden border border-line/70">
        <div className="atlas-hero__grid">
          <div className="atlas-mark" aria-hidden="true">
            <span>IQ</span>
          </div>
          <p className="font-mono-label text-accent">Proprietary research system</p>
          <h1 className="mt-4 font-newsreader text-5xl leading-[0.95] text-ink sm:text-6xl md:text-7xl">
            Atlas IQ
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-stone sm:text-lg">
            Sponsor-ready market research and company analysis, powered by PE-specific
            intelligence. Ask a sharper question. Get a memo the deal team can use.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/atlas-iq/chat"
              className="atlas-primary-cta inline-flex items-center justify-center gap-3 px-6 py-3.5 font-mono-label text-[0.72rem] text-paper transition hover:-translate-y-0.5 hover:shadow-[0_18px_34px_oklch(31%_0.038_248_/_0.16)] focus-visible:outline-offset-4"
            >
              Start research
              <ArrowRight size={14} strokeWidth={2} />
            </Link>
            <span className="text-sm leading-6 text-stone">
              Market, company, and thesis work in one research surface.
            </span>
          </div>
        </div>
        <div className="atlas-hero__artifact" aria-hidden="true">
          <div className="atlas-memo-sheet">
            <span className="font-mono-label text-accent">Memo preview</span>
            <div className="mt-5 space-y-3">
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-7 grid grid-cols-1 border border-line/70 bg-line/60 shadow-[0_22px_60px_oklch(31%_0.038_248_/_0.07)] md:grid-cols-3 md:gap-px">
        {capabilities.map(({ icon: Icon, label, kicker, description }) => (
          <article key={label} className="atlas-capability bg-paper p-6 md:min-h-64">
            <div className="mb-6 flex items-center justify-between">
              <Icon size={20} strokeWidth={1.35} className="text-accent" />
              <span className="font-mono-label text-[0.62rem] text-stone">{kicker}</span>
            </div>
            <h2 className="font-newsreader text-2xl text-ink">{label}</h2>
            <p className="mt-4 text-sm leading-7 text-stone">{description}</p>
          </article>
        ))}
      </section>

      <section className="atlas-dossier mt-10 border-y border-line/60 py-3">
        {differentiators.map(({ icon: Icon, label, description }) => (
          <article
            key={label}
            className="grid gap-4 border-b border-line/35 py-5 last:border-b-0 sm:grid-cols-[2.75rem_13rem_1fr] sm:items-start"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-line/55 bg-accent-soft/45 shadow-[0_1px_0_oklch(99%_0.004_235_/_0.9)_inset]">
              <Icon size={15} strokeWidth={1.5} className="text-accent" />
            </div>
            <h3 className="font-mono-label pt-1.5 text-xs text-ink">{label}</h3>
            <p className="text-sm leading-7 text-stone">{description}</p>
          </article>
        ))}
      </section>

      <div className="flex justify-center py-10">
        <Link
          href="/atlas-iq/chat"
          className="inline-flex items-center gap-2 border-b border-accent/45 pb-1 font-mono-label text-xs text-accent transition-colors hover:border-accent hover:text-ink"
        >
          Open Atlas IQ
          <ArrowRight size={12} strokeWidth={2} />
        </Link>
      </div>
    </div>
  );
}
