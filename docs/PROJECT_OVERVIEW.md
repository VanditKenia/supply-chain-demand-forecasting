# Project Overview

## Supply Chain Demand Forecasting & Inventory Optimization

This project is an end-to-end analytical and decision-support system that converts historical retail demand data into 30-day demand forecasts, inventory-risk measurements, replenishment recommendations, and a web-facing operational presentation layer.

The project is documented from the implementation that exists on `main`. Documentation does not treat planned features as completed functionality.

## Problem statement

Retail supply chains must balance stockout exposure against excess inventory. Historical demand contains temporal, store-level, product-level, and seasonal patterns, but raw sales data does not directly answer how much demand should be expected next or which inventory positions require action.

The project addresses that gap through a sequence of validated data engineering, SQL analytics, exploratory analysis, forecasting, inventory optimization, and application-layer work.

## Business objective

The objective is to answer:

> Given historical demand and current inventory information, what demand is expected over the next 30 days, what inventory pressure exists under explicit assumptions, and what replenishment action follows from those calculations?

The output is decision support, not an autonomous purchasing system.

## Scope and phase boundaries

| Phase | Actual role |
|---|---|
| Phase 0 | Setup and repository foundation |
| Phase 1 | Dataset selection and validation |
| Phase 2 | Data engineering and relational design |
| Phase 3 | SQL analytics |
| Phase 4 | Data analysis / EDA |
| Phase 5 | Demand forecasting |
| Phase 6 | Inventory optimization |
| Phase 7 | Web application platform |
| Phase 8 | Documentation and project knowledge base |

Phase 5 is the frozen demand-input layer for Phase 6. Phase 7 consumes Phase 5/6 analytical outputs; it does not redefine their methodology. Phase 8 documents the system without changing analytical or application behavior.

## End-to-end workflow

```text
Historical Sales
      ↓
Data Validation
      ↓
Store × Product Time Series
      ↓
Chronological Forecast Validation
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
Risk / Action / Priority
      ↓
Web Application / BI Consumption
```

## Dataset

The validated sales dataset contains 76,000 rows and 16 columns covering 2022-01-01 through 2024-01-30. The analytical grain is one row per Date × Store ID × Product ID, with 5 stores, 20 products, and 100 Store × Product series.

Validation recorded zero missing values, zero duplicate grain records, and a complete balanced temporal panel.

The frozen forecast artifact contains 3,000 rows: 100 Store × Product series × 30 forecast dates.

## Forecasting

Phase 5 uses a leakage-controlled chronological workflow:

- Training: 2022-01-01 to 2023-11-30
- Validation: 2023-12-01 to 2023-12-31
- Final test: 2024-01-01 to 2024-01-30
- Forecast horizon: 30 days
- Model selection: independently at Store × Product series level

Candidate models were Naive, Seasonal Naive 7-day, ARIMA(1,0,1), Random Forest, Tuned Random Forest, and HistGradientBoosting.

Final January 2024 test results:

| Metric | Result |
|---|---:|
| MAE | 35.40 |
| RMSE | 45.98 |
| sMAPE | 41.20% |

The main known forecasting limitation is underprediction of high-demand observations. For Demand >= 125, actual mean demand was 158.04 versus forecast mean 106.72; the mean bias was -51.32. The maximum actual demand was 284 versus maximum forecast 146.

## Inventory optimization

Phase 6 consumes the frozen 30-day forecast layer and historical inventory information.

Base assumptions:

- Lead time: 7 days
- Service level: 95%
- Scenario lead times: 3, 7, 14 days
- Scenario service levels: 90%, 95%, 99%

Core calculations:

```text
Lead-Time Demand = sum of forecast demand over the selected lead-time window

Safety Stock = Z × Demand Std Dev × √Lead Time

Reorder Point = Lead-Time Demand + Safety Stock

Recommended Order Quantity =
    max(Reorder Point − Current Inventory, 0), rounded up
```

Risk and excess-inventory classifications are business rules, not measured stockout probabilities or financial-impact estimates.

Validated Phase 6 reconciliation:

| Measure | Value |
|---|---:|
| Decision units | 100 |
| Current inventory | 29,049 |
| Safety stock | 18,669.09 |
| Reorder point | 80,496.07 |
| Inventory gap | 51,447.07 |
| Recommended order | 52,083 |
| High risk | 95 |
| Medium risk | 2 |
| Low risk | 3 |

## Phase 7 platform

The application stack is:

```text
Next.js / React / TypeScript
          ↓
FastAPI
          ↓
Data service / MySQL schema
          ↓
Phase 5 forecast + Phase 6 inventory outputs
```

The repository currently contains a frontend foundation, FastAPI API foundation, MySQL schema, and Docker Compose stack.

Currently implemented backend routes are documented in [API Documentation](API_DOCUMENTATION.md). The frontend currently renders a foundation experience with Control Tower, Demand, Inventory, and Actions navigation cards. Rich Store Explorer, Product Explorer, Power BI integration, and deeper interactive modules are defined in the platform blueprint but are not represented as completed functionality in the current code.

## Technology stack

- Python, Pandas, NumPy, scikit-learn, Statsmodels
- MySQL 8.4
- FastAPI
- Next.js 15, React 19, TypeScript
- Framer Motion
- Apache ECharts and Three.js dependencies for the planned analytical experience
- Power BI / DAX as a separate analytical layer
- Docker Compose
- Git / GitHub

## Inputs and outputs

### Inputs

- `sales_data.csv`
- Frozen Phase 5 forecasts
- Historical/current inventory information used by Phase 6

### Outputs

- 30-day forecast by Store × Product × Date
- Store × Product inventory decision records
- Replenishment quantities
- Risk and action fields
- API responses for overview and action consumption
- Power BI analytical artifacts where maintained separately

## Repository documentation map

- [Data Dictionary](DATA_DICTIONARY.md)
- [Data Pipeline](DATA_PIPELINE.md)
- [Forecasting Methodology](FORECASTING_METHODOLOGY.md)
- [Inventory Optimization](INVENTORY_OPTIMIZATION.md)
- [Platform Architecture](PLATFORM_ARCHITECTURE.md)
- [API Documentation](API_DOCUMENTATION.md)
- [Database Schema](DATABASE_SCHEMA.md)
- [Deployment](DEPLOYMENT.md)
- [Testing](TESTING.md)
- [Limitations](LIMITATIONS.md)
- [User Guide](USER_GUIDE.md)
- [Project Master](../PROJECT_MASTER.md)
