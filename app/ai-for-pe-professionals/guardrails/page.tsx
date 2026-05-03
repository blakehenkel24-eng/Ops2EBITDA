import type { Metadata } from "next";
import { PageHeader } from "@/components/Cards";
import { AIPillarNav, SourceList } from "@/components/AIPillarNav";
import { guardrailPractices, sourceLinks } from "@/lib/aiForPE";

export const metadata: Metadata = {
  title: "AI Guardrails & Data Security for PE | Ops2EBITDA",
  description:
    "Practical guardrails for using AI with private equity workflows, confidential deal data, enterprise licenses, data rooms, and legal provisions.",
};

export default function AIGuardrailsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="AI for PE Professionals"
        title="Guardrails and data security."
        summary="How to make AI feel safe enough for real PE work: approved tools, enterprise controls, data-room discipline, source review, and clear contract language."
      />

      <AIPillarNav />

      <section className="border-y border-line/80 py-8">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="font-mono-label text-accent">The honest answer</p>
            <h2 className="mt-3 max-w-2xl font-newsreader text-3xl text-ink">
              AI data risk is manageable, but only if the firm treats it like a
              normal enterprise-control problem.
            </h2>
          </div>
          <div className="space-y-4 text-sm leading-7 text-stone font-geist">
            <p>
              People are right to be cautious. PE work involves CIMs, data rooms,
              board materials, customer information, employee data, legal
              documents, and nonpublic financials. Those materials should not be
              pasted into random consumer tools.
            </p>
            <p>
              The good news is that enterprise AI products, approved data-room
              platforms, and normal legal provisions can reduce the risk
              substantially. The goal is not blind trust. The goal is controlled
              usage: approved accounts, clear permissions, documented retention,
              no-training commitments where available, and human review.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        {guardrailPractices.map((practice) => (
          <article
            key={practice.title}
            className="border border-line/80 bg-paper p-5"
          >
            <h2 className="font-newsreader text-2xl text-ink">
              {practice.title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-stone font-geist">
              {practice.body}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-8 border-y border-line/80 py-8">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="font-mono-label text-accent">Practical clause topics</p>
            <h2 className="mt-3 font-newsreader text-3xl text-ink">
              Contract language should make AI use explicit.
            </h2>
          </div>
          <div className="space-y-4 text-sm leading-7 text-stone font-geist">
            <p>
              This is not legal advice, but the practical checklist is
              straightforward. Engagement letters, NDAs, vendor agreements, and
              portfolio company policies can address whether AI tools may be
              used, which tools are approved, whether confidential information
              can be uploaded, whether data can be retained or used for model
              training, and who is responsible for reviewing AI-assisted work.
            </p>
            <p>
              For high-sensitivity matters, the default should be conservative:
              approved enterprise account, access controls, no model training on
              customer content where available, source-linked outputs, and no
              unreviewed AI text in client-ready or investment-decision work.
            </p>
          </div>
        </div>
      </section>

      <SourceList
        sources={sourceLinks.filter((source) =>
          [
            "OpenAI business data privacy",
            "Anthropic data processor guidance",
            "Microsoft 365 Copilot data security",
            "Intralinks DealCentre AI overview",
          ].includes(source.label),
        )}
      />
    </div>
  );
}
