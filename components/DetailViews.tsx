import { MermaidDiagram } from "@/components/MermaidDiagram";
import type {
  AnyContent,
  ArticleSection,
  Fundamental,
  Industry,
  Kpi,
  Playbook,
} from "@/lib/types";

function fallbackSections(item: AnyContent): ArticleSection[] {
  return [
    {
      title: "Operator's View",
      body: [
        `${item.title} should be understood as an operating system topic, not as a vocabulary item. The useful question is not "what is it?" but how it changes the way a sponsor underwrites value, assigns ownership, measures progress, and prepares a company for the next buyer.`,
        "A strong PE knowledge base should connect the topic to management behavior, data quality, operational cadence, and enterprise value logic. That is the standard this page is designed around.",
      ],
    },
  ];
}

function ArticlePage({ item }: { item: AnyContent }) {
  const sections = item.articleSections?.length ? item.articleSections : fallbackSections(item);
  const diagrams = item.diagrams ?? [];

  return (
    <article className="flex flex-col gap-12 xl:gap-16">
      <div className="mx-auto w-full max-w-[72ch] space-y-16">
        {sections.map((section, index) => (
          <section
            key={`${section.title}-${index}`}
            className="knowledge-article"
          >
            <p className="font-mono-label text-stone mb-2">
              {String(index + 1).padStart(2, "0")}
            </p>
            <h2 className="font-newsreader text-4xl mb-4 text-ink leading-tight">
              {section.title}
            </h2>
            <div className="mt-5 text-base leading-8 text-ink">
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            {section.callout ? (
              <div className="mt-8 border border-stone/30 bg-paper p-6 text-lg font-semibold leading-7 text-ink">
                {section.callout}
              </div>
            ) : null}
          </section>
        ))}
      </div>

      {diagrams.length > 0 && (
        <div className="mx-auto w-full max-w-5xl space-y-16">
          <hr className="editorial-rule my-8" />
          {diagrams.map((diagram) => (
            <MermaidDiagram
              key={diagram.title}
              chart={diagram.chart}
              title={diagram.title}
              description={diagram.description}
            />
          ))}
        </div>
      )}
    </article>
  );
}

export function FundamentalDetail({ item }: { item: Fundamental }) {
  return <ArticlePage item={item} />;
}

export function PlaybookDetail({ item }: { item: Playbook }) {
  return <ArticlePage item={item} />;
}

export function IndustryDetail({ item }: { item: Industry }) {
  return <ArticlePage item={item} />;
}



export function KpiDetail({ item }: { item: Kpi }) {
  return <ArticlePage item={item} />;
}
