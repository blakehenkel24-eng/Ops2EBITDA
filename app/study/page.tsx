import { PageHeader } from "@/components/Cards";

const plannedFeatures = [
  "Ask the Knowledge Base",
  "Briefing Cards",
  "Operating Quizzes",
  "Case Drills",
  "Interview Prep",
  "Visual Explainers",
];

export default function StudyPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Phase 2"
        title="AI research and case prep"
        summary="A reserved area for future question-answering, briefing cards, operating quizzes, case drills, interview preparation, and visual explainers."
      />
      <div className="mb-6 inline-flex border border-stone/30 bg-bone px-4 py-2 font-mono-label text-ochre">
        Phase 2 Placeholder
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {plannedFeatures.map((feature) => (
          <div
            key={feature}
            className="border border-dashed border-stone/30 bg-paper p-6"
          >
            <p className="font-mono-label text-stone">
              Planned
            </p>
            <h2 className="mt-4 font-newsreader text-2xl text-ink">
              {feature}
            </h2>
            <p className="mt-3 text-sm leading-6 text-stone font-geist">
              Reserved for a future AI-enabled knowledge workflow. V1 intentionally avoids LLM calls, embeddings, chat UI, and usage history.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
