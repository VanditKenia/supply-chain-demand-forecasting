# Data Dictionary

## Source and analytical artifacts

This document describes the validated source dataset and frozen analytical artifacts actually used by the project. Where an artifact is not currently present in the GitHub tree, that fact is stated instead of inventing values.

## 1. sales_data.csv

| Property | Value |
|---|---|
| Filename | `sales_data.csv` |
| Rows | 76,000 |
| Columns | 16 |
| Grain | Date × Store ID × Product ID |
| Date range | 2022-01-01 to 2024-01-30 |
| Stores | 5 |
| Products | 20 |
| Store × Product series | 100 |
| Temporal coverage | 760 daily dates |
| Missing values | 0 |
| Duplicate grain rows | 0 |

| Column | Type | Meaning | Observed range / values |
|---|---|---|---|
| Date | date/string | Observation date | 2022-01-01 to 2024-01-30 |
| Store ID | string | Store identifier | S001-S005 |
| Product ID | string | Product identifier | P0001-P0020 |
| Category | string | Product category | Electronics, Clothing, Groceries, Toys, Furniture |
| Region | string | Store region | North, South, East, West |
| Inventory Level | integer | Inventory quantity recorded for the row | 0-2267 |
| Units Sold | integer | Observed units sold | 0-426 |
| Units Ordered | integer | Units ordered | 0-1616 |
| Price | float | Product price | 4.74-228.03 |
| Discount | integer | Discount value recorded for the row | 0-25 |
| Weather Condition | string | Recorded weather category | Snowy, Cloudy, Sunny, Rainy |
| Promotion | integer | Promotion indicator | 0-1 |
| Competitor Pricing | float | Recorded competitor price | 4.29-261.22 |
| Seasonality | string | Seasonal category | Winter, Spring, Summer, Autumn |
| Epidemic | integer | Epidemic indicator | 0-1 |
| Demand | integer | Forecasting target | 4-430 |

The forecasting target is **Demand**, not Units Sold. The forecasting workflow excludes Units Sold, Inventory Level, and Units Ordered from the main ML predictors because their timing can be leakage-prone or unavailable at forecast generation time.

## 2. final_demand_forecasts.csv

| Property | Value |
|---|---|
| Filename | `final_demand_forecasts.csv` |
| Rows | 3,000 |
| Columns | 5 |
| Grain | Forecast Date × Store ID × Product ID |
| Forecast range | 2024-01-01 to 2024-01-30 |
| Store series | 100 Store × Product combinations |
| Forecast horizon | 30 days |
| Forecast total | 278,398.48 |

| Column | Type | Meaning | Observed range / values |
|---|---|---|---|
| Date | date/string | Forecast date | 2024-01-01 to 2024-01-30 |
| Store ID | string | Store identifier | 5 stores |
| Product ID | string | Product identifier | 20 products |
| Forecast_Demand | float | Frozen predicted demand | 4.00 to 148.1567 |
| Selected_Model | string | Model selected for the Store × Product series | ARIMA(1,0,1), HistGradientBoosting, TunedRF_300_depth12_leaf1, RandomForest, Naive, SeasonalNaive7 |

Selected-model counts at the series level are documented in [Forecasting Methodology](FORECASTING_METHODOLOGY.md).

## 3. inventory_recommendations.csv

The Phase 6 artifact is documented in the project's validated artifact manifest as **100 rows and 21 columns**. The row grain is one Store × Product inventory decision.

The validated schema is:

| Column | Meaning |
|---|---|
| Inventory Snapshot Date | Inventory snapshot date used for the decision |
| Store ID | Store identifier |
| Product ID | Product identifier |
| Forecast_Start | Start of the forecast window |
| Forecast_End | End of the forecast window |
| Forecast_Days | Number of forecast days considered |
| Current Inventory | Inventory position used by the decision calculation |
| Lead Time | Assumed replenishment lead time |
| Lead Time Demand | Forecast demand over the selected lead-time window |
| Demand Std Dev | Historical daily demand standard deviation used for safety stock |
| Service Level | Target service level assumption |
| Z_Value | Standard normal service-level factor |
| Safety Stock | Buffer quantity derived from demand variability and lead time |
| Reorder Point | Lead-time demand plus safety stock |
| Inventory Gap | Difference between target/reorder inventory and current inventory |
| Excess_Inventory_Units | Units classified as excess under the Phase 6 rule |
| Excess_Inventory_Flag | Excess-inventory classification |
| Recommended Order Quantity | Replenishment quantity |
| Risk | Inventory risk classification |
| Recommended Action | Action associated with the decision |
| Priority | Decision priority |

The repository currently does **not** contain the binary/CSV file itself; the artifact manifest records its validated SHA-256 and 100-row/21-column shape. The documentation therefore preserves the known schema and does not invent row-level examples.

Base assumptions are Lead Time = 7 days and Service Level = 95%.

## Artifact integrity note

The repository intentionally removed earlier placeholder forecast/Phase 6 artifacts. The validated real files are available in the project workspace and must be synchronized through the intended artifact-upload path before application data loading. See `data/processed/ARTIFACT_MANIFEST.md`.
