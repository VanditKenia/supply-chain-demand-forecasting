# Database Schema

## Source of truth

The authoritative current application schema is:

`database/schema.sql`

It creates the MySQL database:

`supply_chain_intelligence`

The older `sql/schema.sql` file is only a placeholder comment and is not the source of truth for the current application database.

## Tables

### stores

Purpose: store master data.

| Column | Type | Key |
|---|---|---|
| store_id | VARCHAR(32) | PK |
| region | VARCHAR(100) | — |

### products

Purpose: product master data.

| Column | Type | Key |
|---|---|---|
| product_id | VARCHAR(32) | PK |
| category | VARCHAR(100) | — |

### forecasts

Purpose: daily forecast records.

| Column | Type | Key |
|---|---|---|
| forecast_date | DATE | PK component |
| store_id | VARCHAR(32) | PK component, FK |
| product_id | VARCHAR(32) | PK component, FK |
| forecast_demand | DECIMAL(12,4) | — |
| selected_model | VARCHAR(100) | — |

Primary key:

```text
(forecast_date, store_id, product_id)
```

Foreign keys:

- `store_id → stores.store_id`
- `product_id → products.product_id`

### inventory_recommendations

Purpose: Store × Product inventory decision records.

| Column | Type | Key |
|---|---|---|
| store_id | VARCHAR(32) | PK component, FK |
| product_id | VARCHAR(32) | PK component, FK |
| current_inventory | DECIMAL(12,2) | — |
| lead_time_demand | DECIMAL(12,2) | — |
| safety_stock | DECIMAL(12,2) | — |
| reorder_point | DECIMAL(12,2) | — |
| recommended_order_quantity | DECIMAL(12,2) | — |
| risk | VARCHAR(20) | — |
| action | VARCHAR(50) | — |

Primary key:

```text
(store_id, product_id)
```

Foreign keys:

- `store_id → stores.store_id`
- `product_id → products.product_id`

## Relationships

```text
stores 1 ───────< forecasts >─────── 1 products
stores 1 ───────< inventory_recommendations >─────── 1 products
```

A store can have many forecast rows and inventory decisions. A product can appear across many stores.

## Schema versus CSV artifact

The validated Phase 6 CSV contains 21 columns because it preserves planning metadata such as snapshot date, forecast window, lead time, service level, Z-value, excess-inventory fields, action, and priority.

The current `database/schema.sql` stores a narrower operational subset of those fields. This is a documented schema boundary; the CSV artifact should not be described as identical to the current MySQL table.

The repository does not currently claim that all validated analytical CSV artifacts have already been loaded into MySQL.
