import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { PageHeader } from "@/components/Cards";
import {
  offeringCollections,
  productLines,
  type Offering,
} from "@/lib/offerings";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "PE Operating Assets, Excel Models, AI Project Kits, and Skill Packages",
  description:
    "Downloadable private equity operating assets for EBITDA improvement, value creation planning, portfolio diagnostics, AI workflows, and executive-ready operating work.",
  path: "/offerings",
  keywords: [
    "PE operating assets",
    "private equity Excel models",
    "AI project kits for private equity",
    "PE skill packages",
  ],
});

function OfferButton({ offering }: { offering: Offering }) {
  if (!offering.checkoutHref) {
    return (
      <button
        type="button"
        disabled
        className="mt-auto flex w-full items-center justify-between border border-line/90 bg-bone/80 px-4 py-3 text-left font-mono-label text-ink/55 transition-colors disabled:cursor-not-allowed disabled:opacity-80"
      >
        <span className="text-ink/55">{offering.ctaFallbackLabel}</span>
        <ArrowRight size={15} strokeWidth={1.5} className="text-ink/35" />
      </button>
    );
  }

  return (
    <a
      href={offering.checkoutHref}
      target="_blank"
      rel="noreferrer"
      className="mt-auto inline-flex w-full items-center justify-between border border-accent/60 bg-accent px-4 py-3 font-mono-label text-paper shadow-[0_14px_32px_oklch(31%_0.038_248_/_0.12)] transition-[background-color,border-color,box-shadow,transform] duration-200 hover:-translate-y-px hover:border-ink hover:bg-ink hover:shadow-[0_18px_38px_oklch(31%_0.038_248_/_0.16)]"
    >
      <span className="text-paper">{offering.ctaLabel}</span>
      <ArrowRight size={15} strokeWidth={1.5} className="text-paper/90" />
    </a>
  );
}

function OfferCard({
  offering,
  compact = false,
  showBestFor = true,
}: {
  offering: Offering;
  compact?: boolean;
  showBestFor?: boolean;
}) {
  const titleSize = compact ? "text-[1.55rem]" : "text-[1.75rem]";
  const priceSize = compact ? "text-[2.25rem]" : "text-[2.5rem]";

  return (
    <article
      className={`flex h-full flex-col border bg-paper p-6 ${
        offering.featured
          ? "border-accent/45 shadow-[0_18px_44px_oklch(31%_0.038_248_/_0.08)]"
          : "border-line/80"
      }`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[0.74rem] font-medium uppercase text-ink/52">
              {offering.category}
            </p>
            {offering.badge ? (
              <span className="border border-accent/25 bg-accent-soft px-3 py-1 text-[0.74rem] font-medium uppercase text-accent">
                {offering.badge}
              </span>
            ) : null}
          </div>
          <h3 className={`mt-3 font-newsreader ${titleSize} leading-[1.12] text-ink`}>
            {offering.title}
          </h3>
        </div>
        <p className={`font-newsreader ${priceSize} leading-none text-accent`}>
          {offering.price}
        </p>
      </div>

      <p className="mt-4 text-[0.95rem] leading-7 text-ink/72 font-geist">
        {offering.description}
      </p>
      {showBestFor ? (
        <p className="mt-4 text-[0.95rem] leading-7 text-ink/88 font-geist">
          <span className="mr-2 inline-block text-[0.72rem] font-medium uppercase text-ink/48">
            Best for
          </span>
          {offering.bestFor}
        </p>
      ) : null}

      <ul
        className={`mb-7 mt-5 grid gap-3 text-[0.92rem] leading-6 text-ink/82 font-geist ${
          compact ? "" : "sm:grid-cols-2"
        }`}
      >
        {offering.items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 border border-line/90 bg-bone/60 px-4 py-3"
          >
            <Check
              size={15}
              className="mt-1 shrink-0 text-accent"
              strokeWidth={1.9}
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <OfferButton offering={offering} />
    </article>
  );
}

export default function OfferingsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Offerings"
        title="A simpler toolkit for PE operating work."
        summary="Start with one of three categories: Models for the math, Projects for repeat workflows, and Skills for better AI output. Bundles are still available, but they no longer need to be the first decision."
      />

      <section id="toolkit" className="mt-10 scroll-mt-24">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono-label text-accent">Toolkit</p>
            <h2 className="mt-3 font-newsreader text-3xl text-ink">
              Pick the type of help you need.
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-stone font-geist">
            The catalog is organized around the job in front of you. Quantify
            the case, set up a repeatable workflow, or make AI produce cleaner
            work.
          </p>
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          {productLines.map((line, index) => (
            <article
              key={line.title}
              className="flex h-full flex-col border border-line/80 bg-paper p-6"
            >
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="font-mono-label text-stone">
                    0{index + 1}
                  </p>
                  <h3 className="mt-3 font-newsreader text-[2rem] leading-tight text-ink">
                    {line.title}
                  </h3>
                </div>
                <p className="shrink-0 border border-line/80 bg-bone px-3 py-2 font-mono-label text-accent">
                  {line.price}
                </p>
              </div>
              <p className="mt-5 text-[0.98rem] leading-7 text-ink/82 font-geist">
                {line.description}
              </p>

              <div className="mt-5 border-t border-line/70 pt-5">
                <p className="font-mono-label text-stone">Value</p>
                <p className="mt-2 text-sm leading-6 text-stone font-geist">
                  {line.value}
                </p>
              </div>

              <div className="mt-5 border-t border-line/70 pt-5">
                <p className="font-mono-label text-stone">How to use</p>
                <ol className="mt-3 grid gap-2 text-sm leading-6 text-ink/78 font-geist">
                  {line.howToUse.map((step, stepIndex) => (
                    <li key={step} className="flex gap-3">
                      <span className="mt-1 h-5 min-w-5 border border-accent/25 bg-accent-soft text-center font-mono-label text-[0.58rem] leading-5 text-accent">
                        {stepIndex + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {line.learnHref ? (
                  <Link
                    href={line.learnHref}
                    className="inline-flex min-h-10 items-center border border-line/80 bg-paper px-3 py-2 font-mono-label text-ink/64 transition-colors hover:border-accent/35 hover:text-ink"
                  >
                    {line.learnLabel}
                  </Link>
                ) : null}
                {line.shopHref ? (
                  <Link
                    href={line.shopHref}
                    className="inline-flex min-h-10 items-center border border-accent/35 bg-accent-soft/55 px-3 py-2 font-mono-label text-accent transition-colors hover:border-accent/60 hover:bg-accent-soft hover:text-ink"
                  >
                    {line.shopLabel}
                  </Link>
                ) : null}
              </div>
              {line.bundleHref ? (
                <a
                  href={line.bundleHref}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex w-fit items-center gap-2 text-xs leading-5 text-ink/54 underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
                >
                  {line.bundleLabel}
                  <ArrowRight size={13} strokeWidth={1.5} />
                </a>
              ) : (
                <span className="mt-4 inline-flex w-fit text-xs leading-5 text-ink/42">
                  {line.bundleFallbackLabel}
                </span>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10 border border-line/80 bg-paper p-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono-label text-accent">Full catalog</p>
            <h2 className="mt-3 font-newsreader text-3xl text-ink">
              Browse individual assets when you know the job.
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-stone font-geist">
            These sections stay intentionally direct: choose the exact model,
            project, or skill package that matches the current work.
          </p>
        </div>
      </section>

      {offeringCollections.map((collection) => (
        <section
          key={collection.id}
          id={collection.id}
          className="mt-10 scroll-mt-24"
        >
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-mono-label text-accent">{collection.eyebrow}</p>
              <h2 className="mt-3 font-newsreader text-3xl text-ink">
                {collection.title}
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-stone font-geist">
              {collection.summary}
            </p>
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            {collection.offers.map((offering) => (
              <OfferCard
                key={offering.slug}
                offering={offering}
                compact
                showBestFor={false}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
