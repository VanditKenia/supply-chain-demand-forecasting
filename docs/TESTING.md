# Testing and Validation

## Validation philosophy

Testing is split across the analytical pipeline and the application layer. The goal is to verify data integrity, chronological forecasting integrity, inventory arithmetic, API contracts, frontend behavior, and cross-layer metric reconciliation.

## Data validation

Validated Phase 1/2 checks:

| Check | Result |
|---|---|
| Source rows | 76,000 |
| Source columns | 16 |
| Missing values | 0 |
| Duplicate Date × Store × Product rows | 0 |
| Global date gaps | 0 |
| Internal Store × Product date gaps | 0 |
| Stores | 5 |
| Products | 20 |
| Store × Product series | 100 |
| Dates | 760 |

The source is therefore a complete balanced temporal panel at the locked analytical grain.

## Forecasting validation

Chronological validation:

- Training: 2022-01-01 to 2023-11-30
- Validation: December 2023
- Final test: January 2024

Final January test:

| Metric | Value |
|---|---:|
| MAE | 35.40 |
| RMSE | 45.98 |
| sMAPE | 41.20% |

Forecast artifact integrity:

- 3,000 rows
- 100 Store × Product series
- 30 dates
- no duplicate forecast keys
- no missing forecasts
- finite forecast values
- complete January horizon

## Inventory validation

The Phase 6 artifact contains 100 Store × Product decisions.

Validated reconciliation:

| Measure | Value |
|---|---:|
| Total forecast demand | 278,398.48 |
| Decision units | 100 |
| Current inventory | 29,049 |
| Safety stock | 18,669.09 |
| Reorder point | 80,496.07 |
| Inventory gap | 51,447.07 |
| Recommended order | 52,083 |
| High risk | 95 |
| Medium risk | 2 |
| Low risk | 3 |

The inventory calculations preserve the explicit 7-day lead-time and 95% service-level base scenario.

## API validation

The implemented routes are:

- `GET /health`
- `GET /api`
- `GET /api/overview`
- `GET /api/actions`

The overview contract is designed to reconcile to:

- 3,000 forecast records
- 100 decision units
- 5 stores
- 20 products
- 30 forecast days
- 278,398.48 total forecast demand
- 95 high-risk units
- 52,083 recommended order units

The action endpoint exposes the decision fields required by the current data service.

## Frontend validation

The current frontend is a foundation implementation rather than a completed multi-page application. The code renders:

- persistent navigation rail
- Control Tower
- Demand
- Inventory
- Actions
- platform status/foundation state
- responsive motion/card presentation

The richer modules described in the platform blueprint must not be reported as validated production functionality until they are implemented.

## Cross-page / cross-layer reconciliation

The following values are treated as canonical for the documented analytical state:

- Forecast demand: 278,398.48
- Decision units: 100
- Recommended order: 52,083
- High risk: 95
- Medium risk: 2
- Low risk: 3

Any UI or BI implementation showing these metrics should reconcile to the same underlying artifacts.

## What this testing does not prove

It does not prove:

- real-world stockout probability,
- supplier lead-time accuracy,
- financial savings,
- ROI,
- production-scale throughput,
- live ERP/WMS integration,
- or production cloud reliability.
