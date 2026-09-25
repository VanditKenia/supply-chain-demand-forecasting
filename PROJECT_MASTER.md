# Supply Chain Demand Forecasting & Inventory Optimization

## Phase 4 — EDA Finalized

### EDA 4.15 — Conclusions & Forecasting Implications

Phase 4 EDA established that the selected dataset is structurally suitable for time-series forecasting at the locked **Date × Store ID × Product ID** grain.

#### Dataset structure
- 76,000 observations
- 760 consecutive daily dates
- 5 stores
- 20 products
- 100 Store × Product series
- 760 observations per series
- 0 missing core values
- 0 duplicate Date × Store × Product records
- 0 global date gaps
- 0 internal Store × Product date gaps

#### Demand profile
- Demand range: 4–430
- Mean demand: 104.32
- Median demand: 100.00
- Demand is positive throughout the dataset and shows substantial variation.

#### Trend and seasonality
- The fitted linear trend was only slightly negative and did not establish a strong persistent long-term decline.
- Demand showed meaningful month/season variation.
- Average seasonal demand was approximately:
  - Winter: 103.41
  - Spring: 97.70
  - Summer: 112.86
  - Autumn: 103.42
- Day-of-week differences were comparatively weak.
- The dataset contains complete monthly coverage across three calendar years, with 2024 contributing only January observations.

#### Store-level findings
- Store demand was relatively balanced, with each store contributing roughly 19–21% of total demand.
- Stores showed positively correlated temporal movement.
- Store ID remains useful because demand levels are not identical across stores.

#### Product-level findings
- Product demand levels differ materially.
- Demand is not dominated by a very small number of products.
- Store × Product variability should be preserved because CV values varied materially across combinations.

#### Category findings
- Categories differ substantially in demand level and contribution.
- Groceries represented approximately 46.39% of total demand.
- Several categories showed strong synchronized movement, while Clothing behaved differently from the other major categories.
- Category should remain contextual at the Store × Product analytical level because Product ID is not globally mapped to one category.

#### Promotion findings
- Promotion was present in 32.89% of observations.
- Average demand:
  - No promotion: 95.03
  - Promotion: 123.27
- Demand was approximately 29.72% higher on observations with promotion.
- This is a descriptive association, not a causal estimate.

#### Pricing findings
- Price and Competitor Pricing were highly correlated with each other: approximately 0.977.
- Price and Competitor Pricing had negligible simple linear correlations with Demand.
- Discount had a positive association with Demand of approximately 0.225 Pearson correlation.
- Higher discount levels were associated with higher observed demand, with no monotonic increase beyond the 15–25% range.

#### Correlation findings
- Units Sold vs Demand: approximately +0.83 Pearson.
- Units Ordered vs Demand: approximately +0.51.
- Epidemic vs Demand: approximately −0.36.
- Promotion vs Demand: approximately +0.28.
- Discount vs Demand: approximately +0.22.
- Inventory Level vs Demand: approximately +0.13.
- Price and Competitor Pricing each had approximately −0.02 correlation with Demand.
- Price and Competitor Pricing are potentially multicollinear predictors.

#### Outlier / anomaly findings
- IQR-based screening identified approximately 986 potential demand outliers (about 1.30%).
- The detected outliers were upper-tail observations.
- High-demand observations were strongly concentrated in promotional periods and disproportionately appeared in Groceries.
- No observations were deleted or modified.
- Statistical outlier status was not treated as proof of a data error.

#### Forecasting readiness
The dataset passed the structural forecasting-readiness checks:
- valid dates
- continuous daily calendar
- complete Store × Product histories
- no duplicate forecasting keys
- no missing core forecasting values
- no negative demand
- sufficient historical depth
- chronological holdout evaluation is feasible

#### Leakage and forecast-time availability warnings
The following variables require explicit timing validation before model use:
- Inventory Level
- Units Sold
- Units Ordered
- Weather Condition
- Competitor Pricing
- other operational/contextual variables whose availability depends on the forecast origin

Demand at the prediction timestamp must never be used as a predictor for that same timestamp.

#### Phase 5 forecasting implications
1. Preserve the locked Store × Product × Date forecasting grain.
2. Use chronological train/validation/test splits rather than random splitting.
3. Establish Naive and Moving Average baselines before complex models.
4. Consider calendar and seasonal features.
5. Engineer lag and rolling features from historical information only.
6. Retain Store ID and Product ID information.
7. Treat Promotion, Discount, Price, and other exogenous variables as candidate features only when forecast-time availability is defensible.
8. Validate Inventory Level, Units Sold, and Units Ordered for leakage before inclusion.
9. Retain unusual demand observations and assess their impact on forecast error rather than deleting them.
10. Evaluate errors both globally and by Store × Product series.
11. Use forecasting uncertainty/error behavior later in the inventory-risk layer.

### Phase 4 Status

**COMPLETE.**

No forecasting model was trained during EDA. No observations were removed or modified. Feature selection remains open for Phase 5 based on forecast-origin timing and model evaluation.

