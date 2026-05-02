# Design Document: Curated Articles Enhancement (March 2025)

## 1. Goal
Enhance four key financial and operational articles (`dpo`, `dso`, `ebitda-margin`, `forecast-accuracy`) to reflect a high-authority, "Private Equity Operator" voice.

## 2. Requirements
- **Volume:** Exactly 5 sections per article.
- **Tone:** Punchy, expert, authoritative, and direct.
- **Citations:** ZERO citations to external authors or books. The content must stand as internal "Operating Playbook" expertise.
- **Format:** Maintain existing JSON structure (`id`, `articleSections` with `title`, `body`, and optional `callout`).

## 3. Implementation Plan

### Article: DPO (Days Payable Outstanding)
1. **The Strategic Float:** Focus on DPO as the ultimate zero-cost capital.
2. **Term Standardization:** The move to Net-60/Net-90 across the entire vendor base.
3. **Supply Chain Finance (SCF):** Using bank liquidity to bridge the gap without killing vendors.
4. **Precision AP Automation:** Ensuring "Last Day" payments and algorithmic discount capture.
5. **Inventory Alignment:** Syncing payables to inventory turns for CCC optimization.

### Article: DSO (Days Sales Outstanding)
1. **Cash Velocity as IRR:** Why slow collections destroy private equity returns.
2. **The 90-Day Kill Zone:** Aggressive management of aging buckets and "dirty AR."
3. **Cash-Based Incentives:** Moving sales commissions from "Bookings" to "Cash Receipts."
4. **Digital Payment Velocity:** Portals, automated dunning, and the removal of payment friction.
5. **Systemic Root Cause Analysis:** Eliminating billing and quality errors that delay payment.

### Article: EBITDA Margin
1. **The Value Multiplier:** How margin expansion drives exponential exit value.
2. **True Operating Leverage:** Scaling revenue without inflating the overhead.
3. **QofE Realization:** Turning "Adjusted EBITDA" into "Bankable EBITDA."
4. **Surgical Overhead Optimization:** Trimming G&A while protecting the revenue engine.
5. **Value-Based Pricing:** Using pricing strategy as the highest-ROI margin lever.

### Article: Forecast Accuracy
1. **Variance as Risk:** Why a 5%+ forecast miss is a failure of management control.
2. **The 13-Week Liquidity Pulse:** Implementing the high-fidelity rolling cash forecast.
3. **Field-Level Ownership:** Moving from top-down estimates to bottom-up accountability.
4. **Data-Driven Pipeline Logic:** Killing "hope-based" forecasting with historical conversion data.
5. **Predictive Stress-Testing:** Using shadow forecasting to identify management blind spots.

## 4. Verification
- Validate each JSON file for syntax correctness.
- Ensure section count is exactly 5.
- Confirm total removal of citations (Coffey, Howson, etc.).
