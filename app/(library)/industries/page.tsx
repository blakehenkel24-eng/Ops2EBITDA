import { labelForType } from "@/lib/format";
import { hrefFor } from "@/lib/routes";
import { ContentCard, PageHeader } from "@/components/Cards";
import { getIndustries } from "@/lib/content";

export default function IndustriesPage() {
  const items = getIndustries();

  return (
    <div>
      <PageHeader
        eyebrow="Your industries"
        title="Industry Intelligence"
        summary="Industry profiles written from a PE operations lens: business model, cost structure, diligence, levers, risks, AI opportunities, and exit readiness."
      />
      <div className="grid gap-0 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <ContentCard key={item.slug} title={item.title} description={item.summary} href={hrefFor(item)} tag={labelForType(item.type)} />
        ))}
      </div>
    </div>
  );
}
