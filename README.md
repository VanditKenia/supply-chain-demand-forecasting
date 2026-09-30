# Supply Chain Intelligence Platform

> **From demand signals to replenishment decisions — one operational control tower.**

A supply-chain intelligence platform that turns historical retail demand into **30-day forecasts, inventory-risk signals, reorder recommendations, and an operational decision interface**.

**Live application:** https://supply-chain-intelligence-fyul.onrender.com/  
**API:** https://supply-chain-demand-forecasting-wc7g.onrender.com/  
**API health:** https://supply-chain-demand-forecasting-wc7g.onrender.com/health

---

## The project in one picture

```text
                         SUPPLY CHAIN INTELLIGENCE
                                  |
             +--------------------+--------------------+
             |                    |                    |
             v                    v                    v
       Historical Sales      Forecast Engine      Inventory State
             |                    |                    |
             +--------------+-----+-----+--------------+
                            |           |
                            v           v
                     30-Day Forecast   Risk Classification
                            |           |
                            +-----+-----+
                                  |
                                  v
                         Reorder Point / Safety Stock
                                  |
                                  v
                         Recommended Order Quantity
                                  |
                                  v
                         +---------------------+
                         |    CONTROL TOWER     |
                         | Demand | Inventory   |
                         | Risk   | Actions     |
                         +---------------------+
                                  |
                                  v
                        Next.js + FastAPI Platform
                                  |
                                  v
                              Render Cloud
```

---

## Why this is more than a forecasting notebook

The project connects the complete analytical chain:

**Historical data → validation → forecasting → inventory optimization → risk → replenishment action → operational interface → cloud deployment**

The forecast is not treated as the final answer. It becomes an input to an inventory decision system.

---

## Live product

| Module | Purpose |
|---|---|
| **01 — Control Tower** | Executive operational view of demand and inventory risk |
| **02 — Demand Intelligence** | 30-day forecast trajectories and model behavior |
| **03 — Inventory Intelligence** | Safety stock, reorder point and stock-risk analysis |
| **04 — Action Center** | Prioritized replenishment decision queue |
| **05 — Analytics** | Analytical reporting and BI workspace |

### Open the system

**[Launch the live Supply Chain Intelligence Platform](https://supply-chain-intelligence-fyul.onrender.com/)**

**[Check the live FastAPI health endpoint](https://supply-chain-demand-forecasting-wc7g.onrender.com/health)**

---

## Executive snapshot

| Signal | Current result |
|---|---:|
| Historical sales observations | **76,000** |
| Store × Product series | **100** |
| Forecast horizon | **30 days** |
| Forecast observations | **3,000** |
| Recommended replenishment | **52,083 units** |
| High-risk units | **95 / 100** |
| Base lead time | **7 days** |
| Base service level | **95%** |

### Forecast evaluation

| Metric | January 2024 test |
|---|---:|
| MAE | **35.40** |
| RMSE | **45.98** |
| sMAPE | **41.20%** |

These metrics are reported from the frozen chronological test evaluation and are not presented as guarantees of future performance.

---

## Forecast engine

The system evaluates multiple forecasting strategies and selects a model independently for each Store × Product series.

```text
MODEL SELECTION ACROSS 100 SERIES

ARIMA(1,0,1)                 35
HistGradientBoosting         23
Tuned Random Forest          16
Random Forest                15
Naive                         9
Seasonal Naive                2
                             ---
                             100
```

### Evaluation design

- Training: **2022-01-01 → 2023-11-30**
- Validation: **2023-12-01 → 2023-12-31**
- Final test: **2024-01-01 → 2024-01-30**
- Forecast horizon: **30 days**
- Forecast grain: **Date × Store ID × Product ID**
- Model selection is performed per series rather than forcing one global model.

---

## Inventory decision engine

Frozen forecasts feed the inventory optimization layer.

### Base scenario

- Lead time: **7 days**
- Service level: **95%**

### Core logic

```text
Lead-Time Demand
        |
        v
Safety Stock
        |
        v
Reorder Point
        |
        v
Current Inventory Comparison
        |
        v
Recommended Order
        |
        v
Risk / Action
```

### Core formulas

```text
Safety Stock = Z × Demand Std Dev × sqrt(Lead Time)

Reorder Point = Lead-Time Demand + Safety Stock

Recommended Order
= max(Reorder Point − Current Inventory, 0)
  rounded up
```

### Validated reconciliation

| Metric | Value |
|---|---:|
| Total forecast demand | **278,398.48** |
| Current inventory | **29,049** |
| Safety stock | **18,669.09** |
| Reorder point | **80,496.07** |
| Inventory gap | **51,447.07** |
| Recommended order | **52,083** |
| High risk | **95** |
| Medium risk | **2** |
| Low risk | **3** |

These are planning outputs under explicit assumptions, not guaranteed savings or stockout probabilities.

---

## Architecture

```text
+---------------------------------------------------------------+
|                       USER / INTERVIEWER                      |
+-------------------------------+-------------------------------+
                                |
                                v
+---------------------------------------------------------------+
|                  NEXT.JS 15 + REACT 19                       |
| Control Tower | Demand | Inventory | Actions | Analytics      |
+-------------------------------+-------------------------------+
                                | REST API
                                v
+---------------------------------------------------------------+
|                    FASTAPI APPLICATION                        |
| Overview | Forecast Trend | Risk | Actions | Health           |
+-------------------------------+-------------------------------+
                                |
                    +-----------+-----------+
                    |                       |
                    v                       v
          Forecast Artifacts       Inventory Artifacts
                    |                       |
                    +-----------+-----------+
                                |
                                v
                     Analytical Data Layer
                                |
                                v
                    +-----------------------+
                    |     RENDER CLOUD      |
                    |  Frontend + API live  |
                    +-----------------------+

Local engineering layer:
Docker Compose → Next.js + FastAPI + MySQL
```

---

## Cloud deployment

The application is deployed as two Render web services from the same GitHub repository:

```text
                    GitHub / main
                         |
              +----------+----------+
              v                     v
        Render Web Service    Render Web Service
             Frontend               Backend
          Next.js 15              FastAPI
              |                     |
              +----------+----------+
                         |
                         v
                 Live application
```

### Deployment status

- [x] GitHub main branch connected
- [x] FastAPI deployed
- [x] FastAPI health check verified
- [x] Forecast/inventory data validated at runtime
- [x] Next.js frontend deployed
- [x] Frontend → API connection verified
- [x] All five application workspaces verified
- [x] Live public URLs available

> **Free-tier note:** Render Free Web Services can spin down after inactivity. The deployment remains available and can wake on the next request; the first request after inactivity may have a cold-start delay.

---

## Project evolution

```text
PHASE 0   Setup                         ✓
PHASE 1   Dataset                       ✓
PHASE 2   Data Engineering              ✓
PHASE 3   SQL Analytics                 ✓
PHASE 4   EDA                            ✓
PHASE 5   Demand Forecasting             ✓
PHASE 6   Inventory Optimization         ✓
PHASE 7   Intelligence Platform          ✓
PHASE 8   Documentation                  ✓
PHASE 9   Cloud Deployment               ✓
PHASE 10  Portfolio Hardening            ◐ CURRENT
```

### Phase 9 added

The analytical project became a publicly accessible application:

**GitHub → Render → Next.js → FastAPI → validated forecasting/inventory outputs**

The next work is presentation and engineering hardening rather than inventing additional capabilities.

---

## Data artifacts

The validated artifact manifest records the current analytical files:

| Artifact | Rows | Columns | Status |
|---|---:|---:|---|
| `sales_data.csv` | 76,000 | 16 | Verified |
| `final_demand_forecasts.csv` | 3,000 | 5 | Verified |
| `inventory_recommendations.csv` | 100 | 21 | Verified |

See [ARTIFACT_MANIFEST.md](data/processed/ARTIFACT_MANIFEST.md) for validation and SHA-256 hashes.

---

## Engineering honesty

A strong portfolio project should expose where the model struggles.

The current forecasting system **underpredicts high-demand observations**. For demand ≥ 125:

- Actual mean: **158.04**
- Forecast mean: **106.72**
- Mean bias: **−51.32**

This limitation is documented rather than hidden behind an arbitrary forecast uplift.

Other known boundaries:

- Forecasting is based on historical data.
- Lead time is an explicit planning assumption.
- Service level is an explicit planning assumption.
- There is no live ERP/WMS integration.
- The cloud deployment is a portfolio/demo deployment, not a claim of enterprise production readiness.
- No guaranteed financial impact is claimed.

See [Limitations](docs/LIMITATIONS.md).

---

## Technology stack

| Layer | Technology |
|---|---|
| Data analysis | Python, Pandas, NumPy |
| Forecasting | Statsmodels, scikit-learn |
| API | FastAPI, Uvicorn |
| Frontend | Next.js 15, React 19, TypeScript |
| Visualization | ECharts |
| UI motion | Framer Motion |
| Database schema | MySQL 8.4 |
| BI | Power BI / DAX |
| Local deployment | Docker Compose |
| Cloud deployment | Render |
| Version control | Git / GitHub |

---

## Repository map

```text
supply-chain-demand-forecasting/
|
├── README.md                    ← You are here
├── PROJECT_MASTER.md            ← Project source of truth
|
├── data/
│   ├── raw/
│   └── processed/
│       └── ARTIFACT_MANIFEST.md
|
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   └── data_service.py
│   └── requirements.txt
|
├── frontend/
│   ├── app/
│   │   ├── components/
│   │   ├── services/
│   │   ├── page.tsx
│   │   └── globals.css
│   └── package.json
|
├── database/
│   └── schema.sql
|
├── docs/
├── notebooks/
├── sql/
├── platform/
├── dashboard/
├── reports/
├── assets/
└── docker-compose.yml
```

---

## Local development

### Clone

```bash
git clone https://github.com/VanditKenia/supply-chain-demand-forecasting.git
cd supply-chain-demand-forecasting
```

### Docker Compose

```bash
docker compose up
```

Local services:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`
- MySQL: `localhost:3306`

For detailed deployment and runtime requirements, see [Deployment](docs/DEPLOYMENT.md).

---

## Documentation

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

---

## Author

**Vandit Kenia**

Built as a portfolio project spanning **data engineering, SQL analytics, time-series forecasting, inventory optimization, API development, frontend engineering, BI, and cloud deployment**.

---

### Current project status

**Phase 10 — Portfolio Hardening**

The analytical engine, inventory decision layer, application platform, documentation, and public deployment are complete. Current work focuses on making the project easier to inspect, demonstrate, and discuss in technical interviews.
