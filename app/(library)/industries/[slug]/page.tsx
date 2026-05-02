import { notFound } from "next/navigation";
import { PageHeader } from "@/components/Cards";
import { IndustryDetail } from "@/components/DetailViews";
import { getBySlug, getIndustries } from "@/lib/content";

export function generateStaticParams() {
  return getIndustries().map((item) => ({ slug: item.slug }));
}

export default async function IndustryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getBySlug(getIndustries(), slug);

  if (!item) {
    notFound();
  }

  return (
    <div>
      <PageHeader eyebrow="Industry Profile" title={item.title} summary={item.summary} />
      <IndustryDetail item={item} />
    </div>
  );
}
