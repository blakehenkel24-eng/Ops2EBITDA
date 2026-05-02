import { ContentCard, PageHeader } from "@/components/Cards";
import { getKpis } from "@/lib/content";

export default function KpisPage() {
  const items = getKpis();

  return (
    <div>
      <PageHeader
        eyebrow="Measurement reference"
        title="KPI Library"
        summary="A PE-focused KPI reference organized across sales, marketing, SaaS, procurement, finance, and operations."
      />
      <div className="grid gap-0 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <ContentCard key={item.slug} item={item} />
        ))}
      </div>
    </div>
  );
}
