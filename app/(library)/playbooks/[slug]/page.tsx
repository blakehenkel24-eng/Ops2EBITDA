import { notFound } from "next/navigation";
import { PageHeader } from "@/components/Cards";
import { PlaybookDetail } from "@/components/DetailViews";
import { getBySlug, getPlaybooks } from "@/lib/content";

export function generateStaticParams() {
  return getPlaybooks().map((item) => ({ slug: item.slug }));
}

export default async function PlaybookPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getBySlug(getPlaybooks(), slug);

  if (!item) {
    notFound();
  }

  return (
    <div>
      <PageHeader eyebrow={item.category} title={item.title} summary={item.summary} />
      <PlaybookDetail item={item} />
    </div>
  );
}
