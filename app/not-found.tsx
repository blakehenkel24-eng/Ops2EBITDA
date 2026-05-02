import Link from "next/link";

export default function NotFound() {
  return (
    <div className="border-t border-[var(--line)] bg-[var(--panel)] p-8">
      <h1 className="text-4xl font-semibold tracking-[-0.03em]">Page not found</h1>
      <p className="mt-4 text-[var(--muted)]">
        This topic is not in the static knowledge base.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-lg bg-[var(--accent-soft)] px-5 py-3 text-sm font-semibold text-[var(--accent)]"
      >
        Back to knowledge base
      </Link>
    </div>
  );
}
