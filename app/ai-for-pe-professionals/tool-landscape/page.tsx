import type { Metadata } from "next";
import { PageHeader } from "@/components/Cards";
import { AIPillarNav, SourceList } from "@/components/AIPillarNav";
import { sourceLinks, toolLandscape } from "@/lib/aiForPE";

export const metadata: Metadata = {
  title: "AI Tool Landscape for PE Professionals",
  description:
    "An opinionated guide to Claude, ChatGPT, NotebookLM, Hebbia, Onyx, AlphaSense, S&P Capital IQ Pro, PitchBook, Grata, FactSet, and other AI tools for PE professionals.",
};

export default function AIToolLandscapePage() {
  return (
    <div>
      <PageHeader
        eyebrow="AI for PE Professionals"
        title="Tool landscape."
        summary="An opinionated map of the current AI tool stack for PE work: what to use, why it wins, and where it falls short."
      />

      <AIPillarNav />

      <section className="border-y border-line/80 py-8">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="font-mono-label text-accent">Point of view</p>
            <h2 className="mt-3 max-w-2xl font-newsreader text-3xl text-ink">
              Claude should be the default AI workspace. Specialist tools should
              earn their place by owning a specific data layer or workflow.
            </h2>
          </div>
          <div className="space-y-4 text-sm leading-7 text-stone font-geist">
            <p>
              My take: Claude is the superior everyday AI product for PE
              professionals right now. The writing is stronger, the reasoning is
              steadier, the long-context work feels more natural, and Projects
              plus Skills make repeatable workflows easier to operationalize.
            </p>
            <p>
              That does not mean every workflow belongs in Claude. If the work
              depends on premium market content, private-market data, enterprise
              search, or a controlled data-room process, use the tool built for
              that layer. The winning stack is not one model. It is a clear
              division of labor.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8 divide-y divide-line/80 border-y border-line/80">
        {toolLandscape.map((tool) => (
          <article
            key={tool.name}
            className="grid gap-5 py-6 lg:grid-cols-[18rem_1fr_auto] lg:items-start"
          >
            <div>
              <p className="font-mono-label text-stone">{tool.category}</p>
              <h2 className="font-newsreader text-2xl text-ink">
                {tool.name}
              </h2>
              <p className="mt-2 font-mono-label text-accent">
                {tool.opinion}
              </p>
            </div>
            <div className="grid gap-4 text-sm leading-7 text-stone font-geist md:grid-cols-3">
              <div>
                <p className="font-mono-label text-stone">Best for</p>
                <p className="mt-2">{tool.bestFor}</p>
              </div>
              <div>
                <p className="font-mono-label text-stone">Why use it</p>
                <p className="mt-2">{tool.whyUse}</p>
              </div>
              <div>
                <p className="font-mono-label text-stone">Limitations</p>
                <p className="mt-2">{tool.limitations}</p>
              </div>
            </div>
            <a
              href={tool.source}
              target="_blank"
              rel="noreferrer"
              className="font-mono-label text-accent hover:text-ink"
            >
              Source
            </a>
          </article>
        ))}
      </section>

      <SourceList
        sources={sourceLinks.filter((source) =>
          [
            "OpenAI business data privacy",
            "Claude Enterprise",
            "Google Workspace Gemini Privacy Hub",
            "Anthropic data processor guidance",
            "Microsoft 365 Copilot data security",
            "Onyx enterprise search",
            "Hebbia: AI in private equity",
            "AlphaSense market intelligence",
            "S&P Capital IQ Pro AI",
            "PitchBook in ChatGPT",
            "Grata AI deal sourcing",
            "FactSet AI pitch creator",
            "Intralinks DealCentre AI overview",
          ].includes(source.label),
        )}
      />
    </div>
  );
}
