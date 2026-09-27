# Deployment

## Current deployment posture

The repository contains a local Docker Compose stack for the Phase 7 application foundation. It is not documented as a production cloud deployment.

## Services

The Compose file defines:

| Service | Image | Port | Role |
|---|---|---:|---|
| frontend | node:22-alpine | 3000 | Next.js development server |
| backend | python:3.12-slim | 8000 | FastAPI application |
| mysql | mysql:8.4 | 3306 | MySQL database |

A named Docker volume, `mysql_data`, persists MySQL data.

## Prerequisites

- Docker with Docker Compose support
- Git
- The validated project artifacts
- The repository checkout

## Start

From the repository root:

```bash
docker compose up
```

The frontend is configured for port 3000 and the backend for port 8000.

The backend mounts:

- `./backend:/app`
- `./data:/data:ro`

The MySQL service mounts `database/schema.sql` into MySQL's initialization directory.

## Data synchronization requirement

The current repository deliberately does not contain the validated forecast and inventory CSV files in `data/processed`; they are recorded in `data/processed/ARTIFACT_MANIFEST.md` as workspace artifacts.

Before expecting the API to return analytical data, synchronize the validated artifacts into the expected paths:

```text
data/raw/sales_data.csv
data/processed/final_demand_forecasts.csv
data/processed/inventory_recommendations.csv
```

Do not substitute placeholder files.

## Backend

The backend command used by Compose is equivalent to:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## Frontend

The frontend uses the package scripts:

```bash
npm install
npm run dev
```

The Compose service executes installation and starts the development server automatically.

## Database

The MySQL service creates:

`supply_chain_intelligence`

and initializes `database/schema.sql`.

The schema is documented in [Database Schema](DATABASE_SCHEMA.md).

## Important limitation

This stack is a development/local deployment foundation. No production-grade cloud deployment, authentication, secrets management, TLS termination, scaling policy, or operational SLO is claimed by the project.
