export type OfferingCategory =
  | "Excel Model"
  | "AI Project Kit"
  | "Skill Package"
  | "Bundle";

export type ProductLine = {
  title: string;
  price: string;
  description: string;
  examples: string[];
  learnHref?: string;
  learnLabel?: string;
};

export type Offering = {
  title: string;
  category: OfferingCategory;
  price: string;
  description: string;
  items: string[];
  featured?: boolean;
  futureCheckoutLabel: string;
};

export const productLines: ProductLine[] = [
  {
    title: "Excel Models",
    price: "$99 each",
    description:
      "Decision-ready workbooks for quantifying EBITDA, cash flow, and enterprise value impact.",
    examples: [
      "Pricing Waterfall & Margin Leakage Model",
      "Procurement Spend Cube & Savings Tracker",
      "Working Capital & Cash Conversion Model",
    ],
  },
  {
    title: "AI Project Kits",
    price: "$49 each",
    description:
      "Ready-to-build AI workspaces for recurring PE operating workflows and executive outputs.",
    learnHref: "/ai-for-deal-teams#ai-projects",
    learnLabel: "What is an AI project kit?",
    examples: [
      "Operating Partner Copilot",
      "Board Pack & Executive Update Builder",
      "KPI Diagnostic & Root Cause Project",
    ],
  },
  {
    title: "Skill Packages",
    price: "$39 each",
    description:
      "Reusable markdown skill bundles for PE communication, diagnostics, diligence, and quality control.",
    learnHref: "/ai-for-deal-teams#skills",
    learnLabel: "What is a reusable AI skill?",
    examples: [
      "Executive Communication Skills",
      "Operating Diagnostic Skills",
      "Work Product Quality Control Skills",
    ],
  },
];

export const featuredOfferings: Offering[] = [
  {
    title: "Full Ops2EBITDA Toolkit",
    category: "Bundle",
    price: "$699",
    description:
      "The complete operating asset library: models, project kits, and reusable skill packages.",
    items: [
      "Excel model library",
      "AI project kit library",
      "Skill package library",
    ],
    featured: true,
    futureCheckoutLabel: "Buy with Lemon Squeezy later",
  },
  {
    title: "Core Model Bundle",
    category: "Bundle",
    price: "$399",
    description:
      "Launch-ready Excel models for the value creation analyses most likely to need real modeling depth.",
    items: ["Pricing", "Procurement", "Working capital", "Sales productivity"],
    futureCheckoutLabel: "Add checkout link later",
  },
  {
    title: "AI Project Library",
    category: "Bundle",
    price: "$299",
    description:
      "Structured AI workspaces for portfolio monitoring, board updates, diligence, and operating planning.",
    items: ["Operating partner copilot", "Board updates", "KPI diagnostics"],
    futureCheckoutLabel: "Add checkout link later",
  },
  {
    title: "Skill Package Library",
    category: "Bundle",
    price: "$179",
    description:
      "The complete set of reusable PE operating skills for AI tools, local agents, and project folders.",
    items: [
      "Executive communication",
      "Diagnostics",
      "Diligence",
      "Quality control",
    ],
    futureCheckoutLabel: "Add checkout link later",
  },
];
