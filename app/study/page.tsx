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
      <div className="mb-6 inline-flex rounded-full bg-[var(--accent-soft)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">
        Phase 2 Placeholder
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {plannedFeatures.map((feature) => (
          <div
            key={feature}
            className="rounded-xl border border-dashed border-[var(--line)] bg-[var(--panel)] p-6"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">
              Planned
            </p>
            <h2 className="mt-4 text-2xl font-semibold tracking-[-0.02em]">
              {feature}
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Reserved for a future AI-enabled knowledge workflow. V1 intentionally avoids LLM calls, embeddings, chat UI, and usage history.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
