import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const contentRoot = path.join(root, "content");

function slugify(input) {
  return input
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function writeCollection(directory, items) {
  const target = path.join(contentRoot, directory);
  fs.mkdirSync(target, { recursive: true });
  for (const item of items) {
    fs.writeFileSync(
      path.join(target, `${item.slug}.json`),
      `${JSON.stringify(item, null, 2)}\n`,
    );
  }
}

const sourceRefs = [
  {
    id: "local-pe-study-guide",
    title: "PE-AI-Value-Creation-Study-Guide.md",
    type: "local-vault",
    path: "../../wiki/private-equity/PE-AI-Value-Creation-Study-Guide.md",
    note: "Local synthesis note used for AI transformation, 100-day planning, and operational alpha framing.",
  },
  {
    id: "local-value-creation-playbook",
    title: "Private Equity Value Creation.md",
    type: "local-vault",
    path: "../../wiki/research/private-equity/Private Equity Value Creation.md",
    note: "Local research note used for value creation categories, EBITDA logic, working capital, and 100-day planning.",
  },
  {
    id: "local-pe-operations",
    title: "Private Equity Operations.md",
    type: "local-vault",
    path: "../../wiki/research/private-equity/Private Equity Operations.md",
    note: "Local research note used for operating partner cadence, portfolio monitoring, and execution patterns.",
  },
  {
    id: "local-pe-healthcare",
    title: "PE in Healthcare.md",
    type: "local-vault",
    path: "../../wiki/research/private-equity/PE in Healthcare.md",
    note: "Local research note used for healthcare services industry profile and project examples.",
  },
  {
    id: "local-book-folder",
    title: "Private equity book folder",
    type: "local-vault",
    path: "../../wiki/private-equity",
    note: "Book files were treated as private reference material only; V1 content is original synthesis and does not reproduce protected text.",
  },
];

const relatedPlaybooks = [
  "Pricing Optimization",
  "Procurement Savings",
  "KPI Dashboard Buildout",
  "100-Day Value Creation Plan",
];
const relatedIndustries = ["Vertical SaaS", "Healthcare Services", "Manufacturing", "Distribution"];

const fundamentalNames = [
  "What Private Equity Is",
  "PE Business Model",
  "Deal Lifecycle",
  "Sources of Return",
  "LBO Basics",
  "Investment Thesis",
  "Commercial Diligence",
  "Operational Diligence",
  "Value Creation Planning",
  "Portfolio Monitoring",
  "Add-On Acquisitions",
  "Exit Planning",
];

const fundamentals = fundamentalNames.map((title) => ({
  slug: slugify(title),
  title,
  type: "fundamental",
  summary: `${title} explains the operating logic a PE professional needs before diagnosing a portfolio company or designing a value creation plan.`,
  definition: `${title} is a core concept in how sponsors evaluate, own, improve, and eventually sell companies.`,
  whyItMatters:
    "PE operators translate this concept into priorities, dashboards, management routines, and initiatives that improve EBITDA, cash flow, growth durability, or exit credibility.",
  example:
    "A portfolio CEO may use the concept to decide whether to prioritize pricing, working capital, sales productivity, or management cadence in the first 100 days.",
  diagram: `graph TD
  A[Concept: ${title}] --> B[Operator Question]
  B --> C[Data Needed]
  C --> D[Action]
  D --> E[KPI Movement]
  E --> F[Value Creation Story]`,
  relatedPlaybooks,
  relatedIndustries,
  sourceRefs: ["local-value-creation-playbook", "local-pe-operations", "local-book-folder"],
  tags: ["fundamentals", "private equity", "operations"],
}));

const playbookSpecs = [
  ["Procurement Savings", "EBITDA Margin Expansion", "Reducing third-party spend through better sourcing, vendor consolidation, and contract discipline."],
  ["Pricing Optimization", "Revenue Growth", "Improving realized price through segmentation, value-based pricing, discount governance, and contract cleanup."],
  ["Sales Productivity Improvement", "Revenue Growth", "Increasing seller output by clarifying territories, pipeline discipline, enablement, and manager cadence."],
  ["Marketing Efficiency Improvement", "Revenue Growth", "Improving demand generation ROI by reallocating spend toward channels that convert into profitable pipeline."],
  ["Customer Retention / Churn Reduction", "Revenue Growth", "Reducing preventable customer loss by diagnosing churn drivers and improving onboarding, success, and renewal motion."],
  ["Working Capital Improvement", "Working Capital / Cash Flow", "Releasing cash by improving receivables, payables, inventory, and cash conversion cycle discipline."],
  ["Finance Function Transformation", "EBITDA Margin Expansion", "Upgrading finance from bookkeeping to forecasting, decision support, controls, and board-ready reporting."],
  ["KPI Dashboard Buildout", "Talent / Organization", "Creating a reliable management dashboard that connects operating activity to value creation priorities."],
  ["AI Opportunity Identification", "Digital & AI Transformation", "Finding practical automation, analytics, and agentic workflow opportunities with measurable business cases."],
  ["Data Readiness for AI", "Digital & AI Transformation", "Preparing source systems, definitions, ownership, and governance so AI use cases can produce dependable outcomes."],
  ["100-Day Value Creation Plan", "Exit Readiness", "Converting diligence findings into a prioritized first-100-days execution roadmap."],
  ["Add-On Acquisition Integration", "M&A Integration", "Capturing cost, revenue, and operating synergies after acquiring a tuck-in or merger target."],
  ["Exit Readiness", "Exit Readiness", "Preparing the business, data room, KPI story, and growth narrative for buyer diligence."],
  ["Management Operating Cadence", "Talent / Organization", "Installing weekly, monthly, and quarterly routines that make performance transparent and accountable."],
  ["Org Design / Spans and Layers", "Talent / Organization", "Improving accountability and cost structure by clarifying roles, layers, spans, and decision rights."],
];

const playbooks = playbookSpecs.map(([title, category, summary], index) => ({
  slug: slugify(title),
  title,
  type: "playbook",
  category,
  difficulty: index < 5 ? "Beginner" : index < 11 ? "Intermediate" : "Advanced",
  summary,
  definition: summary,
  whyItMatters:
    "PE cares because the initiative can convert operating diagnosis into measurable EBITDA, cash flow, growth quality, management accountability, or exit multiple support.",
  commonProblems: [
    "Management has anecdotes but no clean baseline.",
    "The company tracks activity but not value impact.",
    "Owners are unclear and initiatives compete for attention.",
  ],
  diagnosticQuestions: [
    "Where is the value leakage visible in the P&L, balance sheet, or operating dashboard?",
    "Which segments, sites, customers, SKUs, vendors, or teams drive the variance?",
    "What can be changed in the first 30, 60, and 100 days without breaking the business?",
  ],
  dataNeeded: [
    "Revenue and gross margin detail",
    "Customer / vendor / SKU master data",
    "Operating KPIs",
    "Org ownership and process maps",
  ],
  process: [
    "Define the value hypothesis and KPI baseline.",
    "Segment the business to isolate where the opportunity lives.",
    "Prioritize quick wins, structural fixes, and longer-term capability builds.",
    "Assign owners, cadence, and benefits tracking.",
    "Report progress through the value creation dashboard.",
  ],
  kpisImpacted:
    category === "Revenue Growth"
      ? ["Gross Margin", "Win Rate", "NRR", "Churn", "Sales Cycle Length"]
      : category === "Working Capital / Cash Flow"
        ? ["DSO", "DPO", "Cash Conversion Cycle", "Inventory Turns"]
        : ["EBITDA Margin", "Gross Margin", "Forecast Accuracy", "Labor Productivity"],
  ebitdaLogic:
    "The lever improves enterprise value by increasing EBITDA, releasing cash, making growth more durable, or creating a better diligence story that buyers can underwrite.",
  caseExample:
    "In a sponsor-backed company, the team builds a baseline, targets the highest-variance segments, launches a 100-day sprint, and uses weekly value tracking to separate real savings or growth from one-time noise.",
  hundredDayPlan: [
    "Days 1-30: baseline data, confirm opportunity, name executive owner.",
    "Days 31-60: launch pilots, install dashboard, remove blockers.",
    "Days 61-100: scale what works, lock cadence, quantify run-rate impact.",
  ],
  commonMistakes: [
    "Treating the playbook as a one-time project instead of a management system.",
    "Counting theoretical benefits that never hit EBITDA or cash.",
    "Skipping change management with the operating team.",
  ],
  relatedIndustries,
  relatedProjectPlaybooks: [
    "Pricing and Packaging Redesign",
    "Inventory Turns Improvement",
    "Location-Level Profitability Dashboard",
  ],
  diagram: `graph LR
  A[Problem] --> B[${title}]
  B --> C[Operating Actions]
  C --> D[KPIs]
  D --> E[EBITDA / Cash Flow]
  E --> F[Exit Story]`,
  sourceRefs: ["local-value-creation-playbook", "local-pe-study-guide", "local-pe-operations"],
  tags: [category, "value creation", "100-day plan"],
}));

const industrySpecs = [
  ["Vertical SaaS", "Software for a specific industry workflow with recurring revenue and high switching costs."],
  ["Healthcare Services", "Provider, payer-adjacent, and outsourced healthcare delivery services with utilization and reimbursement complexity."],
  ["Industrial Services", "Field or facility services supporting industrial assets, infrastructure, and mission-critical maintenance."],
  ["Distribution", "Intermediaries that buy, stock, sell, and deliver products across fragmented customer bases."],
  ["Manufacturing", "Companies that transform inputs into finished goods through plants, labor, materials, and supply chains."],
  ["Multi-Site Services", "Location-based services where unit economics, labor scheduling, and local execution drive performance."],
  ["Business Services", "B2B services businesses monetizing people, process expertise, outsourced functions, or recurring contracts."],
  ["Tech-Enabled Services", "Services businesses that use software, automation, and workflow data to deliver better margins or outcomes."],
  ["Insurance Services", "Brokerage, claims, distribution, and support services around insurance products and risk transfer."],
  ["Staffing / Human Capital Services", "Talent supply, workforce management, recruiting, and human capital services businesses."],
];

const industries = industrySpecs.map(([title, summary]) => ({
  slug: slugify(title),
  title,
  type: "industry",
  summary,
  businessModel: summary,
  revenueModel:
    title.includes("SaaS")
      ? "Subscription revenue, usage expansion, implementation fees, and professional services."
      : "Recurring contracts, transaction fees, project revenue, branch/site revenue, or unit-based service volume.",
  costStructure:
    "Major cost buckets typically include labor, delivery capacity, procurement or COGS, technology, facilities, sales, and overhead.",
  keyKpis: ["Revenue Growth", "Gross Margin", "EBITDA Margin", "Retention", "Labor Productivity"],
  whyPeLikesIt:
    "PE likes niches with fragmented competition, repeatable operations, visible KPIs, pricing opportunity, add-on potential, and room for professionalized management.",
  investmentThesis:
    "A common thesis is to improve management systems, increase pricing discipline, expand sales capacity, consolidate fragmented competitors, and build a cleaner exit story.",
  diligenceQuestions: [
    "What are the true unit economics by customer, site, branch, product, or contract?",
    "Where is growth recurring versus one-time?",
    "Which KPIs predict margin or retention deterioration earliest?",
  ],
  operationalIssues: [
    "Inconsistent KPI definitions across teams.",
    "Local or functional variation that hides margin leakage.",
    "Underdeveloped pricing, sales operations, and forecasting cadence.",
  ],
  valueCreationLevers: [
    "Pricing discipline",
    "Sales productivity",
    "Procurement and vendor management",
    "KPI dashboard buildout",
    "Operating cadence",
  ],
  projectPlaybooks: [
    `${title} KPI dashboard`,
    `${title} pricing discipline`,
    `${title} operating cadence`,
  ],
  aiOpportunities: [
    "Automate repetitive admin workflows.",
    "Improve forecasting, scheduling, or routing decisions.",
    "Use analytics to identify churn, margin leakage, or service failures earlier.",
  ],
  risks: [
    "Customer concentration",
    "Weak data quality",
    "Margin compression",
    "Regulatory or labor exposure",
  ],
  hundredDayPlan: [
    "Build KPI baseline by segment.",
    "Identify quick-win pricing, cash, and cost opportunities.",
    "Install weekly operating review and value tracking.",
  ],
  exitReadiness: [
    "Clean revenue and margin bridge.",
    "Evidence of repeatable organic growth.",
    "Documented playbooks and management cadence.",
  ],
  representativeExamples: ["Representative public companies and sponsor-backed platforms vary by sub-niche."],
  relatedPlaybooks,
  relatedKpis: ["EBITDA Margin", "Gross Margin", "Revenue Growth", "Retention"],
  sourceRefs: title === "Healthcare Services"
    ? ["local-pe-healthcare", "local-value-creation-playbook"]
    : ["local-value-creation-playbook", "local-pe-operations"],
  tags: ["industry", title],
}));

const projectGroups = {
  "Vertical SaaS": [
    "Churn Reduction",
    "Pricing and Packaging Redesign",
    "Net Revenue Retention Improvement",
    "RevOps Dashboard Buildout",
    "Customer Success Operating Model",
    "Cloud Cost Optimization",
  ],
  "Healthcare Services": [
    "Provider Utilization Improvement",
    "Revenue Cycle Management Optimization",
    "Scheduling Optimization",
    "Payer Mix Improvement",
    "Centralized Call Center Implementation",
    "Referral Growth Engine",
  ],
  Manufacturing: [
    "Lean Manufacturing Improvement",
    "Procurement Savings",
    "SKU Rationalization",
    "Inventory Optimization",
    "Plant Utilization Improvement",
    "Scrap and Defect Reduction",
  ],
  Distribution: [
    "Inventory Turns Improvement",
    "Vendor Rebate Optimization",
    "Pricing Discipline",
    "Branch Profitability Improvement",
    "Warehouse Productivity Improvement",
    "Sales Territory Redesign",
  ],
  "Multi-Site Services": [
    "Location-Level Profitability Dashboard",
    "Labor Scheduling Optimization",
    "Centralized Procurement",
    "Add-On Integration Playbook",
    "Standard Operating Procedures Rollout",
    "Local Marketing Engine",
  ],
  "Business Services": [
    "Sales Process Professionalization",
    "Utilization Improvement",
    "Delivery Margin Improvement",
    "Customer Concentration Reduction",
    "Account Management Model",
    "Back-Office Centralization",
  ],
};

const industryProjects = Object.entries(projectGroups).flatMap(([industry, projects]) =>
  projects.map((project, index) => ({
    slug: slugify(`${industry}-${project}`),
    title: project,
    type: "industry-project",
    industry,
    summary: `${project} is a focused ${industry} operating project that connects a specific business problem to workstreams, data, KPIs, and expected value impact.`,
    businessProblem: `${industry} companies often lose margin, growth, or cash when ${project.toLowerCase()} is not managed with a clear owner and KPI baseline.`,
    goal: "Create a measurable improvement plan that management can execute through weekly operating cadence.",
    timeline: index % 2 === 0 ? "30-90 days" : "60-120 days",
    workstreams: [
      "Baseline current performance",
      "Segment the opportunity",
      "Design operating changes",
      "Pilot with owner accountability",
      "Track KPI and financial impact",
    ],
    dataNeeded: ["Customer data", "P&L detail", "Operating KPI exports", "Org ownership map"],
    kpisImpacted: ["Revenue Growth", "Gross Margin", "EBITDA Margin", "Retention"],
    expectedImpact:
      "Expected impact should be underwritten as run-rate EBITDA, cash release, risk reduction, or exit-story improvement after baseline validation.",
    difficulty: index < 2 ? "Beginner" : index < 5 ? "Intermediate" : "Advanced",
    typicalOwner: index % 3 === 0 ? "COO" : index % 3 === 1 ? "CFO" : "Commercial Leader",
    relatedPlaybooks: [
      "KPI Dashboard Buildout",
      "Management Operating Cadence",
      index % 2 === 0 ? "Pricing Optimization" : "Procurement Savings",
    ],
    sourceRefs: ["local-value-creation-playbook", "local-pe-operations"],
    tags: [industry, "industry project", project],
  })),
);

const kpiSpecs = [
  ["Win Rate", "Sales", "Closed-won opportunities divided by qualified opportunities."],
  ["Sales Cycle Length", "Sales", "Average time from qualified opportunity to closed-won or closed-lost."],
  ["Pipeline Coverage", "Sales", "Qualified pipeline divided by quota or bookings target."],
  ["Quota Attainment", "Sales", "Percentage of sellers meeting or exceeding quota."],
  ["CAC Payback", "Sales", "Months required for gross profit to recover customer acquisition cost."],
  ["CAC", "Marketing", "Sales and marketing acquisition cost per new customer."],
  ["Cost per Lead", "Marketing", "Marketing spend divided by leads generated."],
  ["Lead Conversion Rate", "Marketing", "Leads converting to qualified opportunities or customers."],
  ["Campaign ROI", "Marketing", "Incremental gross profit or pipeline generated per campaign dollar."],
  ["ARR", "SaaS", "Annualized recurring revenue from subscription customers."],
  ["MRR", "SaaS", "Monthly recurring revenue from subscription customers."],
  ["NRR", "SaaS", "Starting recurring revenue plus expansion less contraction and churn, divided by starting revenue."],
  ["GRR", "SaaS", "Starting recurring revenue retained before expansion."],
  ["Churn", "SaaS", "Customers or recurring revenue lost in a period."],
  ["Logo Retention", "SaaS", "Percentage of customers retained over a period."],
  ["Expansion Revenue", "SaaS", "Incremental revenue from existing customers through upsell, cross-sell, or usage."],
  ["Addressable Spend", "Procurement", "Spend that can be influenced through sourcing, renegotiation, or demand management."],
  ["Savings Percentage", "Procurement", "Validated savings divided by addressable spend or baseline spend."],
  ["Vendor Count", "Procurement", "Number of active vendors by category, site, or entity."],
  ["Maverick Spend", "Procurement", "Spend outside approved vendors, contracts, or purchasing policy."],
  ["Contract Compliance", "Procurement", "Share of spend following negotiated terms and approved channels."],
  ["EBITDA Margin", "Finance", "EBITDA divided by revenue."],
  ["Gross Margin", "Finance", "Revenue less direct costs, divided by revenue."],
  ["DSO", "Finance", "Days sales outstanding; how long receivables take to collect."],
  ["DPO", "Finance", "Days payable outstanding; how long the company takes to pay suppliers."],
  ["Cash Conversion Cycle", "Finance", "DSO plus inventory days minus DPO."],
  ["Forecast Accuracy", "Finance", "Actual performance compared with forecast over a defined horizon."],
  ["Utilization", "Operations", "Billable or productive capacity used divided by available capacity."],
  ["Throughput", "Operations", "Units, jobs, visits, or transactions completed over a period."],
  ["Defect Rate", "Operations", "Defective units or service failures divided by total output."],
  ["On-Time Delivery", "Operations", "Orders or services delivered by committed date."],
  ["Labor Productivity", "Operations", "Output or revenue per labor hour or employee."],
  ["Inventory Turns", "Operations", "COGS divided by average inventory."],
  ["Provider Utilization", "Healthcare", "Booked or productive provider hours divided by available hours."],
  ["Revenue Cycle Denial Rate", "Healthcare", "Denied claims divided by submitted claims."],
  ["Branch Profitability", "Distribution", "Branch EBITDA or contribution margin after local costs."],
  ["Warehouse Picks per Hour", "Distribution", "Completed picks divided by labor hours."],
  ["Scrap Rate", "Manufacturing", "Scrapped units or material cost divided by total production."],
  ["Plant OEE", "Manufacturing", "Overall equipment effectiveness across availability, performance, and quality."],
  ["Employee Turnover", "Talent", "Departures divided by average headcount over a period."],
];

const kpis = kpiSpecs.map(([title, fn, summary]) => ({
  slug: slugify(title),
  title,
  type: "kpi",
  function: fn,
  summary,
  formula: summary.includes("divided") || summary.includes("plus") ? summary : undefined,
  whyPeCares:
    "PE cares because this KPI gives an early read on growth quality, margin expansion, cash conversion, execution discipline, or exit-story credibility.",
  goodBadSignals:
    "Good performance shows controlled execution and improving unit economics; bad performance signals leakage, weak process ownership, or a diligence risk requiring deeper segmentation.",
  improvementActions: [
    "Standardize the definition and data owner.",
    "Segment by customer, site, product, team, or channel.",
    "Tie movement to an operating playbook and weekly cadence.",
  ],
  relatedPlaybooks: [
    fn === "Procurement" ? "Procurement Savings" : "KPI Dashboard Buildout",
    fn === "Finance" ? "Working Capital Improvement" : "Management Operating Cadence",
  ],
  relatedIndustries,
  sourceRefs: ["local-value-creation-playbook", "local-pe-operations"],
  tags: [fn, "KPI", title],
}));

writeCollection("sources", sourceRefs.map((source) => ({
  ...source,
  slug: source.id,
  type: "source",
  summary: source.note,
})));
writeCollection("fundamentals", fundamentals);
writeCollection("playbooks", playbooks);
writeCollection("industries", industries);
writeCollection("industry-project-playbooks", industryProjects);
writeCollection("kpis", kpis);

console.log(
  `Generated ${fundamentals.length} fundamentals, ${playbooks.length} playbooks, ${industries.length} industries, ${industryProjects.length} projects, ${kpis.length} KPIs, and ${sourceRefs.length} source refs.`,
);
