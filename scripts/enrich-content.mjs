import fs from "node:fs";
import path from "node:path";

const contentRoot = path.join(process.cwd(), "content");
const curatedRoot = path.join(contentRoot, "curated-articles");
if (!fs.existsSync(curatedRoot)) fs.mkdirSync(curatedRoot, { recursive: true });

function getCuratedArticle(slug) {
  const curatedPath = path.join(curatedRoot, `${slug}.json`);
  if (fs.existsSync(curatedPath)) {
    return JSON.parse(fs.readFileSync(curatedPath, "utf8")).articleSections;
  }
  return null;
}

function readCollection(directory) {
  const target = path.join(contentRoot, directory);
  return fs
    .readdirSync(target)
    .filter((file) => file.endsWith(".json"))
    .map((file) => {
      const filePath = path.join(target, file);
      return { filePath, item: JSON.parse(fs.readFileSync(filePath, "utf8")) };
    });
}

function write(filePath, item) {
  fs.writeFileSync(filePath, `${JSON.stringify(item, null, 2)}\n`);
}

const STYLES = `
  classDef base fill:#f0ece3,stroke:#ded8cd,color:#22201c
  classDef accent fill:#f1e4dc,stroke:#7a3f2c,color:#22201c
  classDef strong fill:#7a3f2c,stroke:#7a3f2c,color:#fffdf8`;

function fallbackSections(item) {
  return [
    {
      title: "Operator's View",
      body: [
        `${item.title} should be understood as an operating system topic, not as a vocabulary item. The useful question is not "what is it?" but how it changes the way a sponsor underwrites value, assigns ownership, measures progress, and prepares a company for the next buyer.`,
        "A strong PE knowledge base should connect the topic to management behavior, data quality, operational cadence, and enterprise value logic. That is the standard this page is designed around.",
      ],
    },
  ];
}

function fundamentalDiagrams(item) {
  const charts = {
    "value-creation-planning": `flowchart TB
  A["Business problem"] --> B["Diagnosis"]
  B --> C["Analysis / tool"]
  C --> D["Initiative"]
  D --> E["Process change"]
  E --> F["KPI impact"]
  F --> G["EBITDA / cash impact"]
  G --> H["Enterprise value"]
${STYLES}
  class A,H strong
  class B,C,D base
  class E,F,G accent`,
    "deal-lifecycle": `flowchart TB
  A["Investment thesis"] --> B["Commercial and operational diligence"]
  B --> C["Value creation underwriting"]
  C --> D["Close and 100-day plan"]
  D --> E["Portfolio operating cadence"]
  E --> F["Exit readiness"]
  F --> G["Sale process and buyer diligence"]
${STYLES}
  class A,G strong
  class B,C,D base
  class E,F accent`,
    "commercial-diligence": `flowchart TB
  A["Market thesis"] --> B["Customer and segment analysis"]
  B --> C["Revenue quality and retention"]
  C --> D["Pricing and sales productivity"]
  D --> E["Growth case and risks"]
  E --> F["Value creation implications"]
${STYLES}
  class A,F strong
  class B,C base
  class D,E accent`,
  };

  const chart = charts[item.slug];
  return chart
    ? [
        {
          title: `${item.title} workflow`,
          description: "A practical flow from diagnosis through execution and value impact.",
          chart,
        },
      ]
    : [];
}

function playbookDiagrams(item) {
  const charts = {
    "100-day-value-creation-plan": `flowchart TB
  A["Close / day 0"] --> B["Stabilize cash, customers, data"]
  B --> C["Validate diligence hypotheses"]
  C --> D["Prioritize value levers"]
  D --> E["Launch quick wins"]
  E --> F["Install weekly value cadence"]
  F --> G["Approve 3-year VCP"]
  G --> H["Board-ready benefit tracking"]
${STYLES}
  class A,H strong
  class B,C,D base
  class E,F,G accent`,
    "procurement-savings": `flowchart TB
  A["AP and PO data"] --> B["Spend cube"]
  B --> C["Addressable spend"]
  C --> D["Category strategy"]
  D --> E["Supplier negotiation"]
  E --> F["Contract and buying controls"]
  F --> G["Savings ledger"]
  G --> H["EBITDA validation"]
${STYLES}
  class A,H strong
  class B,C,D base
  class E,F,G accent`,
    "pricing-optimization": `flowchart TB
  A["Transaction data"] --> B["Price waterfall"]
  B --> C["Segment pocket margin"]
  C --> D["Find leakage and outliers"]
  D --> E["Set price actions and guardrails"]
  E --> F["Sales execution"]
  F --> G["Track realization, churn, win rate"]
  G --> H["Gross margin / EBITDA bridge"]
${STYLES}
  class A,H strong
  class B,C,D base
  class E,F,G accent`,
    "sales-productivity-improvement": `flowchart TB
  A["Bookings target"] --> B["Pipeline coverage"]
  B --> C["Stage conversion"]
  C --> D["Bottleneck by rep / segment"]
  D --> E["Manager coaching action"]
  E --> F["Forecast and pipeline review"]
  F --> G["Bookings quality and CAC payback"]
${STYLES}
  class A,G strong
  class B,C,D base
  class E,F accent`,
    "customer-retention-churn-reduction": `flowchart TB
  A["Customer base"] --> B["Cohort and segment churn"]
  B --> C["Root-cause reason codes"]
  C --> D["At-risk account list"]
  D --> E["Save / onboarding / success plays"]
  E --> F["Renewal outcome"]
  F --> G["GRR / NRR bridge"]
${STYLES}
  class A,G strong
  class B,C,D base
  class E,F accent`,
    "working-capital-improvement": `flowchart TB
  A["Balance sheet baseline"] --> B["DSO + inventory + DPO bridge"]
  B --> C["Segment by customer / SKU / vendor"]
  C --> D["Collections, inventory, terms workstreams"]
  D --> E["Daily cash review"]
  E --> F["Released cash"]
  F --> G["Debt paydown / growth capacity"]
${STYLES}
  class A,G strong
  class B,C base
  class D,E,F accent`,
    "add-on-acquisition-integration": `flowchart TB
  A["Integration thesis before signing"] --> B["Close readiness"]
  B --> C["Protect customers and critical talent"]
  C --> D["Install finance and KPI controls"]
  D --> E["Capture validated synergies"]
  E --> F["Migrate systems and process"]
  F --> G["Repeatable integration playbook"]
${STYLES}
  class A,G strong
  class B,C,D base
  class E,F accent`,
    "ai-opportunity-identification": `flowchart TB
  A["Workflow inventory"] --> B["Value / feasibility / risk score"]
  B --> C["Data readiness check"]
  C --> D["Pilot design with controls"]
  D --> E["Measure cycle time, cost, quality"]
  E --> F{"Benefit proven?"}
  F -->|"Yes"| G["Scale"]
  F -->|"No"| H["Stop or redesign"]
${STYLES}
  class A,G strong
  class B,C,D base
  class E,H accent
  class F base`,
    "kpi-dashboard-buildout": `flowchart TB
  A["Operating questions"] --> B["Metric contracts"]
  B --> C["Source-system validation"]
  C --> D["Segmented dashboard"]
  D --> E["Weekly review cadence"]
  E --> F["Owner actions"]
  F --> G["Financial bridge"]
${STYLES}
  class A,G strong
  class B,C,D base
  class E,F accent`,
    "exit-readiness": `flowchart TB
  A["Buyer lens"] --> B["Revenue and margin proof"]
  B --> C["KPI history and bridges"]
  C --> D["Data room issue log"]
  D --> E["Resolve diligence gaps"]
  E --> F["Next-owner value roadmap"]
  F --> G["Defensible exit story"]
${STYLES}
  class A,G strong
  class B,C,D base
  class E,F accent`,
  };

  const chart = charts[item.slug];
  return chart
    ? [
        {
          title: `${item.title} workflow`,
          description: "A realistic operator flow from diagnosis through execution, KPI tracking, and value impact.",
          chart,
        },
      ]
    : [];
}

function industryDiagrams(item) {
  const chart = `flowchart TB
  A["${item.title} economics"] --> B["Revenue quality"]
  A --> C["Margin quality"]
  A --> D["Cash profile"]
  B --> E["Growth durability"]
  C --> F["EBITDA bridge"]
  D --> G["Liquidity and debt capacity"]
  E --> H["Enterprise value"]
  F --> H
  G --> H
${STYLES}
  class A,H strong
  class B,C,D base
  class E,F,G accent`;

  return [
    {
      title: `${item.title} operating value tree`,
      description: "A compact view of the levers that connect industry economics to enterprise value.",
      chart,
    },
  ];
}

function kpiDiagrams(item) {
  const chart = `flowchart TB
  A["Define ${item.title}"] --> B["Validate baseline"]
  B --> C["Segment variance"]
  C --> D["Identify controllable driver"]
  D --> E["Assign owner action"]
  E --> F["Track paired guardrail"]
  F --> G["Update value bridge"]
  G -.-> C
${STYLES}
  class A,G strong
  class B,C,D base
  class E,F accent`;

  return [
    {
      title: `${item.title} action loop`,
      description: "How the KPI should move from definition to variance, action, and financial interpretation.",
      chart,
    },
  ];
}

function diagramsFor(directory, item) {
  if (directory === "fundamentals") return fundamentalDiagrams(item);
  if (directory === "playbooks") return playbookDiagrams(item);
  if (directory === "industries") return industryDiagrams(item);
  if (directory === "kpis") return kpiDiagrams(item);
  return [];
}

function fallbackArticle(item) {
  return fallbackSections(item);
}

const enrichers = {
  fundamentals: fallbackArticle,
  playbooks: fallbackArticle,
  industries: fallbackArticle,
  kpis: fallbackArticle,
};

for (const [directory, makeArticle] of Object.entries(enrichers)) {
  for (const { filePath, item } of readCollection(directory)) {
    const curatedSections = getCuratedArticle(item.slug);
    item.articleSections = curatedSections || makeArticle(item);
    item.diagrams = diagramsFor(directory, item);
    delete item.bookExcerpts;
    delete item.sourceRefs;
    write(filePath, item);
  }
}

console.log("Enriched static content with curated article sections and selective Mermaid diagram metadata.");
