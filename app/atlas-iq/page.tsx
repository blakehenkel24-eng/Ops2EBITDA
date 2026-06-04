import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Landmark, Building2, MessageCircle } from "lucide-react";
import { PageHeader, PillList } from "@/components/Cards";
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

const modes = [
  {
    icon: Landmark,
    label: "Market Mode",
    title: "Sector Analysis",
    description:
      "Market size, segmentation, competitive landscape, M&A activity, sponsor thesis. IC pre-read ready.",
  },
  {
    icon: Building2,
    label: "Company Mode",
    title: "Target Evaluation",
    description:
      "Business overview, market positioning, sponsor fit, red flags, and platform potential. LMM perspective.",
  },
  {
    icon: MessageCircle,
    label: "Chat Mode",
    title: "Follow-Up Research",
    description:
      "Natural conversation on live research. Challenge assumptions, dig into subsectors, pressure-test thesis.",
  },
];

const commands = [
  "/brief",
  "/thesis",
  "/redflags",
  "/comps",
  "/diligence",
  "/memo",
  "/pdf",
  "/platform",
  "/challenge",
  "/rank",
];

export default function AtlasIQPage() {
  return (
    <>
      <div className="text-center mb-12">
        <PageHeader
          eyebrow="PROPRIETARY AI RESEARCH SYSTEM"
          title="Atlas IQ"
          summary="Sponsor-ready market research and company analysis, powered by PE-specific intelligence. Ask a question. Get a memo."
          className="mx-auto text-center"
        />
        <div className="flex gap-3 justify-center mt-8">
          <Link
            href="/atlas-iq/chat"
            className="inline-flex items-center gap-2 bg-accent text-white px-6 py-2.5 rounded-lg font-mono-label hover:opacity-90 transition-opacity"
          >
            Start Research
            <ArrowRight size={14} strokeWidth={1.5} />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        {modes.map(({ icon: Icon, label, title, description }) => (
          <article
            key={label}
            className="bg-paper border border-line/80 p-6 flex flex-col"
          >
            <div className="flex items-center gap-2 mb-3">
              <Icon size={16} strokeWidth={1.5} className="text-accent" />
              <span className="font-mono-label text-accent">{label}</span>
            </div>
            <h3 className="font-newsreader text-xl text-ink mb-2">{title}</h3>
            <p className="text-sm text-stone leading-relaxed flex-1">
              {description}
            </p>
          </article>
        ))}
      </div>

      <div className="bg-paper border border-line/80 p-6 mb-12">
        <p className="font-mono-label text-stone mb-3">PE WORKFLOW COMMANDS</p>
        <PillList items={commands} />
      </div>
    </>
  );
}
