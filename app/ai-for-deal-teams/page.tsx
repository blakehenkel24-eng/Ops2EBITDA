import Link from "next/link";
import type { Metadata } from "next";
import { PageHeader } from "@/components/Cards";

export const metadata: Metadata = {
  title: "AI for Deal Teams | Ops2EBITDA",
  description:
    "A practical primer on AI projects, reusable skills, and common AI workflows for PE deal teams, operating professionals, and consultants.",
};

const useCases = [
  {
    title: "Outside-in diligence",
    body: "Use AI to assemble source packs, summarize filings and calls, map competitors, draft market questions, and generate first-pass value creation hypotheses.",
  },
  {
    title: "Management meeting prep",
    body: "Turn a CIM, operating data, and prior notes into sharper questions for the CEO, CFO, and functional leaders.",
  },
  {
    title: "Board and IC work",
    body: "Convert messy operating updates into crisp narratives, issue trees, KPI watchlists, and action-oriented follow-ups.",
  },
  {
    title: "KPI diagnostics",
    body: "Move from a metric miss to likely drivers, data requests, management questions, and a short list of operating interventions.",
  },
  {
    title: "Research synthesis",
    body: "Compare public sources, expert-call notes, and internal reference material so the team can see what is known, disputed, and still missing.",
  },
  {
    title: "Work product QA",
    body: "Check whether a memo, board update, or analysis states the actual operating implication, cites evidence, and avoids unsupported claims.",
  },
];

const tools = [
  {
    name: "ChatGPT Projects and GPTs",
    fit: "Reusable workspaces and custom assistants with instructions, uploaded knowledge, and selected tools.",
    source: "https://help.openai.com/en/articles/10169521-projects-in-chatgpt",
  },
  {
    name: "Claude Projects",
    fit: "Team knowledge bases with project instructions, document context, and collaboration on paid work plans.",
    source: "https://support.claude.com/en/articles/9517075-what-are-projects",
  },
  {
    name: "NotebookLM",
    fit: "Source-grounded notebooks for uploaded docs, Google Drive material, websites, YouTube transcripts, and synthesized study outputs.",
    source:
      "https://support.google.com/notebooklm/answer/16215270?co=GENIE.Platform%3DDesktop&hl=en",
  },
  {
    name: "Perplexity Spaces",
    fit: "Research spaces that combine web search, files, connectors, and shareable research threads.",
    source:
      "https://www.perplexity.ai/help-center/en/articles/10352961-what-are-spaces",
  },
  {
    name: "Microsoft 365 Copilot Agents",
    fit: "Enterprise agents grounded in Microsoft 365 files, SharePoint, connectors, and firm-managed permissions.",
    source:
      "https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/copilot-studio-agent-builder-build",
  },
  {
    name: "Gemini Gems",
    fit: "Custom Gemini assistants for repetitive tasks, saved instructions, and lightweight specialist workflows.",
    source: "https://support.google.com/gemini/answer/15236321?hl=en",
  },
];

const adoptionSteps = [
  "Start with one repeatable workflow, not a firmwide transformation.",
  "Collect the source material: memo examples, diligence questions, KPI definitions, value creation logic, and preferred output formats.",
  "Write explicit instructions for role, task boundaries, evidence standards, and final deliverable shape.",
  "Test against a real work product, compare the output to a strong human draft, and tighten the instructions.",
  "Package what works into a reusable project, skill, checklist, or team standard.",
];

export default function AIForDealTeamsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Knowledge Base"
        title="AI for deal teams and PE professionals."
        summary="A practical guide to custom AI projects, reusable skills, and the current tool stack for diligence, portfolio monitoring, board work, and operating analysis."
      />

      <section className="border-y border-line/80 py-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="font-mono-label text-accent">Why this matters</p>
            <h2 className="mt-3 max-w-2xl font-newsreader text-3xl text-ink">
              AI is becoming part of the deal workflow, but the advantage is not
              the tool by itself.
            </h2>
          </div>
          <div className="space-y-4 text-sm leading-7 text-stone font-geist">
            <p>
              For PE users, AI is most useful when it is attached to a repeatable
              decision process: diligence, operating reviews, board updates,
              thesis pressure testing, or KPI diagnosis. The value comes from
              better context, sharper instructions, reusable judgment, and a
              disciplined review loop.
            </p>
            <p>
              That is why Ops2EBITDA treats AI assets as operating tools, not
              novelty prompts. A project gives the AI a workspace. A skill gives
              it a repeatable method. The professional still owns the judgment.
            </p>
          </div>
        </div>
      </section>

      <section
        id="ai-projects"
        className="scroll-mt-24 border-b border-line/80 py-8"
      >
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="font-mono-label text-accent">AI projects</p>
            <h2 className="mt-3 font-newsreader text-3xl text-ink">
              A project is a reusable workspace for a recurring workstream.
            </h2>
          </div>
          <div className="space-y-5 text-sm leading-7 text-stone font-geist">
            <p>
              Think of a custom AI project as a deal room for one workflow. It
              can hold the relevant reference files, instructions, chats, output
              standards, examples, and source links so the AI does not start from
              zero every time.
            </p>
            <div className="border border-line/80 bg-paper p-5">
              <p className="font-mono-label text-stone">Example</p>
              <p className="mt-3">
                A Board Pack Builder project might include the firm&apos;s preferred
                update format, KPI definitions, examples of strong board
                commentary, management notes, and instructions to convert raw
                operating updates into issue-based narratives.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="skills" className="scroll-mt-24 border-b border-line/80 py-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="font-mono-label text-accent">Reusable AI skills</p>
            <h2 className="mt-3 font-newsreader text-3xl text-ink">
              A skill is a reusable method the AI can follow on demand.
            </h2>
          </div>
          <div className="space-y-5 text-sm leading-7 text-stone font-geist">
            <p>
              A skill is narrower than a project. It is a portable set of
              instructions, checks, examples, and output rules for one job:
              diagnose a KPI miss, pressure-test a value creation claim, rewrite
              a CEO update, or identify missing evidence in a diligence memo.
            </p>
            <div className="border border-line/80 bg-paper p-5">
              <p className="font-mono-label text-stone">Example</p>
              <p className="mt-3">
                A KPI Root Cause skill can force the AI to separate symptoms from
                drivers, list likely causes, request missing data, and tie each
                hypothesis back to EBITDA, cash conversion, or enterprise value.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line/80 py-8">
        <p className="font-mono-label text-accent">Use cases</p>
        <h2 className="mt-3 max-w-3xl font-newsreader text-3xl text-ink">
          Where PE professionals can use AI now.
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {useCases.map((useCase) => (
            <article key={useCase.title} className="border border-line/80 bg-paper p-5">
              <h3 className="font-newsreader text-xl text-ink">
                {useCase.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-stone font-geist">
                {useCase.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section
        id="tool-stack"
        className="scroll-mt-24 border-b border-line/80 py-8"
      >
        <p className="font-mono-label text-accent">Tool stack</p>
        <h2 className="mt-3 max-w-3xl font-newsreader text-3xl text-ink">
          Common AI tools deal teams should understand.
        </h2>
        <div className="mt-6 divide-y divide-line/80 border-y border-line/80">
          {tools.map((tool) => (
            <article
              key={tool.name}
              className="grid gap-3 py-5 md:grid-cols-[18rem_1fr_auto] md:items-start"
            >
              <h3 className="font-newsreader text-xl text-ink">{tool.name}</h3>
              <p className="text-sm leading-7 text-stone font-geist">
                {tool.fit}
              </p>
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
        </div>
      </section>

      <section className="border-b border-line/80 py-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="font-mono-label text-accent">Adoption path</p>
            <h2 className="mt-3 font-newsreader text-3xl text-ink">
              Start narrow, then capture what works.
            </h2>
          </div>
          <ol className="space-y-3 text-sm leading-7 text-stone font-geist">
            {adoptionSteps.map((step, index) => (
              <li key={step} className="flex gap-4 border-b border-line/70 pb-3">
                <span className="font-mono-label text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mt-8 border border-accent/25 bg-accent-soft/45 p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-mono-label text-accent">Ops2EBITDA assets</p>
            <h2 className="mt-3 font-newsreader text-3xl text-ink">
              The toolkit turns these ideas into reusable work products.
            </h2>
            <p className="mt-3 text-sm leading-7 text-stone font-geist">
              Start with the free knowledge base, then use project kits and
              skills when you need repeatable AI workflows for diligence,
              portfolio reviews, executive communication, and diagnostics.
            </p>
          </div>
          <Link
            href="/offerings#toolkit"
            className="shrink-0 border border-accent/35 bg-paper px-4 py-3 text-center font-mono-label text-accent transition-colors hover:border-accent/55 hover:bg-accent-soft hover:text-ink"
          >
            View toolkit
          </Link>
        </div>
      </section>
    </div>
  );
}
