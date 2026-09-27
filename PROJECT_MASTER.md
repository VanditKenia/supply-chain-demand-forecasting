# Supply Chain Demand Forecasting & Inventory Optimization

> **Project Master Document / Single Source of Truth**

This document governs the current scope, methodology, architecture, validation standards, phase status, and documentation state of the project. It describes the implementation that exists on `main`; planned work is explicitly marked as such.

## 1. Project identity

- **Project:** Supply Chain Demand Forecasting & Inventory Optimization
- **Repository:** `VanditKenia/supply-chain-demand-forecasting`
- **Type:** Business Analytics / Demand Forecasting / Inventory Decision Support
- **Primary objective:** Convert validated historical supply-chain data into demand forecasts, inventory-risk measurements, replenishment recommendations, and business-facing decision support.

## 2. Current status

**Current phase: Phase 8 — Documentation & Project Knowledge Base**

Phases 0–7 have reached their documented current state. Phase 8 completes the documentation layer without modifying the forecasting methodology, inventory methodology, validated datasets, or application functionality.

## 3. Phase status

| Phase | Status | Deliverable / current state |
|---|---|---|
| Phase 0 — Setup | Complete | Repository, Git workflow, project structure |
| Phase 1 — Dataset | Complete | 76,000-row validated retail dataset |
| Phase 2 — Data Engineering | Complete | Data quality validation and MySQL/application schema |
| Phase 3 — SQL Analytics | Complete | SQL analytical layer and demand analysis view |
| Phase 4 — Data Analysis / EDA | Complete | Demand, seasonality, store/product, volatility and anomaly analysis |
| Phase 5 — Demand Forecasting | Complete | 30-day forecasts for 100 Store × Product series |
| Phase 6 — Inventory Optimization | Complete | 100 inventory decision records; base 7-day/95% scenario |
| Phase 7 — Web Application Platform | Foundation complete | Next.js/FastAPI/MySQL/Docker foundation and analytical API contracts |
| Phase 8 — Documentation | Complete with this commit | Professional project knowledge base |

## 4. Phase 5 — Demand Forecasting

Locked analytical grain: Date × Store ID × Product ID.

- Target: Demand
- Horizon: 30 days
- Training: 2022-01-01 → 2023-11-30
- Validation: 2023-12-01 → 2023-12-31
- Final test: 2024-01-01 → 2024-01-30
- Series: 100 Store × Product

Final January 2024 test:

- MAE: 35.40
- RMSE: 45.98
- sMAPE: 41.20%

Selected model distribution:

| Model | Series |
|---|---:|
| ARIMA(1,0,1) | 35 |
| HistGradientBoosting | 23 |
| TunedRF_300_depth12_leaf1 | 16 |
| Random Forest | 15 |
| Naive | 9 |
| SeasonalNaive7 | 2 |

Known limitation: high-demand observations are underpredicted. For Demand >= 125, actual mean = 158.04 and forecast mean = 106.72; mean bias = -51.32; actual maximum = 284 and forecast maximum = 146.

## 5. Phase 6 — Inventory Optimization

Frozen Phase 5 forecasts are the demand input.

Base assumptions:

- Lead Time = 7 days
- Service Level = 95%

Scenarios:

- Lead Time: 3 / 7 / 14 days
- Service Level: 90% / 95% / 99%

Core formulas:

```text
Lead-Time Demand = sum of forecast demand over selected lead-time window
Safety Stock = Z × Demand Std Dev × √Lead Time
Reorder Point = Lead-Time Demand + Safety Stock
Recommended Order Quantity = max(Reorder Point − Current Inventory, 0), rounded up
```

Validated reconciliation:

- Total Forecast Demand = 278,398.48
- Decision Units = 100
- Current Inventory = 29,049
- Safety Stock = 18,669.09
- Reorder Point = 80,496.07
- Inventory Gap = 51,447.07
- Recommended Order = 52,083
- High Risk = 95
- Medium Risk = 2
- Low Risk = 3

Risk/excess classifications are business rules, not probabilities or financial-impact estimates.

## 6. Phase 7 — Web Application Platform

Architecture:

```text
Next.js / React / TypeScript
          ↓
FastAPI
          ↓
Data Service / MySQL
          ↓
Phase 5 + Phase 6 analytical outputs
```

Current backend routes:

- `GET /health`
- `GET /api`
- `GET /api/overview`
- `GET /api/actions`

Current frontend foundation renders Control Tower, Demand, Inventory, and Actions module cards.

The broader blueprint includes Store Explorer, Product Explorer, cross-filtering, drill-through, 3D/network visualization, and Power BI workspace integration. Those are not represented as completed current functionality unless implemented in code.

Power BI remains a separate analytical layer.

## 7. Data artifacts

Validated artifacts:

| Artifact | Rows | Columns |
|---|---:|---:|
| sales_data.csv | 76,000 | 16 |
| final_demand_forecasts.csv | 3,000 | 5 |
| inventory_recommendations.csv | 100 | 21 |

The repository's artifact manifest records SHA-256 hashes for the validated workspace files. The actual forecast and inventory CSVs are not currently committed to the GitHub tree; the application expects them at the documented mounted paths.

## 8. Database source of truth

Current application schema:

`database/schema.sql`

Database:

`supply_chain_intelligence`

Tables:

- stores
- products
- forecasts
- inventory_recommendations

`sql/schema.sql` is a legacy placeholder and is not treated as the current application schema.

## 9. Documentation set

- [Project Overview](docs/PROJECT_OVERVIEW.md)
- [Data Dictionary](docs/DATA_DICTIONARY.md)
- [Data Pipeline](docs/DATA_PIPELINE.md)
- [Forecasting Methodology](docs/FORECASTING_METHODOLOGY.md)
- [Inventory Optimization](docs/INVENTORY_OPTIMIZATION.md)
- [Platform Architecture](docs/PLATFORM_ARCHITECTURE.md)
- [API Documentation](docs/API_DOCUMENTATION.md)
- [Database Schema](docs/DATABASE_SCHEMA.md)
- [Deployment](docs/DEPLOYMENT.md)
- [Testing](docs/TESTING.md)
- [Limitations](docs/LIMITATIONS.md)
- [User Guide](docs/USER_GUIDE.md)

## 10. Quality rules

The project must:

- never fabricate metrics or business impact,
- preserve chronological forecasting integrity,
- keep recommendations traceable to calculations,
- document assumptions explicitly,
- distinguish analytical artifacts from application behavior,
- avoid calling local development infrastructure production deployment,
- and update this master document whenever a material project decision changes.

## 11. Change log

| Date | Change |
|---|---|
| 2026-09-25 | Phase 5 forecasting completed and frozen |
| 2026-09-25 | Phase 6 inventory optimization completed |
| 2026-09-26 | Phase 7 platform foundation and API layer added |
| 2026-09-27 | Phase 8 documentation and project knowledge base completed |

## 12. Final project state

The project now has a documented analytical chain from validated sales data through forecasting and inventory decision support into an application foundation.

The documentation intentionally records remaining implementation/artifact gaps instead of presenting blueprint items as completed functionality.
