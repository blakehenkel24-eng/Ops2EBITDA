import { labelForType } from "@/lib/format";
import { hrefFor } from "@/lib/routes";
import { ContentCard, PageHeader } from "@/components/Cards";
import { getFundamentals } from "@/lib/content";

export default function FundamentalsPage() {
  const items = getFundamentals();

  return (
    <div>
      <PageHeader
        eyebrow="Foundation briefings"
        title="PE Fundamentals"
        summary="Core concepts that explain how private equity firms buy, improve, monitor, and exit companies."
      />
      <div className="grid gap-0 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <ContentCard key={item.slug} title={item.title} description={item.summary} href={hrefFor(item)} tag={labelForType(item.type)} />
        ))}
      </div>
    </div>
  );
}
