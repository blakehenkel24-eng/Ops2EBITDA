# Enhance Curated Articles Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enhance 3 curated article JSON files by increasing volume to 5 sections, adopting a punchy expert tone, and removing all source citations.

**Architecture:** Directly update JSON content in `content/curated-articles/`.

**Tech Stack:** JSON, TypeScript (for validation if needed).

---

### Task 1: Update `ai-opportunity-identification.json`

**Files:**
- Modify: `content/curated-articles/ai-opportunity-identification.json`

- [ ] **Step 1: Replace content with enhanced version**

```json
{
  "id": "ai-opportunity-identification",
  "articleSections": [
    {
      "title": "The AI Mandate: Operational Alpha in the 4.0 Era",
      "body": [
        "AI is no longer a speculative line item; it is the primary engine for margin expansion in the current private equity landscape. Firms are aggressively pivoting from generic 'Digital Transformation' to 'AI-Native Operations' where intelligence is baked into the workflow.",
        "The playbook begins with ruthless Opportunity Mapping. You aren't looking for 'innovation'; you are looking for high-volume, repetitive friction points. If a process is predictable and happens 10,000 times a month, it's a prime target for displacement."
      ],
      "callout": "AI is the ultimate operating leverage. It doesn't just replace headcount; it decapitates the marginal cost of growth."
    },
    {
      "title": "Hunting for 'Low-Hanging' Intelligent Automation",
      "body": [
        "The first 100 days must focus on immediate ROI. Deploying LLM-driven agents for tier-one customer support or predictive engines for churn reduction can move the needle in months, not years. These aren't just efficiency plays; they are defensive moats.",
        "Precision in targeting is everything. Identify where 'Cognitive Load' is highest but 'Value Add' is lowest. Automating document extraction in back-office functions or streamlining initial lead qualification are the quick wins that fund the broader transformation."
      ]
    },
    {
      "title": "Architecting the Common Agentic Framework",
      "body": [
        "Top-tier GPs are building centralized AI capabilities that transcend individual portfolio companies. By creating a 'Common Agentic Framework,' firms can deploy proven, modular AI assets across diverse industries with minimal friction.",
        "This centralization de-risks execution for portco CEOs. Instead of every company reinventing the wheel, they plug into a battle-tested stack. The result is a 'Defensible Advantage'—a portfolio that is fundamentally faster and leaner than its legacy competitors."
      ]
    },
    {
      "title": "The Technical Debt Trap",
      "body": [
        "You cannot run AI on a foundation of sand. Operational Due Diligence (ODD) now mandates a brutal assessment of data infrastructure. If your data is trapped in legacy SQL tables or unsearchable PDFs, your AI project is dead on arrival.",
        "Data Engineering is the unglamorous prerequisite. Clean, structured, and accessible data is the only fuel that powers an effective AI engine. Skip this step, and you aren't building intelligence; you're just accelerating your mistakes."
      ]
    },
    {
      "title": "AI as an Exit Multiple Driver",
      "body": [
        "The goal isn't just better EBITDA; it's a higher multiple at exit. A company with 'Clean, Auditable, AI-Native Workflows' is worth significantly more to a strategic buyer than a traditional service business.",
        "Showcasing a scalable AI infrastructure proves that the company has a sustainable competitive edge. It signals to the market that the business is future-proofed, shifting the narrative from 'Legacy Services' to 'Tech-Enabled Platform.'"
      ]
    }
  ]
}
```

---

### Task 2: Update `data-readiness-for-ai.json`

**Files:**
- Modify: `content/curated-articles/data-readiness-for-ai.json`

- [ ] **Step 1: Replace content with enhanced version**

```json
{
  "id": "data-readiness-for-ai",
  "articleSections": [
    {
      "title": "Data Integrity: The Non-Negotiable Prerequisite",
      "body": [
        "AI Alpha is impossible without absolute Data Integrity. Mid-market companies are notorious for 'Dark Data'—massive volumes of trapped information that remain invisible to decision-makers. Data readiness is the forced march every portco must undergo.",
        "The process starts with a ruthless Data Audit. It’s not about how much data you have, but how clean it is. Inconsistent 'Customer Master Data' across legacy systems is a silent killer of AI initiatives. Master Data Management (MDM) isn't an IT project; it's a business survival tactic."
      ],
      "callout": "Bad data + AI = Fast mistakes. High-integrity data + AI = Unassailable Operational Alpha."
    },
    {
      "title": "Migrating to the Modern Data Stack (MDS)",
      "body": [
        "Legacy on-prem servers are the graveyards of AI potential. The playbook requires an aggressive move to a 'Modern Data Stack'—leveraging cloud Lakehouses like Snowflake or Databricks to centralize intelligence.",
        "Interoperability is the metric of success. Can your ERP feed your CRM in real-time? Is your finance system talking to your warehouse management? If your data is siloed, your AI is handicapped. Day 1 priority: API-first integration for every critical system."
      ]
    },
    {
      "title": "Enforcing Data Governance",
      "body": [
        "Data readiness is a management failure disguised as a tech problem. Every functional area must have an assigned 'Data Owner'—a leader accountable for the hygiene and accuracy of their domain's information.",
        "Establish brutal Governance. Define who can touch the data, how it’s classified, and how it’s purged. Without strict rules, your 'AI Foundation' will degrade into a swamp of misinformation, rendering your models useless and dangerous."
      ]
    },
    {
      "title": "Structuring Unstructured Data",
      "body": [
        "The next frontier of data readiness is conquering the 'Unstructured'—the emails, PDFs, and call transcripts that hold the real insights. Implementing vector databases and automated extraction pipelines is critical to making this data 'AI-Readable.'",
        "Converting tribal knowledge into structured digital assets is a massive value-creation lever. It allows you to build internal 'Knowledge Engines' that ensure best practices are followed across the entire organization, regardless of individual turnover."
      ]
    },
    {
      "title": "The Data Exit Story",
      "body": [
        "Strategic buyers pay a massive premium for 'Auditable Data.' During the exit process, being able to prove your AI models are built on clean, governed data reduces buyer risk and increases confidence in future projections.",
        "A portco that can demonstrate 'Data Provenance' and 'Automated Quality Controls' isn't just a business; it's a sophisticated asset. This level of data maturity is the difference between a standard exit and a top-quartile return."
      ]
    }
  ]
}
```

---

### Task 3: Update `business-services.json`

**Files:**
- Modify: `content/curated-articles/business-services.json`

- [ ] **Step 1: Replace content with enhanced version**

```json
{
  "id": "business-services",
  "articleSections": [
    {
      "title": "Business Services: Monetizing People and Process",
      "body": [
        "In business services, you are selling human capital at scale. The PE playbook focuses on 'Operational Consistency'—transforming a collection of local operations into a unified, high-performance machine with a single standard of delivery.",
        "Margin expansion is won or lost on 'Labor Utilization.' Every unbillable hour is a leak in the EBITDA bucket. The operating partner's first move is often implementing sophisticated scheduling and routing software to ensure the workforce is optimized to the minute."
      ],
      "callout": "In business services, employees are the inventory. If you aren't managing their utilization with precision, you are burning cash."
    },
    {
      "title": "Driving Multiple via Contractual Stickiness",
      "body": [
        "PE firms are obsessed with 'Recurring Revenue' for a reason: it de-risks the cash flow. The goal is to move from 'One-Time Projects' to multi-year, evergreen contracts that provide a predictable foundation for growth.",
        "Customer concentration is the primary risk factor. If one account represents more than 20% of revenue, the business is fragile. The focus must be on aggressive diversification and securing long-term extensions well before the exit process begins."
      ]
    },
    {
      "title": "Weaponizing the Sales Engine",
      "body": [
        "Most mid-market service businesses grow by accident or 'Word of Mouth.' The PE playbook installs a professionalized sales motion—splitting the team into 'Hunters' for new acquisition and 'Farmers' for account expansion.",
        "Implementing a CRM with ruthless pipeline tracking is non-negotiable. By moving from a 'Passive' to an 'Active' sales model, portcos can often double their growth rate within the first 24 months, fundamentally changing the exit narrative."
      ]
    },
    {
      "title": "Scaling via M&A: The Buy-and-Build Playbook",
      "body": [
        "Business services are often highly fragmented, making them perfect for a 'Buy-and-Build' strategy. The platform company serves as the foundation, and 'Bolt-on' acquisitions are integrated to expand geographic reach or service offerings.",
        "The value creation lies in 'Synergy Realization'—centralizing back-office functions like HR, Finance, and IT while maintaining the local sales presence. A well-executed integration strategy can drive significant 'Multiple Arbitrage' at the final exit."
      ]
    },
    {
      "title": "The Tech-Enabled Transformation",
      "body": [
        "The ultimate goal in business services is to become 'Tech-Enabled.' This means using software to automate the unglamorous parts of service delivery—scheduling, reporting, and client portals—to increase perceived value and stickiness.",
        "A tech-enabled service business commands a higher multiple than a pure human-capital business because it is more scalable and less dependent on individual labor. It shifts the company from being a 'Commodity Provider' to a 'Strategic Partner.'"
      ]
    }
  ]
}
```

---

### Task 4: Final Validation

- [ ] **Step 1: Verify all 3 files have exactly 5 sections**
- [ ] **Step 2: Verify no citations remain (e.g., no 'Adam Coffey', 'Peter Howson', 'PE 4.0' references)**
- [ ] **Step 3: Ensure tone is expert and punchy**
