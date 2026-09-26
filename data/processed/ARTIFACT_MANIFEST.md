# Analytical Artifact Manifest

The validated Phase 5 and Phase 6 source artifacts are synchronized and verified in the repository.

| Artifact | Location | Rows | Columns | SHA-256 | Status |
|---|---|---:|---:|---|---|
| `sales_data.csv` | `data/raw/sales_data.csv` | 76,000 | 16 | `96f107b42042d5b21fcae88c7dfc98aab036788aaae73fb3605546cfc06135ff` | **Verified** |
| `final_demand_forecasts.csv` | `data/processed/final_demand_forecasts.csv` | 3,000 | 5 | `5d701eade24ddc9d471ece6dd24dfa85025f715b2225ad6131db743a78154784` | **Verified** |
| `inventory_recommendations.csv` | `data/processed/inventory_recommendations.csv` | 100 | 21 | `52ca5159bd72acaf9b8e955ecf6b8b793ff19a644685158dbf0bb3955b450132` | **Verified** |

### Validation Results:
- **Historical Grain:** `Date × Store ID × Product ID` (760 days × 5 stores × 20 products = 76,000 observations).
- **Forecast Grain:** 100 Store × Product series covering complete 30-day January 2024 horizon (3,000 rows, 0 duplicate keys, 0 missing values).
- **Inventory Decisions:** 100 series with 95 High Risk, 2 Medium Risk, and 3 Low Risk units under 95% service level and 7-day lead time assumptions.
