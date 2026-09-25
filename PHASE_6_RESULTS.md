Phase 6 Inventory Optimization

Phase 6 was completed on 2026-09-25 using the frozen Phase 5 forecast output and historical inventory data.

Base scenario: 7-day assumed lead time and 95% service level. Scenario analysis: lead times 3/7/14 days and service levels 90%/95%/99%.

Core calculations:
- Lead-time demand = sum of forecast demand over the selected lead-time window.
- Safety stock = Z × historical daily demand standard deviation × sqrt(lead time).
- Reorder point = lead-time demand + safety stock.
- Recommended order quantity = max(reorder point − current inventory, 0), rounded up.

Lead time is an explicit assumption because the source data contains no observed supplier lead-time field. Risk and excess-inventory classifications are business rules, not stockout probabilities or financial-impact estimates.

Phase 5 forecast underprediction of high-demand observations is retained as a downstream limitation; no undocumented forecast uplift is applied.

Output: data/processed/inventory_recommendations.csv (100 Store × Product decision rows).

The Phase 5 forecast detail remains the 3,000-row daily forecast layer for Power BI time-series visuals.
