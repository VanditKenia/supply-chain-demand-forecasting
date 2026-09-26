# Analytical Artifact Manifest

The validated Phase 5/6 source artifacts are available in the project workspace.

| Artifact | Rows | Columns | SHA-256 |
|---|---:|---:|---|
| sales_data.csv | 76,000 | 16 | 96f107b42042d5b21fcae88c7dfc98aab036788aaae73fb3605546cfc06135ff |
| final_demand_forecasts.csv | 3,000 | 5 | 0eea84f383e64e34513d8d98b84cd1406b5bd0b8b84e7d5f8d8382e791587dab |
| inventory_recommendations.csv | 100 | 21 | 52ca5159bd72ac9f8e955ecf6b8b793ff19a644685158dbf0bb3955b450132 |
| 06_inventory_optimization.ipynb | — | — | 67d0dd5bb1733a50f7f29749baf9310cc0324dc72dacb7629a660aa22d23d623 |

The previous GitHub versions of the forecast CSV and Phase 6 notebook were placeholders and have been removed from main rather than presented as valid artifacts.

The real files remain available in the project workspace and must be transferred through a safe file-upload path before production data loading.

After synchronization, validate hashes, row counts, columns, grain, nulls, duplicates, and date coverage.
