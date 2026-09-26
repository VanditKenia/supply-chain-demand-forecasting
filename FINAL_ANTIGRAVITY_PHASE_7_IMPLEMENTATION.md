# FINAL ANTIGRAVITY IMPLEMENTATION SPECIFICATION
# Supply Chain Intelligence Platform — Phase 7

Repository: `VanditKenia/supply-chain-demand-forecasting`
Branch: `main`

## 1. Mission

Complete Phase 7 as a **resume-ready Supply Chain Intelligence Platform**.

The product must connect:

Historical Demand → Demand Forecast → Inventory Risk → Recommended Action.

This is not a static dashboard or college-style visualization project. It must be a working application with real data, real APIs, dynamic calculations, filtering, drill-down/detail interactions, validation, documentation, and a Power BI analytical layer.

Do not stop at planning. Inspect the repository, implement the work, test it, fix issues, update documentation, and commit directly to `main`.

---

## 2. Final Architecture — Hybrid

Use this architecture:

```text
                 SUPPLY CHAIN INTELLIGENCE
                          |
          +---------------+----------------+
          |                                |
   OPERATIONAL PLATFORM              BI ANALYTICS
       Next.js                         Power BI
          |                                |
   React + ECharts                    DAX / BI
   Framer Motion                  Drill-through
          |                       Advanced analysis
   +------+------+------+
   |      |      |      |
Control Demand Inventory Actions
Tower   Intel   Intel
          |
       FastAPI
          |
    +-----+------+
    |            |
 Phase 5      Phase 6
 Forecast     Inventory
 3,000 rows   100 rows
    |            |
    +-----+------+
          |
    Historical Data
      76,000 rows
```

### Critical architecture rule

The native Next.js application owns the **operational experience**:

- Control Tower
- Demand Intelligence
- Inventory Intelligence
- Action Center

Power BI owns the **deeper analytical/reporting experience**.

Do NOT recreate Power BI inside Next.js.

Do NOT make Power BI Embedded a dependency for completing Phase 7.

---

## 3. Technology

Use the existing project stack:

### Frontend
- Next.js
- React
- TypeScript
- Framer Motion
- Apache ECharts

### Backend
- FastAPI
- Python
- Pandas

### Database
- MySQL

### Infrastructure
- Docker Compose

### BI
- Power BI
- DAX

Avoid unnecessary technologies and microservices.

---

# 4. Analytical Source of Truth

Never fabricate business data.

## Phase 5 — Forecast

Historical:

`data/raw/sales_data.csv`

Expected:
- 76,000 rows
- 5 stores
- 20 products
- 100 Store × Product series
- 760 daily observations
- Date × Store ID × Product ID grain

Forecast:

`data/processed/final_demand_forecasts.csv`

Expected:
- 3,000 rows
- 100 Store × Product series
- 30 forecast days

Columns:
- Date
- Store ID
- Product ID
- Forecast_Demand
- Selected_Model

## Phase 6 — Inventory Optimization

`data/processed/inventory_recommendations.csv`

Expected:
- 100 rows
- Store × Product grain

Important columns:
- Inventory Snapshot Date
- Store ID
- Product ID
- Forecast_Start
- Forecast_End
- Forecast_Days
- Current Inventory
- Lead Time
- Lead Time Demand
- Demand Std Dev
- Service Level
- Z_Value
- Safety Stock
- Reorder Point
- Inventory Gap
- Excess_Inventory_Units
- Excess_Inventory_Flag
- Recommended Order Quantity
- Risk
- Recommended Action
- Priority

These artifacts are the source of truth.

If they are unavailable at runtime, show a clear data-unavailable state. Never substitute fake data.

---

# 5. Phase 5 Methodology — Frozen

Do not retrain, replace, uplift, or silently modify Phase 5.

Final January 2024 test:
- MAE: 35.40
- RMSE: 45.98
- sMAPE: 41.20%

Selected models:
- ARIMA(1,0,1): 35
- HistGradientBoosting: 23
- TunedRF_300_depth12_leaf1: 16
- Random Forest: 15
- Naive: 9
- SeasonalNaive7: 2

Known limitation:

For Demand >= 125:
- Actual mean: 158.04
- Forecast mean: 106.72
- Mean bias: -51.32
- Actual maximum: 284
- Forecast maximum: 146

This limitation must remain visible in the Demand workspace.

Do not apply undocumented corrections.

---

# 6. Phase 6 Methodology — Frozen

Base assumptions:
- Lead time: 7 days
- Service level: 95%

Formula:

`Safety Stock = Z × Demand Std Dev × sqrt(Lead Time)`

`Reorder Point = Lead-Time Demand + Safety Stock`

`Recommended Order = max(Reorder Point - Current Inventory, 0)`

Risk:
- High: Current Inventory < Reorder Point
- Medium: Reorder Point <= Current Inventory < 1.2 × Reorder Point
- Low: Current Inventory >= 1.2 × Reorder Point

Known risk distribution:
- High: 95
- Medium: 2
- Low: 3

Do not change these definitions.

---

# 7. Navigation

Create a persistent navigation system:

```text
SUPPLY INTELLIGENCE

01  Control Tower
02  Demand
03  Inventory
04  Actions
05  Analytics
```

All navigation must work.

No dead buttons or fake routes.

---

# 8. Control Tower

Build the primary operational workspace.

Title:

**Supply Chain Control Tower**

Show:
- data connection status
- forecast horizon
- inventory snapshot date where available

### Dynamic KPI cards

- Total Forecast Demand
- Decision Units
- High-Risk Units
- Recommended Order Quantity
- Stores
- Products

Every KPI must be calculated from the actual backend data.

### Charts

1. 30-day forecast trend
2. Risk distribution
3. Recommended replenishment ranking

### Priority action table

Columns:
- Priority
- Store
- Product
- Risk
- Current Inventory
- Reorder Point
- Inventory Gap
- Recommended Order
- Action

Rows must be interactive.

---

# 9. Demand Intelligence

Build a dedicated demand analysis workspace.

### KPIs
- Total Forecast Demand
- Average Daily Forecast
- Maximum Daily Forecast
- Forecast Days
- Forecast Series

### Main chart

Interactive 30-day forecast line chart.

Filters:
- Store
- Product
- Model
- Date range

### Additional views

- Store comparison
- Product comparison
- Model usage
- Forecast detail table

Forecast table:
- Date
- Store ID
- Product ID
- Forecast Demand
- Selected Model

Requirements:
- search
- sorting
- pagination
- filtering

### Limitation panel

Display the known high-demand underprediction facts:

- threshold >= 125
- actual mean 158.04
- forecast mean 106.72
- mean bias -51.32

Present this factually.

---

# 10. Inventory Intelligence

Build a decision-focused inventory workspace.

### KPIs

- Current Inventory
- Safety Stock
- Reorder Point
- Inventory Gap
- Recommended Order
- High Risk
- Excess Inventory

### Charts

- Current Inventory vs Reorder Point
- Risk by Store
- Recommended Order by Product
- Inventory pressure/risk view

### Table

Columns:
- Priority
- Store
- Product
- Current Inventory
- Lead-Time Demand
- Safety Stock
- Reorder Point
- Inventory Gap
- Recommended Order
- Risk
- Action

Filters:
- Store
- Product
- Risk
- Priority

Rows open a detail drawer/page.

---

# 11. Action Center

Purpose:

**What needs attention first?**

Use the actual Phase 6 Priority field.

Do not invent a replacement scoring system.

Display:
- Priority
- Risk
- Store
- Product
- Current Inventory
- Reorder Point
- Inventory Gap
- Recommended Order
- Recommended Action

### Action detail

When a row is selected, show:
- Store
- Product
- Current Inventory
- Lead-Time Demand
- Demand Std Dev
- Safety Stock
- Reorder Point
- Inventory Gap
- Recommended Order
- Risk
- Priority
- Recommended Action
- Service Level
- Lead Time
- Forecast Model where available

### Why this action?

Generate only deterministic explanations from the actual fields.

Example:

"Current inventory is below the calculated reorder point, so the existing recommendation indicates replenishment of the calculated inventory gap."

Do not invent causal explanations.

---

# 12. Filtering

Filtering must be real.

Preferred flow:

```text
User Filter
    ↓
Next.js
    ↓
FastAPI
    ↓
Actual Data
    ↓
Filtered Response
    ↓
KPI / Chart / Table
```

Supported filters should include only fields that actually exist:
- Store
- Product
- Risk
- Forecast Model
- Date range
- Priority where applicable

All dependent visuals must update consistently.

---

# 13. FastAPI

Maintain:
- GET /health
- GET /api

Implement:

- GET /api/overview
- GET /api/forecasts
- GET /api/forecasts/trend
- GET /api/inventory
- GET /api/risk
- GET /api/actions
- GET /api/stores
- GET /api/products

Support appropriate query filters.

Return HTTP 503 when required analytical artifacts are missing.

Do not expose unnecessary filesystem details.

---

# 14. Backend Validation

Validate:
- required files exist
- required columns exist
- forecast row count is 3,000
- inventory row count is 100
- no duplicate Date + Store ID + Product ID forecast keys
- no negative forecasts
- no negative recommended orders
- risk values are valid
- dates are valid

If validation fails, return a clear error.

Do not silently repair analytical outputs.

---

# 15. Database

Maintain the existing schema:

- stores
- products
- forecasts
- inventory_recommendations

Conceptual model:

```text
DimDate
DimStore
DimProduct

FactForecast
FactInventoryRecommendation
```

Do not alter analytical definitions just to simplify frontend development.

---

# 16. Visual Design

Preserve the existing design direction:

- warm neutral background
- charcoal typography
- terracotta accent
- olive/green healthy state
- restrained risk colors
- sparse borders
- strong hierarchy
- generous spacing
- asymmetric layouts where useful

Avoid:
- neon gradients
- excessive glassmorphism
- excessive shadows
- giant rounded cards
- generic Bootstrap dashboard styling
- decorative charts
- unnecessary 3D

The product should look like a modern operations intelligence product.

---

# 17. Charts

Use ECharts.

Charts must answer real business questions.

Every chart needs:
- meaningful title
- readable axes
- useful tooltip
- appropriate aggregation
- responsive sizing
- empty state

Do not use pie/donut charts everywhere.

Prefer line charts, ranked bars, comparisons, and operational tables.

---

# 18. Motion

Use Framer Motion subtly for:
- page transitions
- KPI entry
- row hover
- drawer opening
- panel transitions

Do not animate everything.

---

# 19. 3D

Do not force Three.js into the project.

Only use 3D if a meaningful supply-chain/network visualization can be implemented.

If not, omit it.

Correct analytical communication is more important than decorative 3D.

---

# 20. Power BI — Hybrid Analytics Layer

Power BI is NOT responsible for the native application's operational KPI cards and charts.

The native app owns:
- Control Tower visuals
- Demand visuals
- Inventory visuals
- Action Center
- operational KPI cards
- action tables
- application interactions

Power BI owns deeper analytics/reporting.

Create:

`docs/POWER_BI_ANALYTICS.md`

Specify a Power BI report with:

## Page 1 — Executive Overview
- Total Forecast Demand
- Current Inventory
- High-Risk Units
- Recommended Order Quantity
- Forecast trend
- Risk distribution
- replenishment analysis

## Page 2 — Demand Analysis
- forecast over time
- store comparison
- product comparison
- model distribution
- forecast detail
- slicers

## Page 3 — Inventory Optimization
- Current Inventory vs Reorder Point
- Safety Stock
- Inventory Gap
- Recommended Order
- Risk
- Priority

Power BI must use the same validated project data.

Do not create a second conflicting analytical pipeline.

---

# 21. Analytics Workspace

Create an `Analytics` route/page in Next.js.

It should clearly state:

**Power BI Analytical Workspace**

Initial implementation must work without Power BI Embedded.

Provide:
- clean Power BI workspace UI
- explanation of its purpose
- configurable Power BI report URL
- button to open the report when configured
- graceful "Power BI report not configured" state

Use an environment variable such as:

`NEXT_PUBLIC_POWERBI_REPORT_URL=`

Do NOT fake an embedded report.

Power BI Embedded may be added later without redesigning the app.

---

# 22. Responsive Design

Primary target:
- desktop/laptop

Also support:
- tablet
- mobile

On smaller screens:
- collapse navigation
- stack KPI cards
- allow horizontal table scrolling
- keep charts readable
- preserve action usability

---

# 23. Loading / Error / Empty States

Every data-driven workspace must support:

### Loading
Skeleton or compact loading indicator.

### Missing data

"Data not connected"

with the relevant missing artifact.

### API failure

Useful error message.

### Empty filters

"No records match the selected filters."

Never show a broken blank chart.

---

# 24. Accessibility

Implement:
- semantic HTML
- keyboard-accessible controls
- visible focus states
- meaningful labels
- sufficient contrast
- accessible table headers

---

# 25. Performance

Expected data size:
- 76,000 historical rows
- 3,000 forecast rows
- 100 inventory decisions

Do not introduce distributed systems.

Avoid unnecessary repeated Pandas loads.

Use sensible server-side filtering where useful.

Avoid huge unnecessary frontend payloads.

---

# 26. Security

Never commit:
- API keys
- passwords
- database credentials
- secrets

Use environment variables.

Maintain `.env.example`.

---

# 27. Docker

Ensure:

`docker compose up --build`

supports:

- Frontend: localhost:3000
- Backend: localhost:8000
- MySQL: localhost:3306

Mount the data directory appropriately.

---

# 28. Documentation

Update:

- README.md
- PROJECT_MASTER.md
- docs/PHASE_7_PLATFORM.md
- frontend/DESIGN_SYSTEM.md

Create/update:

- docs/POWER_BI_ANALYTICS.md

Document:
- architecture
- hybrid model
- API
- data flow
- frontend workspaces
- Power BI role
- Power BI report design
- assumptions
- limitations
- setup
- testing

---

# 29. No Unsupported Business Claims

Never claim:
- revenue increase
- cost reduction
- ROI
- savings
- stockouts prevented
- working-capital reduction
- real-time operations
- "excellent" forecast accuracy

unless evidence exists.

Use factual language:
- "The model forecasts..."
- "The analysis identifies..."
- "The recommendation indicates..."
- "Under the stated 95% service-level assumption..."

---

# 30. Git Rules

Repository:

`VanditKenia/supply-chain-demand-forecasting`

Work directly on:

`main`

Do NOT:
- create branches
- create PRs
- fabricate commits
- commit secrets
- commit generated junk

Use logical commit messages such as:

`feat: complete supply chain intelligence platform`

`feat: add power bi analytical workspace specification`

`docs: finalize phase 7 documentation`

---

# 31. Final QA Checklist

## Frontend
- [ ] App starts
- [ ] Navigation works
- [ ] Control Tower works
- [ ] Demand works
- [ ] Inventory works
- [ ] Actions works
- [ ] Analytics works
- [ ] Filters work
- [ ] Tables work
- [ ] Charts work
- [ ] Loading states work
- [ ] Error states work
- [ ] Empty states work
- [ ] Responsive layout works
- [ ] No broken buttons
- [ ] No major console errors

## Backend
- [ ] /health
- [ ] /api
- [ ] /api/overview
- [ ] /api/forecasts
- [ ] /api/forecasts/trend
- [ ] /api/inventory
- [ ] /api/risk
- [ ] /api/actions
- [ ] /api/stores
- [ ] /api/products

## Data
- [ ] 76,000 historical rows
- [ ] 3,000 forecast rows
- [ ] 100 inventory decisions
- [ ] no duplicate forecast keys
- [ ] no negative forecasts
- [ ] no negative recommended orders
- [ ] risk values preserved
- [ ] recommendations preserved
- [ ] known forecast limitation preserved

## Infrastructure
- [ ] Docker Compose valid
- [ ] environment configuration documented
- [ ] no secrets

## Documentation
- [ ] README updated
- [ ] PROJECT_MASTER updated
- [ ] Phase 7 docs updated
- [ ] Power BI docs added

---

# 32. Final Quality Bar

The finished result must feel like:

**A real supply-chain operations intelligence product.**

Not:

**A college dashboard with charts.**

A reviewer should immediately understand:

```text
FORECAST
   ↓
RISK
   ↓
DECISION
   ↓
ACTION
```

The project should demonstrate:
- demand forecasting
- data engineering
- FastAPI
- React/Next.js
- interactive analytics
- inventory optimization
- decision support
- visualization
- Power BI/DAX
- database design
- software engineering

---

# 33. Execution Instruction

START NOW.

1. Inspect the existing repository.
2. Preserve completed analytical work.
3. Identify incomplete Phase 7 implementation.
4. Connect the real Phase 5 and Phase 6 artifacts.
5. Implement backend APIs.
6. Implement Control Tower.
7. Implement Demand Intelligence.
8. Implement Inventory Intelligence.
9. Implement Action Center.
10. Implement Analytics / Power BI workspace.
11. Implement filtering and interactions.
12. Add loading/error/empty states.
13. Validate data integrity.
14. Run the application and fix errors.
15. Update documentation.
16. Perform final visual and technical QA.
17. Commit the completed implementation directly to `main`.

Do not return only a plan.

Actually implement the project.

Do not stop until the acceptance checklist is satisfied as far as the available environment permits.
