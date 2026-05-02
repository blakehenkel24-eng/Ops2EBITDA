# Curated Articles Update Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update four key financial metric articles in `content/curated-articles/` to increase volume to 5 sections, remove citations, and adopt a punchy, expert tone.

**Architecture:** Data-only update to existing JSON content files.

**Tech Stack:** JSON, write_file tool.

---

### Task 1: Update ARR Article

**Files:**
- Modify: `content/curated-articles/arr.json`

- [ ] **Step 1: Update `content/curated-articles/arr.json`**

```json
{
  "id": "arr",
  "articleSections": [
    {
      "title": "The Foundation of Predictability",
      "body": [
        "Annual Recurring Revenue (ARR) is the baseline for underwriting any subscription business. It provides the visibility required to support levered capital structures and long-term investment horizons. ARR isn't just revenue; it's the predictable floor from which all growth is measured.",
        "In a Private Equity context, ARR serves as the primary metric for debt capacity. A stable ARR base allows a firm to carry higher leverage safely, as the recurring nature of the contracts ensures that interest obligations can be met even in volatile markets."
      ],
      "callout": "ARR is the 'Predictable Foundation' of the modern software platform."
    },
    {
      "title": "The ARR Bridge: Operational Mechanics",
      "body": [
        "The ARR Bridge is the core reporting mechanism for portfolio monitoring. It decomposes growth into four distinct levers: New Logos, Expansion (Upsell/Cross-sell), Contraction (Downsell), and Churn.",
        "A healthy bridge shows growth coming from both new customer acquisition and significant expansion within the existing base. If growth relies solely on new logos while expansion is flat, it indicates a 'Leaky Bucket' that will eventually erode the exit multiple."
      ]
    },
    {
      "title": "ARR-to-Cash Reconciliation",
      "body": [
        "There is often a significant delta between reported ARR and actual cash collections. This 'Operational Leakage' usually stems from implementation lags, aggressive payment terms, or poor billing discipline.",
        "Operators must maintain a clean ARR-to-Cash reconciliation. If a company reports high ARR but fails to convert it into liquid cash within 30-60 days, the 'Quality of Earnings' is suspect, and the business risks a liquidity crunch under LBO debt loads."
      ]
    },
    {
      "title": "Net Revenue Retention (NRR) Velocity",
      "body": [
        "While ARR measures scale, NRR measures momentum. High NRR velocity indicates that the product has become indispensable to the customer base, allowing for 'Negative Churn' where expansion revenue outpaces losses.",
        "Top-quartile performers aim for NRR above 110%. This compound growth effect significantly reduces the 'Cost of Growth' as the existing base becomes the primary engine for scale, rather than expensive new customer acquisition."
      ]
    },
    {
      "title": "Quality of Earnings Filter",
      "body": [
        "Not all ARR is created equal. The 'Quality' of ARR is determined by contract length, customer concentration, and the creditworthiness of the base. Multi-year enterprise contracts are valued significantly higher than month-to-month SMB subscriptions.",
        "During exit readiness, firms must scrub the ARR base to remove 'One-Time' services masquerading as recurring revenue. A clean, high-quality ARR ledger is the single biggest driver of the exit multiple."
      ]
    }
  ]
}
```

- [ ] **Step 2: Verify `arr.json` content**

### Task 2: Update CAC Payback Article

**Files:**
- Modify: `content/curated-articles/cac-payback.json`

- [ ] **Step 1: Update `content/curated-articles/cac-payback.json`**

```json
{
  "id": "cac-payback",
  "articleSections": [
    {
      "title": "The Efficiency Engine",
      "body": [
        "Customer Acquisition Cost (CAC) Payback is the survival metric for high-growth companies. It measures the number of months required to recoup the cost of acquiring a customer through their contribution margin.",
        "In a PE-backed environment, capital efficiency is paramount. A company can grow at 100% YoY, but if its payback is 36 months in a levered structure, it will eventually run out of cash. The target is a payback period under 12 months for mid-market SaaS."
      ],
      "callout": "Growth is only valuable if the cost of acquisition is significantly lower than the lifetime value (LTV)."
    },
    {
      "title": "The Unit Economics Filter",
      "body": [
        "CAC Payback serves as a ruthless filter for marketing and sales spend. Every channel—SEO, Paid Search, Field Sales—must be measured individually. If a specific channel has a 24-month payback while another has 6 months, capital must be reallocated immediately.",
        "Operating partners use the payback filter to 'Stop the Bleeding' in unprofitable customer segments. Often, the smallest customers have the highest CAC and the longest payback, making them a drag on overall enterprise value."
      ]
    },
    {
      "title": "Scaling the Sales Motion",
      "body": [
        "Once a 'Short Payback' model is proven, the GP will aggressively scale the sales force. This is the 'Growth Acceleration' phase where the goal is to capture as much market share as possible before the unit economics degrade.",
        "The risk during scaling is 'Sales Rep Productivity' decay. As more reps are added, the blended CAC often rises. Constant monitoring of the payback trend ensures that the company doesn't 'Buy Growth' at an unsustainable price."
      ]
    },
    {
      "title": "Blended vs. Paid CAC",
      "body": [
        "A common mistake is focusing solely on 'Blended CAC,' which includes organic growth. For a true measure of efficiency, operators must look at 'Paid CAC'—the direct cost of acquired customers through performance marketing.",
        "If organic growth is high, it can mask an inefficient paid acquisition strategy. By stripping away organic 'Tailwinds,' firms can identify the true ROI of their marketing spend and optimize the 'Engine' for maximum cash flow."
      ]
    },
    {
      "title": "Payback and Debt Service",
      "body": [
        "Payback cycles have a direct impact on a company's ability to service LBO debt. Long payback cycles tie up cash on the balance sheet for years, reducing the 'Cash Flow from Operations' available for interest payments.",
        "Accelerating the payback cycle by just 3 months can release millions in cash for debt paydown or add-on acquisitions. It is the most powerful lever for improving the 'Cash-on-Cash' return for the GP."
      ]
    }
  ]
}
```

- [ ] **Step 2: Verify `cac-payback.json` content**

### Task 3: Update Cash Conversion Cycle Article

**Files:**
- Modify: `content/curated-articles/cash-conversion-cycle.json`

- [ ] **Step 1: Update `content/curated-articles/cash-conversion-cycle.json`**

```json
{
  "id": "cash-conversion-cycle",
  "articleSections": [
    {
      "title": "Cash is King",
      "body": [
        "The Cash Conversion Cycle (CCC) is the ultimate metric for operational efficiency. It measures how quickly a company converts its investments in inventory and other resources into cash flow from sales.",
        "In a Private Equity LBO, cash is more important than accrual profit. A business can report record EBITDA while simultaneously going bankrupt because its cash is 'Trapped' in the balance sheet. CCC management is the first line of defense against liquidity risk."
      ],
      "callout": "Every day removed from the CCC is 'Found Money' for debt paydown."
    },
    {
      "title": "The Working Capital Sprint",
      "body": [
        "New ownership usually triggers a 'Working Capital Sprint' in the first 100 days. The goal is to unlock a 'Cash Windfall' by optimizing the three components of CCC: Receivables, Inventory, and Payables.",
        "By simply tightening credit terms and improving collection rigor, firms can often release 5-10% of annual revenue in cash. This immediate liquidity is often used to fund the first wave of operational improvements or pay down expensive 'Bridge Loans'."
      ]
    },
    {
      "title": "DSO and Collections Rigor",
      "body": [
        "Days Sales Outstanding (DSO) is often the largest component of a bloated CCC. Poor billing discipline and 'Lazy' collections processes allow customers to effectively use the company as a bank.",
        "Implementing automated dunning, incentivizing early payments, and ruthlessly following up on 'Past Due' accounts are standard PE playbooks. Reducing DSO by even 10 days can have a transformative impact on the company's net debt position."
      ]
    },
    {
      "title": "The Inventory and Payable Levers",
      "body": [
        "Inventory is 'Dead Cash.' High-performing operators focus on 'Just-in-Time' supply chains and SKU rationalization to increase inventory turns. Every unit sitting in a warehouse is capital that could be working elsewhere.",
        "On the flip side, Days Payable Outstanding (DPO) should be stretched where possible without damaging supplier relationships. Negotiating longer terms with non-critical vendors allows the company to keep its cash longer, effectively gaining interest-free financing."
      ]
    },
    {
      "title": "Negative Working Capital",
      "body": [
        "The 'Holy Grail' of operations is achieving Negative Working Capital. This occurs when customers pay for goods or services before the company has to pay its suppliers. This is common in high-scale SaaS and marketplace models.",
        "A company with negative working capital generates cash *faster* than it grows. This creates a powerful 'Flywheel' effect where growth self-funds itself, drastically reducing the need for external equity or debt financing."
      ]
    }
  ]
}
```

- [ ] **Step 2: Verify `cash-conversion-cycle.json` content**

### Task 4: Update Churn Article

**Files:**
- Modify: `content/curated-articles/churn.json`

- [ ] **Step 1: Update `content/curated-articles/churn.json`**

```json
{
  "id": "churn",
  "articleSections": [
    {
      "title": "The Value Destroyer",
      "body": [
        "Churn is the primary drag on enterprise value. A high-growth company with high churn is effectively a 'Treadmill' business—it must acquire a massive amount of new revenue just to stay flat.",
        "In the PE playbook, churn is a systemic risk that must be addressed before scaling. High churn typically signals a failure in either product-market fit, customer success, or pricing strategy. Left unchecked, it will collapse the exit multiple."
      ],
      "callout": "In recurring revenue, retention is the engine of valuation."
    },
    {
      "title": "Gross vs. Net Revenue Churn",
      "body": [
        "Understanding the delta between Gross and Net Churn is critical for accurate forecasting. Gross Churn measures the absolute dollar loss, while Net Churn includes expansion revenue from the remaining base.",
        "While 'Negative Net Churn' is the goal for valuation, operators must never ignore Gross Churn. If Gross Churn is high, it means the 'Core' of the business is rotting, even if expansion revenue is temporarily masking the problem."
      ]
    },
    {
      "title": "Leading Indicators & Health Scoring",
      "body": [
        "Reactive churn management—waiting for a cancellation notice—is a recipe for failure. Modern operators build 'Customer Health Scores' based on product usage, support tickets, and NPS.",
        "A drop in login frequency or a lack of engagement with new features is a leading indicator of risk. By intervening 3-6 months before a contract renewal, customer success teams can 'Save' at-risk accounts before they reach the point of no return."
      ]
    },
    {
      "title": "The Churn Segmentation Playbook",
      "body": [
        "Churn is rarely uniform. It often clusters in specific customer segments, geographies, or product tiers. PE firms use 'Cohort Analysis' to identify these 'Hot Spots' and take surgical action.",
        "For example, if churn is high in the 'SMB' segment but low in 'Enterprise,' the firm may decide to exit the SMB market entirely to focus resources on the higher-LTV, more stable enterprise base."
      ]
    },
    {
      "title": "Structural vs. Fixable Churn",
      "body": [
        "Not all churn can be fixed. 'Structural Churn'—customers going out of business or being acquired—is a cost of doing business. 'Fixable Churn'—poor onboarding, buggy software, or bad service—is where the operator adds value.",
        "By identifying and eliminating the 'Root Causes' of fixable churn, firms can drastically improve the terminal value of the investment. This often involves restructuring the customer success organization or pivoting the product roadmap."
      ]
    }
  ]
}
```

- [ ] **Step 2: Verify `churn.json` content**
