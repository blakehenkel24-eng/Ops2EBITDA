import { PageHeader } from "@/components/Cards";
import { featuredOfferings, productLines } from "@/lib/offerings";
import Link from "next/link";

export default function OfferingsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Offerings"
        title="Paid operating assets for PE value creation work."
        summary="The free knowledge base explains the operating logic. These downloadable assets are built for the next step: modeling, planning, diagnosing, communicating, and executing faster."
      />

      <section className="grid gap-4 md:grid-cols-3">
        {productLines.map((line) => (
          <article
            key={line.title}
            className="border border-line/80 bg-paper p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <h2 className="font-newsreader text-2xl text-ink">
                {line.title}
              </h2>
              <p className="shrink-0 font-mono-label text-accent">
                {line.price}
              </p>
            </div>
            <p className="mt-4 text-sm leading-7 text-stone font-geist">
              {line.description}
            </p>
            {line.learnHref ? (
              <Link
                href={line.learnHref}
                className="mt-4 inline-flex border border-accent/30 bg-paper px-3 py-2 font-mono-label text-accent transition-colors hover:border-accent/55 hover:bg-accent-soft/70 hover:text-ink"
              >
                {line.learnLabel}
              </Link>
            ) : null}
            <ul className="mt-5 divide-y divide-line/80 border-y border-line/80 text-sm leading-6 text-stone font-geist">
              {line.examples.map((example) => (
                <li key={example} className="py-3">
                  {example}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section id="toolkit" className="mt-10 scroll-mt-24">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono-label text-accent">
              Bundles
            </p>
            <h2 className="mt-3 font-newsreader text-3xl text-ink">
              Toolkit packages for repeated operating work.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-stone font-geist">
            Checkout buttons are placeholders until Lemon Squeezy product links
            are ready.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {featuredOfferings.map((offering) => (
            <article
              key={offering.title}
              className={`border bg-paper p-6 ${
                offering.featured
                  ? "border-accent/45 shadow-[0_18px_44px_oklch(31%_0.038_248_/_0.08)]"
                  : "border-line/80"
              }`}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-mono-label text-stone">
                    {offering.category}
                  </p>
                  <h3 className="mt-3 font-newsreader text-2xl text-ink">
                    {offering.title}
                  </h3>
                </div>
                <p className="font-newsreader text-3xl text-accent">
                  {offering.price}
                </p>
              </div>

              <p className="mt-4 text-sm leading-7 text-stone font-geist">
                {offering.description}
              </p>

              <ul className="mt-5 grid gap-2 text-sm leading-6 text-stone font-geist sm:grid-cols-2">
                {offering.items.map((item) => (
                  <li
                    key={item}
                    className="border border-line/80 bg-bone/45 px-3 py-2"
                  >
                    {item}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                disabled
                className="mt-6 w-full border border-line/80 bg-bone px-4 py-3 text-left font-mono-label text-stone disabled:cursor-not-allowed disabled:opacity-75"
              >
                {offering.futureCheckoutLabel}
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
