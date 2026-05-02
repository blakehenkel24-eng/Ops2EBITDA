import { ContentCard, PageHeader } from "@/components/Cards";
import { getPlaybooks } from "@/lib/content";

export default function PlaybooksPage() {
  const items = getPlaybooks();

  return (
    <div>
      <PageHeader
        eyebrow="Your needs"
        title="Value Creation Playbooks"
        summary="Universal PE operating levers with diagnostics, data needs, KPIs, EBITDA logic, common mistakes, and 100-day plans."
      />
      <div className="grid gap-0 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <ContentCard key={item.slug} item={item} />
        ))}
      </div>
    </div>
  );
}
