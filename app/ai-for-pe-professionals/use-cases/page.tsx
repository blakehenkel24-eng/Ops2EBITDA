import type { Metadata } from "next";
import { PageHeader } from "@/components/Cards";
import { AIPillarNav, SourceList } from "@/components/AIPillarNav";
import { sourceLinks, useCases } from "@/lib/aiForPE";

export const metadata: Metadata = {
  title: "Top AI Use Cases for PE Professionals",
  description:
    "Practical AI use cases for private equity investment teams, operating partners, portfolio teams, and diligence consultants.",
};

export default function AIUseCasesPage() {
  return (
    <div>
      <PageHeader
        eyebrow="AI for PE Professionals"
        title="Top use-case themes."
        summary="Where AI is actually useful for PE professionals today: compressing diligence, improving judgment support, turning portfolio reporting into signal, and reusing firm knowledge."
      />

      <AIPillarNav />

      <section className="border-y border-line/80 py-8">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="font-mono-label text-accent">The real pattern</p>
            <h2 className="mt-3 max-w-2xl font-newsreader text-3xl text-ink">
              The value is one click above the task, not buried inside a single
              task.
            </h2>
          </div>
          <div className="space-y-4 text-sm leading-7 text-stone font-geist">
            <p>
              The best use cases are not random prompts. They sit one level
              above the repetitive work: diligence compression, IC pressure
              testing, portfolio signal detection, value creation planning,
              market mapping, and firm knowledge reuse.
            </p>
            <p>
              AI creates leverage when the professional already has judgment and
              process. The model reads, compares, drafts, structures, and
              pressure-tests. The PE professional decides what deserves
              conviction.
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
                  {useCase.take}
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
                  <p className="font-mono-label text-stone">Where it pays</p>
                  <p className="mt-2">{useCase.payoff}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="font-mono-label text-stone">Sub-use cases</p>
                  <ul className="mt-2 grid gap-2 md:grid-cols-2">
                    {useCase.examples.map((example) => (
                      <li key={example} className="border-t border-line/80 pt-2">
                        {example}
                      </li>
                    ))}
                  </ul>
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
            "McKinsey: 2026 private equity report",
            "BCG: Inside the AI-first PE firm",
            "Bain: Generative AI in M&A",
            "Bain: Generative AI in Private Equity",
            "PwC: GenAI for PE investment teams",
          ].includes(source.label),
        )}
      />
    </div>
  );
}
