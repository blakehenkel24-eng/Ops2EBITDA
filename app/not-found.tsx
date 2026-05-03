import Link from "next/link";

export default function NotFound() {
  return (
    <div className="border border-stone/30 bg-paper p-8">
      <h1 className="font-newsreader text-4xl text-ink">Page not found</h1>
      <p className="mt-4 text-stone font-geist">
        This topic is not in the static knowledge base.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block bg-bone border border-stone/30 px-5 py-3 font-mono-label text-ochre hover:bg-paper transition-colors"
      >
        Back to knowledge base
      </Link>
    </div>
  );
}
