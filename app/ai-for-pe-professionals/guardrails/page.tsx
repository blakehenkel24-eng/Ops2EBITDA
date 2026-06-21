import type { Metadata } from "next";
import { PageHeader } from "@/components/Cards";
import { AIPillarNav, SourceList } from "@/components/AIPillarNav";
import { guardrailPractices, sourceLinks } from "@/lib/aiForPE";

export const metadata: Metadata = {
  title: "AI Guardrails & Data Security for PE",
  description:
    "Practical AI guardrails for private equity workflows, enterprise licenses, retention settings, admin controls, sensitive uploads, transcripts, and legal provisions.",
};

export default function AIGuardrailsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="AI for PE Professionals"
        title="Guardrails and data security."
        summary="How PE teams can use enterprise AI confidently: rely on provider privacy and retention controls, configure admin settings, use basic data hygiene, and cover AI use in legal language."
      />

      <AIPillarNav />

      <section className="border-y border-line/80 py-8">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="font-mono-label text-accent">The practical answer</p>
            <h2 className="mt-3 max-w-2xl font-newsreader text-3xl text-ink">
              Enterprise AI is built for this. The firm just needs basic
              operating hygiene.
            </h2>
          </div>
          <div className="space-y-4 text-sm leading-7 text-stone font-geist">
            <p>
              Claude, ChatGPT, Gemini, Microsoft Copilot, and the other major
              enterprise AI platforms already have business privacy, security,
              retention, and data-use policies in place. If the firm is using an
              approved enterprise account, the baseline data-storage concern is
              manageable.
            </p>
            <p>
              The remaining work is straightforward: let IT own the admin
              settings, configure retention and history rules, avoid unnecessary
              personal information, clean transcripts before upload when needed,
              and make sure AI use is covered in policies, engagement letters,
              and vendor terms.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8 border-y border-line/80 py-8">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="font-mono-label text-accent">Admin procedure</p>
            <h2 className="mt-3 font-newsreader text-3xl text-ink">
              Major enterprise AI providers already have robust retention and
              privacy controls in place.
            </h2>
          </div>
          <div className="space-y-4 text-sm leading-7 text-stone font-geist">
            <p>
              A PE firm does not need to turn AI adoption into a legal project
              every time someone wants to use Claude or ChatGPT. It needs a
              named admin owner for each approved workspace and a simple
              settings register covering retention, chat history, data sharing,
              connector access, identity controls, audit logs, export rules, and
              deletion process.
            </p>
            <p>
              Once that is in place, the usage rules can be plain: use approved
              enterprise accounts, avoid uploading unnecessary PII, remove
              sensitive personal details from transcripts where possible, and
              keep human review on investment or client-ready outputs.
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
              Legal language should cover the obvious cases.
            </h2>
          </div>
          <div className="space-y-4 text-sm leading-7 text-stone font-geist">
            <p>
              This is not legal advice, but the practical checklist is
              straightforward. Engagement letters, NDAs, vendor agreements, and
              portfolio company policies can say that approved enterprise AI
              tools may be used to support analysis, drafting, summarization,
              and workflow automation, subject to confidentiality, retention,
              privacy, and human-review standards.
            </p>
            <p>
              That is usually enough for practical coverage: use approved tools,
              avoid unnecessary personal information, redact sensitive
              transcripts when appropriate, preserve confidentiality, and keep a
              human accountable for final work product.
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
