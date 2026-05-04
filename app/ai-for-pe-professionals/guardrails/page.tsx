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
        summary="The practical control model for using AI in PE: enterprise licenses, legal language, data classification, permission discipline, and review standards."
      />

      <AIPillarNav />

      <section className="border-y border-line/80 py-8">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="font-mono-label text-accent">Control model</p>
            <h2 className="mt-3 max-w-2xl font-newsreader text-3xl text-ink">
              Treat AI like any other enterprise system that touches
              confidential work.
            </h2>
          </div>
          <div className="space-y-4 text-sm leading-7 text-stone font-geist">
            <p>
              The facts matter more than the anxiety. Enterprise AI products can
              provide contractual privacy terms, no-training commitments for
              business data, admin controls, retention settings, encryption,
              access management, auditability, and security documentation.
            </p>
            <p>
              The right posture is straightforward: use approved enterprise
              accounts, put AI language into legal documents, define what data
              can go where, keep permissions attached to the underlying content,
              and require human review before investment or client-ready use.
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
              portfolio company policies can specify whether AI tools may be
              used, which tools are approved, what confidential information may
              be uploaded, whether customer content can be retained or used for
              training, and who reviews AI-assisted work.
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
            "Claude Enterprise",
            "Anthropic data processor guidance",
            "Google Workspace Gemini Privacy Hub",
            "Microsoft 365 Copilot data security",
            "Intralinks DealCentre AI overview",
          ].includes(source.label),
        )}
      />
    </div>
  );
}
