import Link from "next/link";
import type { Metadata } from "next";
import { PageHeader } from "@/components/Cards";

export const metadata: Metadata = {
  title: "AI for PE Professionals | Ops2EBITDA",
  description:
    "A plain-English knowledge-base guide to AI projects, reusable AI skills, and common AI tools for private equity professionals and consultants.",
};

const projectExample = [
  {
    label: "Sources you add",
    body: "CIM, management presentation, call transcript, KPI definitions, old board deck, diligence notes, and the firm's preferred memo format.",
  },
  {
    label: "Instructions you write",
    body: "Act like a PE operating advisor. Use only the provided sources. Separate facts from assumptions. Flag missing data. End with management questions and a one-page operating implication summary.",
  },
  {
    label: "Repeatable output",
    body: "Every time you add new materials, the project can produce the same kind of output: questions, risks, upside hypotheses, data requests, and executive-ready summaries.",
  },
];

const differences = [
  {
    item: "Normal chat",
    simpleMeaning: "A one-off conversation.",
    example: "Ask: summarize this transcript.",
  },
  {
    item: "AI project",
    simpleMeaning: "A reusable folder or workroom for one workflow.",
    example: "A diligence project that remembers the files, rules, examples, and desired output format for that deal.",
  },
  {
    item: "AI skill",
    simpleMeaning: "A reusable checklist or method the AI follows.",
    example: "A KPI diagnostic skill that always separates symptoms, likely causes, data needed, and EBITDA impact.",
  },
];

const useCases = [
  {
    title: "Diligence question builder",
    inputs: "CIM, market notes, financial trends, prior expert-call notes.",
    output: "A tighter management meeting guide with questions by function, risk area, and value creation theme.",
  },
  {
    title: "Board update assistant",
    inputs: "Monthly KPI pack, CEO notes, prior board deck, budget, and action item tracker.",
    output: "A draft board narrative that explains what changed, why it matters, where management needs help, and which decisions are needed.",
  },
  {
    title: "KPI root-cause helper",
    inputs: "Metric definitions, monthly results, pipeline data, margin bridge, customer or SKU detail.",
    output: "A first-pass issue tree, likely causes, missing data, and operating questions for the management team.",
  },
  {
    title: "IC memo pressure test",
    inputs: "Draft memo, diligence findings, market research, management answers, and underwriting assumptions.",
    output: "A list of unsupported claims, unclear assumptions, open diligence items, and stronger ways to state the operating thesis.",
  },
  {
    title: "Expert call synthesis",
    inputs: "Call transcripts, prepared questions, thesis notes, and market map.",
    output: "Recurring themes, contradictions, quotes to revisit, and implications for market growth, pricing, margins, or execution risk.",
  },
  {
    title: "Value creation plan draft",
    inputs: "Diligence findings, KPI baseline, management priorities, org chart, and post-close timeline.",
    output: "A draft 100-day agenda with workstreams, owners, metrics, risks, and next data requests.",
  },
];

const tools = [
  {
    name: "Claude Projects and Skills",
    opinion: "Best default for reusable skill workflows.",
    fit: "Claude is the strongest fit when the work depends on reusable skills because Skills are a native Claude concept. You can package instructions, reference files, and workflow steps so Claude can load the right method when the task calls for it.",
    source: "https://support.claude.com/en/articles/12512176-what-are-skills",
  },
  {
    name: "ChatGPT Projects and GPTs",
    opinion: "Good for broad project work, weaker for true skill packages.",
    fit: "Useful when you want a saved workspace or custom assistant with files, instructions, and repeatable behavior. It can approximate parts of a skill workflow, but it does not map as directly to portable skill folders.",
    source: "https://help.openai.com/en/articles/10169521-projects-in-chatgpt",
  },
  {
    name: "NotebookLM",
    opinion: "Best for source-grounded reading and synthesis.",
    fit: "Useful when you want the AI to stay close to a set of uploaded sources and help you study, compare, and summarize them. It is less of a reusable workflow engine and more of a research notebook.",
    source:
      "https://support.google.com/notebooklm/answer/16215270?co=GENIE.Platform%3DDesktop&hl=en",
  },
  {
    name: "Perplexity Spaces",
    opinion: "Best for fast external research workflows.",
    fit: "Useful for research workflows that combine web search, uploaded files, saved threads, and shared spaces. Strong for finding and comparing outside information, less direct for reusable internal skills.",
    source:
      "https://www.perplexity.ai/help-center/en/articles/10352961-what-are-spaces",
  },
  {
    name: "Microsoft 365 Copilot Agents",
    opinion: "Best when the firm already runs on Microsoft 365.",
    fit: "Useful inside firms that already work in Microsoft 365 and want agents connected to SharePoint, files, and firm permissions. The advantage is enterprise context and governance, not simplicity.",
    source:
      "https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/copilot-studio-agent-builder-build",
  },
  {
    name: "Gemini Gems",
    opinion: "Useful for simple saved assistants.",
    fit: "Useful for saved assistants that repeat a task or style of thinking inside Gemini. Good for lightweight repetition, but not the cleanest home for structured PE skill packages.",
    source: "https://support.google.com/gemini/answer/15236321?hl=en",
  },
];

const groundRules = [
  "Do not put confidential deal data into tools your firm has not approved.",
  "Ask the AI to show what source supports each important claim.",
  "Treat the first answer as a draft, not the answer.",
  "Make the AI separate facts, assumptions, and open questions.",
  "Use human judgment for valuation, legal, client, investment, and management recommendations.",
];

export default function AIForPEProfessionalsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Knowledge Base"
        title="AI for PE professionals."
        summary="A plain-English guide to AI projects, reusable AI skills, and how private equity professionals can use them in real work."
      />

      <section className="border-y border-line/80 py-8">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="font-mono-label text-accent">Start here</p>
            <h2 className="mt-3 max-w-2xl font-newsreader text-3xl text-ink">
              Most PE use cases are simple: give the AI better context, then ask
              for the same useful output again and again.
            </h2>
          </div>
          <div className="space-y-4 text-sm leading-7 text-stone font-geist">
            <p>
              A normal chatbot starts with almost no context. You paste
              something in, ask a question, and get an answer. That works for
              quick tasks, but it gets messy when the work repeats.
            </p>
            <p>
              PE work is repetitive in a good way. Diligence, board updates,
              IC memos, KPI reviews, expert calls, and value creation plans all
              have recurring inputs and recurring outputs. AI projects and
              skills help make those recurring workflows easier to reuse.
            </p>
          </div>
        </div>
      </section>

      <section
        id="ai-projects"
        className="scroll-mt-24 border-b border-line/80 py-8"
      >
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="font-mono-label text-accent">AI projects</p>
            <h2 className="mt-3 font-newsreader text-3xl text-ink">
              An AI project is like a reusable work folder.
            </h2>
          </div>
          <div className="space-y-5 text-sm leading-7 text-stone font-geist">
            <p>
              Instead of opening a blank chat every time, you create a project
              for one kind of work. The project holds the source documents, the
              instructions, the examples, and the output format. Then each new
              chat inside that project starts with the same operating context.
            </p>
            <div className="grid gap-3">
              {projectExample.map((example) => (
                <div
                  key={example.label}
                  className="border border-line/80 bg-paper p-5"
                >
                  <p className="font-mono-label text-stone">{example.label}</p>
                  <p className="mt-3">{example.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="skills" className="scroll-mt-24 border-b border-line/80 py-8">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="font-mono-label text-accent">AI skills</p>
            <h2 className="mt-3 font-newsreader text-3xl text-ink">
              An AI skill is like a reusable checklist.
            </h2>
          </div>
          <div className="space-y-5 text-sm leading-7 text-stone font-geist">
            <p>
              A skill does not need to hold a whole deal room. It tells the AI
              how to do one specific task. Think of it like a short standard
              operating procedure: when this task appears, follow these steps,
              ask for these inputs, avoid these mistakes, and format the answer
              this way.
            </p>
            <div className="border border-line/80 bg-paper p-5">
              <p className="font-mono-label text-stone">Simple example</p>
              <p className="mt-3">
                A KPI diagnostic skill might always ask: What moved? What could
                have caused it? What data would prove or disprove each cause?
                What is the EBITDA or cash impact? What should management do
                next?
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line/80 py-8">
        <p className="font-mono-label text-accent">The difference</p>
        <h2 className="mt-3 max-w-3xl font-newsreader text-3xl text-ink">
          Chat, project, and skill are not the same thing.
        </h2>
        <div className="mt-6 divide-y divide-line/80 border-y border-line/80">
          {differences.map((row) => (
            <article
              key={row.item}
              className="grid gap-3 py-5 md:grid-cols-[14rem_1fr_1fr]"
            >
              <h3 className="font-newsreader text-xl text-ink">{row.item}</h3>
              <p className="text-sm leading-7 text-stone font-geist">
                {row.simpleMeaning}
              </p>
              <p className="text-sm leading-7 text-stone font-geist">
                {row.example}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-b border-line/80 py-8">
        <p className="font-mono-label text-accent">Examples</p>
        <h2 className="mt-3 max-w-3xl font-newsreader text-3xl text-ink">
          What this looks like in PE work.
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {useCases.map((useCase) => (
            <article
              key={useCase.title}
              className="border border-line/80 bg-paper p-5"
            >
              <h3 className="font-newsreader text-xl text-ink">
                {useCase.title}
              </h3>
              <div className="mt-4 space-y-3 text-sm leading-7 text-stone font-geist">
                <p>
                  <span className="font-mono-label text-accent">Inputs </span>
                  {useCase.inputs}
                </p>
                <p>
                  <span className="font-mono-label text-accent">Output </span>
                  {useCase.output}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        id="tool-stack"
        className="scroll-mt-24 border-b border-line/80 py-8"
      >
        <p className="font-mono-label text-accent">Common tools</p>
        <h2 className="mt-3 max-w-3xl font-newsreader text-3xl text-ink">
          Where these ideas show up in the current AI tool stack.
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-stone font-geist">
          The names differ by vendor. For PE professionals who want reusable
          skill packages, Claude is the best starting point by far because it
          has native Skills. Other tools can still be useful, but they usually
          recreate the same idea through saved instructions, custom assistants,
          agents, notebooks, or research spaces.
        </p>
        <div className="mt-6 divide-y divide-line/80 border-y border-line/80">
          {tools.map((tool) => (
            <article
              key={tool.name}
              className="grid gap-3 py-5 md:grid-cols-[18rem_1fr_auto] md:items-start"
            >
              <div>
                <h3 className="font-newsreader text-xl text-ink">
                  {tool.name}
                </h3>
                <p className="mt-2 font-mono-label text-accent">
                  {tool.opinion}
                </p>
              </div>
              <p className="text-sm leading-7 text-stone font-geist">{tool.fit}</p>
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
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="font-mono-label text-accent">Ground rules</p>
            <h2 className="mt-3 font-newsreader text-3xl text-ink">
              Use AI like an analyst draft, not a source of truth.
            </h2>
          </div>
          <ul className="space-y-3 text-sm leading-7 text-stone font-geist">
            {groundRules.map((rule) => (
              <li key={rule} className="border-b border-line/70 pb-3">
                {rule}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-8 border border-line/80 bg-paper p-6">
        <p className="font-mono-label text-stone">Related</p>
        <div className="mt-3 flex flex-col gap-3 text-sm leading-7 text-stone font-geist sm:flex-row sm:items-center sm:justify-between">
          <p>
            The offerings page includes examples of project kits and skills, but
            this knowledge page is meant to stand on its own.
          </p>
          <Link
            href="/offerings#toolkit"
            className="shrink-0 border border-line/80 bg-bone px-4 py-3 text-center font-mono-label text-stone transition-colors hover:border-accent/45 hover:bg-accent-soft/60 hover:text-ink"
          >
            View examples
          </Link>
        </div>
      </section>
    </div>
  );
}
