import { notFound } from "next/navigation";
import { PageHeader } from "@/components/Cards";
import { KpiDetail } from "@/components/DetailViews";
import { getBySlug, getKpis } from "@/lib/content";

export function generateStaticParams() {
  return getKpis().map((item) => ({ slug: item.slug }));
}

export default async function KpiPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getBySlug(getKpis(), slug);

  if (!item) {
    notFound();
  }

  return (
    <div className="reader-layout">
      <PageHeader
        eyebrow={item.function}
        title={item.title}
        summary={item.summary}
        className="reader-header"
      />
      <KpiDetail item={item} />
    </div>
  );
}
