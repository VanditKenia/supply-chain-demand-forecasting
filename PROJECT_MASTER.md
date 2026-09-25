# Supply Chain Demand Forecasting & Inventory Optimization

> **Project Master Document / Single Source of Truth**
>
> This document governs the scope, methodology, architecture, implementation decisions, validation standards, and final deliverables for the project. Any future change to the project should be reflected here.

---

## 1. Project Identity

**Project Name:** Supply Chain Demand Forecasting & Inventory Optimization

**Working Repository Name:** `supply-chain-demand-forecasting`

**Project Type:** Business Analytics / Demand Forecasting / Inventory Decision Support

**Primary Portfolio Target:** Data Analyst / Business Analyst / Analytics / Operations Analytics / Supply Chain Analytics / Data Science roles

**Primary Objective:** Build an end-to-end analytical system that converts historical supply-chain data into demand forecasts, inventory-risk measurements, replenishment recommendations, and business-facing insights.

---

## 2. Executive Objective

The system should answer:

> **Given historical demand and operational information, what are we likely to need in the future, how uncertain is that demand, and what inventory action should the business take?**

The project must demonstrate the complete analytical chain:

**Business Problem → Data → SQL → EDA → Forecasting → Evaluation → Inventory Analytics → Decision → Visualization**

The project is intended to be useful for the current Analyst application while remaining a credible, reusable portfolio project for future Analyst and Analytics roles.

---

## 3. Business Problem

Businesses need to balance two competing risks:

1. **Stockouts** — insufficient inventory to satisfy expected demand.
2. **Overstock** — excessive inventory that increases holding costs and ties up working capital.

Historical sales data contains demand patterns such as:

- trend
- seasonality
- volatility
- product-level differences
- location-level differences
- recurring demand patterns

The project will analyze these patterns, forecast future demand, quantify uncertainty/risk where supported by the data, and translate forecasts into inventory decisions.

---

## 4. Core Business Questions

### Demand Analytics

1. What are the overall demand trends?
2. Which products/SKUs have the highest demand?
3. Which products have the most volatile demand?
4. Which products show meaningful seasonality?
5. Which products are growing or declining?
6. Are there meaningful differences across stores, regions, or categories?

### Forecasting

1. What should a simple baseline forecast predict?
2. How well do statistical forecasting methods perform?
3. How well does an ML forecasting approach perform?
4. Which method performs best for the relevant forecasting horizon?
5. Where does forecasting fail?
6. Are model errors concentrated in particular products, periods, or demand patterns?

### Inventory

1. Which products are at risk of stockout?
2. Which products appear overstocked relative to expected demand?
3. What safety stock is appropriate under stated assumptions?
4. What is the reorder point?
5. How does lead time affect inventory requirements?
6. Which SKUs should receive replenishment attention first?

### Decision Support

1. What action should the business take?
2. Why is that action recommended?
3. What assumptions drive the recommendation?
4. What changes if service level, lead time, or demand changes?
5. When should the recommendation not be trusted?

---

## 5. Scope

### In Scope

- Dataset discovery and validation
- Data cleaning and quality analysis
- Relational data modeling
- MySQL database
- SQL analytical queries
- Exploratory data analysis
- Demand pattern analysis
- Time-series preparation
- Baseline forecasting
- Statistical forecasting where appropriate
- Machine-learning forecasting where appropriate
- Time-aware model evaluation
- Forecast error analysis
- Safety-stock analysis
- Reorder-point analysis
- Stockout-risk analysis
- Inventory decision recommendations
- Scenario analysis where supported
- Power BI dashboard
- Python visualizations
- Git/GitHub version control
- Professional project documentation
- Resume-ready project description
- Interview preparation based on actual implementation

### Out of Scope

Unless explicitly added later:

- Deep-learning forecasting such as LSTM
- Large-scale distributed computing
- Kubernetes
- Microservices
- Complex React frontend
- Production-grade cloud deployment
- Real-time streaming infrastructure
- Artificially inflated model complexity
- Fabricated business impact
- Unsupported financial savings claims

---

## 6. Technology Stack

### Development

- VS Code
- Git
- GitHub

### Programming

- Python

### Python Libraries

Expected libraries include:

- Pandas
- NumPy
- Matplotlib
- Seaborn
- Scikit-learn
- Statsmodels
- XGBoost
- SciPy where required

Additional libraries may be introduced only when they provide a clear analytical benefit.

### Database

- MySQL

### Notebook Environment

- Google Colab

Local Jupyter Notebook is not required initially.

### Business Intelligence

- Microsoft Power BI
- DAX

### Spreadsheet Analysis

- Microsoft Excel

### Optional

- Streamlit, only if the core project is complete and additional time remains.

---

## 7. Hardware / Computational Strategy

Primary local machine:

- Intel Core i5-1235U
- 16 GB RAM
- Intel Iris Xe integrated graphics
- Approximately 100 GB free storage at project start

Computational strategy:

- Avoid unnecessary GPU-dependent workloads.
- Avoid unnecessarily large datasets.
- Prefer efficient Pandas/SQL operations.
- Use Google Colab for notebook-based analytical workloads when useful.
- Keep MySQL local for SQL development.
- Do not add computational complexity solely to make the project appear advanced.

---

## 8. Dataset Requirements

The final dataset must be evaluated before implementation begins.

### Preferred Characteristics

- 25,000+ observations where practical
- Clear date/time field
- Repeated observations over time
- Product/SKU identifier
- Sales/demand quantity
- Revenue/price if available
- Store/location/region if available
- Product category if available
- Inventory information if available
- Promotion information if available
- Lead time if available

### Critical Requirement

The dataset must support meaningful temporal analysis at an appropriate product/SKU level.

A large row count alone is not sufficient.

### Dataset Selection Criteria

The dataset will be evaluated on:

1. Temporal depth
2. Number of products/SKUs
3. Observation count
4. Forecasting suitability
5. Inventory-analysis potential
6. Business realism
7. Data quality
8. Reproducibility
9. Portfolio value
10. Interview defensibility

The selected dataset will be recorded in this document after evaluation.

---

## 9. Selected Dataset

**Status:** SELECTED

### Dataset Identity

**Dataset Name:** Retail Store Inventory and Demand Forecasting

**Source:** Kaggle

**URL:** https://www.kaggle.com/datasets/atomicd/retail-store-inventory-and-demand-forecasting

**License:** Apache 2.0

**Rows:** 76,000

**Original Columns:** 16

**Date Range:** 2022-01-01 to 2024-01-30

**Unique Dates:** 760

**Stores:** 5

**Products:** 20

**Categories:** 5

**Regions:** 4

### Exact Analytical Grain

**Date × Store ID × Product ID**

Validation established:

- 76,000 unique grain records
- 0 duplicate grain records
- 100 Store × Product combinations
- 760 observations per Store × Product combination
- 0 internal date gaps
- 0 globally missing dates
- 100% temporal panel coverage

### Source Columns

1. Date
2. Store ID
3. Product ID
4. Category
5. Region
6. Inventory Level
7. Units Sold
8. Units Ordered
9. Price
10. Discount
11. Weather Condition
12. Promotion
13. Competitor Pricing
14. Seasonality
15. Epidemic
16. Demand

### Forecasting Target

**Demand**

Demand is distinct from Units Sold. In the semantic audit:

- Demand > Units Sold: 70.32% of records
- Demand = Units Sold: 2.05%
- Demand < Units Sold: 27.63%

Simple reconstruction tests did not establish Demand as a direct formula of Units Sold, Inventory Level, or Units Ordered.

### Inventory-Relevant Fields

- Inventory Level
- Units Sold
- Units Ordered
- Demand

The dataset contains 406 records where Inventory Level = 0. All 406 also have Units Sold = 0 and Demand > 0. These records will be treated as **stockout-associated demand observations** unless further analysis establishes stronger semantics.

### Commercial / Contextual Features

- Price
- Discount
- Promotion
- Competitor Pricing
- Weather Condition
- Seasonality
- Epidemic
- Store ID
- Region
- Product ID
- Category

### Data Quality Validation

The dataset passed the initial structural audit:

- Missing values: 0
- Duplicate rows: 0
- Duplicate Date × Store × Product records: 0
- Missing global dates: 0
- Internal Store × Product date gaps: 0
- Complete temporal coverage: 100%

### Category Semantics

Product ID is **not globally mapped to one category**.

All 20 products appear under multiple categories. However:

- Category is consistent within each Store × Product combination.
- Store × Product pairs with multiple categories: 0.

Therefore, the project must **not model Category as a Product master attribute**. Category should be treated as a contextual attribute at the Store × Product analytical level.

### Region Semantics

Each Store maps to exactly one Region, while products can appear across multiple regions.

Therefore:

- Store → Region is stable.
- Product → Region is not unique.

### Lead Time Limitation

**No explicit lead-time column is present.**

Lead time must therefore **not** be represented as observed source data.

If lead time is required for safety-stock/reorder-point analysis, it will be introduced as an explicitly documented business assumption or scenario parameter.

### Known Limitations

1. The source dataset does not provide supplier lead-time observations.
2. Category is not globally unique to Product ID.
3. The semantic meaning of Demand versus Units Sold must be treated carefully; stockout-associated observations provide evidence of unmet-demand-like behavior but do not by themselves prove a real-world lost-sales definition.
4. Forecast features must be classified according to whether they would actually be known at the chosen forecast origin.
5. Inventory Level, Units Sold, Units Ordered, weather, promotion, competitor pricing and other operational variables require time-aware leakage assessment before inclusion in a forecasting model.

### Why This Dataset Was Selected

The dataset satisfies the project's core structural requirements while providing both forecasting and inventory-analysis fields. Its complete daily Store × Product panel supports time-series modeling without requiring imputation of missing dates. It also contains operational and commercial variables that allow the project to go beyond pure univariate forecasting into demand drivers, stockout analysis, and inventory decision support.

The selection is based on validated dataset properties rather than row count alone.

---

## 10. Data Architecture

Expected conceptual flow:

```text
Raw Dataset
    ↓
Data Quality Checks
    ↓
Cleaned Data
    ↓
MySQL Relational Tables
    ↓
SQL Analytics
    ↓
Analytical Dataset
    ↓
Python / Colab
    ↓
EDA + Forecasting
    ↓
Inventory Decision Layer
    ↓
Power BI
```

Expected logical entities may include:

- products
- sales
- inventory
- stores/locations
- calendar

The final schema must be based on the selected dataset rather than assumed in advance.

---

## 11. Data Quality Standards

Before modeling, check for:

- missing values
- duplicate records
- invalid dates
- invalid quantities
- impossible prices
- inconsistent identifiers
- negative values where they are not meaningful
- unexpected category values
- gaps in time series
- aggregation inconsistencies
- extreme outliers
- leakage risks

Every important cleaning decision must be documented.

Data must not be silently deleted simply because it makes the model perform better.

---

## 12. SQL Layer

MySQL will be used to demonstrate practical analytical SQL.

Expected capabilities:

- SELECT
- WHERE
- GROUP BY
- HAVING
- JOIN
- CASE
- subqueries
- Common Table Expressions (CTEs)
- window functions
- date functions
- aggregations
- ranking
- rolling calculations where practical

Potential analytical outputs:

- daily/monthly demand
- product contribution
- growth rates
- rolling demand
- demand volatility
- inventory turnover
- stockout frequency
- regional performance
- product rankings
- period-over-period comparisons

The SQL layer must contain real project analysis, not placeholder queries.

---

## 13. Exploratory Data Analysis

EDA should answer business questions rather than produce charts for decoration.

Areas to investigate:

### Overall

- demand distribution
- sales trends
- revenue trends
- category contribution

### Product

- top products
- low-demand products
- demand volatility
- product growth

### Time

- daily/weekly/monthly patterns
- seasonality
- trend
- calendar effects where supported

### Geography

- store/region differences where available

### Data Quality

- missingness
- outliers
- anomalies
- time gaps

Each major visualization should have an analytical purpose.

---

## 14. Forecasting Methodology

Forecasting will be performed only after understanding the data.

### Stage 1 — Baselines

Potential baselines:

- Naive forecast
- Moving average

The baseline establishes a minimum performance benchmark.

### Stage 2 — Statistical Models

Potential methods:

- Exponential Smoothing
- ARIMA/SARIMA

The exact method depends on observed time-series characteristics.

### Stage 3 — Machine Learning

Potential primary model:

- XGBoost

Potential feature families:

- lag features
- rolling means
- rolling standard deviation
- calendar features
- product/category information
- promotion features where available
- other variables supported by the dataset

Feature engineering must avoid future-data leakage.

---

## 15. Forecast Evaluation

Time-series data must not be evaluated using an inappropriate random split.

Preferred structure:

```text
PAST                         FUTURE
────────────────────────────────────
TRAIN          VALIDATION       TEST
██████████████ ████████         █████
```

Potential metrics:

- MAE
- RMSE
- MAPE where appropriate
- sMAPE where appropriate

Metric choice must be justified.

Forecasting performance should be compared against baseline methods.

Model selection should consider:

- predictive performance
- stability
- interpretability
- computational cost
- business usefulness

The most complex model is not automatically the best model.

---

## 16. Inventory Decision Layer

Forecasts must be translated into operational decisions.

Potential outputs:

### Expected Lead-Time Demand

Demand expected during the replenishment lead time.

### Safety Stock

Calculated according to the available data and explicitly documented assumptions.

### Reorder Point

Conceptually:

**Reorder Point = Expected Lead-Time Demand + Safety Stock**

The exact calculation must be adapted to the available data.

### Stockout Risk

Identify products where expected demand and available inventory indicate elevated stockout exposure.

### Excess Inventory

Identify products where inventory materially exceeds expected demand under stated assumptions.

---

## 17. Recommendation Engine

The system should produce interpretable outputs such as:

| SKU | Forecast | Current Inventory | Risk | Recommended Action |
|---|---:|---:|---|---|
| Example | Example | Example | High | Replenish |

Actual values will only be populated after the dataset and methodology are finalized.

Recommendations must be traceable to underlying calculations.

---

## 18. Scenario Analysis

If the dataset and implementation time permit, analyze how recommendations change under different assumptions.

Potential scenario variables:

- service level
- lead time
- demand growth
- inventory level
- demand volatility

The objective is to demonstrate trade-off analysis rather than simply generate a single recommendation.

---

## 19. Power BI Dashboard Specification

### Page 1 — Executive Overview

Potential KPIs:

- Total Sales
- Units Sold
- Demand Growth
- Forecast Accuracy
- Inventory Value
- Stockout Risk

### Page 2 — Demand Analytics

Potential visuals:

- historical demand
- demand trends
- seasonality
- product/category performance
- regional performance where available

### Page 3 — Forecast Performance

Potential visuals:

- actual vs forecast
- forecast error
- model comparison
- product-level forecast performance

### Page 4 — Inventory Decision Center

Potential visuals:

- stockout-risk products
- safety stock
- reorder points
- current inventory
- recommended action
- priority products

Every visual must answer a business question.

---

## 20. Excel Layer

Excel may be used for a business-consumer-friendly decision sheet.

Potential columns:

- SKU
- Forecast Demand
- Lead Time
- Service Level
- Safety Stock
- Reorder Point
- Current Inventory
- Recommended Order Quantity
- Risk
- Action

Excel is supplemental and must not duplicate the entire Python/SQL workflow.

---

## 21. Repository Structure

Target structure:

```text
supply-chain-demand-forecasting/
│
├── README.md
├── PROJECT_MASTER.md
├── requirements.txt
├── .gitignore
│
├── data/
│   ├── raw/
│   ├── processed/
│   └── README.md
│
├── sql/
│   ├── schema.sql
│   ├── data_quality.sql
│   └── analytics.sql
│
├── notebooks/
│   ├── 01_data_exploration.ipynb
│   ├── 02_demand_analysis.ipynb
│   ├── 03_forecasting.ipynb
│   └── 04_inventory_optimization.ipynb
│
├── src/
│   ├── data_processing/
│   ├── forecasting/
│   ├── inventory/
│   └── evaluation/
│
├── dashboard/
│   └── powerbi/
│
├── reports/
│
└── assets/
    └── screenshots/
```

The structure may be changed if implementation requirements justify it.

---

## 22. Development Roadmap

### Phase 0 — Project Setup
- [x] Create repository
- [x] Create project structure
- [x] Create PROJECT_MASTER.md
- [x] Create README.md
- [x] Establish Git workflow

### Phase 1 — Dataset
- [x] Research candidate datasets
- [x] Compare/evaluate candidate dataset
- [x] Select dataset
- [x] Document source and license
- [x] Validate dataset grain
- [x] Validate temporal completeness
- [x] Validate demand semantics
- [x] Audit stockout behavior
- [x] Audit category/store/region consistency
- [x] Perform initial feature leakage classification
- [x] Record dataset limitations
- [x] Build formal data dictionary

### Phase 2 — Data Engineering
- [x] Inspect raw data
- [x] Perform quality checks
- [x] Clean data
- [x] Design MySQL schema
- [x] Load data into MySQL
- [x] Validate database contents

### Phase 3 — SQL Analytics
- [x] Core business queries
- [x] Time-based analysis
- [x] Product analysis
- [x] Demand metrics
- [x] Inventory metrics where available
- [x] Final analytical view created and validated

### Phase 3 Validation Checkpoint

- MySQL analytical layer completed and reconciled with the source grain.
- Final analytical view: `vw_demand_analysis`.
- View validation: 76,000 rows, 760 dates, 5 stores, 20 products.
- Completed descriptive analyses include store/product/category demand, monthly demand, seasonality, promotion association, potential inventory pressure, Store × Product pressure, demand concentration, volatility, inventory-to-demand ratio, YoY comparisons, and ordering-vs-demand diagnostics.
- `inventory_level < demand` is treated as a potential inventory-pressure indicator, not a confirmed stockout.
- Descriptive relationships are not interpreted as causal effects without supporting design or evidence.

### Phase 3 Status

**COMPLETE — Phase 4 EDA is the next active phase.**

### Phase 4 — EDA
- [ ] Analytical-view sanity check
- [ ] Demand distribution
- [ ] Trend analysis
- [ ] Seasonality analysis
- [ ] Store analysis
- [ ] Product analysis
- [ ] Category analysis
- [ ] Promotion analysis
- [ ] Inventory vs Demand
- [ ] Volatility analysis
- [ ] Correlation analysis
- [ ] Anomaly analysis
- [ ] Forecasting readiness

### Phase 5 — Forecasting
- [ ] Create baseline
- [ ] Build statistical model(s)
- [ ] Build XGBoost model
- [ ] Evaluate models
- [ ] Analyze errors
- [ ] Select appropriate approach

### Phase 6 — Inventory Optimization
- [ ] Calculate lead-time demand
- [ ] Calculate safety stock
- [ ] Calculate reorder point
- [ ] Estimate stockout risk
- [ ] Identify excess inventory
- [ ] Generate recommendations
- [ ] Add scenario analysis if feasible

### Phase 7 — Power BI
- [ ] Prepare analytical dataset
- [ ] Build Executive Overview
- [ ] Build Demand Analytics
- [ ] Build Forecast Performance
- [ ] Build Inventory Decision Center
- [ ] Validate KPIs

### Phase 8 — Documentation
- [ ] Complete README
- [ ] Document methodology
- [ ] Document assumptions
- [ ] Document limitations
- [ ] Add dashboard screenshots
- [ ] Prepare project report

### Phase 9 — Final Audit
- [ ] Reproduce analysis
- [ ] Validate calculations
- [ ] Check leakage
- [ ] Check SQL
- [ ] Check dashboard
- [ ] Check documentation
- [ ] Review GitHub repository
- [ ] Prepare resume bullets
- [ ] Prepare interview questions

---

## 23. Project Quality Standards

The project must satisfy these principles:

### Analytical Integrity
Never fabricate results, performance, savings, or business impact.

### Reproducibility
A reviewer should be able to understand how results were generated.

### Temporal Integrity
Forecasting must respect chronological ordering.

### Traceability
Business recommendations must be traceable to calculations.

### Interpretability
Important model and business decisions must be explainable.

### Business Relevance
Every major analysis should connect to a business question.

### Simplicity
Use the simplest method that adequately solves the problem.

### Honest Limitations
Weaknesses and assumptions must be documented.

---

## 24. Assumptions Log

| ID | Assumption | Reason | Status |
|---|---|---|---|
| A001 | Selected dataset has no explicit supplier lead-time observations | Source dataset does not contain a lead-time field | Confirmed |
| A002 | MySQL will be the relational database | Existing local environment | Confirmed |
| A003 | Google Colab will be the primary notebook environment | Reduces local computational burden | Confirmed |
| A004 | Deep-learning forecasting is out of scope initially | Not required for the target role/project objective | Confirmed |
| A005 | Lead time, if required for inventory calculations, must be an explicitly documented assumption/scenario parameter | Lead-time data is unavailable | Open |
| A006 | Category is treated as a Store × Product contextual attribute rather than a Product master attribute | Product IDs map to multiple categories globally but consistently within Store × Product | Confirmed |
| A007 | Stockout-associated records are not automatically labeled as true lost sales | Inventory = 0, Units Sold = 0 and Demand > 0 are observed, but Demand semantics are not externally verified | Confirmed |

---

## 25. Decisions Log

| ID | Decision | Reason | Date | Status |
|---|---|---|---|---|
| D001 | Project focus is supply-chain demand forecasting and inventory optimization | Aligns with Analyst use case and long-term portfolio value | 2026-09-25 | Confirmed |
| D002 | MySQL instead of PostgreSQL | MySQL is already available locally | 2026-09-25 | Confirmed |
| D003 | Google Colab instead of local Jupyter initially | Available and reduces local workload | 2026-09-25 | Confirmed |
| D004 | Avoid LSTM initially | Adds complexity without being necessary for the project objective | 2026-09-25 | Confirmed |
| D005 | Power BI is the primary business visualization layer | Demonstrates business-facing analytics | 2026-09-25 | Confirmed |
| D006 | Select Retail Store Inventory and Demand Forecasting as the project dataset | Passed structural, temporal, semantic, inventory, and initial leakage audits | 2026-09-25 | Confirmed |
| D007 | Use Date × Store ID × Product ID as the analytical grain | Dataset contains exactly one record for each combination with complete temporal coverage | 2026-09-25 | Confirmed |
| D008 | Treat Category as Store × Product context | Product IDs are not globally category-unique | 2026-09-25 | Confirmed |
| D009 | Do not treat lead time as observed data | No lead-time field exists in the source dataset | 2026-09-25 | Confirmed |

---

## 26. Known Limitations

1. **No explicit lead-time data:** Inventory optimization will require a documented assumption or scenario parameter for lead time.
2. **Category is not Product-unique:** Category varies by Store × Product context.
3. **Demand semantics require caution:** Demand differs substantially from Units Sold, but the source does not provide an external definition proving Demand equals true unconstrained customer demand.
4. **Potential feature leakage:** Several operational/contextual fields may only be available after the forecast origin. Feature eligibility must be defined against the forecast horizon.
5. **Synthetic/curated-data realism must be treated carefully:** Results should be presented as analytical findings on the selected dataset, not as measured outcomes for a real company.
6. **No causal interpretation by default:** Correlation between demand and input variables will not automatically be treated as causal impact.

---

## 27. Resume Claims Policy

Only claims directly supported by the completed project may appear on the resume.

Do not claim:

- percentage improvements that were not measured
- cost savings that were not measured
- production deployment that did not occur
- real business adoption that did not occur
- forecasting accuracy without documented evaluation
- optimization results based on unsupported assumptions

Potential final resume themes:

- demand forecasting
- time-series analysis
- inventory analytics
- SQL analytics
- XGBoost
- model evaluation
- Power BI
- decision support

Exact bullets will be written only after the project is completed.

---

## 28. Interview Preparation

The final project should prepare the candidate to answer:

### Business
- Why does demand forecasting matter?
- What business problem are you solving?
- Why is inventory optimization necessary?

### Data
- How did you validate the dataset?
- How did you handle missing values?
- How did you handle outliers?
- What constitutes data leakage?

### Forecasting
- Why did you select the baseline?
- Why did you use statistical forecasting?
- Why XGBoost?
- Why not LSTM?
- Why MAE/RMSE/MAPE?
- How did you perform train/test splitting?

### Inventory
- What is safety stock?
- What is reorder point?
- How does lead time affect it?
- What assumptions did you make?
- How do service levels affect inventory?

### Business
- What would the business actually do with your output?
- When would you not trust the recommendation?
- What additional data would improve the model?
- How would you measure financial impact in a real company?

---

## 29. Completed Work

### Phase 0
- Repository created.
- Project structure established.
- PROJECT_MASTER.md established.
- README.md established.
- Git workflow established.

### Phase 1
- Dataset researched and selected.
- Kaggle source and license recorded.
- 76,000-row source dataset validated.
- Analytical grain validated as Date × Store × Product.
- Complete 760-day Store × Product panel validated.
- Missing values and duplicate records validated.
- Demand versus Units Sold semantics audited.
- Stockout-associated observations audited.
- Product/category/store/region consistency audited.
- Initial forecasting feature leakage classification completed.
- Dataset limitations documented.

---

## 30. Pending Work

### Immediate Next Step

**Begin Phase 2 — Data Engineering.**

First deliverables:

1. Build the formal data dictionary.
2. Design the MySQL relational schema from the validated analytical grain.
3. Create the schema SQL.
4. Create production-quality SQL data-quality checks.
5. Load and validate the dataset in MySQL.
6. Then begin the real SQL analytics layer.

**Do not start forecasting, inventory optimization, or Power BI yet.**
