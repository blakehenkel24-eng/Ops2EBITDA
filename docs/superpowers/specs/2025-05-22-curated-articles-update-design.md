# Design Spec: Curated Articles Content Enhancement (2025-05-22)

## Overview
Update four key financial metric articles in `content/curated-articles/` to increase depth, remove external citations, and adopt a more punchy, expert tone.

## Target Files
- `content/curated-articles/arr.json`
- `content/curated-articles/cac-payback.json`
- `content/curated-articles/cash-conversion-cycle.json`
- `content/curated-articles/churn.json`

## Requirements
- **Volume:** Increase from 3 to 5 sections per article.
- **Tone:** Expert, punchy, high-signal (Private Equity operator style).
- **Citations:** Remove all mentions of specific authors or books (e.g., Adam Coffey, Peter Howson).
- **Format:** Maintain existing JSON structure (`id` and `articleSections` array).

## Content Designs

### 1. ARR (Annual Recurring Revenue)
1. **The Foundation of Predictability:** ARR is the baseline for underwriting and LBO debt capacity.
2. **The ARR Bridge:** Detailed mechanics of New Logos, Expansion, Contraction, and Churn.
3. **ARR-to-Cash Reconciliation:** Addressing operational leakage and the delta between bookings and collections.
4. **Net Revenue Retention (NRR) Velocity:** How expansion within the base drives valuation.
5. **The Quality of Earnings (QofE) Filter:** Distinguishing "sticky" enterprise ARR from low-quality segments.

### 2. CAC Payback
1. **The Efficiency Engine:** Payback as the survival metric for capital-efficient growth.
2. **The Unit Economics Filter:** Ruthlessly cutting low-ROI marketing channels.
3. **Scaling the Sales Motion:** Accelerating growth once the unit economics are proven.
4. **Blended vs. Paid CAC:** The danger of hiding inefficiency behind organic growth.
5. **Payback and Debt Service:** Why long payback cycles are lethal for levered structures.

### 3. Cash Conversion Cycle (CCC)
1. **Cash is King:** Liquidity over accrual profit in PE.
2. **The Working Capital Sprint:** The 100-day playbook to unlock trapped cash.
3. **DSO and Collections Rigor:** Accelerating cash velocity through receivables discipline.
4. **Inventory and Payable Levers:** Balancing turns and supplier terms.
5. **Negative Working Capital:** Using customer cash to fund growth.

### 4. Churn
1. **The Value Destroyer:** Churn's impact on exit multiples and enterprise value.
2. **Gross vs. Net Revenue Churn:** Balancing absolute loss against expansion revenue.
3. **Leading Indicators & Health Scoring:** Proactive risk mitigation strategies.
4. **The Churn Segmentation Playbook:** Identifying high-risk cohorts.
5. **Structural vs. Fixable Churn:** Product failure vs. market fit issues.

## Verification Plan
- Manually inspect JSON structure for correctness.
- Ensure all 5 sections are present in each file.
- Confirm total removal of citations.
- Validate "punchy, expert tone" across all updated content.
