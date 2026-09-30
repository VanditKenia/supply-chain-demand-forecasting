# Supply Chain Intelligence Platform

> **Project Master Document / Single Source of Truth**

This document governs the current scope, methodology, architecture, validation standards, phase status, deployment posture, and documentation state of the project.

## 1. Project identity

- **Project:** Supply Chain Intelligence Platform
- **Repository:** \`VanditKenia/supply-chain-demand-forecasting\`
- **Type:** Supply Chain Analytics / Demand Forecasting / Inventory Decision Support / Web Platform
- **Primary objective:** Convert validated historical supply-chain data into demand forecasts, inventory-risk measurements, replenishment recommendations, and business-facing decision support.

## 2. Current status

**Current phase: Phase 10 — Portfolio Hardening**

Phases 0–9 are complete at their documented current scope. Phase 9 added the public Render deployment of the Next.js frontend and FastAPI backend. Phase 10 focuses on presentation quality, interview readiness, validation, and engineering hardening.

## 3. Phase status

| Phase | Status | Deliverable / current state |
|---|---|---|
| Phase 0 — Setup | Complete | Repository, Git workflow, project structure |
| Phase 1 — Dataset | Complete | 76,000-row validated retail dataset |
| Phase 2 — Data Engineering | Complete | Data quality validation and application schema |
| Phase 3 — SQL Analytics | Complete | SQL analytical layer and demand analysis |
| Phase 4 — Data Analysis / EDA | Complete | Demand, seasonality, store/product, volatility and anomaly analysis |
| Phase 5 — Demand Forecasting | Complete | 30-day forecasts for 100 Store × Product series |
| Phase 6 — Inventory Optimization | Complete | 100 inventory decision records; base 7-day/95% scenario |
| Phase 7 — Web Application Platform | Complete | Next.js/FastAPI/MySQL/Docker foundation and operational workspaces |
| Phase 8 — Documentation | Complete | Professional project knowledge base |
| Phase 9 — Cloud Deployment | Complete | Public Render frontend + FastAPI deployment |
| Phase 10 — Portfolio Hardening | Current | README/product presentation, validation, interview readiness |

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

Known limitation: high-demand observations are underpredicted. For Demand >= 125, actual mean = 158.04 and forecast mean = 106.72; mean bias = -51.32.

## 5. Phase 6 — Inventory Optimization

Frozen Phase 5 forecasts are the demand input.

Base assumptions:

- Lead Time = 7 days
- Service Level = 95%

Scenarios:

- Lead Time: 3 / 7 / 14 days
- Service Level: 90% / 95% / 99%

Core formulas:

\`\`\`text
Lead-Time Demand = sum of forecast demand over selected lead-time window
Safety Stock = Z × Demand Std Dev × √Lead Time
Reorder Point = Lead-Time Demand + Safety Stock
Recommended Order Quantity = max(Reorder Point − Current Inventory, 0), rounded up
\`\`\`

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

\`\`\`text
Next.js / React / TypeScript
          |
       FastAPI
          |
    Data Service
          |
 Phase 5 + Phase 6 outputs
\`\`\`

Current frontend workspaces:

1. Control Tower
2. Demand Intelligence
3. Inventory Intelligence
4. Action Center
5. Analytics

Current backend routes include:

- \`GET /health\`
- \`GET /api\`
- \`GET /api/overview\`
- \`GET /api/actions\`

Power BI remains a separate analytical layer.

## 7. Phase 8 — Documentation

The documentation layer includes:

- Project Overview
- Data Dictionary
- Data Pipeline
- Forecasting Methodology
- Inventory Optimization
- Platform Architecture
- API Documentation
- Database Schema
- Deployment
- Testing
- Limitations
- User Guide

The documentation must distinguish implemented behavior from future blueprint items.

## 8. Phase 9 — Cloud Deployment

The application is publicly deployed from GitHub \`main\` using Render.

### Frontend

- Platform: Render Web Service
- Framework: Next.js 15 / React 19
- Public URL: \`https://supply-chain-intelligence-fyul.onrender.com/\`

### Backend

- Platform: Render Web Service
- Framework: FastAPI / Uvicorn
- Public URL: \`https://supply-chain-demand-forecasting-wc7g.onrender.com/\`
- Health endpoint: \`/health\`
- Verified response includes \`status: ok\` and \`data_ready: true\`

### Deployment verification

- GitHub \`main\` connected
- Backend deployed
- Backend health verified
- Forecast/inventory data available at runtime
- Frontend deployed
- Frontend-to-backend communication verified
- All five application workspaces verified manually

### Free-tier behavior

Render Free Web Services may spin down after inactivity. This is a service lifecycle behavior, not deletion of the deployment. A later request can wake the service and may experience a cold-start delay.

The deployment is intended for portfolio/demo access and is not represented as enterprise production infrastructure.

## 9. Data artifacts

Validated artifacts:

| Artifact | Rows | Columns |
|---|---:|---:|
| sales_data.csv | 76,000 | 16 |
| final_demand_forecasts.csv | 3,000 | 5 |
| inventory_recommendations.csv | 100 | 21 |

The artifact manifest records SHA-256 hashes and validation results.

## 10. Database source of truth

Current application schema:

\`database/schema.sql\`

Database:

\`supply_chain_intelligence\`

Tables:

- stores
- products
- forecasts
- inventory_recommendations

\`sql/schema.sql\` is a legacy placeholder and is not treated as the current application schema.

## 11. Phase 10 — Portfolio Hardening

Current objectives:

- Maintain an inspectable, product-style GitHub landing page
- Keep public deployment links visible
- Preserve analytical evidence and limitations
- Verify live application behavior
- Improve interview/demo readiness
- Avoid claiming unimplemented capabilities
- Add stronger automated testing and operational controls where justified

Phase 10 is presentation and engineering hardening, not a license to alter validated forecasting results.

## 12. Quality rules

The project must:

- never fabricate metrics or business impact,
- preserve chronological forecasting integrity,
- keep recommendations traceable to calculations,
- document assumptions explicitly,
- distinguish analytical artifacts from application behavior,
- distinguish portfolio deployment from enterprise production infrastructure,
- and update this master document whenever a material project decision changes.

## 13. Change log

| Date | Change |
|---|---|
| 2026-09-25 | Phase 5 forecasting completed and frozen |
| 2026-09-25 | Phase 6 inventory optimization completed |
| 2026-09-26 | Phase 7 platform foundation and API layer added |
| 2026-09-27 | Phase 8 documentation and project knowledge base completed |
| 2026-09-30 | Phase 9 cloud deployment completed on Render |
| 2026-09-30 | README redesigned as product-style project landing page |
| 2026-09-30 | Phase 10 portfolio hardening started |

## 14. Final current state

The project now spans:

**Validated data → forecasting → inventory optimization → operational web platform → documentation → public cloud deployment.**

The public application is live and the repository landing page now presents the project as a supply-chain intelligence product rather than a conventional notebook repository.
