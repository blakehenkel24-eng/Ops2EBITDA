import type { Metadata } from "next";

export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ops2ebitda.com",
);

export const siteName = "Ops2EBITDA";

export const siteDescription =
  "Ops2EBITDA helps private equity professionals diagnose operating issues, plan value creation work, and use AI-enabled operating assets to improve EBITDA, cash flow, and exit quality.";

export const defaultKeywords = [
  "private equity operations",
  "PE value creation",
  "operating partner playbooks",
  "EBITDA improvement",
  "portfolio company operations",
  "AI for private equity",
];

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}

export function pageMetadata({
  title,
  description,
  path,
  keywords = [],
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    keywords: [...defaultKeywords, ...keywords],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName,
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
