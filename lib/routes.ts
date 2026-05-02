import type { AnyContent, ContentType } from "./types";

export function hrefFor(item: Pick<AnyContent, "slug" | "type">) {
  const baseByType: Record<Exclude<ContentType, "industry-project">, string> = {
    fundamental: "/fundamentals",
    playbook: "/playbooks",
    industry: "/industries",
    kpi: "/kpis",
  };

  return `${baseByType[item.type]}/${item.slug}`;
}
