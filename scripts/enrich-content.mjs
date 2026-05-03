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
  const charts = {
    "arr": `flowchart TB
  A["Starting ARR"] --> B["New ARR"]
  A --> C["Expansion ARR"]
  A --> D["Contraction and churn"]
  B --> E["Ending ARR"]
  C --> E
  D --> E
  E --> F["Growth quality"]
  F --> G["Revenue multiple support"]
${STYLES}
  class A,G strong
  class B,C,D base
  class E,F accent`,
    "mrr": `flowchart TB
  A["Starting MRR"] --> B["New MRR"]
  A --> C["Expansion MRR"]
  A --> D["Churned MRR"]
  B --> E["Ending MRR"]
  C --> E
  D --> E
  E --> F["ARR run-rate"]
  F --> G["Forecast and valuation support"]
${STYLES}
  class A,G strong
  class B,C,D base
  class E,F accent`,
    "nrr": `flowchart TB
  A["Starting customer revenue"] --> B["Expansion"]
  A --> C["Contraction"]
  A --> D["Churn"]
  B --> E["Ending retained revenue"]
  C --> E
  D --> E
  E --> F["NRR"]
  F --> G["Durability and multiple"]
${STYLES}
  class A,G strong
  class B,C,D base
  class E,F accent`,
    "grr": `flowchart TB
  A["Starting recurring revenue"] --> B["Lost logos"]
  A --> C["Downgrades"]
  B --> D["Retained base revenue"]
  C --> D
  D --> E["GRR"]
  E --> F["Revenue floor"]
  F --> G["Downside risk for buyers"]
${STYLES}
  class A,G strong
  class B,C base
  class D,E,F accent`,
    "churn": `flowchart TB
  A["Customer cohort"] --> B["Logo churn"]
  A --> C["Revenue churn"]
  B --> D["Reason codes"]
  C --> D
  D --> E["Save plays and onboarding fixes"]
  E --> F["GRR / NRR movement"]
  F --> G["Growth efficiency"]
${STYLES}
  class A,G strong
  class B,C,D base
  class E,F accent`,
    "logo-retention": `flowchart TB
  A["Opening customer count"] --> B["Renewed logos"]
  A --> C["Lost logos"]
  B --> D["Logo retention"]
  C --> D
  D --> E["Referenceability"]
  E --> F["New logo efficiency"]
  F --> G["Exit story durability"]
${STYLES}
  class A,G strong
  class B,C base
  class D,E,F accent`,
    "expansion-revenue": `flowchart TB
  A["Existing customer base"] --> B["Seat expansion"]
  A --> C["Cross-sell"]
  A --> D["Price / package uplift"]
  B --> E["Expansion revenue"]
  C --> E
  D --> E
  E --> F["NRR lift"]
  F --> G["Capital-efficient growth"]
${STYLES}
  class A,G strong
  class B,C,D base
  class E,F accent`,
    "cac": `flowchart TB
  A["Sales and marketing spend"] --> B["Qualified opportunities"]
  B --> C["New customers"]
  A --> D["CAC"]
  C --> D
  D --> E["Gross profit payback"]
  E --> F["Growth efficiency"]
  F --> G["Valuation quality"]
${STYLES}
  class A,G strong
  class B,C base
  class D,E,F accent`,
    "cac-payback": `flowchart TB
  A["CAC"] --> B["New customer ARR"]
  B --> C["Gross margin dollars"]
  C --> D["Months to recover CAC"]
  D --> E["Payback period"]
  E --> F["Sales capacity decision"]
  F --> G["Efficient growth thesis"]
${STYLES}
  class A,G strong
  class B,C,D base
  class E,F accent`,
    "cost-per-lead": `flowchart TB
  A["Marketing spend"] --> B["Leads generated"]
  A --> C["Cost per lead"]
  B --> C
  C --> D["Lead quality check"]
  D --> E["MQL to SQL conversion"]
  E --> F["CAC impact"]
  F --> G["Channel allocation"]
${STYLES}
  class A,G strong
  class B,C,D base
  class E,F accent`,
    "campaign-roi": `flowchart TB
  A["Campaign spend"] --> B["Attributed pipeline"]
  B --> C["Closed-won revenue"]
  C --> D["Gross profit"]
  A --> E["ROI"]
  D --> E
  E --> F["Budget reallocation"]
  F --> G["Growth efficiency"]
${STYLES}
  class A,G strong
  class B,C,D base
  class E,F accent`,
    "lead-conversion-rate": `flowchart TB
  A["Leads"] --> B["Qualified leads"]
  B --> C["Opportunities"]
  C --> D["Closed won"]
  A --> E["Conversion rate"]
  D --> E
  E --> F["Funnel bottleneck"]
  F --> G["Bookings impact"]
${STYLES}
  class A,G strong
  class B,C,D base
  class E,F accent`,
    "pipeline-coverage": `flowchart TB
  A["Bookings target"] --> B["Required qualified pipeline"]
  C["Current qualified pipeline"] --> D["Coverage ratio"]
  B --> D
  D --> E["Stage-weighted gap"]
  E --> F["Rep / segment action"]
  F --> G["Forecast confidence"]
${STYLES}
  class A,G strong
  class B,C,D base
  class E,F accent`,
    "quota-attainment": `flowchart TB
  A["Quota"] --> B["Bookings by rep"]
  B --> C["Attainment distribution"]
  C --> D["Territory / capacity issue"]
  C --> E["Coaching / enablement issue"]
  D --> F["Sales productivity"]
  E --> F
  F --> G["Revenue plan credibility"]
${STYLES}
  class A,G strong
  class B,C base
  class D,E,F accent`,
    "sales-cycle-length": `flowchart TB
  A["Opportunity created"] --> B["Qualified"]
  B --> C["Proposal"]
  C --> D["Negotiation"]
  D --> E["Closed won / lost"]
  E --> F["Cycle length by segment"]
  F --> G["Pipeline velocity and cash timing"]
${STYLES}
  class A,G strong
  class B,C,D base
  class E,F accent`,
    "win-rate": `flowchart TB
  A["Qualified opportunities"] --> B["Closed won"]
  A --> C["Closed lost"]
  B --> D["Win rate"]
  C --> D
  D --> E["Loss reason analysis"]
  E --> F["Pricing / product / sales action"]
  F --> G["Bookings productivity"]
${STYLES}
  class A,G strong
  class B,C base
  class D,E,F accent`,
    "gross-margin": `flowchart TB
  A["Revenue"] --> B["Direct costs"]
  A --> C["Gross profit"]
  B --> C
  C --> D["Gross margin"]
  D --> E["Price / mix / cost bridge"]
  E --> F["EBITDA flow-through"]
  F --> G["Enterprise value"]
${STYLES}
  class A,G strong
  class B,C,D base
  class E,F accent`,
    "ebitda-margin": `flowchart TB
  A["Revenue"] --> B["Gross profit"]
  B --> C["Operating expenses"]
  C --> D["EBITDA"]
  A --> E["EBITDA margin"]
  D --> E
  E --> F["Margin bridge"]
  F --> G["Multiple and leverage capacity"]
${STYLES}
  class A,G strong
  class B,C,D base
  class E,F accent`,
    "cash-conversion-cycle": `flowchart TB
  A["DSO"] --> D["Cash conversion cycle"]
  B["Inventory days"] --> D
  C["DPO"] --> D
  D --> E["Cash trapped in operations"]
  E --> F["Collections / inventory / terms actions"]
  F --> G["Released cash"]
  G --> H["Debt paydown or growth capacity"]
${STYLES}
  class A,H strong
  class B,C,D base
  class E,F,G accent`,
    "dso": `flowchart TB
  A["Credit sales"] --> B["Accounts receivable"]
  B --> C["DSO"]
  C --> D["Aging buckets"]
  D --> E["Collections and billing fixes"]
  E --> F["Cash acceleration"]
  F --> G["Working capital release"]
${STYLES}
  class A,G strong
  class B,C,D base
  class E,F accent`,
    "dpo": `flowchart TB
  A["Purchases"] --> B["Accounts payable"]
  B --> C["DPO"]
  C --> D["Supplier terms variance"]
  D --> E["Terms negotiation and payment controls"]
  E --> F["Cash retained"]
  F --> G["Liquidity improvement"]
${STYLES}
  class A,G strong
  class B,C,D base
  class E,F accent`,
    "forecast-accuracy": `flowchart TB
  A["Forecast"] --> B["Actual result"]
  A --> C["Variance"]
  B --> C
  C --> D["Driver attribution"]
  D --> E["Planning cadence fix"]
  E --> F["Capital allocation confidence"]
  F --> G["Board and lender credibility"]
${STYLES}
  class A,G strong
  class B,C,D base
  class E,F accent`,
    "addressable-spend": `flowchart TB
  A["Total spend"] --> B["Exclude taxes, payroll, pass-throughs"]
  B --> C["Addressable spend"]
  C --> D["Category opportunity"]
  D --> E["Sourcing waves"]
  E --> F["Savings pipeline"]
  F --> G["EBITDA opportunity"]
${STYLES}
  class A,G strong
  class B,C,D base
  class E,F accent`,
    "savings-percentage": `flowchart TB
  A["Baseline spend"] --> B["Validated savings"]
  A --> C["Savings percentage"]
  B --> C
  C --> D["Run-rate validation"]
  D --> E["P&L recognition"]
  E --> F["EBITDA bridge"]
  F --> G["Value creation scorecard"]
${STYLES}
  class A,G strong
  class B,C,D base
  class E,F accent`,
    "maverick-spend": `flowchart TB
  A["Total spend"] --> B["Contracted spend"]
  A --> C["Off-contract spend"]
  C --> D["Maverick spend"]
  D --> E["Buying control gaps"]
  E --> F["Policy and system controls"]
  F --> G["Leakage reduction"]
${STYLES}
  class A,G strong
  class B,C,D base
  class E,F accent`,
    "contract-compliance": `flowchart TB
  A["Contract terms"] --> B["Invoice and PO data"]
  B --> C["Compliance check"]
  C --> D["Price / SLA / rebate exceptions"]
  D --> E["Recoveries and controls"]
  E --> F["Realized savings"]
  F --> G["Procurement EBITDA proof"]
${STYLES}
  class A,G strong
  class B,C,D base
  class E,F accent`,
    "vendor-count": `flowchart TB
  A["Vendor master"] --> B["Active vendors"]
  B --> C["Spend by category"]
  C --> D["Fragmentation"]
  D --> E["Consolidation candidates"]
  E --> F["Negotiation leverage"]
  F --> G["Savings and control improvement"]
${STYLES}
  class A,G strong
  class B,C,D base
  class E,F accent`,
    "inventory-turns": `flowchart TB
  A["COGS"] --> C["Inventory turns"]
  B["Average inventory"] --> C
  C --> D["SKU / site variance"]
  D --> E["Slow-moving inventory"]
  E --> F["Replenishment and rationalization"]
  F --> G["Cash release and carrying cost reduction"]
${STYLES}
  class A,G strong
  class B,C,D base
  class E,F accent`,
    "defect-rate": `flowchart TB
  A["Total output"] --> B["Defects"]
  B --> C["Defect rate"]
  C --> D["Root cause by line / shift / supplier"]
  D --> E["Quality corrective action"]
  E --> F["Scrap, rework, warranty reduction"]
  F --> G["Gross margin lift"]
${STYLES}
  class A,G strong
  class B,C,D base
  class E,F accent`,
    "scrap-rate": `flowchart TB
  A["Production input"] --> B["Scrapped material"]
  B --> C["Scrap rate"]
  C --> D["Material / process root cause"]
  D --> E["Yield improvement"]
  E --> F["COGS reduction"]
  F --> G["Gross margin lift"]
${STYLES}
  class A,G strong
  class B,C,D base
  class E,F accent`,
    "plant-oee": `flowchart TB
  A["Availability"] --> D["OEE"]
  B["Performance"] --> D
  C["Quality"] --> D
  D --> E["Hidden capacity"]
  E --> F["Throughput without capex"]
  F --> G["Margin and cash impact"]
${STYLES}
  class A,G strong
  class B,C,D base
  class E,F accent`,
    "throughput": `flowchart TB
  A["Available capacity"] --> B["Bottleneck step"]
  B --> C["Units / jobs completed"]
  C --> D["Throughput"]
  D --> E["Constraint removal"]
  E --> F["Revenue capacity"]
  F --> G["EBITDA flow-through"]
${STYLES}
  class A,G strong
  class B,C,D base
  class E,F accent`,
    "on-time-delivery": `flowchart TB
  A["Customer due date"] --> B["Actual delivery date"]
  B --> C["On-time delivery"]
  C --> D["Late order reason codes"]
  D --> E["Scheduling / inventory / carrier fixes"]
  E --> F["Service level improvement"]
  F --> G["Retention and working capital impact"]
${STYLES}
  class A,G strong
  class B,C,D base
  class E,F accent`,
    "utilization": `flowchart TB
  A["Available capacity"] --> B["Productive capacity used"]
  B --> C["Utilization"]
  C --> D["Idle / non-billable time"]
  D --> E["Scheduling and demand balancing"]
  E --> F["Revenue per resource"]
  F --> G["EBITDA margin"]
${STYLES}
  class A,G strong
  class B,C,D base
  class E,F accent`,
    "labor-productivity": `flowchart TB
  A["Labor hours"] --> B["Output"]
  B --> C["Productivity"]
  C --> D["Variance by role / site / shift"]
  D --> E["Staffing, training, process fixes"]
  E --> F["Output per FTE"]
  F --> G["Margin improvement"]
${STYLES}
  class A,G strong
  class B,C,D base
  class E,F accent`,
    "warehouse-picks-per-hour": `flowchart TB
  A["Labor hours"] --> B["Completed picks"]
  B --> C["Picks per hour"]
  C --> D["Zone / picker / SKU variance"]
  D --> E["Slotting and process changes"]
  E --> F["Warehouse productivity"]
  F --> G["Fulfillment cost reduction"]
${STYLES}
  class A,G strong
  class B,C,D base
  class E,F accent`,
    "branch-profitability": `flowchart TB
  A["Branch revenue"] --> B["Gross margin"]
  B --> C["Direct branch costs"]
  C --> D["Branch EBITDA"]
  D --> E["Profitability by location"]
  E --> F["Pricing, labor, footprint actions"]
  F --> G["Portfolio margin lift"]
${STYLES}
  class A,G strong
  class B,C,D base
  class E,F accent`,
    "provider-utilization": `flowchart TB
  A["Available provider hours"] --> B["Booked productive hours"]
  B --> C["Provider utilization"]
  C --> D["Schedule gaps and no-shows"]
  D --> E["Template and referral actions"]
  E --> F["Visit capacity"]
  F --> G["Revenue and margin impact"]
${STYLES}
  class A,G strong
  class B,C,D base
  class E,F accent`,
    "revenue-cycle-denial-rate": `flowchart TB
  A["Submitted claims"] --> B["Denied claims"]
  B --> C["Denial rate"]
  C --> D["Root cause by payer / code / site"]
  D --> E["Front-end and coding fixes"]
  E --> F["Collections improvement"]
  F --> G["Cash and EBITDA impact"]
${STYLES}
  class A,G strong
  class B,C,D base
  class E,F accent`,
    "employee-turnover": `flowchart TB
  A["Average headcount"] --> B["Departures"]
  B --> C["Turnover rate"]
  C --> D["Role / manager / site variance"]
  D --> E["Retention and hiring actions"]
  E --> F["Productivity and replacement cost"]
  F --> G["EBITDA stability"]
${STYLES}
  class A,G strong
  class B,C,D base
  class E,F accent`,
  };

  const chart = charts[item.slug];
  if (!chart) return [];

  return [
    {
      title: `${item.title} value path`,
      description: "A metric-specific view of how the KPI is calculated, diagnosed, and connected to operating value.",
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
