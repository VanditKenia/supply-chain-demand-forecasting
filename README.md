# Supply Chain Demand Forecasting & Inventory Optimization

End-to-end demand forecasting and inventory decision-support project that converts historical retail data into 30-day forecasts, inventory-risk measurements, and replenishment recommendations.

## 1. Problem statement

Retail inventory planning has two competing risks: stockouts and excess inventory. Historical sales data contains demand patterns, but raw observations do not directly provide a defensible future-demand estimate or an actionable inventory requirement.

This project builds an analytical chain from validated historical data to forecast-driven inventory decisions.

## 2. Solution

The project:

1. validates a 76,000-row retail time-series dataset,
2. analyzes demand at Store × Product level,
3. evaluates multiple forecasting methods chronologically,
4. selects a model independently for each Store × Product series,
5. produces a frozen 30-day demand forecast,
6. converts the forecast into lead-time demand, safety stock, reorder point, inventory gap, risk, and replenishment recommendations,
7. exposes the analytical outputs through a FastAPI application layer,
8. provides a Next.js/React web-platform foundation, and
9. documents the entire system for reproducibility and review.

## 3. Architecture

```text
Historical Sales
      ↓
Validation / SQL / EDA
      ↓
Phase 5: Demand Forecasting
      ↓
30-Day Forecast
      ↓
Phase 6: Inventory Optimization
      ↓
Risk + Recommended Order
      ↓
Phase 7: Web Platform
      ├── Next.js / React
      ├── FastAPI
      └── MySQL schema
      ↓
Separate Power BI analytical layer
```

## 4. Key features

- Balanced 76,000-row daily retail panel
- 100 Store × Product forecasting series
- 30-day chronological forecast horizon
- Per-series model selection
- Leakage controls
- Inventory optimization under explicit assumptions
- Lead-time and service-level scenario analysis
- Risk/action/replenishment decision layer
- FastAPI overview and action endpoints
- Next.js/React application foundation
- MySQL schema
- Docker Compose local stack
- Documentation and validation trail

## 5. Technology stack

| Layer | Technology |
|---|---|
| Analysis | Python, Pandas, NumPy |
| Forecasting | Statsmodels, scikit-learn |
| Database | MySQL 8.4 |
| API | FastAPI, Uvicorn |
| Frontend | Next.js 15, React 19, TypeScript |
| UI motion | Framer Motion |
| BI | Power BI / DAX |
| Containers | Docker Compose |
| Version control | Git / GitHub |

## 6. Project pipeline

| Phase | State |
|---|---|
| Phase 0 — Setup | Complete |
| Phase 1 — Dataset | Complete |
| Phase 2 — Data Engineering | Complete |
| Phase 3 — SQL Analytics | Complete |
| Phase 4 — Data Analysis / EDA | Complete |
| Phase 5 — Demand Forecasting | Complete |
| Phase 6 — Inventory Optimization | Complete |
| Phase 7 — Web Application Platform | Foundation complete |
| Phase 8 — Documentation | Complete |

## 7. Forecasting results

Chronological split:

- Training: 2022-01-01 → 2023-11-30
- Validation: 2023-12-01 → 2023-12-31
- Final test: 2024-01-01 → 2024-01-30
- Horizon: 30 days

Final January 2024 test:

| Metric | Result |
|---|---:|
| MAE | 35.40 |
| RMSE | 45.98 |
| sMAPE | 41.20% |

Selected models across 100 series:

| Model | Series |
|---|---:|
| ARIMA(1,0,1) | 35 |
| HistGradientBoosting | 23 |
| TunedRF_300_depth12_leaf1 | 16 |
| Random Forest | 15 |
| Naive | 9 |
| SeasonalNaive7 | 2 |

Known limitation: high-demand observations are underpredicted. Demand >= 125 had actual mean 158.04 versus forecast mean 106.72.

## 8. Inventory optimization results

Base scenario:

- Lead Time = 7 days
- Service Level = 95%

Scenarios:

- Lead Time: 3 / 7 / 14 days
- Service Level: 90% / 95% / 99%

Core formulas:

```text
Safety Stock = Z × Demand Std Dev × √Lead Time
Reorder Point = Lead-Time Demand + Safety Stock
Recommended Order = max(Reorder Point − Current Inventory, 0), rounded up
```

Validated reconciliation:

| Metric | Value |
|---|---:|
| Total Forecast Demand | 278,398.48 |
| Decision Units | 100 |
| Recommended Order | 52,083 |
| High Risk | 95 |
| Medium Risk | 2 |
| Low Risk | 3 |

These are planning outputs under explicit assumptions, not guaranteed savings or stockout probabilities.

## 9. Platform

The current application foundation contains:

- Control Tower
- Demand
- Inventory
- Actions
- FastAPI overview endpoint
- FastAPI action endpoint with risk filter
- MySQL application schema
- Docker Compose stack

The repository blueprint also describes Store Explorer, Product Explorer, deeper interactive analytics, and Power BI workspace integration. Those areas should not be interpreted as completed functionality unless their implementation is present.

## 10. Screenshots

Place validated screenshots under `assets/screenshots/` and reference them here when available.

```text
assets/screenshots/
├── control-tower.png
├── demand-intelligence.png
├── inventory-intelligence.png
└── action-center.png
```

No screenshots are claimed as committed by this documentation update.

## 11. Repository structure

```text
supply-chain-demand-forecasting/
├── README.md
├── PROJECT_MASTER.md
├── PHASE_5_RESULTS.md
├── PHASE_6_RESULTS.md
├── docs/
├── backend/
├── frontend/
├── database/
├── data/
├── sql/
├── notebooks/
├── platform/
├── dashboard/
├── reports/
├── assets/
└── docker-compose.yml
```

## 12. Setup

### Clone

```bash
git clone https://github.com/VanditKenia/supply-chain-demand-forecasting.git
cd supply-chain-demand-forecasting
```

### Start the local stack

```bash
docker compose up
```

Services:

- Frontend: port 3000
- Backend: port 8000
- MySQL: port 3306

### Required analytical artifacts

The application expects:

```text
data/raw/sales_data.csv
data/processed/final_demand_forecasts.csv
data/processed/inventory_recommendations.csv
```

The validated forecast and inventory artifacts are recorded in `data/processed/ARTIFACT_MANIFEST.md` but are not currently committed to the GitHub tree. Do not replace them with fabricated placeholders.

## 13. Usage

1. Start the Docker Compose stack.
2. Open the frontend on port 3000.
3. Use the platform foundation to navigate the Control Tower, Demand, Inventory, and Actions areas.
4. The backend overview route provides reconciled analytical summary metrics once artifacts are mounted.
5. Use `/api/actions?risk=High` to filter replenishment decisions by risk.
6. Use Power BI separately for deeper analytical reporting where its artifacts are maintained.

## 14. Limitations

- High-demand forecast underestimation
- Retrospective planning data
- 7-day lead time is an assumption
- 95% service level is an assumption
- No live telemetry
- No real-time ERP/WMS integration
- Power BI is a separate analytical layer
- Phase 7 is currently a foundation rather than a fully completed operational product
- No guaranteed financial impact is claimed

See [Limitations](docs/LIMITATIONS.md).

## 15. Future scope

Future work may include:

- safe synchronization of validated Phase 5/6 artifacts into the repository/runtime,
- implementation of deeper frontend analytical pages,
- richer filtering and drill-through,
- Store/Product exploration,
- completed Power BI integration where required,
- stronger automated API/frontend tests,
- production deployment only after appropriate operational controls are added.

These are future scope items, not current capabilities.

## 16. Documentation

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
- [Project Master](PROJECT_MASTER.md)

## 17. Author

**Vandit Kenia**

Supply Chain Demand Forecasting & Inventory Optimization — portfolio project focused on analytics, forecasting, inventory decision support, SQL, and application integration.
