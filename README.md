# Supply Chain Demand Forecasting & Inventory Optimization

An end-to-end analytics project for demand forecasting, inventory-risk analysis, replenishment decision support, SQL analytics, EDA, and Power BI reporting.

## Current Status

**Phase:** 4 — EDA ✅ Complete  
**Phase 3:** ✅ Complete  
**Phase 5:** Ready to begin  
**Status:** Active Development  
**Dataset:** Retail Store Inventory and Demand Forecasting — selected and validated

The selected dataset contains 76,000 records covering 760 consecutive days, 5 stores, and 20 products at the Date × Store ID × Product ID grain.

### Completed Milestones

- Phase 0 — Project Setup ✅
- Phase 1 — Dataset Validation ✅
- Phase 2 — Data Engineering ✅
- Phase 3 — SQL Analytics ✅
- Phase 4 — EDA ✅
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

## Phase 4 — EDA Completed

Phase 4 was completed through EDA 4.15.

Key findings:

- Demand is positive with a range of 4–430 and mean of 104.32.
- Long-run linear trend is weak; the fitted trend is slightly negative.
- Month/season variation is meaningful; summer showed the highest seasonal average in the completed EDA.
- Store demand is relatively balanced, while Store × Product demand levels and volatility differ materially.
- Groceries contribute approximately 46.39% of total demand.
- Promotion is associated with higher observed demand; this is descriptive, not causal.
- Discount has a positive association with Demand, while Price and Competitor Pricing have weak simple linear relationships with Demand.
- Price and Competitor Pricing are highly correlated and require multicollinearity consideration.
- IQR screening identified approximately 986 upper-tail demand observations; they were retained because statistical outlier status is not proof of data error.
- The dataset passed forecasting-readiness checks with complete daily histories for all 100 Store × Product series.

### Forecasting Safeguards

Potential leakage or forecast-time availability concerns remain for:

- Inventory Level
- Units Sold
- Units Ordered
- Weather Condition
- Competitor Pricing
- other variables whose values may not be known at the forecast origin

Forecasting will use chronological evaluation. Demand at the prediction timestamp must never be used as a predictor for that same timestamp.

## Phase 5 — Forecasting

Planned sequence:

1. Define forecast horizon and prediction cutoff
2. Create chronological train/validation/test sets
3. Establish Naive baseline
4. Establish Moving Average baseline
5. Evaluate baseline errors
6. Engineer lag and rolling features
7. Validate feature timing and leakage
8. Evaluate statistical forecasting methods where appropriate
9. Evaluate XGBoost where appropriate
10. Compare models using time-aware evaluation
11. Analyze errors by Store × Product
12. Select the simplest defensible approach

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
