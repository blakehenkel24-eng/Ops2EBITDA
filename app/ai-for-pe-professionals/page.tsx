import Link from "next/link";
import type { Metadata } from "next";
import { PageHeader } from "@/components/Cards";
import { AIPillarNav } from "@/components/AIPillarNav";
import { differences, projectExample, skillExamples } from "@/lib/aiForPE";

export const metadata: Metadata = {
  title: "AI for PE Professionals",
  description:
    "A practical starting point for AI projects, AI skills, skill.md files, and AI workflows for private equity professionals.",
};

export default function AIForPEProfessionalsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="AI for PE Professionals"
        title="Start here."
        summary="A practical orientation to custom AI projects, AI skills, and why reusable AI workflows matter for private equity work."
      />

      <AIPillarNav />

      <section className="border-y border-line/80 py-8">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="font-mono-label text-accent">Working mental model</p>
            <h2 className="mt-3 max-w-2xl font-newsreader text-3xl text-ink">
              The best AI workflows combine context, instructions, examples,
              and a repeatable output standard.
            </h2>
          </div>
          <div className="space-y-4 text-sm leading-7 text-stone font-geist">
            <p>
              A blank chat is useful for quick work. It is less useful when the
              task repeats across deals, portfolio companies, board cycles, and
              diligence workstreams. That is where projects and reusable
              instructions matter.
            </p>
            <p>
              The goal is not to make AI sound impressive. The goal is to make a
              recurring professional workflow easier to run: same inputs, same
              standards, better first draft, faster review cycle.
            </p>
          </div>
        </div>
      </section>

      <section id="ai-projects" className="scroll-mt-24 border-b border-line/80 py-8">
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
              instructions, the examples, and the output format. Each new chat
              inside that project starts with the same operating context.
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
              An AI skill tells the model how to do one specific task. Think of
              it like a short operating procedure: when this task appears, follow
              these steps, ask for these inputs, avoid these mistakes, and format
              the answer this way.
            </p>
            <p>
              In Claude-style workflows, that skill is often represented by a
              markdown file called <code>skill.md</code>. The name matters
              because it is the artifact the tool can read, reuse, and load when
              the workflow calls for it.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-line/80 py-8">
        <p className="font-mono-label text-accent">Simple distinction</p>
        <h2 className="mt-3 max-w-3xl font-newsreader text-3xl text-ink">
          Chat, project, and AI skill are not the same thing.
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
          Examples of AI skills a PE professional might use.
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {skillExamples.map((skill) => (
            <article
              key={skill.name}
              className="border border-line/80 bg-paper p-5"
            >
              <h3 className="font-newsreader text-xl text-ink">
                {skill.name}
              </h3>
              <p className="mt-3 text-sm leading-7 text-stone font-geist">
                {skill.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8 border border-line/80 bg-paper p-6">
        <p className="font-mono-label text-stone">Next</p>
        <div className="mt-3 flex flex-col gap-3 text-sm leading-7 text-stone font-geist sm:flex-row sm:items-center sm:justify-between">
          <p>
            Once the terms are clear, the next question is where PE
            professionals are actually using AI today.
          </p>
          <Link
            href="/ai-for-pe-professionals/use-cases"
            className="shrink-0 border border-line/80 bg-bone px-4 py-3 text-center font-mono-label text-stone transition-colors hover:border-accent/45 hover:bg-accent-soft/60 hover:text-ink"
          >
            Top use cases
          </Link>
        </div>
      </section>
    </div>
  );
}
