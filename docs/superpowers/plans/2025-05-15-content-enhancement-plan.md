# Content Enhancement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update three JSON files with 5 sections each, no citations, and an expert tone.

**Architecture:** Data-driven content update to existing JSON files.

**Tech Stack:** JSON, Markdown.

---

### Task 1: Update `working-capital-improvement.json`

**Files:**
- Modify: `content/curated-articles/working-capital-improvement.json`

- [ ] **Step 1: Write updated content to file**

```json
{
  "id": "working-capital-improvement",
  "articleSections": [
    {
      "title": "The Hidden Bank Account: Cash Conversion Cycle",
      "body": [
        "Working capital is the primary internal lever for deleveraging. Every dollar released from the balance sheet is a dollar that directly pays down debt, effectively increasing equity value without requiring EBITDA growth. The objective is to aggressively compress the Cash Conversion Cycle (CCC).",
        "The CCC is not just an accounting metric; it is a measure of operational velocity. By reducing the time between paying for inputs and receiving payment for outputs, an operator can turn a portfolio company into a self-funding growth machine."
      ],
      "callout": "Working capital optimization is not an accounting exercise; it is an operational discipline."
    },
    {
      "title": "DSO & DPO: Managing the Float",
      "body": [
        "Days Sales Outstanding (DSO) is often bloated by legacy 'relationship' terms that favor the customer over the shareholder. Tightening credit policies, automating collections, and enforcing strict payment terms are non-negotiable first steps. Driving DSO down by even 5-10 days can release millions in liquidity.",
        "Conversely, Days Payable Outstanding (DPO) must be maximized. Professionalizing the accounts payable function involves negotiating extended terms with vendors and synchronizing outgoing payments with incoming receipts to optimize the float."
      ]
    },
    {
      "title": "Inventory Discipline and Demand Intelligence",
      "body": [
        "Inventory is where cash goes to die. SKU rationalization is the first line of defense—eliminating the 'long tail' of slow-moving products that consume warehouse space and capital. Most companies find that the bottom 20% of their catalog generates less than 5% of their margin.",
        "Modern operators replace 'gut feel' ordering with demand-driven supply chains. Utilizing predictive analytics to optimize safety stock levels ensures that the company maintains service levels while minimizing the capital trapped in the warehouse."
      ]
    },
    {
      "title": "Procurement and Spend Centralization",
      "body": [
        "Fragmented procurement is a hallmark of underdeveloped mid-market companies. Centralizing spend allows for the standardization of payment terms and the negotiation of volume-based discounts. A unified procurement strategy forces vendors to compete for the business on terms that favor the portfolio company's cash position.",
        "Implementing a 'No PO, No Pay' policy ensures that all spend is authorized and captured, providing the visibility needed to identify further consolidation opportunities and drive additional working capital improvements."
      ]
    },
    {
      "title": "Building a Cash-Centric Culture",
      "body": [
        "Transforming working capital requires a cultural shift where cash is treated as a scarce resource. This starts with a weekly cash cadence—a rigorous review of aging receivables, upcoming payables, and inventory turns led by the CFO and the Operating Partner.",
        "Incentive structures must be aligned. Management bonuses should be tied to cash flow metrics, not just EBITDA. When the sales team and operations managers have 'skin in the game' regarding working capital, the organization naturally pivots toward efficiency."
      ]
    }
  ]
}
```

- [ ] **Step 2: Commit**

```bash
git add content/curated-articles/working-capital-improvement.json
git commit -m "content: enhance working capital improvement article"
```

### Task 2: Update `sales-productivity-improvement.json`

**Files:**
- Modify: `content/curated-articles/sales-productivity-improvement.json`

- [ ] **Step 1: Write updated content to file**

```json
{
  "id": "sales-productivity-improvement",
  "articleSections": [
    {
      "title": "The Repeatable Revenue Machine",
      "body": [
        "Sales productivity is the difference between a 'Hero Culture' and a 'Repeatable Machine'. Most mid-market companies rely on a few star performers while the rest of the team underdelivers. Professionalizing the sales force starts with a rigorous activity audit to identify where the funnel is leaking.",
        "By identifying the core behaviors of the top 20% and codifying them into a standard process, an operator can 'level up' the middle 60%. The goal is to move the entire distribution curve toward higher productivity, reducing reliance on individual brilliance."
      ],
      "callout": "Sales is a process-driven machine, not a relationship-driven mystery."
    },
    {
      "title": "Commission Alignment and Territory Mastery",
      "body": [
        "Incentives drive behavior. If commissions are paid on top-line revenue, sales reps will discount aggressively to close deals. Commission structures must be realigned to Gross Margin or EBITDA to ensure that the sales team is focused on high-value, profitable growth.",
        "Territory planning must be data-driven. High-potential accounts should be assigned based on capacity and expertise, not legacy relationships. Modernizing territory management ensures that reps are spending their time hunting in the most fertile ground rather than 'camping' on low-margin accounts."
      ]
    },
    {
      "title": "Tech-Enabled Forecasting and CRM Rigor",
      "body": [
        "A CRM is not a database; it is a forecasting engine and a capital allocation tool. Implementing 'Stage Gates' with clearly defined exit criteria ensures that the pipeline is clean and that probabilities are based on objective evidence rather than rep optimism.",
        "With high-fidelity data, the Operating Partner can accurately predict revenue quarters in advance. This visibility allows for proactive decisions on hiring, capacity planning, and capital investment, turning the sales function into a predictable driver of valuation."
      ]
    },
    {
      "title": "The Sales Playbook: Hard-Coding Success",
      "body": [
        "Standardization is the enemy of variance. A comprehensive Sales Playbook should codify the entire lifecycle: from lead qualification and discovery questions to objection handling and pricing floors. Every rep should be running the same high-probability play.",
        "A well-defined playbook reduces ramp time for new hires and ensures a consistent customer experience. It also provides a benchmark for performance management, making it easy to identify exactly where a rep is struggling and provide targeted coaching."
      ]
    },
    {
      "title": "Performance Pipelining and Talent Upgrading",
      "body": [
        "The best sales organizations are 'Always Recruiting'. Creating a continuous pipeline of talent allows the company to move quickly on underperformers and maintain a high standard for the team. High turnover in sales isn't always a problem—if it's the right people leaving.",
        "Structured onboarding is critical. A new rep should be able to reach full productivity in half the industry-standard time through intensive training and mentorship. Continuous talent management ensures that the sales force remains the company's most competitive asset."
      ]
    }
  ]
}
```

- [ ] **Step 2: Commit**

```bash
git add content/curated-articles/sales-productivity-improvement.json
git commit -m "content: enhance sales productivity improvement article"
```

### Task 3: Update `customer-retention-churn-reduction.json`

**Files:**
- Modify: `content/curated-articles/customer-retention-churn-reduction.json`

- [ ] **Step 1: Write updated content to file**

```json
{
  "id": "customer-retention-churn-reduction",
  "articleSections": [
    {
      "title": "Churn: The Valuation Killer",
      "body": [
        "In recurring revenue models, churn is the single most destructive force to exit multiples. A 1% improvement in retention can lead to a 10-20% increase in enterprise value over the holding period. It is significantly more efficient to preserve existing revenue than to acquire new customers at a high CAC.",
        "Rigorous cohort analysis is mandatory. Operators must identify the 'Critical Churn Window'—the specific point in the customer lifecycle where churn is most likely to occur. Understanding the 'why' behind the 'when' allows for surgical interventions that stabilize the revenue base."
      ],
      "callout": "Retention is the foundation of growth. You cannot build a skyscraper on quicksand."
    },
    {
      "title": "Proactive Health Scoring and Algorithmic Intervention",
      "body": [
        "Waiting for a cancelation notice is a failure of management. Proactive retention requires a 'Customer Health Score' built from real-time data: product usage frequency, support ticket volume, and executive engagement levels.",
        "When a health score dips below the threshold, it must trigger an automated 'Red Flag' workflow. Customer Success Managers (CSMs) should be deployed with specific playbooks to address the underlying issue, whether it's a technical bottleneck or a lack of perceived value, before the customer even considers leaving."
      ]
    },
    {
      "title": "Structural Stickiness and Switching Costs",
      "body": [
        "The most resilient businesses have high switching costs baked into the product. This 'stickiness' is achieved by integrating the software into the customer's core daily workflows and becoming the 'system of record' through deep API connections and essential data storage.",
        "Structural retention is also reinforced through contract management. Transitioning customers to multi-year agreements and implementing automatic renewal clauses changes the default behavior from 're-evaluate' to 'retain', providing the stability needed for long-term planning."
      ]
    },
    {
      "title": "Pricing, Packaging, and Lock-In",
      "body": [
        "Pricing is a powerful retention lever. By bundling essential features and offering tiered pricing based on usage or value, an operator can create 'golden handcuffs' that make it economically irrational for a customer to leave.",
        "Volume commitments and multi-product discounts further incentivize long-term loyalty. When a customer is deeply invested in a suite of integrated products, the friction of moving to a competitor becomes a significant barrier, effectively neutralizing the threat of churn."
      ]
    },
    {
      "title": "Closing the Loop: The Feedback Flywheel",
      "body": [
        "Churn reduction is a cross-functional effort. Customer success must be tightly coupled with product engineering. A formalized feedback loop ensures that the 'voice of the customer' directly informs the product roadmap, prioritizing features that solve retention-critical issues.",
        "Implementing Customer Advisory Boards and systematic NPS surveys provides the qualitative data needed to supplement the health scores. When customers feel their needs are being met through continuous product evolution, they become advocates rather than attrition risks."
      ]
    }
  ]
}
```

- [ ] **Step 2: Commit**

```bash
git add content/curated-articles/customer-retention-churn-reduction.json
git commit -m "content: enhance customer retention and churn reduction article"
```
