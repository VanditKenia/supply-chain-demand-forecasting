# User Guide

## Purpose

The web platform is intended to help a user move from a high-level supply-chain view to demand forecasts and replenishment decisions.

The current implementation is a foundation. This guide separates current behavior from the broader planned product surface.

## Navigation

The current frontend presents a navigation rail with:

1. Control Tower
2. Demand
3. Inventory
4. Actions

The platform blueprint additionally defines Store Explorer, Product Explorer, and a Power BI analytical workspace. Those areas are not presented here as completed current functionality.

## Control Tower

### Purpose

Use the Control Tower as the high-level entry point into the platform.

### Current behavior

The current frontend foundation renders a Control Tower card and an entry-oriented hero section. The backend provides the overview API that can supply the canonical summary metrics once the validated artifacts are mounted.

### Interpreting overview metrics

Key measures include:

- forecast record count,
- decision-unit count,
- store/product counts,
- forecast horizon,
- total forecast demand,
- high-risk count,
- recommended order quantity.

These are analytical summaries, not live operational telemetry.

## Demand Intelligence

### Purpose

Use the Demand area to understand the 30-day forecast horizon.

The frozen forecast grain is:

```text
Date × Store ID × Product ID
```

The detailed forecast artifact contains 3,000 records across 100 Store × Product series and 30 dates.

The selected model is stored with each forecast row and reflects model selection performed independently at Store × Product level.

### Interpretation

A forecast is an expected demand value under the Phase 5 methodology. It is not a guaranteed sales quantity.

## Inventory Intelligence

### Purpose

Inventory Intelligence connects forecast demand to inventory requirements.

Important fields include:

- Current Inventory
- Lead Time Demand
- Safety Stock
- Reorder Point
- Inventory Gap
- Risk

Base assumptions are 7-day lead time and 95% service level.

### Risk levels

- **High:** current inventory is below reorder point.
- **Medium:** inventory is approaching reorder point under the business rule.
- **Low:** inventory is comfortably above reorder point.

Risk should be interpreted as planning priority, not as a probability.

## Action Center

### Purpose

Action Center exposes replenishment-oriented decisions.

The current API route is:

`GET /api/actions`

Optional filter:

`risk`

Examples:

```text
/api/actions
/api/actions?risk=High
```

Returned decision fields include Store ID, Product ID, Current Inventory, Lead Time Demand, Safety Stock, Reorder Point, Inventory Gap, Recommended Order Quantity, Risk, Recommended Action, and Priority.

### Recommended orders

The recommended order is derived from the inventory gap/reorder-point calculation:

```text
max(Reorder Point − Current Inventory, 0)
```

The quantity is rounded up in the Phase 6 calculation.

Do not treat the recommendation as an automatic purchase order.

## Analytics

Power BI is the deeper analytical layer for broader reporting and reconciliation. It is separate from the operational web application.

Use the BI layer for analytical exploration such as historical demand, forecast performance, inventory measures, and scenario analysis where the corresponding artifacts are available.

## Filters and search

The current FastAPI implementation exposes only the `risk` filter on `/api/actions`. Rich frontend search, multi-dimensional filtering, drill-through, and cross-filtering are part of the broader platform blueprint and should not be assumed to exist in the current foundation.

## When to question a recommendation

A user should review the underlying assumptions when:

- high-demand spikes are likely,
- supplier lead time differs materially from 7 days,
- the desired service level changes,
- current inventory data is stale,
- the forecast horizon does not match the operational planning need,
- or the business situation contains causal factors not represented in the data.

The project is a decision-support system, not an autonomous procurement system.
