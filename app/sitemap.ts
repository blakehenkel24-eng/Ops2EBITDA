import type { MetadataRoute } from "next";
import {
  getAllContent,
} from "@/lib/content";
import { hrefFor } from "@/lib/routes";
import { absoluteUrl } from "@/lib/seo";

const staticRoutes = [
  "/",
  "/offerings",
  "/fundamentals",
  "/playbooks",
  "/industries",
  "/kpis",
  "/ai-for-pe-professionals",
  "/ai-for-pe-professionals/use-cases",
  "/ai-for-pe-professionals/tool-landscape",
  "/ai-for-pe-professionals/guardrails",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const contentRoutes = getAllContent().map((item) => hrefFor(item));

  return [...staticRoutes, ...contentRoutes].map((route) => ({
    url: absoluteUrl(route),
    lastModified: now,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : route === "/offerings" ? 0.9 : 0.7,
  }));
}
