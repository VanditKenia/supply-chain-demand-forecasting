# Platform Architecture

## Phase 7 — Supply Chain Intelligence Platform

Phase 7 is the operational presentation and decision-consumption layer around the validated Phase 5 and Phase 6 analytical outputs.

## Logical architecture

```text
┌───────────────────────────────┐
│ Next.js / React / TypeScript  │
│ Web experience                │
└───────────────┬───────────────┘
                │ HTTP
                ▼
┌───────────────────────────────┐
│ FastAPI                       │
│ API + analytical data service │
└───────────────┬───────────────┘
                │
                ├───────────────┐
                ▼               ▼
┌─────────────────────┐  ┌────────────────────────┐
│ MySQL schema        │  │ Analytical CSV artifacts│
│ supply_chain_       │  │ Phase 5 + Phase 6      │
│ intelligence        │  └────────────────────────┘
└─────────────────────┘
```

The Docker Compose stack also provisions MySQL, the FastAPI backend, and the Next.js frontend.

## Technology

### Frontend

- Next.js 15
- React 19
- TypeScript
- Framer Motion
- Tailwind CSS/design-system foundation
- Apache ECharts dependency
- Three.js / React Three Fiber dependencies

### Backend

- FastAPI
- Python 3.12 container
- Pandas data service
- Uvicorn

### Database

- MySQL 8.4
- Database: `supply_chain_intelligence`

### BI layer

Power BI + DAX remains a separate analytical layer. It should not be described as being embedded into the current FastAPI/Next.js application unless that integration is actually implemented.

## Application modules

The intended product areas are:

1. **Control Tower** — high-level supply-chain state and decision overview.
2. **Demand Intelligence** — exploration of the 30-day forecast layer.
3. **Inventory Intelligence** — inventory pressure, reorder-point, safety-stock, and risk interpretation.
4. **Action Center** — replenishment decisions and recommended actions.
5. **Analytics** — deeper analytical reporting, including the separate Power BI layer.

The platform blueprint also defines Store Explorer and Product Explorer, but these are not documented as completed current functionality.

## Current implementation status

The current frontend code renders a foundation experience with four navigation/module cards:

- Control Tower
- Demand
- Inventory
- Actions

The backend currently exposes:

- `GET /health`
- `GET /api`
- `GET /api/overview`
- `GET /api/actions`

The data service loads the sales, forecast, and inventory CSV paths and derives overview/action responses. It does not implement a full CRUD or forecasting engine.

## Data consumption

The backend reads:

- `/data/raw/sales_data.csv`
- `/data/processed/final_demand_forecasts.csv`
- `/data/processed/inventory_recommendations.csv`

The Docker Compose file mounts the repository `data` directory read-only into the backend container.

## Separation of concerns

- Phase 5 owns demand forecasting methodology and frozen forecast outputs.
- Phase 6 owns inventory optimization calculations and recommendations.
- Phase 7 owns application presentation and API consumption.
- Power BI owns deeper analytical reporting where applicable.
- Phase 8 owns documentation.

This separation prevents the web layer from silently changing validated analytical results.
