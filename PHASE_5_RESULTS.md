# Phase 5 — Demand Forecasting

Phase 5 has been completed using a leakage-controlled, chronological forecasting workflow at the locked Date × Store ID × Product ID grain.

## Validation Design
- Training: 2022-01-01 → 2023-11-30 (69,900 rows)
- Validation: 2023-12-01 → 2023-12-31 (3,100 rows)
- Final test: 2024-01-01 → 2024-01-30 (3,000 rows)
- 100 Store × Product series
- Primary forecast horizon: 30 days

## Models Evaluated
- Naive
- Seasonal Naive (7-day lag)
- ARIMA(1,0,1)
- Random Forest
- Tuned Random Forest
- HistGradientBoosting

All candidate models were evaluated on the same December 2023 validation period. ML forecasts use recursive multi-step prediction; actual future Demand is not used to construct future lag or rolling features.

## Validation Results
| Model | MAE | RMSE | sMAPE |
|---|---:|---:|---:|
| Naive | 41.99 | 53.04 | 43.11% |
| Seasonal Naive 7 | 45.42 | 57.54 | 45.47% |
| ARIMA(1,0,1) | 34.78 | 43.77 | 35.42% |
| Random Forest | 35.13 | 43.89 | 35.56% |
| HistGradientBoosting | 34.75 | 43.53 | 35.29% |
| TunedRF_300_depth12_leaf1 | 34.73 | 43.49 | 35.28% |

Model selection was performed per Store × Product series using validation MAE, with RMSE and sMAPE used as tie-breakers where needed.

## Selected Model Distribution
| Model | Series |
|---|---:|
| ARIMA(1,0,1) | 35 |
| HistGradientBoosting | 23 |
| TunedRF_300_depth12_leaf1 | 16 |
| Random Forest | 15 |
| Naive | 9 |
| SeasonalNaive7 | 2 |
| **Total** | **100** |

## Final January 2024 Test
The January 2024 actual Demand values were joined only after forecasts were generated and model decisions were frozen.

- MAE: 35.40
- RMSE: 45.98
- sMAPE: 41.20%

## Forecast Output Integrity
`data/processed/final_demand_forecasts.csv` contains 3,000 forecast rows covering 100 Store × Product series across the complete 30-day horizon from 2024-01-01 to 2024-01-30.

Checks passed:
- 3,000 rows
- 100 series
- no duplicate Date × Store ID × Product ID keys
- no missing forecasts
- all forecasts finite
- complete 30-day forecast horizon

## Error Analysis Limitation
The final test analysis shows substantial regression toward the mean for high-demand observations:
- High-demand threshold: 125 units
- High-demand actual mean: 158.04
- High-demand forecast mean: 106.72
- Mean bias: -51.32
- Actual maximum: 284
- Forecast maximum: 146

The pipeline therefore under-represents high-demand spikes. No demand observations were removed to improve model performance, and this limitation should be considered when forecasts are used in Phase 6 inventory-risk analysis.

## Leakage Controls
The main ML forecasting workflow excludes `Units Sold`, `Inventory Level`, and `Units Ordered` because their timing can make them leakage-prone or unavailable at forecast generation time. Future actual Demand is never used as a predictor. Conditional variables such as Price, Discount, Promotion, Weather Condition, Competitor Pricing, and Epidemic were not automatically included without forecast-time availability justification.

## Inventory Optimization Handoff
The final forecast file is intended as the demand-input layer for Phase 6. Lead time is not present in the source data and has not been fabricated; any lead-time value used in inventory optimization must be stated explicitly as a scenario assumption.
