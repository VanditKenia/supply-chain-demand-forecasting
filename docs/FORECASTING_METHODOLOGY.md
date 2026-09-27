# Forecasting Methodology

## Overview

Phase 5 is the frozen demand-forecasting layer. It forecasts **Demand** at the Store × Product series level for a 30-day horizon.

## Dataset structure

The source dataset has:

- 76,000 rows
- 16 columns
- 5 stores
- 20 products
- 100 Store × Product series
- 760 consecutive daily dates
- 2022-01-01 through 2024-01-30

The analytical grain is Date × Store ID × Product ID.

## Target

The target is `Demand`.

Units Sold is deliberately not substituted for Demand. Inventory Level, Units Sold, and Units Ordered are excluded from the main ML forecasting predictors because their timing can make them leakage-prone or unavailable at forecast generation time.

## Chronological evaluation

| Split | Period | Rows |
|---|---|---:|
| Training | 2022-01-01 → 2023-11-30 | 69,900 |
| Validation | 2023-12-01 → 2023-12-31 | 3,100 |
| Final test | 2024-01-01 → 2024-01-30 | 3,000 |

No random time-series split is used.

The January actual Demand values remain untouched until final evaluation. Model selection is frozen before joining January actuals.

## Candidate models

The evaluated candidates were:

1. Naive
2. Seasonal Naive 7-day
3. ARIMA(1,0,1)
4. Random Forest
5. Tuned Random Forest
6. HistGradientBoosting

All candidate models use the same December 2023 validation period.

ML multi-step forecasting is recursive. Future actual Demand is therefore not used to create future lag or rolling features.

## Validation results

| Model | MAE | RMSE | sMAPE |
|---|---:|---:|---:|
| Naive | 41.99 | 53.04 | 43.11% |
| Seasonal Naive 7 | 45.42 | 57.54 | 45.47% |
| ARIMA(1,0,1) | 34.78 | 43.77 | 35.42% |
| Random Forest | 35.13 | 43.89 | 35.56% |
| HistGradientBoosting | 34.75 | 43.53 | 35.29% |
| TunedRF_300_depth12_leaf1 | 34.73 | 43.49 | 35.28% |

## Model selection

Selection occurs independently for every Store × Product series.

The primary selection criterion is validation MAE, with RMSE and sMAPE used as tie-breakers where needed.

| Selected model | Series count |
|---|---:|
| ARIMA(1,0,1) | 35 |
| HistGradientBoosting | 23 |
| TunedRF_300_depth12_leaf1 | 16 |
| Random Forest | 15 |
| Naive | 9 |
| SeasonalNaive7 | 2 |
| **Total** | **100** |

The resulting system is therefore a model-selection portfolio rather than a single global model.

## Final January 2024 test

The final frozen evaluation is:

| Metric | Result |
|---|---:|
| MAE | 35.40 |
| RMSE | 45.98 |
| sMAPE | 41.20% |

The forecast output contains 3,000 rows with no duplicate forecast keys, no missing forecasts, finite forecast values, and the complete 2024-01-01 through 2024-01-30 horizon.

## Known high-demand limitation

The final test shows systematic underprediction of high-demand observations:

- Threshold: Demand >= 125
- Actual high-demand mean: 158.04
- Forecast high-demand mean: 106.72
- Mean bias: -51.32
- Actual maximum: 284
- Forecast maximum: 146

The project did not remove genuine demand spikes to improve model metrics. This limitation is carried into Phase 6 inventory analysis.

## Leakage controls

The workflow excludes:

- Units Sold
- Inventory Level
- Units Ordered

Future actual Demand is never used as a predictor.

Variables such as Price, Discount, Promotion, Weather Condition, Competitor Pricing, and Epidemic are not automatically treated as valid future predictors without forecast-time availability justification.

## Reproducible outputs

- Notebook: `notebooks/Phase_5_Demand_Forecasting_Clean_Rebuild (1).ipynb`
- Forecast artifact: `data/processed/final_demand_forecasts.csv` in the validated project workspace
- Results record: `PHASE_5_RESULTS.md`
