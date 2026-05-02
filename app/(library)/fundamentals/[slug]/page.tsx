import { notFound } from "next/navigation";
import { FundamentalDetail } from "@/components/DetailViews";
import { PageHeader } from "@/components/Cards";
import { getBySlug, getFundamentals } from "@/lib/content";

export function generateStaticParams() {
  return getFundamentals().map((item) => ({ slug: item.slug }));
}

export default async function FundamentalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getBySlug(getFundamentals(), slug);

  if (!item) {
    notFound();
  }

  return (
    <div>
      <PageHeader eyebrow="PE Fundamental" title={item.title} summary={item.summary} />
      <FundamentalDetail item={item} />
    </div>
  );
}
