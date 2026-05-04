import type { Metadata } from "next";
import { PageHeader } from "@/components/Cards";
import { AIPillarNav, SourceList } from "@/components/AIPillarNav";
import { guardrailPractices, sourceLinks } from "@/lib/aiForPE";

export const metadata: Metadata = {
  title: "AI Guardrails & Data Security for PE | Ops2EBITDA",
  description:
    "Practical AI governance for private equity workflows, enterprise licenses, retention settings, admin controls, data rooms, and legal provisions.",
};

export default function AIGuardrailsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="AI for PE Professionals"
        title="Guardrails and data security."
        summary="A practical control model for using enterprise AI in PE: vendor privacy terms, admin configuration, data classification, permission discipline, legal language, and review standards."
      />

      <AIPillarNav />

      <section className="border-y border-line/80 py-8">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="font-mono-label text-accent">Control model</p>
            <h2 className="mt-3 max-w-2xl font-newsreader text-3xl text-ink">
              The vendor privacy question is only the first layer of AI
              governance.
            </h2>
          </div>
          <div className="space-y-4 text-sm leading-7 text-stone font-geist">
            <p>
              Claude, ChatGPT, Gemini, Microsoft Copilot, and other major
              enterprise AI platforms already provide formal privacy,
              data-use, retention, and security commitments for business
              accounts. With an approved enterprise account, the basic concern
              is not whether the tool has a policy. It is whether the firm has
              configured the account correctly.
            </p>
            <p>
              The operating work is procedural: set retention and history
              rules, approve connectors, govern repositories, document upload
              standards, assign ownership, audit usage, and require human review
              before investment or client-ready use.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8 border-y border-line/80 py-8">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="font-mono-label text-accent">Admin procedure</p>
            <h2 className="mt-3 font-newsreader text-3xl text-ink">
              The practical question is configuration, not permission to
              experiment.
            </h2>
          </div>
          <div className="space-y-4 text-sm leading-7 text-stone font-geist">
            <p>
              A PE firm should have a named admin owner for each approved AI
              workspace. That owner should maintain the settings register:
              retention, chat history, data sharing, connector access, identity
              controls, audit logs, export rules, and deletion process.
            </p>
            <p>
              The governance standard should be explicit enough that a new
              associate, operating partner, consultant, or portfolio CFO knows
              which tool to use, what data can be uploaded, when redaction is
              required, and when outputs need review.
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
              Contract language should match the operating policy.
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
