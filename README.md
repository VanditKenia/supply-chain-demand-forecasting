# Supply Chain Demand Forecasting & Inventory Optimization

An end-to-end analytics project for demand forecasting, inventory-risk analysis, replenishment decision support, SQL analytics, EDA, and Power BI reporting.

## Current Status

**Phase:** 5 — Demand Forecasting ✅ Complete  
**Phase 4:** ✅ Complete  
**Phase 6:** Ready to begin  
**Status:** Active Development  
**Dataset:** Retail Store Inventory and Demand Forecasting — selected and validated

The selected dataset contains 76,000 records covering 760 consecutive days, 5 stores, and 20 products at the Date × Store ID × Product ID grain.

### Completed Milestones

- Phase 0 — Project Setup ✅
- Phase 1 — Dataset Validation ✅
- Phase 2 — Data Engineering ✅
- Phase 3 — SQL Analytics ✅
- Phase 4 — EDA ✅
- Phase 5 — Forecasting ✅
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

## Phase 3 — SQL Analytics Completed

The SQL analytics layer has been completed and validated.

Final analytical view:

`vw_demand_analysis`

## Phase 4 — EDA Completed

Phase 4 established the forecasting-readiness of the dataset and documented demand, seasonality, store/product differences, promotion association, pricing relationships, volatility, and retained upper-tail observations.

## Phase 5 — Demand Forecasting Completed

Phase 5 uses a leakage-controlled chronological forecasting workflow at the locked Date × Store ID × Product ID grain.

### Chronological evaluation

- Training: 2022-01-01 → 2023-11-30
- Validation: 2023-12-01 → 2023-12-31
- Final test: 2024-01-01 → 2024-01-30
- Primary horizon: 30 days
- 100 Store × Product series

### Models evaluated

- Naive
- Seasonal Naive (7-day)
- ARIMA(1,0,1)
- Random Forest
- Tuned Random Forest
- HistGradientBoosting

All candidate models use the same December 2023 validation period. ML multi-step forecasts are recursive so future actual Demand does not enter future lag or rolling features.

### Validation results

| Model | MAE | RMSE | sMAPE |
|---|---:|---:|---:|
| Naive | 41.99 | 53.04 | 43.11% |
| Seasonal Naive 7 | 45.42 | 57.54 | 45.47% |
| ARIMA(1,0,1) | 34.78 | 43.77 | 35.42% |
| Random Forest | 35.13 | 43.89 | 35.56% |
| HistGradientBoosting | 34.75 | 43.53 | 35.29% |
| TunedRF_300_depth12_leaf1 | 34.73 | 43.49 | 35.28% |

### Validation-based model selection

Selection was performed per Store × Product series using validation MAE, with RMSE and sMAPE used as tie-breakers where needed.

- ARIMA(1,0,1): 35 series
- HistGradientBoosting: 23 series
- TunedRF_300_depth12_leaf1: 16 series
- Random Forest: 15 series
- Naive: 9 series
- SeasonalNaive7: 2 series

### Final January 2024 test

The January actual Demand values were joined only after forecasts were generated and model decisions were frozen.

- MAE: 35.40
- RMSE: 45.98
- sMAPE: 41.20%

### Forecast integrity

Final output contains:

- 3,000 forecast rows
- 100 Store × Product series
- 30 forecast dates
- no duplicate forecast keys
- no missing forecasts
- all forecasts finite
- complete 2024-01-01 → 2024-01-30 horizon

### Known limitation

The final test error analysis shows substantial underprediction of high-demand observations:

- High-demand threshold: 125
- Actual high-demand mean: 158.04
- Forecast high-demand mean: 106.72
- Mean bias: -51.32
- Actual maximum: 284
- Forecast maximum: 146

No genuine demand spikes were removed to improve performance. This limitation must be considered in downstream inventory-risk analysis.

### Leakage controls

The main ML forecasting workflow excludes Units Sold, Inventory Level, and Units Ordered because they are leakage-prone or may not be available at forecast generation time. Future actual Demand is never used as a predictor. Conditional variables are only candidates when forecast-time availability is defensible.

### Phase 5 Output

- Notebook: `notebooks/05_demand_forecasting.ipynb`
- Forecast output: `data/processed/final_demand_forecasts.csv`
- Results documentation: `PHASE_5_RESULTS.md`

## Phase 6 — Inventory Optimization

The frozen Phase 5 forecasts are now the demand-input layer for inventory optimization.

Lead time is not present in the source data and will not be fabricated. Any lead time used in Phase 6 must be stated explicitly as a scenario assumption.

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

See `PROJECT_MASTER.md` and `PHASE_5_RESULTS.md` for methodology, assumptions, decisions, limitations, and forecasting results.


## Phase 7 — Supply Chain Intelligence Platform

Phase 7 expands the presentation-oriented BI layer into an application-style decision-support platform.

### Platform stack

- Next.js + React + TypeScript
- Tailwind CSS
- Framer Motion
- Apache ECharts
- Three.js / React Three Fiber
- FastAPI
- MySQL
- Docker Compose
- Power BI + DAX as the BI/analytical workspace

### Product experience

The platform is organized around:

1. Control Tower
2. Demand Intelligence
3. Inventory Intelligence
4. Action Center
5. Store Explorer
6. Product Explorer
7. Power BI Analytics

The frontend must use the real Phase 5 and Phase 6 analytical outputs. It must not fabricate real-time data, AI-generated insights, savings, ROI, or operational impact.

### Phase 7 status

- [x] Platform architecture defined
- [x] Frontend foundation committed
- [x] FastAPI foundation committed
- [x] MySQL schema committed
- [x] Docker Compose foundation committed
- [x] Design system committed
- [ ] Synchronize validated Phase 5/6 artifacts into repository
- [ ] Implement API data services
- [ ] Implement Control Tower
- [ ] Implement Demand Intelligence
- [ ] Implement Inventory Intelligence
- [ ] Implement Action Center
- [ ] Implement Store/Product explorers
- [ ] Implement meaningful 3D/network visualization
- [ ] Integrate Power BI analytical workspace
- [ ] QA and deployment
