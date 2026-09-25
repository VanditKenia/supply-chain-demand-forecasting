# Supply Chain Demand Forecasting & Inventory Optimization

## Phase 5 Implementation Status Update

Phase 5 Demand Forecasting was completed on 2026-09-25 using the supplied `sales_data.csv` dataset and a clean Colab notebook.

### Phase 5 decisions implemented

- Locked grain: Date × Store ID × Product ID
- Target: Demand
- Primary horizon: 30 days
- Training: 2022-01-01 → 2023-11-30
- Validation: 2023-12-01 → 2023-12-31
- Final test: 2024-01-01 → 2024-01-30
- No random time-series split
- Final January 2024 Demand remained untouched until final evaluation
- ML multi-step forecasting is recursive
- Rolling features use past-only information
- Units Sold, Inventory Level, and Units Ordered excluded from the main forecasting predictors
- Genuine demand spikes retained
- ARIMA warnings/failures recorded rather than hidden
- Model selection performed from validation results only
- No lead time fabricated

### Phase 5 results

Final January 2024 test:
- MAE: 35.40
- RMSE: 45.98
- sMAPE: 41.20%

Selected models across 100 series:
- ARIMA(1,0,1): 35
- HistGradientBoosting: 23
- TunedRF_300_depth12_leaf1: 16
- Random Forest: 15
- Naive: 9
- SeasonalNaive7: 2

Known limitation:
High-demand spikes are underpredicted. For observations with Demand >= 125, actual mean Demand was 158.04 versus forecast mean 106.72, with mean bias -51.32. Maximum actual Demand was 284 versus maximum forecast 146.

### Phase 5 deliverables

- `notebooks/05_demand_forecasting.ipynb`
- `data/processed/final_demand_forecasts.csv`
- `PHASE_5_RESULTS.md`

### Phase 5 status

**COMPLETE**

### Next phase

Phase 6 — Inventory Optimization, using the frozen Phase 5 forecast output as the demand-input layer. Lead time, service level, safety stock, reorder point, stockout risk, and replenishment recommendations must use explicit assumptions where the source dataset does not provide the required information.

## 29. Completed Work

Update:
- Phase 5 demand forecasting completed.
- Chronological validation and final test completed.
- Final 30-day forecast generated for all 100 Store × Product series.
- Forecast integrity checks passed.
- Final forecast output frozen for Phase 6 handoff.

## 30. Pending Work

### Immediate Next Step

Phase 6 — Inventory Optimization using the frozen Phase 5 forecasts.
