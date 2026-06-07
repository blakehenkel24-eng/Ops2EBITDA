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
    description:
      "Full sector analysis with sizing, fragmentation, M&A activity, and sponsor thesis angles. IC pre-read ready.",
  },
  {
    icon: Building2,
    label: "Company Reports",
    description:
      "Target evaluation from an LMM sponsor perspective: business quality, red flags, platform fit, diligence agenda.",
  },
  {
    icon: MessageCircle,
    label: "Research Chat",
    description:
      "Conversational PE copilot. Challenge assumptions, dig into subsectors, pressure-test investment logic.",
  },
];

const differentiators = [
  {
    icon: BookOpen,
    label: "Operating Library",
    description: "Grounded in 1,100+ curated PE operating knowledge chunks, not generic web data.",
  },
  {
    icon: Zap,
    label: "Workflow Commands",
    description: "Type /brief, /thesis, /redflags, /diligence to transform any response into deal-ready output.",
  },
  {
    icon: Shield,
    label: "Source Aware",
    description: "Distinguishes sourced facts from hypotheses. Flags weak evidence and converts gaps to diligence items.",
  },
];

export default function AtlasIQPage() {
  return (
    <div className="max-w-3xl mx-auto">
      {/* Hero */}
      <div className="text-center pt-8 pb-12">
        <div className="w-14 h-14 rounded-full bg-accent/8 flex items-center justify-center mx-auto mb-6">
          <span className="text-accent font-newsreader text-xl font-semibold">IQ</span>
        </div>
        <h1 className="font-newsreader text-4xl md:text-5xl text-ink mb-3 tracking-tight">
          Atlas IQ
        </h1>
        <p className="text-stone text-base max-w-md mx-auto leading-relaxed mb-8">
          Sponsor-ready market research and company analysis, powered by
          PE-specific intelligence. Ask a question. Get a memo.
        </p>
        <Link
          href="/atlas-iq/chat"
          className="inline-flex items-center gap-2.5 bg-accent text-white px-7 py-3 font-mono-label text-xs tracking-wider hover:opacity-90 transition-opacity"
        >
          Start Research
          <ArrowRight size={13} strokeWidth={2} />
        </Link>
      </div>

      {/* Capabilities */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-line/50 border border-line/50 mb-10">
        {capabilities.map(({ icon: Icon, label, description }) => (
          <article key={label} className="bg-paper p-5">
            <Icon size={18} strokeWidth={1.3} className="text-accent mb-3" />
            <h3 className="font-mono-label text-ink text-xs mb-2">{label}</h3>
            <p className="text-sm text-stone leading-relaxed">{description}</p>
          </article>
        ))}
      </div>

      {/* Differentiators */}
      <div className="space-y-0 border-t border-line/50 mb-12">
        {differentiators.map(({ icon: Icon, label, description }) => (
          <div key={label} className="flex items-start gap-4 py-4 border-b border-line/30">
            <div className="w-8 h-8 rounded bg-accent/6 flex items-center justify-center shrink-0 mt-0.5">
              <Icon size={15} strokeWidth={1.5} className="text-accent" />
            </div>
            <div>
              <h4 className="font-mono-label text-ink text-xs mb-0.5">{label}</h4>
              <p className="text-sm text-stone leading-relaxed">{description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="text-center pb-12">
        <Link
          href="/atlas-iq/chat"
          className="inline-flex items-center gap-2 text-accent font-mono-label text-xs hover:underline underline-offset-4"
        >
          Open Atlas IQ
          <ArrowRight size={12} strokeWidth={2} />
        </Link>
      </div>
    </div>
  );
}
