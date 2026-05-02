# 9 KPI Curated Articles Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate 9 new JSON files in `content/curated-articles/` for specific KPIs with senior operating partner tone and exactly 5 sections per file.

**Architecture:** Each file will follow a consistent "Operational Lever" structure (Strategic Value, Drivers, Quality/Pitfalls, EBITDA Impact, Exit Readiness).

**Tech Stack:** JSON

---

### Task 1: Create `expansion-revenue.json`

**Files:**
- Create: `content/curated-articles/expansion-revenue.json`

- [ ] **Step 1: Write the content**

```json
{
  "id": "expansion-revenue",
  "articleSections": [
    {
      "title": "The Net Retention Engine",
      "body": [
        "Expansion Revenue is the highest-margin growth lever in a subscription business. It represents the ability to grow the top line without the heavy Customer Acquisition Cost (CAC) associated with new logos. In a PE context, high expansion rates demonstrate 'Product-Market Fit at Scale'.",
        "A business that can consistently upsell and cross-sell to its existing base creates a 'Negative Churn' environment. This significantly de-risks the investment thesis by providing a built-in growth engine that operates independently of broader market headwinds."
      ],
      "callout": "Expansion revenue is 'Free Growth' that directly expands the LTV/CAC ratio."
    },
    {
      "title": "Operational Drivers: Upsell vs. Cross-sell",
      "body": [
        "Effective expansion requires a distinct strategy for upsells (more of the same product) versus cross-sells (new product modules). Operators should look for 'Seat Expansion' tied to customer success and 'Feature Adoption' as lead indicators.",
        "Sales and Customer Success (CS) teams must be aligned on compensation structures that reward net retention. If CS is only measured on renewal, they will miss the signals for expansion; if Sales is only measured on new logos, they will neglect the 'Gold Mine' in the installed base."
      ]
    },
    {
      "title": "Quality of Expansion: The 'Forced' Growth Trap",
      "body": [
        "Operating partners must scrutinize the 'Quality' of expansion revenue. Temporary price hikes or 'One-Time' professional services masquerading as recurring expansion will be flagged during sell-side diligence.",
        "Sustainable expansion is rooted in increased product utility. If expansion is driven solely by contractual annual escalators without corresponding value delivery, the business risks a 'Retention Cliff' when those contracts come up for renewal."
      ]
    },
    {
      "title": "Revenue Operations (RevOps) Rigor",
      "body": [
        "Capturing expansion requires robust data on product usage and white-space analysis. The RevOps function must provide Sales with 'Propensity to Buy' scores based on actual customer engagement metrics.",
        "Without a unified view of the customer, expansion attempts feel like 'Random Acts of Sales'. A disciplined RevOps cadence ensures that expansion motions are targeted, timely, and data-driven."
      ]
    },
    {
      "title": "The Multiple Expander",
      "body": [
        "Public and private markets accord a significant premium to businesses with strong expansion profiles. A company growing 20% with 115% NRR is valued much higher than one growing 20% with 90% NRR due to the underlying efficiency of the growth.",
        "During exit preparation, the expansion bridge should be presented as the primary evidence of 'Scalability'. A proven expansion playbook allows the next buyer to underwrite a more aggressive growth forecast with lower risk."
      ]
    }
  ]
}
```

- [ ] **Step 2: Commit**

```bash
git add content/curated-articles/expansion-revenue.json
git commit -m "feat: add expansion-revenue curated article"
```

---

### Task 2: Create `gross-margin.json`

**Files:**
- Create: `content/curated-articles/gross-margin.json`

- [ ] **Step 1: Write the content**

```json
{
  "id": "gross-margin",
  "articleSections": [
    {
      "title": "The Unit Economics Floor",
      "body": [
        "Gross Margin is the ultimate filter for business model viability. It defines the 'Contribution Room' available to fund R&D, Sales, and eventually, EBITDA. In Private Equity, gross margin discipline is the first line of defense against inflationary pressures.",
        "A declining gross margin is often the 'Canary in the Coal Mine' for commoditization or operational inefficiency. High-quality platforms maintain stable or expanding margins even as they scale, indicating strong pricing power and structural advantages."
      ],
      "callout": "Gross Margin is the 'Profitability Ceiling'—you cannot cost-cut your way to greatness from a weak margin base."
    },
    {
      "title": "Operational Levers: Pricing and Mix",
      "body": [
        "Improving gross margin requires a surgical focus on 'Customer and Product Mix'. Operators must identify low-margin 'Tail' customers or products that consume disproportionate resources and either re-price them or exit them.",
        "Pricing optimization is often the fastest lever for margin expansion. By shifting the sales motion toward high-margin 'Value-Added' services and away from low-margin 'Commodity' offerings, a firm can significantly improve its contribution profile without increasing headcount."
      ]
    },
    {
      "title": "COGS vs. OpEx: The Integrity Check",
      "body": [
        "Management teams often 'Hide' direct costs in OpEx to artificially inflate Gross Margin. Common areas of leakage include customer support, implementation teams, and cloud hosting costs being misclassified as G&A.",
        "During diligence, 'Quality of Earnings' providers will re-classify these costs. It is critical to establish a clean 'Standard Costing' model early in the hold period to ensure that reporting reflects the true unit economics of the business."
      ]
    },
    {
      "title": "Scalability and Operating Leverage",
      "body": [
        "The goal of any PE-backed platform is to achieve 'Negative Cost Scaling'—where revenue grows faster than the cost of goods sold. This is achieved through automation, procurement scale, and process optimization.",
        "As a company grows, its gross margin should ideally trend upward as fixed costs within COGS are spread over a larger revenue base. If margins are flat or declining during high growth, it indicates a 'Manual' business model that will struggle to deliver promised exit multiples."
      ]
    },
    {
      "title": "The 'Quality of Growth' Filter",
      "body": [
        "The next buyer will look at Gross Margin as a proxy for 'Competitive Moat'. High margins suggest that customers value the product enough to pay a premium over its cost of production.",
        "Exit readiness involves 'Scrubbing' the margin profile to show a sustainable, high-quality floor. A business with a clean 70%+ gross margin profile is a far more attractive acquisition target than one with 50% margins and 'Promise' of future efficiency."
      ]
    }
  ]
}
```

- [ ] **Step 2: Commit**

```bash
git add content/curated-articles/gross-margin.json
git commit -m "feat: add gross-margin curated article"
```

---

### Task 3: Create `grr.json`

**Files:**
- Create: `content/curated-articles/grr.json`

- [ ] **Step 1: Write the content**

```json
{
  "id": "grr",
  "articleSections": [
    {
      "title": "The Baseline of Sustainability",
      "body": [
        "Gross Revenue Retention (GRR) measures the ability to retain the existing revenue base, excluding expansion. It is the most conservative and honest view of 'Customer Satisfaction' and 'Product Stickiness'.",
        "While NRR can hide churn with aggressive expansion, GRR has a hard ceiling of 100%. In a PE context, GRR is the 'Safety Valve'; if it falls below 85-90% for enterprise software, the business model is likely broken, regardless of how fast new logos are being added."
      ],
      "callout": "GRR is the 'Floor' of your valuation; expansion is the 'Ceiling'."
    },
    {
      "title": "Operational Drivers: The Churn Prevention Desk",
      "body": [
        "Managing GRR requires a proactive 'Early Warning System'. CS teams must track 'Leading Indicators' of churn, such as declining seat usage, lack of executive engagement, or unresolved support tickets.",
        "A disciplined renewal process starts 180 days before contract expiration. Waiting until the 'Renewal Month' to engage is a recipe for churn. High-performing operators institutionalize a 'Red Account' process to swarm at-risk customers with resources before the notice period."
      ]
    },
    {
      "title": "The 'Commodity' Risk and Switching Costs",
      "body": [
        "Low GRR often indicates low 'Switching Costs'. If a product is easily replaced by a cheaper alternative, the business lacks a 'Moat'. Operators must focus on 'Workflow Integration'—making the product part of the customer's daily operational fabric.",
        "If GRR is declining, the first place to look is 'Competitive Displacement'. Are customers leaving for a specific competitor, or are they 'Sunsetting' the category entirely? Understanding the 'Why' behind the 'Where' is critical for the 100-day plan."
      ]
    },
    {
      "title": "Quality of Earnings: The Churn Ledger",
      "body": [
        "Lenders and PE buyers look for 'Concentration Risk' within the GRR base. If a few large logos represent a significant portion of the revenue, their churn could trigger debt covenant breaches.",
        "It is essential to maintain a granular churn ledger that categorizes losses by 'Reason Code'. This data is the primary evidence used during exit to prove that churn is 'Controllable' or 'Cyclical' rather than 'Structural'."
      ]
    },
    {
      "title": "Positioning for the Exit",
      "body": [
        "A stable, high GRR (95%+) allows the next buyer to underwrite the 'Terminal Value' of the business with confidence. It proves that the customer base is a 'Durable Asset' rather than a 'Transitory Audience'.",
        "During the exit process, management should showcase 'Logo Longevity'—the average age of the customer relationship. A business with high GRR and long tenure is a 'Cash Cow' that warrants a premium multiple."
      ]
    }
  ]
}
```

- [ ] **Step 2: Commit**

```bash
git add content/curated-articles/grr.json
git commit -m "feat: add grr curated article"
```

---

### Task 4: Create `lead-conversion-rate.json`

**Files:**
- Create: `content/curated-articles/lead-conversion-rate.json`

- [ ] **Step 1: Write the content**

```json
{
  "id": "lead-conversion-rate",
  "articleSections": [
    {
      "title": "Marketing Efficiency and ROI",
      "body": [
        "Lead Conversion Rate is the primary metric for 'Sales and Marketing Alignment'. It measures the efficiency of the top-of-funnel spend and the effectiveness of the sales follow-up process.",
        "In a Private Equity context, improving conversion rates is a 'Zero-Cost' growth lever. Doubling the conversion rate has the same impact as doubling the marketing budget, but without the corresponding increase in OpEx. It is the definition of 'Operational Leverage'."
      ],
      "callout": "Lead conversion is the 'Transmission' of the growth engine—if it's slipping, you're burning fuel for nothing."
    },
    {
      "title": "Operational Drivers: MQL to SQL Transition",
      "body": [
        "The most frequent point of failure is the 'Hand-off' between Marketing and Sales. Establishing clear definitions for Marketing Qualified Leads (MQL) and Sales Qualified Leads (SQL) is the first step in driving conversion.",
        "Speed-to-lead is a critical driver. Research consistently shows that responding to a lead within 5 minutes increases conversion rates by orders of magnitude. Operators should implement automated routing and 'SLA' (Service Level Agreement) tracking for sales follow-up."
      ]
    },
    {
      "title": "Funnel Leakage and 'Dead' Lead Management",
      "body": [
        "Most conversion leakage happens mid-funnel. Leads that go 'Dark' after an initial demo represent a massive wasted investment. A disciplined 'Nurture' program is required to keep these prospects engaged until they are ready to buy.",
        "Operators must conduct regular 'Lost Lead' post-mortems. Is the sales team 'Cherry-picking' the easy wins and ignoring the rest? A clean CRM with enforced 'Next Step' fields is the only way to prevent leads from falling through the cracks."
      ]
    },
    {
      "title": "Impact on CAC and EBITDA",
      "body": [
        "Conversion rates directly dictate the 'Customer Acquisition Cost' (CAC). A 10% improvement in conversion can lead to a 10% reduction in CAC, directly dropping to the bottom line as EBITDA.",
        "When modeling value creation, the 'Conversion Lever' is often the most sensitive. Small improvements at the top of the funnel compound as they move toward the close, creating significant enterprise value."
      ]
    },
    {
      "title": "Diligence and Exit Readiness",
      "body": [
        "The next buyer will look for a 'Predictable' lead-to-revenue machine. If conversion rates are volatile or untracked, the buyer will discount the growth forecast due to 'Execution Risk'.",
        "A proven, high-conversion funnel is evidence of a 'Scalable Sales Motion'. It shows that the business can effectively 'Digest' more marketing spend, making it an attractive platform for a strategic or larger financial buyer."
      ]
    }
  ]
}
```

- [ ] **Step 2: Commit**

```bash
git add content/curated-articles/lead-conversion-rate.json
git commit -m "feat: add lead-conversion-rate curated article"
```

---

### Task 5: Create `logo-retention.json`

**Files:**
- Create: `content/curated-articles/logo-retention.json`

- [ ] **Step 1: Write the content**

```json
{
  "id": "logo-retention",
  "articleSections": [
    {
      "title": "The 'Brand Loyalty' Proxy",
      "body": [
        "Logo Retention measures the percentage of unique customers retained over a period. While GRR measures dollars, Logo Retention measures 'Relationships'. It is a key indicator of product-market fit and customer success.",
        "In Private Equity, high logo retention among 'Ideal Customer Profiles' (ICP) is a sign of a high-quality franchise. Even if some revenue is lost (contraction), retaining the logo preserves the 'Option Value' for future expansion when the customer's budget recovers."
      ],
      "callout": "Retaining a logo is 5x cheaper than winning a new one."
    },
    {
      "title": "Operational Drivers: Onboarding and Adoption",
      "body": [
        "Logo retention is won or lost in the first 90 days. A 'Frictionless Onboarding' process is the single biggest driver of long-term retention. If a customer doesn't see 'Value' quickly, the logo is at risk from day one.",
        "Operators should monitor 'Product Adoption' metrics at the logo level. Are they using the core features? Is there 'Breadth' of usage across the organization? CS teams should be alerted whenever a logo's 'Health Score' dips below a defined threshold."
      ]
    },
    {
      "title": "SMB vs. Enterprise: The Retention Delta",
      "body": [
        "Logo retention benchmarks vary wildly by segment. SMB retention is naturally lower due to business failure rates, while Enterprise retention should be near 95%+. Operators must segment their retention data to avoid 'Blended Metric' confusion.",
        "A declining logo retention in the 'Core' enterprise segment is an existential threat. It suggests a 'Competitive Vulnerability' that must be addressed through product roadmap adjustments or defensive pricing strategies."
      ]
    },
    {
      "title": "The 'Quality of Customer' Filter",
      "body": [
        "Not all logos are worth keeping. 'Toxic' customers who demand excessive support and yield low margins should be allowed to churn. High logo retention at the expense of profitability is a 'Vanity Metric'.",
        "During the hold period, operators should 'Prune' the logo base to focus on high-LTV, low-maintenance segments. This improves the 'Quality of Growth' and makes the business easier to manage and scale."
      ]
    },
    {
      "title": "Exit Positioning: The 'Annuity' Story",
      "body": [
        "A high logo retention rate is the primary evidence for an 'Annuity-Like' revenue stream. It proves that the customer base is 'Captive' and that the cost of displacement is high.",
        "The next buyer will look for 'Logo Cohort' analysis. Showing that logos acquired 5 years ago are still active and growing is the single most powerful slide in the exit deck. It proves 'Endurance' and 'LTV' (Lifetime Value)."
      ]
    }
  ]
}
```

- [ ] **Step 2: Commit**

```bash
git add content/curated-articles/logo-retention.json
git commit -m "feat: add logo-retention curated article"
```

---

### Task 6: Create `maverick-spend.json`

**Files:**
- Create: `content/curated-articles/maverick-spend.json`

- [ ] **Step 1: Write the content**

```json
{
  "id": "maverick-spend",
  "articleSections": [
    {
      "title": "The Hidden Margin Leech",
      "body": [
        "Maverick Spend occurs when employees purchase goods or services outside of established procurement contracts or processes. It is a direct erosion of 'Negotiated Savings' and a major source of EBITDA leakage.",
        "In a Private Equity context, tackling maverick spend is often the 'Lowest Hanging Fruit' for margin expansion. If a firm has negotiated a 20% discount with a preferred vendor but 40% of the spend is still going to non-preferred providers, the 'Value Creation' is being left on the table."
      ],
      "callout": "Maverick spend is the 'Invisible Tax' on your procurement strategy."
    },
    {
      "title": "Operational Drivers: P2P Discipline",
      "body": [
        "Reducing maverick spend requires a disciplined 'Procure-to-Pay' (P2P) process. Implementing a centralized purchasing system with 'Guided Buying' ensures that employees are directed toward preferred vendors at the point of purchase.",
        "Strict 'No PO, No Pay' policies are the ultimate enforcement mechanism. If the Finance department refuses to pay invoices that lack an approved Purchase Order, the organization will quickly adapt to the procurement standards."
      ]
    },
    {
      "title": "The Visibility Gap: Data and Auditing",
      "body": [
        "You cannot manage what you cannot see. Maverick spend often hides in 'T&E' (Travel and Expense) reports or 'PCard' transactions. Regular 'Spend Cube' analysis is required to identify categories where leakage is highest.",
        "Operating partners should look for 'Fragmented Spend'—where a company is using dozens of vendors for the same commodity (e.g., office supplies, janitorial services). Consolidating this spend under a single contract is the first step in capturing the 'Procurement Multiple'."
      ]
    },
    {
      "title": "EBITDA Impact and the 'Procurement Multiple'",
      "body": [
        "Every dollar saved in maverick spend is a dollar of pure EBITDA. At a 10x exit multiple, a $1M reduction in maverick spend creates $10M in enterprise value.",
        "Procurement savings are particularly attractive because they are 'Structural'. Unlike a sales campaign, once a category is consolidated and the process is enforced, the savings recur every year without additional effort."
      ]
    },
    {
      "title": "Exit Readiness and Compliance",
      "body": [
        "The next buyer will value a 'Disciplined' procurement function. It suggests a high level of 'Operational Control' and reduces the risk of 'Budget Surprises'.",
        "During exit preparation, management should showcase the 'Compliance Rate'—the percentage of spend that is 'Under Contract'. A high compliance rate proves that the margin expansion achieved during the hold period is sustainable and not a 'One-Time' event."
      ]
    }
  ]
}
```

- [ ] **Step 2: Commit**

```bash
git add content/curated-articles/maverick-spend.json
git commit -m "feat: add maverick-spend curated article"
```

---

### Task 7: Create `mrr.json`

**Files:**
- Create: `content/curated-articles/mrr.json`

- [ ] **Step 1: Write the content**

```json
{
  "id": "mrr",
  "articleSections": [
    {
      "title": "The Operational Pulse",
      "body": [
        "Monthly Recurring Revenue (MRR) is the 'Operational Pulse' of a subscription business. While ARR provides the long-term view, MRR captures the month-over-month momentum and provides immediate feedback on sales and retention performance.",
        "In Private Equity, MRR is the primary metric for 'Operating Cadence'. It allows for tight monthly monitoring of the business and quick course corrections if the 'MRR Bridge' begins to show signs of weakness."
      ],
      "callout": "MRR is the 'Real-Time' barometer of your value creation plan."
    },
    {
      "title": "The MRR Bridge: New, Expansion, Churn",
      "body": [
        "The 'Net MRR' calculation is the heart of the monthly reporting package. Net MRR = (New MRR + Expansion MRR) - (Churn MRR + Contraction MRR).",
        "Operators must focus on the 'Growth Mix'. If Net MRR is positive but is driven entirely by New MRR while Churn MRR is also high, the business has a 'Leaky Bucket' problem that will eventually cap its scale and valuation."
      ]
    },
    {
      "title": "Quality of MRR: Revenue Recognition",
      "body": [
        "Not all monthly revenue is MRR. 'One-time' setup fees, consulting projects, or hardware sales should be excluded to ensure a clean view of the recurring base. 'Quality of Earnings' issues often arise from 'Aggressive MRR' reporting.",
        "Operating partners must enforce strict 'Revenue Recognition' policies. If a company includes 'Committed' but not yet 'Live' revenue in its MRR, it creates a 'Bubble' that will burst during exit diligence."
      ]
    },
    {
      "title": "Cash Flow and Liquidity Management",
      "body": [
        "MRR is the primary driver of 'Cash Flow Predictability'. In a levered environment, knowing exactly how much cash will hit the bank every month is critical for debt service and liquidity management.",
        "Operators should track the 'MRR-to-Cash' conversion cycle. If there is a lag between 'Billing MRR' and 'Collected Cash', it indicates a working capital issue that could stress the business under heavy interest loads."
      ]
    },
    {
      "title": "Exit Readiness: The Monthly Momentum",
      "body": [
        "The next buyer will look for 'Consistency' in the MRR trend line. A 'Sawtooth' pattern (up one month, down the next) suggests a lack of control and increases the 'Execution Risk' discount.",
        "A clean, growing MRR ledger is the foundation of the 'LTM' (Last Twelve Months) revenue figure used to set the exit price. Every dollar of MRR added in the months leading up to the exit is magnified by the exit multiple."
      ]
    }
  ]
}
```

- [ ] **Step 2: Commit**

```bash
git add content/curated-articles/mrr.json
git commit -m "feat: add mrr curated article"
```

---

### Task 8: Create `on-time-delivery.json`

**Files:**
- Create: `content/curated-articles/on-time-delivery.json`

- [ ] **Step 1: Write the content**

```json
{
  "id": "on-time-delivery",
  "articleSections": [
    {
      "title": "The Service-Level Foundation",
      "body": [
        "On-Time Delivery (OTD) is the primary measure of 'Operational Reliability'. In manufacturing and distribution, OTD is the 'Table Stakes' for customer retention and pricing power.",
        "In a PE context, OTD is a key indicator of 'Supply Chain Health'. Poor OTD is often a symptom of underlying issues in production planning, inventory management, or logistics. Improving OTD is frequently the first step in a 'Turnaround' or 'Operational Improvement' thesis."
      ],
      "callout": "OTD is the 'Reliability Metric' that protects your Gross Margin."
    },
    {
      "title": "Operational Drivers: The S&OP Process",
      "body": [
        "Driving OTD requires a robust 'Sales and Operations Planning' (S&OP) process. This ensures that production capacity and raw material supply are aligned with the sales forecast.",
        "Operators should implement 'Visual Management' on the shop floor to track OTD in real-time. 'Root Cause Analysis' must be performed for every missed delivery. Is the delay due to a 'Bottleneck' in production, a 'Supplier Failure', or 'Unrealistic Sales Promises'?"
      ]
    },
    {
      "title": "The 'Hidden' Cost of Poor OTD",
      "body": [
        "Poor OTD leads to 'Expedited Shipping' costs, 'Customer Penalties', and 'Inventory Bloat' as the company tries to 'Buffer' against uncertainty. These costs directly erode EBITDA.",
        "Furthermore, poor OTD damages 'Customer Trust', leading to 'Price Erosion' as the company is forced to offer discounts to compensate for unreliability. High OTD allows a company to charge a 'Premium' for being the 'Safest Choice' in the market."
      ]
    },
    {
      "title": "Working Capital and Inventory Velocity",
      "body": [
        "There is a direct link between OTD and 'Inventory Turns'. A reliable production process allows for 'Lean' inventory levels, freeing up cash for debt repayment or further investment.",
        "Improving OTD by just 5% can often unlock millions in working capital by reducing the need for 'Safety Stock'. This 'Cash Release' is a primary goal of any PE-backed industrial improvement plan."
      ]
    },
    {
      "title": "Exit Readiness: The 'Franchise' Quality",
      "body": [
        "Strategic buyers value 'Operational Excellence'. A company with a consistent 98%+ OTD record is seen as a 'High-Quality Asset' that is easy to integrate and scale.",
        "During exit, OTD should be presented as part of the 'Operational Moat'. It proves that the company has 'Process Maturity' and is not dependent on the 'Heroic Efforts' of a few individuals to get product out the door."
      ]
    }
  ]
}
```

- [ ] **Step 2: Commit**

```bash
git add content/curated-articles/on-time-delivery.json
git commit -m "feat: add on-time-delivery curated article"
```

---

### Task 9: Create `plant-oee.json`

**Files:**
- Create: `content/curated-articles/plant-oee.json`

- [ ] **Step 1: Write the content**

```json
{
  "id": "plant-oee",
  "articleSections": [
    {
      "title": "The Gold Standard of Productivity",
      "body": [
        "Overall Equipment Effectiveness (OEE) is the 'Gold Standard' for measuring manufacturing productivity. It combines Availability, Performance, and Quality into a single metric that reveals the 'Hidden Factory' of lost capacity.",
        "In Private Equity, OEE is the primary tool for 'Capacity Expansion' without capital expenditure. Improving OEE from 60% to 80% is equivalent to adding a new production line for 'Free'. It is the ultimate lever for 'Asset Productivity'."
      ],
      "callout": "OEE is the 'Efficiency Lens' that identifies where your capital is being wasted."
    },
    {
      "title": "The Three Pillars: Availability, Performance, Quality",
      "body": [
        "Availability tracks 'Downtime' (planned and unplanned). Performance tracks 'Speed' relative to the 'Ideal Cycle Time'. Quality tracks 'Yield' (good units vs. total units).",
        "Operators must decompose OEE to find the 'Constraint'. If Availability is high but Performance is low, the issue is likely 'Micro-stoppages' or 'Operator Skill'. If Quality is the issue, the focus must shift to 'Maintenance' and 'Process Control'."
      ]
    },
    {
      "title": "Operational Drivers: Total Productive Maintenance (TPM)",
      "body": [
        "Driving OEE requires a shift from 'Reactive' to 'Proactive' maintenance. TPM empowers operators to perform basic maintenance and identifies potential failures before they cause downtime.",
        "Implementing 'SMED' (Single-Minute Exchange of Die) techniques to reduce 'Changeover Time' is a major OEE driver. Reducing a 2-hour changeover to 20 minutes directly increases 'Availability' and allows for more flexible production."
      ]
    },
    {
      "title": "Impact on Unit Cost and EBITDA",
      "body": [
        "Higher OEE leads to lower 'Unit Costs' as fixed overhead is spread over more good units. This 'Absorption' effect is a powerful driver of margin expansion.",
        "A 10% improvement in OEE can often lead to a 20-30% increase in EBITDA for high-fixed-cost businesses. It is one of the most 'Value-Dense' improvements an operating partner can drive."
      ]
    },
    {
      "title": "Exit Readiness: The 'Hidden Capacity' Story",
      "body": [
        "The next buyer will look at OEE as a measure of 'Future Growth Potential'. If a plant is running at 60% OEE, there is significant 'Upside' available to the buyer without needing to build a new factory.",
        "Management should showcase the 'OEE Improvement Trend' as evidence of a 'Culture of Continuous Improvement'. A business that can demonstrate 'Scientific' productivity gains is valued significantly higher than one that relies on 'Intuition'."
      ]
    }
  ]
}
```

- [ ] **Step 2: Commit**

```bash
git add content/curated-articles/plant-oee.json
git commit -m "feat: add plant-oee curated article"
```

---

### Task 10: Final Verification

- [ ] **Step 1: Validate JSON structure**

Run: `find content/curated-articles/ -name "*.json" -exec jq . {} + > /dev/null`
Expected: No errors.

- [ ] **Step 2: Verify section counts**

Run: `grep -c "title" content/curated-articles/*.json` (and manually check the 9 new ones)
Expected: Each of the 9 new files has exactly 5 sections.

- [ ] **Step 3: Tone and "id" check**

Manually verify each file's `id` field matches its filename and the tone is senior operating partner level.
