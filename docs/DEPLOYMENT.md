# Deployment

## Current deployment posture

The project has two deployment layers:

1. **Local engineering stack** using Docker Compose
2. **Public portfolio deployment** using Render

The public deployment is intended to make the working application accessible for demonstrations, portfolio review, and interviews. It is not represented as enterprise production infrastructure.

## Public deployment

### Frontend

- Platform: Render Web Service
- Framework: Next.js 15 / React 19
- Root directory: `frontend`
- Build command: `npm install && npm run build`
- Start command: `npm start`
- Public URL: https://supply-chain-intelligence-fyul.onrender.com/

### Backend

- Platform: Render Web Service
- Framework: FastAPI / Uvicorn
- Root directory: `backend`
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Public URL: https://supply-chain-demand-forecasting-wc7g.onrender.com/
- Health endpoint: https://supply-chain-demand-forecasting-wc7g.onrender.com/health

### Frontend environment

The deployed frontend uses:

```text
NEXT_PUBLIC_API_URL=https://supply-chain-demand-forecasting-wc7g.onrender.com
```

This keeps the browser client from falling back to the local development API address.

## Deployment verification

The deployment was manually verified after both services were live:

- GitHub `main` branch connected
- FastAPI service deployed successfully
- `/health` returned `status: ok`
- `/health` returned `data_ready: true`
- Forecast and inventory artifacts loaded successfully
- Next.js frontend deployed successfully
- Frontend-to-backend communication verified
- Control Tower verified
- Demand Intelligence verified
- Inventory Intelligence verified
- Action Center verified
- Analytics verified

## Render Free-tier behavior

The public services use Render's Free Web Service tier.

Free Web Services can spin down after inactivity. This does **not** delete the deployment. A later request can wake the service and may experience a cold-start delay.

The deployment should therefore be treated as a portfolio/demo environment rather than a latency-guaranteed production service.

## Local deployment

The repository also contains a Docker Compose development stack.

### Services

| Service | Image | Port | Role |
|---|---|---:|---|
| frontend | node:22-alpine | 3000 | Next.js development server |
| backend | python:3.12-slim | 8000 | FastAPI application |
| mysql | mysql:8.4 | 3306 | MySQL database |

A named Docker volume, `mysql_data`, persists MySQL data.

### Prerequisites

- Docker with Docker Compose support
- Git
- Validated project artifacts
- Repository checkout

### Start

From the repository root:

```bash
docker compose up
```

Local services:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`
- MySQL: `localhost:3306`

## Backend

The backend command is:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The FastAPI application is located at:

```text
backend/app/main.py
```

## Frontend

The frontend uses:

```bash
npm install
npm run dev
```

For the Render deployment, the production build uses:

```bash
npm install && npm run build
npm start
```

## Data artifacts

The validated analytical artifacts are recorded in:

```text
data/raw/sales_data.csv
data/processed/final_demand_forecasts.csv
data/processed/inventory_recommendations.csv
```

See [ARTIFACT_MANIFEST.md](../data/processed/ARTIFACT_MANIFEST.md) for row counts, validation details, and SHA-256 hashes.

Do not substitute placeholder files for validated analytical artifacts.

## Database

The local MySQL service creates:

`supply_chain_intelligence`

and initializes:

`database/schema.sql`

The schema is documented in [Database Schema](DATABASE_SCHEMA.md).

## Operational limitations

The current public deployment does not claim:

- enterprise authentication,
- enterprise secrets management,
- autoscaling,
- production SLOs,
- live ERP/WMS integration,
- multi-region availability,
- or guaranteed latency.

These are outside the current portfolio deployment scope.
