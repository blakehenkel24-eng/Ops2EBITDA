export function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function labelForType(type: string) {
  const labels: Record<string, string> = {
    fundamental: "PE Fundamental",
    playbook: "Value Creation",
    industry: "Industry",
    "industry-project": "Industry Project",
    kpi: "KPI",
  };

  return labels[type] ?? type;
}
