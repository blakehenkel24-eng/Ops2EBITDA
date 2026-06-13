export type OfferingCategory =
  | "Excel Model"
  | "AI Project Kit"
  | "Skill Package"
  | "Bundle";

export type ProductLine = {
  title: string;
  price: string;
  description: string;
  value: string;
  howToUse: string[];
  examples: string[];
  learnHref?: string;
  learnLabel?: string;
  shopHref?: string;
  shopLabel?: string;
  bundleHref?: string;
  bundleLabel?: string;
  bundleFallbackLabel?: string;
};

export type Offering = {
  slug: string;
  title: string;
  category: OfferingCategory;
  price: string;
  description: string;
  bestFor: string;
  items: string[];
  checkoutHref?: string;
  ctaLabel: string;
  ctaFallbackLabel: string;
  badge?: string;
  featured?: boolean;
};

export type OfferingCollection = {
  id: string;
  eyebrow: string;
  title: string;
  summary: string;
  offers: Offering[];
};

function checkoutHref(envName: string) {
  return process.env[envName];
}

function createOffer(
  envName: string,
  offer: Omit<Offering, "checkoutHref" | "ctaFallbackLabel">,
): Offering {
  return {
    ...offer,
    checkoutHref: checkoutHref(envName),
    ctaFallbackLabel: "Checkout link coming soon",
  };
}

export const productLines: ProductLine[] = [
  {
    title: "Models",
    price: "$99 each",
    description:
      "Excel workbooks for operating analyses where the answer needs numbers, not just narrative.",
    value:
      "Use them to size EBITDA upside, cash release, revenue leakage, retention risk, and synergy capture in a format you can edit and defend.",
    howToUse: [
      "Pick the operating lever you are working on.",
      "Load your company data into the workbook.",
      "Use the outputs in diligence, board prep, or the value creation plan.",
    ],
    examples: [
      "Pricing Waterfall & Margin Leakage Model",
      "Procurement Spend Cube & Savings Tracker",
      "Working Capital & Cash Conversion Model",
    ],
    shopHref: "#excel-models",
    shopLabel: "Browse models",
    bundleHref: checkoutHref("NEXT_PUBLIC_LS_CHECKOUT_CORE_MODEL_BUNDLE"),
    bundleLabel: "Model bundle available",
    bundleFallbackLabel: "Model bundle link coming soon",
  },
  {
    title: "Projects",
    price: "$49 each",
    description:
      "Ready-to-build AI workspaces for recurring PE operating jobs.",
    value:
      "Use them when the work has multiple steps: board updates, KPI diagnosis, diligence, meeting prep, market research, or execution follow-through.",
    howToUse: [
      "Choose the project that matches the job.",
      "Set it up in your AI tool or project workspace.",
      "Add the company context and run the included workflow.",
    ],
    learnHref: "/ai-for-pe-professionals#ai-projects",
    learnLabel: "What is a project?",
    shopHref: "#ai-project-kits",
    shopLabel: "Browse projects",
    bundleHref: checkoutHref("NEXT_PUBLIC_LS_CHECKOUT_AI_PROJECT_LIBRARY"),
    bundleLabel: "Project library available",
    bundleFallbackLabel: "Project library link coming soon",
    examples: [
      "Operating Partner Copilot",
      "Board Pack & Executive Update Builder",
      "KPI Diagnostic & Root Cause Project",
    ],
  },
  {
    title: "Skills",
    price: "$39 each",
    description:
      "Reusable instruction files that make your AI tool better at specific PE operating tasks.",
    value:
      "Use them to improve the quality of repeated outputs: sharper summaries, better questions, cleaner logic, and more executive-ready work.",
    howToUse: [
      "Install the skill package in your AI workspace.",
      "Use the matching skill when that task comes up.",
      "Keep the package as a reusable standard for your team.",
    ],
    learnHref: "/ai-for-pe-professionals#skills",
    learnLabel: "What is a skill?",
    shopHref: "#skill-packages",
    shopLabel: "Browse skills",
    bundleHref: checkoutHref("NEXT_PUBLIC_LS_CHECKOUT_SKILL_PACKAGE_LIBRARY"),
    bundleLabel: "Skill library available",
    bundleFallbackLabel: "Skill library link coming soon",
    examples: [
      "Executive Communication Skills",
      "Operating Diagnostic Skills",
      "Work Product Quality Control Skills",
    ],
  },
];

export const featuredOfferings: Offering[] = [
  createOffer("NEXT_PUBLIC_LS_CHECKOUT_FULL_OPS2EBITDA_TOOLKIT", {
    slug: "full-ops2ebitda-toolkit",
    title: "Full Ops2EBITDA Toolkit",
    category: "Bundle",
    price: "$699",
    description:
      "The whole asset library in one purchase: models, AI workflows, and reusable PE operating skills.",
    bestFor:
      "Operating partners, consultants, and PE teams building a repeatable operating toolkit.",
    items: [
      "All 6 Excel models",
      "All 9 AI project kits",
      "All 6 skill packages",
    ],
    ctaLabel: "Buy the full toolkit",
    badge: "Best value",
    featured: true,
  }),
  createOffer("NEXT_PUBLIC_LS_CHECKOUT_CORE_MODEL_BUNDLE", {
    slug: "core-model-bundle",
    title: "Core Model Bundle",
    category: "Bundle",
    price: "$399",
    description:
      "The modeling bundle for the operating levers most likely to need hard numbers.",
    bestFor:
      "Teams that need hard-number analysis before they need broader AI workflow support.",
    items: [
      "Pricing model",
      "Procurement model",
      "Working capital model",
      "Sales productivity model",
    ],
    ctaLabel: "Buy the model bundle",
    badge: "Anchor bundle",
  }),
  createOffer("NEXT_PUBLIC_LS_CHECKOUT_AI_PROJECT_LIBRARY", {
    slug: "ai-project-library",
    title: "AI Project Library",
    category: "Bundle",
    price: "$299",
    description:
      "All AI project kits for recurring PE operating work: board prep, diligence, KPI diagnosis, and PMO follow-through.",
    bestFor:
      "Operators who want multiple AI workspaces ready before the next board cycle or diligence sprint.",
    items: [
      "All 9 AI project kits",
      "Daily workflow prompts",
      "Example outputs and setup flows",
    ],
    ctaLabel: "Buy the AI project library",
    badge: "Daily-use library",
  }),
  createOffer("NEXT_PUBLIC_LS_CHECKOUT_SKILL_PACKAGE_LIBRARY", {
    slug: "skill-package-library",
    title: "Skill Package Library",
    category: "Bundle",
    price: "$179",
    description:
      "Reusable PE operating skills for communication, diagnostics, meeting prep, execution, diligence, and QA.",
    bestFor:
      "Buyers who already use AI tools and want sharper output without rebuilding prompts every time.",
    items: [
      "All 6 skill packages",
      "Uploadable markdown skill files",
      "Cross-workflow PE operating coverage",
    ],
    ctaLabel: "Buy the skill library",
    badge: "Lowest-friction library",
  }),
];

export const workflowBundles: Offering[] = [
  createOffer("NEXT_PUBLIC_LS_CHECKOUT_DAILY_OPERATOR_AI_BUNDLE", {
    slug: "daily-operator-ai-bundle",
    title: "Daily Operator AI Bundle",
    category: "Bundle",
    price: "$199",
    description:
      "A focused AI bundle for weekly portfolio reviews, KPI follow-up, management meetings, and executive updates.",
    bestFor:
      "Operating partners and value creation leads who want fast daily leverage rather than the whole AI library.",
    items: [
      "Operating Partner Copilot",
      "Board Pack & Executive Update Builder",
      "Management Meeting Prep Project",
      "KPI Diagnostic & Root Cause Project",
    ],
    ctaLabel: "Buy the daily operator bundle",
    badge: "Fastest path",
  }),
  createOffer("NEXT_PUBLIC_LS_CHECKOUT_ANALYST_ACCELERATION_BUNDLE", {
    slug: "analyst-acceleration-bundle",
    title: "Analyst Acceleration Bundle",
    category: "Bundle",
    price: "$149",
    description:
      "For turning rough notes and uneven analysis into cleaner executive-ready work product.",
    bestFor:
      "Analysts, consultants, chiefs of staff, and PMO leads who need sharper output under time pressure.",
    items: [
      "Analyst Work Product Improver",
      "Executive Communication Skills",
      "Work Product Quality Control Skills",
    ],
    ctaLabel: "Buy the analyst bundle",
    badge: "Lower-friction entry",
  }),
  createOffer("NEXT_PUBLIC_LS_CHECKOUT_DILIGENCE_TO_EXECUTION_BUNDLE", {
    slug: "diligence-to-execution-bundle",
    title: "Diligence-to-Execution Bundle",
    category: "Bundle",
    price: "$299",
    description:
      "For turning diligence findings into post-close priorities, owners, and first-100-day action.",
    bestFor:
      "Deal teams, operating teams, and consultants converting diligence into the first 100 days.",
    items: [
      "Diligence & Investment Thesis Project",
      "Value Creation Plan Builder",
      "Initiative Execution & PMO Project",
      "Value Creation Execution Skills",
    ],
    ctaLabel: "Buy the diligence-to-execution bundle",
    badge: "Post-close workflow",
  }),
];

export const offeringCollections: OfferingCollection[] = [
  {
    id: "excel-models",
    eyebrow: "Excel Models",
    title: "Quantify the value before you debate the narrative.",
    summary:
      "These workbooks are for analyses where EBITDA, cash flow, and value capture need to be sized, segmented, and defended.",
    offers: [
      createOffer("NEXT_PUBLIC_LS_CHECKOUT_PRICING_WATERFALL_MARGIN_LEAKAGE_MODEL", {
        slug: "pricing-waterfall-margin-leakage-model",
        title: "Pricing Waterfall & Margin Leakage Model",
        category: "Excel Model",
        price: "$99",
        description:
          "Diagnose discounting, pocket-price leakage, margin dispersion, and pricing upside before the next revenue review.",
        bestFor:
          "Commercial diligence, pricing workstreams, and revenue bridge conversations.",
        items: [
          "Price waterfall",
          "Discount leakage analysis",
          "EBITDA bridge scenarios",
        ],
        ctaLabel: "Buy this model",
      }),
      createOffer("NEXT_PUBLIC_LS_CHECKOUT_PROCUREMENT_SPEND_CUBE_SAVINGS_TRACKER", {
        slug: "procurement-spend-cube-savings-tracker",
        title: "Procurement Spend Cube & Savings Tracker",
        category: "Excel Model",
        price: "$99",
        description:
          "Map third-party spend, isolate addressable categories, and track savings capture with clearer owner accountability.",
        bestFor:
          "Cost programs, vendor rationalization, and procurement opportunity sizing.",
        items: [
          "Spend cube views",
          "Savings pipeline",
          "Category and site cuts",
        ],
        ctaLabel: "Buy this model",
      }),
      createOffer("NEXT_PUBLIC_LS_CHECKOUT_WORKING_CAPITAL_CASH_CONVERSION_MODEL", {
        slug: "working-capital-cash-conversion-model",
        title: "Working Capital & Cash Conversion Model",
        category: "Excel Model",
        price: "$99",
        description:
          "Quantify cash trapped in receivables, payables, and inventory so working capital becomes a tracked operating lever.",
        bestFor:
          "Cash release planning, treasury reviews, and operational cash conversion work.",
        items: [
          "DSO/DPO/DIO bridge",
          "Cash release scenarios",
          "CCC dashboard",
        ],
        ctaLabel: "Buy this model",
      }),
      createOffer("NEXT_PUBLIC_LS_CHECKOUT_SALES_PRODUCTIVITY_PIPELINE_COVERAGE_MODEL", {
        slug: "sales-productivity-pipeline-coverage-model",
        title: "Sales Productivity & Pipeline Coverage Model",
        category: "Excel Model",
        price: "$99",
        description:
          "Pressure-test rep productivity, stage conversion, quota attainment, and pipeline sufficiency before growth misses compound.",
        bestFor:
          "Commercial operating reviews and sales force effectiveness workstreams.",
        items: [
          "Pipeline coverage",
          "Rep productivity cuts",
          "Bookings forecast",
        ],
        ctaLabel: "Buy this model",
      }),
      createOffer("NEXT_PUBLIC_LS_CHECKOUT_CUSTOMER_RETENTION_NRR_COHORT_MODEL", {
        slug: "customer-retention-nrr-cohort-model",
        title: "Customer Retention / NRR Cohort Model",
        category: "Excel Model",
        price: "$99",
        description:
          "See churn, expansion, contraction, and renewal risk by cohort instead of relying on blended retention averages.",
        bestFor:
          "Retention diagnostics, customer value creation, and recurring revenue reviews.",
        items: [
          "Cohort retention",
          "GRR/NRR bridge",
          "Churn waterfall",
        ],
        ctaLabel: "Buy this model",
      }),
      createOffer("NEXT_PUBLIC_LS_CHECKOUT_ADD_ON_SYNERGY_INTEGRATION_VALUE_CAPTURE_MODEL", {
        slug: "add-on-synergy-integration-value-capture-model",
        title: "Add-On Synergy & Integration Value Capture Model",
        category: "Excel Model",
        price: "$99",
        description:
          "Track cost, revenue, procurement, G&A, and systems synergies after an add-on so integration value capture stays visible.",
        bestFor:
          "Add-on integrations, synergy tracking, and post-close value capture governance.",
        items: [
          "Synergy tracker",
          "Integration milestones",
          "Run-rate EBITDA bridge",
        ],
        ctaLabel: "Buy this model",
      }),
    ],
  },
  {
    id: "ai-project-kits",
    eyebrow: "AI Project Kits",
    title: "Stand up repeatable PE workflows without rebuilding the prompt stack.",
    summary:
      "Each kit is built around a recurring operating job: diagnose, synthesize, prepare, communicate, or drive execution.",
    offers: [
      createOffer("NEXT_PUBLIC_LS_CHECKOUT_OPERATING_PARTNER_COPILOT", {
        slug: "operating-partner-copilot",
        title: "Operating Partner Copilot",
        category: "AI Project Kit",
        price: "$49",
        description:
          "A daily thinking partner for portfolio performance, operating risks, value levers, and management follow-up.",
        bestFor:
          "Weekly portfolio reviews and operator readouts that need sharper questions and faster synthesis.",
        items: [
          "Weekly readouts",
          "Risk and opportunity memos",
          "Management question bank",
        ],
        ctaLabel: "Buy this project kit",
      }),
      createOffer("NEXT_PUBLIC_LS_CHECKOUT_BOARD_PACK_EXECUTIVE_UPDATE_BUILDER", {
        slug: "board-pack-executive-update-builder",
        title: "Board Pack & Executive Update Builder",
        category: "AI Project Kit",
        price: "$49",
        description:
          "Turn messy functional updates and initiative notes into crisper board-ready communication with less rewrite time.",
        bestFor:
          "Board cycles, lender updates, and executive reporting workflows.",
        items: [
          "Board updates",
          "Executive summaries",
          "Risk and mitigation drafts",
        ],
        ctaLabel: "Buy this project kit",
      }),
      createOffer("NEXT_PUBLIC_LS_CHECKOUT_MANAGEMENT_MEETING_PREP_PROJECT", {
        slug: "management-meeting-prep-project",
        title: "Management Meeting Prep Project",
        category: "AI Project Kit",
        price: "$49",
        description:
          "Prepare for CEO, CFO, and functional leader meetings with sharper agendas, questions, pre-reads, and follow-up structure.",
        bestFor:
          "Management meetings where the goal is better decisions, not better note taking.",
        items: [
          "Agendas",
          "Question banks",
          "Follow-up trackers",
        ],
        ctaLabel: "Buy this project kit",
      }),
      createOffer("NEXT_PUBLIC_LS_CHECKOUT_KPI_DIAGNOSTIC_ROOT_CAUSE_PROJECT", {
        slug: "kpi-diagnostic-root-cause-project",
        title: "KPI Diagnostic & Root Cause Project",
        category: "AI Project Kit",
        price: "$49",
        description:
          "Diagnose changes in revenue, margin, cash, churn, productivity, and operating metrics with more structure and less wandering.",
        bestFor:
          "Performance reviews that need a driver tree and a next-analysis plan fast.",
        items: [
          "Diagnostic memo",
          "Driver tree",
          "Data request list",
        ],
        ctaLabel: "Buy this project kit",
      }),
      createOffer("NEXT_PUBLIC_LS_CHECKOUT_VALUE_CREATION_PLAN_BUILDER", {
        slug: "value-creation-plan-builder",
        title: "Value Creation Plan Builder",
        category: "AI Project Kit",
        price: "$49",
        description:
          "Convert diligence findings and opportunity lists into a clearer value creation roadmap with owners, milestones, and benefit logic.",
        bestFor:
          "First-100-day planning, portfolio kickoff work, and post-close alignment.",
        items: [
          "VCP roadmap",
          "Initiative charters",
          "30/60/100-day plan",
        ],
        ctaLabel: "Buy this project kit",
      }),
      createOffer("NEXT_PUBLIC_LS_CHECKOUT_DILIGENCE_INVESTMENT_THESIS_PROJECT", {
        slug: "diligence-investment-thesis-project",
        title: "Diligence & Investment Thesis Project",
        category: "AI Project Kit",
        price: "$49",
        description:
          "Evaluate a company from an operating lens and pressure-test whether the thesis survives contact with actual execution constraints.",
        bestFor:
          "Deal teams and operating teams supporting diligence and investment committee prep.",
        items: [
          "Operating diligence memo",
          "Value creation hypotheses",
          "Risk register",
        ],
        ctaLabel: "Buy this project kit",
      }),
      createOffer("NEXT_PUBLIC_LS_CHECKOUT_INITIATIVE_EXECUTION_PMO_PROJECT", {
        slug: "initiative-execution-pmo-project",
        title: "Initiative Execution & PMO Project",
        category: "AI Project Kit",
        price: "$49",
        description:
          "Keep value creation initiatives moving after kickoff with workplans, status logic, recovery plans, and cleaner owner follow-through.",
        bestFor:
          "PMO cadences and operators who need more rigor after the plan is approved.",
        items: [
          "Workplans",
          "RAID and milestone trackers",
          "Recovery plans",
        ],
        ctaLabel: "Buy this project kit",
      }),
      createOffer("NEXT_PUBLIC_LS_CHECKOUT_PORTCO_RESEARCH_MARKET_INTELLIGENCE_PROJECT", {
        slug: "portco-research-market-intelligence-project",
        title: "Portco Research & Market Intelligence Project",
        category: "AI Project Kit",
        price: "$49",
        description:
          "Structure recurring research on industries, competitors, customers, vendors, and market shifts without starting from a blank page.",
        bestFor:
          "Portfolio monitoring, thematic research, and operating diligence refreshes.",
        items: [
          "Market briefs",
          "Competitor landscapes",
          "Monitoring checklists",
        ],
        ctaLabel: "Buy this project kit",
      }),
      createOffer("NEXT_PUBLIC_LS_CHECKOUT_ANALYST_WORK_PRODUCT_IMPROVER", {
        slug: "analyst-work-product-improver",
        title: "Analyst Work Product Improver",
        category: "AI Project Kit",
        price: "$49",
        description:
          "Turn rough notes, bullets, and first-draft analysis into cleaner consulting-grade output before it goes upward.",
        bestFor:
          "Analysts and consultants who need better first drafts with less rewrite churn.",
        items: [
          "Polished bullets",
          "Memo drafts",
          "Logic critiques",
        ],
        ctaLabel: "Buy this project kit",
      }),
    ],
  },
  {
    id: "skill-packages",
    eyebrow: "Skill Packages",
    title: "Upgrade the AI you already use with tighter PE operating instincts.",
    summary:
      "Each package bundles multiple reusable skills so your default outputs get clearer, sharper, and more executive-ready.",
    offers: [
      createOffer("NEXT_PUBLIC_LS_CHECKOUT_EXECUTIVE_COMMUNICATION_SKILLS", {
        slug: "executive-communication-skills",
        title: "Executive Communication Skills",
        category: "Skill Package",
        price: "$39",
        description:
          "Make AI better at board-ready updates, executive summaries, clean bullets, and direct management communication.",
        bestFor:
          "Buyers who constantly need to translate messy analysis into concise executive language.",
        items: [
          "Board Update Writer",
          "Executive Summary Builder",
          "Management Email Drafter",
        ],
        ctaLabel: "Buy this skill package",
      }),
      createOffer("NEXT_PUBLIC_LS_CHECKOUT_OPERATING_DIAGNOSTIC_SKILLS", {
        slug: "operating-diagnostic-skills",
        title: "Operating Diagnostic Skills",
        category: "Skill Package",
        price: "$39",
        description:
          "Help AI reason through what changed, why it changed, and what analysis or action should come next.",
        bestFor:
          "KPI reviews, root-cause work, and operating problem structuring.",
        items: [
          "Root Cause Hypothesis Builder",
          "Driver Tree Builder",
          "Issue Tree Builder",
        ],
        ctaLabel: "Buy this skill package",
      }),
      createOffer("NEXT_PUBLIC_LS_CHECKOUT_MEETING_INTERVIEW_SKILLS", {
        slug: "meeting-interview-skills",
        title: "Meeting & Interview Skills",
        category: "Skill Package",
        price: "$39",
        description:
          "Prepare for management conversations with sharper agendas, targeted questions, better pre-reads, and cleaner follow-up.",
        bestFor:
          "Operators and consultants whose leverage depends on better conversations and cleaner action capture.",
        items: [
          "Management Interview Guide Builder",
          "Meeting Agenda Builder",
          "Follow-Up Tracker Builder",
        ],
        ctaLabel: "Buy this skill package",
      }),
      createOffer("NEXT_PUBLIC_LS_CHECKOUT_VALUE_CREATION_EXECUTION_SKILLS", {
        slug: "value-creation-execution-skills",
        title: "Value Creation Execution Skills",
        category: "Skill Package",
        price: "$39",
        description:
          "Turn ideas into owned initiatives with clearer charters, milestones, benefits tracking, and dependency logic.",
        bestFor:
          "Value creation teams that need execution discipline after the strategy conversation ends.",
        items: [
          "Initiative Charter Builder",
          "30/60/100-Day Planner",
          "Benefits Tracker Designer",
        ],
        ctaLabel: "Buy this skill package",
      }),
      createOffer("NEXT_PUBLIC_LS_CHECKOUT_DILIGENCE_RESEARCH_SKILLS", {
        slug: "diligence-research-skills",
        title: "Diligence & Research Skills",
        category: "Skill Package",
        price: "$39",
        description:
          "Evaluate companies, markets, competitors, and risks with more structured diligence questions and better post-close translation.",
        bestFor:
          "Deal teams, independent sponsors, and consultants supporting diligence or market work.",
        items: [
          "Operating Diligence Question Builder",
          "Investment Thesis Stress Tester",
          "Risk Register Builder",
        ],
        ctaLabel: "Buy this skill package",
      }),
      createOffer("NEXT_PUBLIC_LS_CHECKOUT_WORK_PRODUCT_QUALITY_CONTROL_SKILLS", {
        slug: "work-product-quality-control-skills",
        title: "Work Product Quality Control Skills",
        category: "Skill Package",
        price: "$39",
        description:
          "Make AI act like a reviewer before work reaches a partner, board, client, or management team.",
        bestFor:
          "Analysts and consultants who want fewer logic gaps, weaker claims, and fluffy recommendations getting sent upward.",
        items: [
          "Logic Gap Reviewer",
          "Executive Readiness Reviewer",
          "Tone Tightener",
        ],
        ctaLabel: "Buy this skill package",
      }),
    ],
  },
];
