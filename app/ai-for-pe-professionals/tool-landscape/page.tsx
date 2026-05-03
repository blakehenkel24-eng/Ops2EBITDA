import type { Metadata } from "next";
import { PageHeader } from "@/components/Cards";
import { AIPillarNav, SourceList } from "@/components/AIPillarNav";
import { sourceLinks, toolLandscape } from "@/lib/aiForPE";

export const metadata: Metadata = {
  title: "AI Tool Landscape for PE Professionals | Ops2EBITDA",
  description:
    "An opinionated guide to Claude, ChatGPT, NotebookLM, Perplexity, Copilot, Gemini, and AI-enabled data rooms for private equity professionals.",
};

export default function AIToolLandscapePage() {
  return (
    <div>
      <PageHeader
        eyebrow="AI for PE Professionals"
        title="Tool landscape."
        summary="An opinionated map of the current AI tool stack for PE work, with Claude as the best default for reusable AI skills."
      />

      <AIPillarNav />

      <section className="border-y border-line/80 py-8">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="font-mono-label text-accent">Point of view</p>
            <h2 className="mt-3 max-w-2xl font-newsreader text-3xl text-ink">
              Use Claude as the skill-workflow home base, then add other tools
              for the jobs they are best at.
            </h2>
          </div>
          <div className="space-y-4 text-sm leading-7 text-stone font-geist">
            <p>
              For PE professionals building reusable AI workflows, Claude is the
              strongest starting point because Claude Skills map cleanly to the
              way a repeatable <code>skill.md</code> file works. That matters if
              you want reusable operating methods, not just saved chats.
            </p>
            <p>
              The rest of the landscape still matters. ChatGPT is a strong
              general workspace. NotebookLM is excellent for source-grounded
              reading. Perplexity is useful for external research. Copilot is
              compelling inside Microsoft-heavy firms. Data-room AI belongs
              closest to sensitive transaction material.
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
              <h2 className="font-newsreader text-2xl text-ink">
                {tool.name}
              </h2>
              <p className="mt-2 font-mono-label text-accent">
                {tool.opinion}
              </p>
            </div>
            <div className="grid gap-4 text-sm leading-7 text-stone font-geist md:grid-cols-2">
              <div>
                <p className="font-mono-label text-stone">Best for</p>
                <p className="mt-2">{tool.bestFor}</p>
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
            "Anthropic data processor guidance",
            "Microsoft 365 Copilot data security",
            "Intralinks DealCentre AI overview",
          ].includes(source.label),
        )}
      />
    </div>
  );
}
