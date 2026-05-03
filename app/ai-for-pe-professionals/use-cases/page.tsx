import type { Metadata } from "next";
import { PageHeader } from "@/components/Cards";
import { AIPillarNav, SourceList } from "@/components/AIPillarNav";
import { sourceLinks, useCases } from "@/lib/aiForPE";

export const metadata: Metadata = {
  title: "Top AI Use Cases for PE Professionals | Ops2EBITDA",
  description:
    "Practical AI use cases for private equity investment teams, operating partners, portfolio teams, and diligence consultants.",
};

export default function AIUseCasesPage() {
  return (
    <div>
      <PageHeader
        eyebrow="AI for PE Professionals"
        title="Top use cases for PE professionals."
        summary="What investment teams, operating partners, and consultants are using AI for today: faster diligence, sharper memos, better portfolio monitoring, and more repeatable operating work."
      />

      <AIPillarNav />

      <section className="border-y border-line/80 py-8">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="font-mono-label text-accent">What is actually useful</p>
            <h2 className="mt-3 max-w-2xl font-newsreader text-3xl text-ink">
              The near-term value is not magic. It is compression of repetitive
              knowledge work.
            </h2>
          </div>
          <div className="space-y-4 text-sm leading-7 text-stone font-geist">
            <p>
              The best PE use cases usually sit where the work is document
              heavy, time-sensitive, judgment-intensive, and repeated across
              deals or portfolio companies. AI helps the team get to a sharper
              first draft, a better question list, or a more complete issue tree
              sooner.
            </p>
            <p>
              It is most valuable when the human already knows what good work
              looks like. The model can read, summarize, compare, draft, and
              pressure-test. The professional still decides what matters.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8 space-y-5">
        {useCases.map((useCase) => (
          <article
            key={useCase.title}
            className="border border-line/80 bg-paper p-6"
          >
            <div className="grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
              <div>
                <p className="font-mono-label text-accent">
                  {useCase.stakeholder}
                </p>
                <h2 className="mt-3 font-newsreader text-2xl text-ink">
                  {useCase.title}
                </h2>
                <p className="mt-4 text-sm leading-7 text-stone font-geist">
                  {useCase.value}
                </p>
              </div>
              <div className="grid gap-4 text-sm leading-7 text-stone font-geist md:grid-cols-2">
                <div>
                  <p className="font-mono-label text-stone">Inputs</p>
                  <p className="mt-2">{useCase.inputs}</p>
                </div>
                <div>
                  <p className="font-mono-label text-stone">Workflow</p>
                  <p className="mt-2">{useCase.workflow}</p>
                </div>
                <div>
                  <p className="font-mono-label text-stone">Output</p>
                  <p className="mt-2">{useCase.output}</p>
                </div>
                <div>
                  <p className="font-mono-label text-stone">Watch-out</p>
                  <p className="mt-2">{useCase.caution}</p>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>

      <SourceList
        sources={sourceLinks.filter((source) =>
          [
            "McKinsey: Gen AI for outside-in diligence",
            "McKinsey: Gen AI in private markets",
            "Bain: Generative AI in M&A",
            "Bain: Generative AI in Private Equity",
            "PwC: GenAI for PE investment teams",
          ].includes(source.label),
        )}
      />
    </div>
  );
}
