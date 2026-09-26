# Phase 7 — Supply Chain Intelligence Platform

## 1. Product Mission & System Architecture

The Supply Chain Intelligence Platform completes Phase 7 by transforming chronological forecast models and inventory safety stock calculations into an interactive, operations-grade decision support platform.

The end-to-end data pipeline connects:
```text
Historical Sales (76,000 observations)
       ↓
Demand Forecasting (3,000 predictions, 100 series, 30-day horizon)
       ↓
Inventory Optimization (100 Store × SKU decision units)
       ↓
Replenishment Dispatch Action Center
```

### Hybrid Platform Architecture
The platform is designed with a strict **Separation of Concerns**:
- **Native Next.js Application (Operational Experience):**
  - Next.js 15, React 19, TypeScript
  - Apache ECharts for time-series forecasting, risk distribution, and inventory adequacy
  - Framer Motion for subtle transitions and interactive state communication
  - Control Tower, Demand Intelligence, Inventory Intelligence, Action Center, and Power BI Workspace
  - Real-time decision inspection drawers with deterministic formula breakdowns
- **Power BI Layer (Analytical Reporting Experience):**
  - Dimensional Star Schema modeling (`DimDate`, `DimStore`, `DimProduct`, `FactForecast`, `FactInventoryRecommendation`)
  - Production DAX Measure Library
  - 3-page deep-dive analytical reporting blueprint (`docs/POWER_BI_ANALYTICS.md`)
  - Web service connector via `NEXT_PUBLIC_POWERBI_REPORT_URL`

---

## 2. Core Operational Workspaces

### 01 — Control Tower (`/`)
- **Telemetry & Validation Banner:** Displays live artifact validation state (76,000 historical, 3,000 forecast, 100 inventory rows), active date range, and series count.
- **Dynamic KPI Ribbon:** Total Forecast Demand (278.4k), Recommended Order Quantity (52.1k), High-Risk Units (95/100), Current Inventory (29.0k), Safety Stock Buffer (18.7k), and Node Topology.
- **30-Day Aggregate Forecast Curve:** ECharts time-series line chart displaying daily network demand across January 2024.
- **Network Risk Profile Donut:** Visual breakdown of High Risk (95%), Medium Risk (2%), and Low Risk (3%) units.
- **Replenishment Ranking Bar:** Top Store × Product series ranked by recommended order volume.
- **Priority Action Table:** Real-time clickable ledger triggering deep decision audits.

### 02 — Demand Intelligence
- **Interactive Time-Series Explorer:** 30-day horizon line chart equipped with multi-tier zoom and brush tools.
- **Slicing Controls:** Dynamic filtering by Store (S001–S005), Product (P0001–P0020), Model Architecture, and Search terms.
- **Model Distribution Breakdown:** Proportions of selected models evaluated via validation MAE:
  - `ARIMA(1,0,1)`: 35 series
  - `HistGradientBoosting`: 23 series
  - `TunedRF_300_depth12_leaf1`: 16 series
  - `RandomForest`: 15 series
  - `Naive`: 9 series
  - `SeasonalNaive7`: 2 series
- **Known Limitation Panel:** Transparent disclosure of Phase 5 regression toward the mean for high-demand observations (Demand ≥ 125 units: Actual Mean 158.04 vs Forecast Mean 106.72, Mean Bias -51.32).
- **3,000-Row Paginated Forecast Ledger:** Searchable, sortable table with server/client pagination.

### 03 — Inventory Intelligence
- **Inventory Adequacy Visuals:** Clustered comparison of Current Inventory vs Reorder Point (ROP) across store nodes.
- **Risk Exposure by Store:** 100% stacked bar chart showing stockout vulnerability distribution.
- **SKU Demand Ranking:** Net recommended replenishment volume per product SKU.
- **Decision Matrix Ledger:** Complete 100-row table detailing Lead-Time Demand (7d), Demand Std Dev, Safety Stock (Z=1.6449), ROP, Inventory Gap, and Excess Inventory.

### 04 — Action Center
- **Prioritized Action Queue:** Ordered deterministically by Phase 6 Priority (P1 Urgent Replenish, P2 Monitor Buffer, P3 Maintain/Excess) and Recommended Order Quantity.
- **Contextual Decision Explanations:** Deterministic formula-driven rationales for each action item.
- **Inspect Drawer:** Interactive side drawer with decision metrics, policy assumptions, and dedicated 30-day series forecast mini chart.

### 05 — Analytics (Power BI Workspace)
- **Hybrid Explainer Ribbon:** Explains operational vs analytical responsibilities.
- **Power BI Service Connector:** Direct launch button for configured Power BI service reports (`NEXT_PUBLIC_POWERBI_REPORT_URL`).
- **3-Page Report Specification Blueprints:** Interactive walkthrough of Executive Overview, Demand Analysis, and Inventory Optimization pages.
- **Production DAX Measure Library:** Reference table with exact DAX formulas for safety stock, ROP, recommended orders, and risk categories.

---

## 3. Backend API Architecture (FastAPI)

The backend provides high-performance cached endpoints backed by strict analytical data validation:

| Endpoint | Method | Purpose |
|---|---|---|
| `/health` | GET | Health status and data readiness flag |
| `/api` | GET | API index and documentation map |
| `/api/overview` | GET | Platform-level KPI sums, counts, and validation status |
| `/api/forecasts` | GET | Paginated forecast records with dynamic filtering and summary stats |
| `/api/forecasts/trend` | GET | 30-day daily aggregated demand series with store/product breakdowns |
| `/api/inventory` | GET | Inventory decisions with risk/priority filtering and aggregate metrics |
| `/api/risk` | GET | Risk distribution, store risk profiles, and top replenishment rankings |
| `/api/actions` | GET | Prioritized action dispatch queue with deterministic explanations |
| `/api/stores` | GET | Store node summaries with total demand and high-risk counts |
| `/api/products` | GET | Product SKU summaries with demand rates and models used |

### Error & Validation Handling:
- Missing artifacts return clean `HTTP 503 Service Unavailable` with specific file details.
- Invalid row counts (e.g. non-3,000 forecast rows) or negative values are flagged upon startup.

---

## 4. Local Execution & Docker Deployment

### Run Locally:
```bash
# 1. Start FastAPI Backend
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# 2. Start Next.js Frontend
cd ../frontend
npm run dev
```

### Run via Docker Compose:
```bash
docker compose up --build
```
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- API Docs: `http://localhost:8000/docs`
- MySQL Database: `localhost:3306`
