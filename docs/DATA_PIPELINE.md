# Data Pipeline

## Purpose

The pipeline turns historical retail observations into forecasted demand and then converts forecast demand into inventory decisions.

## End-to-end flow

```text
Historical Sales
↓
Data Validation
↓
Store × Product Series
↓
Forecast Model Selection
↓
30-Day Demand Forecast
↓
Inventory Snapshot
↓
Lead-Time Demand
↓
Safety Stock
↓
Reorder Point
↓
Inventory Gap
↓
Recommended Order
↓
Risk Classification
↓
Web Application
```

## Stage 1 — Historical Sales

The source is a balanced 76,000-row daily panel at Date × Store ID × Product ID grain. It covers 760 consecutive dates, 5 stores, and 20 products.

## Stage 2 — Data Validation

Validation checks established:

- 0 missing values
- 0 duplicate Date × Store × Product records
- 0 missing global dates
- 0 internal Store × Product date gaps
- balanced 760-day temporal panel

These checks establish a usable time-series base before forecasting.

## Stage 3 — Store × Product Series

The forecasting unit is one independent time series per Store × Product pair. There are 100 such series.

This is important: model selection is not performed once for the entire dataset. Each Store × Product series receives its own selected model based on the common validation period.

## Stage 4 — Forecast model selection

The chronological split is:

- Training: 2022-01-01 to 2023-11-30
- Validation: 2023-12-01 to 2023-12-31
- Final test: 2024-01-01 to 2024-01-30

Candidate models are evaluated on the same December validation period. ML multi-step forecasts are recursive so future actual Demand does not leak into future lag/rolling features.

## Stage 5 — 30-day forecast

The frozen Phase 5 output contains 3,000 records:

```text
100 Store × Product series × 30 forecast dates
```

The total forecast demand across the artifact is 278,398.48.

## Stage 6 — Inventory snapshot

Phase 6 takes the inventory position associated with each Store × Product decision row and combines it with the frozen forecast layer.

## Stage 7 — Lead-time demand

For the base scenario, lead time is an explicit 7-day assumption. Lead-time demand is the sum of forecast demand over the selected lead-time window.

## Stage 8 — Safety stock

Safety stock uses historical daily demand variability and the selected service-level Z-value:

```text
Safety Stock = Z × Demand Std Dev × √Lead Time
```

Base service level is 95%.

## Stage 9 — Reorder point

```text
Reorder Point = Lead-Time Demand + Safety Stock
```

This represents the inventory position at which replenishment attention is triggered under the stated assumptions.

## Stage 10 — Inventory gap

The gap represents the amount by which the current inventory position is below the target/reorder level.

## Stage 11 — Recommended order

```text
Recommended Order Quantity =
max(Reorder Point − Current Inventory, 0)
```

The final quantity is rounded up in the Phase 6 calculation.

## Stage 12 — Risk and action

Risk classifications compare current inventory with the reorder-point requirement under the documented business rules. Risk is not a calibrated probability of stockout.

## Stage 13 — Application consumption

The FastAPI data service reads:

- `/data/raw/sales_data.csv`
- `/data/processed/final_demand_forecasts.csv`
- `/data/processed/inventory_recommendations.csv`

The frontend/backend stack therefore acts as a presentation and decision-consumption layer over the analytical artifacts; it does not rerun the forecasting methodology.
