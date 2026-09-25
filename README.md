# Supply Chain Demand Forecasting & Inventory Optimization

An end-to-end analytics project for demand forecasting, inventory-risk analysis, replenishment decision support, SQL analytics, EDA, and Power BI reporting.

## Current Status

**Phase:** 4 — EDA  
**Phase 3:** ✅ Complete  
**Status:** Active Development  
**Dataset:** Retail Store Inventory and Demand Forecasting — selected and validated

The selected dataset contains 76,000 records covering 760 consecutive days, 5 stores, and 20 products at the Date × Store ID × Product ID grain.

### Completed Milestones

- Phase 0 — Project Setup ✅
- Phase 1 — Dataset Validation ✅
- Phase 2 — Data Engineering ✅
- Phase 3 — SQL Analytics ✅
- Phase 4 — EDA 🔵 Current
- Phase 5 — Forecasting ⏳
- Phase 6 — Inventory Optimization ⏳
- Phase 7 — Power BI ⏳
- Phase 8 — Documentation ⏳
- Phase 9 — Final Audit ⏳

## Dataset Validation

- 76,000 rows
- 16 original columns
- 2022-01-01 → 2024-01-30
- 760 consecutive daily dates
- 5 stores
- 20 products
- 100 Store × Product combinations
- 760 observations per Store × Product combination
- 0 missing values
- 0 duplicate grain records
- 0 missing global dates
- 0 internal Store × Product date gaps
- complete balanced temporal panel

## Analytical Grain

**One row = one Product × Store × Date**

Natural key:

`Date + Store ID + Product ID`

Forecasting target:

**Demand**

Demand is deliberately not substituted with Units Sold. The project treats Demand as the primary target while preserving the observed distinction between Demand and Units Sold.

## MySQL Data Model

Implemented relational layer:

- `stg_sales_raw`
- `dim_calendar`
- `dim_store`
- `dim_product`
- `fact_demand`

The fact table uses `(date_key, store_id, product_id)` as its primary key.

Category remains contextual at the fact/Store × Product level because Product ID is not globally mapped to one category.

## Phase 3 — SQL Analytics Completed

The SQL analytics layer has been completed and validated. It covered:

- overall demand and inventory metrics
- demand by store
- demand by product
- demand by category
- monthly demand
- seasonality
- promotion vs demand
- potential inventory pressure
- Store × Product pressure
- demand concentration
- daily demand peaks
- inventory-to-demand ratio
- year-over-year monthly demand
- Store × Product demand volatility
- volatility vs inventory pressure
- promotion × category analysis
- Units Ordered vs Demand
- Product × Category ranking using CTE/window logic
- final analytical view

Final analytical view:

`vw_demand_analysis`

The final view was validated at:

- 76,000 rows
- 760 unique dates
- 5 unique stores
- 20 unique products

### Important Analytical Safeguards

`inventory_level < demand` is treated as **potential inventory pressure**, not confirmed stockout.

Observed relationships such as higher average demand during promotion periods are descriptive associations and are not interpreted as causal effects.

Units Ordered below Demand does not by itself establish ordering failure because supplier timing and lead-time semantics are not observed.

Potential forecasting leakage remains under review for operational variables such as Inventory Level, Units Sold, Units Ordered, Weather Condition, and other features whose availability depends on the forecast origin.

## Phase 4 — EDA

Current objective:

- demand distribution
- demand over time
- trend and seasonality
- store/product/category patterns
- promotion relationships
- inventory vs demand
- demand variability
- correlation structure
- anomaly investigation
- forecasting readiness

EDA will be question-driven rather than chart-driven. No destructive outlier removal or unsupported assumptions will be introduced.

## Repository Structure

```text
supply-chain-demand-forecasting/
├── README.md
├── PROJECT_MASTER.md
├── requirements.txt
├── .gitignore
├── data/
├── sql/
├── notebooks/
├── src/
├── dashboard/
├── reports/
└── assets/
```

See `PROJECT_MASTER.md` for the detailed methodology, assumptions, decisions, limitations, and project roadmap.
