# Supply Chain Demand Forecasting & Inventory Optimization

An end-to-end analytics project for demand forecasting, inventory-risk analysis, replenishment decision support, SQL analytics, and Power BI reporting.

## Current Status

**Phase:** 2 — Data Engineering  
**Status:** Active Development  
**Dataset:** Retail Store Inventory and Demand Forecasting — SELECTED & VALIDATED

The selected dataset contains 76,000 records covering 760 consecutive days, 5 stores, and 20 products at the Date × Store ID × Product ID grain.

Structural and semantic audits have been completed before modeling.

## Dataset Validation

- 76,000 rows
- 16 original columns
- 2022-01-01 → 2024-01-30
- 5 stores
- 20 products
- 100 Store × Product combinations
- 760 observations per Store × Product combination
- 0 duplicate grain records
- 0 missing global dates
- 0 internal Store × Product date gaps
- 0 missing values
- 0 duplicate rows
- Demand selected as the forecasting target
- Inventory Level, Units Sold, and Units Ordered available for inventory analysis
- No explicit lead-time field; lead time will require a documented assumption/scenario if needed

## Important Data Semantics

Product ID is not globally mapped to a single Category. Category is consistent within each Store × Product combination, so Category will be treated as contextual rather than as a Product master attribute.

Demand differs materially from Units Sold; the project will investigate demand semantics without automatically treating Demand as proven real-world unconstrained demand.

Records with Inventory Level = 0, Units Sold = 0, and Demand > 0 are treated as stockout-associated observations pending further analytical validation.

## Analytical Flow

Business Problem → Data → SQL → EDA → Forecasting → Evaluation → Inventory Analytics → Decision → Visualization

## Planned Stack

- Python
- Pandas / NumPy
- Scikit-learn
- Statsmodels
- XGBoost
- MySQL
- Google Colab
- Power BI / DAX
- Git / GitHub

## Repository Guide

See PROJECT_MASTER.md for the complete scope, methodology, architecture, roadmap, assumptions, decisions, quality standards, and current status.

## Data Policy

Raw datasets will not be committed until a dataset has been selected and licensing/usage terms have been checked. Results and business-impact claims will only be added when supported by actual analysis.

## Next Step

Build the formal data dictionary and MySQL relational schema, then load and validate the dataset in MySQL before starting forecasting or dashboard development.
