# Inventory Optimization

## Purpose

Phase 6 translates the frozen Phase 5 demand forecast into inventory decision support. It does not alter the forecasting model or apply an undocumented forecast uplift.

## Decision grain

The Phase 6 artifact contains 100 decision rows:

```text
1 row = 1 Store × Product decision
```

The 30-day Phase 5 forecast remains the detailed daily forecast layer.

## Base scenario

| Parameter | Base value |
|---|---:|
| Lead Time | 7 days |
| Service Level | 95% |
| Forecast horizon | 30 days |

Lead time is an explicit assumption because the source dataset does not contain an observed supplier lead-time field.

## Scenario analysis

Lead-time scenarios:

- 3 days
- 7 days
- 14 days

Service-level scenarios:

- 90%
- 95%
- 99%

These scenarios demonstrate sensitivity of inventory requirements to planning assumptions. They are not measured supplier performance or contractual service levels.

## Core calculations

### Lead-time demand

```text
Lead-Time Demand =
sum of Forecast_Demand over the selected lead-time window
```

### Safety stock

```text
Safety Stock =
Z × Demand Std Dev × √Lead Time
```

Where:

- `Z` is the standard-normal factor associated with the selected service level.
- `Demand Std Dev` is historical daily demand standard deviation.
- `Lead Time` is the explicit scenario assumption in days.

### Reorder point

```text
Reorder Point =
Lead-Time Demand + Safety Stock
```

### Inventory gap

The inventory gap measures the shortfall between current inventory and the target/reorder level used by the Phase 6 decision calculation.

### Recommended order

```text
Recommended Order Quantity =
max(Reorder Point − Current Inventory, 0)
```

The output quantity is rounded up.

## Risk classification

Risk is a business classification based on inventory position relative to the reorder-point requirement:

- **High:** current inventory is below reorder point.
- **Medium:** inventory is approaching the reorder point.
- **Low:** inventory is comfortably above the reorder point.

The exact intermediate threshold for “approaching” versus “comfortably above” is an implementation business rule and is not a measured probability.

## Excess inventory

The artifact contains `Excess_Inventory_Units` and `Excess_Inventory_Flag`. Excess inventory is treated as a planning classification for inventory materially above expected requirement under the stated assumptions. It must not be interpreted as a financial holding-cost estimate.

## Priority and recommended action

The artifact contains `Recommended Action` and `Priority`. These fields are intended to turn the quantitative gap/risk calculation into an interpretable decision queue.

The documentation does not assign a new threshold or priority algorithm that is absent from the validated implementation.

## Validated reconciliation

| Measure | Value |
|---|---:|
| Decision units | 100 |
| Current inventory | 29,049 |
| Safety stock | 18,669.09 |
| Reorder point | 80,496.07 |
| Inventory gap | 51,447.07 |
| Recommended order | 52,083 |
| High risk | 95 |
| Medium risk | 2 |
| Low risk | 3 |

## Important interpretation boundary

The recommendations are planning outputs under explicit assumptions. They are not:

- guaranteed purchase quantities,
- calibrated stockout probabilities,
- guaranteed savings,
- ROI estimates,
- supplier lead-time measurements,
- or autonomous procurement instructions.

The Phase 5 high-demand underprediction limitation remains downstream and can make inventory requirements look less severe than they would be under unobserved demand spikes.
