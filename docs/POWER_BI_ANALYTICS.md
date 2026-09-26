# Power BI Analytical Layer Specification
# Supply Chain Intelligence Platform

## 1. Architectural Role & Separation of Concerns

The Supply Chain Intelligence Platform employs a **Hybrid Architecture**:

- **Native Next.js Application:** Owns the real-time operational experience — Control Tower, operational KPI monitoring, interactive 30-day forecast curves, dynamic inventory tables, cross-filtering, decision-inspection drawers, and deterministic dispatch explanations.
- **Power BI:** Owns deep multi-dimensional analytics, DAX calculations, cross-visual drill-throughs, historical variance slices, and print-ready executive reporting.

Power BI does **not** render the web application's native components. Both systems consume the identical, validated Phase 5 and Phase 6 data layer without divergence.

---

## 2. Dimensional Data Model (Star Schema)

The Power BI data model is structured as an analytical Star Schema:

```text
       +-------------------+       +--------------------+
       |     DimStore      |       |     DimProduct     |
       +-------------------+       +--------------------+
       | Store_ID (PK)     |       | Product_ID (PK)    |
       | Region            |       | Category           |
       +---------+---------+       +---------+----------+
                 |                           |
                 +-------------+-------------+
                               |
         +---------------------+---------------------+
         |                                           |
         v                                           v
+-----------------------------+     +-------------------------------+
|        FactForecast         |     |  FactInventoryRecommendation  |
+-----------------------------+     +-------------------------------+
| Date (FK -> DimDate)        |     | Store_ID (FK -> DimStore)     |
| Store_ID (FK -> DimStore)   |     | Product_ID (FK -> DimProduct) |
| Product_ID (FK-> DimProduct)|     | Current_Inventory             |
| Forecast_Demand             |     | Lead_Time                     |
| Selected_Model              |     | Lead_Time_Demand              |
+--------------+--------------+     | Demand_Std_Dev                |
               |                    | Service_Level                 |
               v                    | Safety_Stock                  |
       +---------------+            | Reorder_Point                 |
       |    DimDate    |            | Inventory_Gap                 |
       +---------------+            | Excess_Inventory_Units        |
       | Date (PK)     |            | Recommended_Order_Quantity    |
       | Day           |            | Risk                          |
       | Month         |            | Recommended_Action            |
       | Year          |            | Priority                      |
       | Day_Of_Week   |            +-------------------------------+
       +---------------+
```

### Table Specifications:
1. **FactForecast** (3,000 rows):
   - Grain: `Date × Store ID × Product ID`
   - Horizon: `2024-01-01` to `2024-01-30` (30 days)
   - Columns: `Date`, `Store ID`, `Product ID`, `Forecast_Demand`, `Selected_Model`
2. **FactInventoryRecommendation** (100 rows):
   - Grain: `Store ID × Product ID`
   - Columns: `Store ID`, `Product ID`, `Current Inventory`, `Lead Time`, `Lead Time Demand`, `Demand Std Dev`, `Service Level`, `Safety Stock`, `Reorder Point`, `Inventory Gap`, `Excess_Inventory_Units`, `Recommended Order Quantity`, `Risk`, `Recommended Action`, `Priority`

---

## 3. Production DAX Measure Library

### Core Forecast Measures
```dax
Total Forecast Demand = 
SUM(FactForecast[Forecast_Demand])

Average Daily Forecast = 
AVERAGEX(
    VALUES(DimDate[Date]),
    [Total Forecast Demand]
)

Max Series Daily Demand = 
MAXX(
    FactForecast,
    FactForecast[Forecast_Demand]
)
```

### Core Inventory & Risk Measures
```dax
Total Current Inventory = 
SUM(FactInventoryRecommendation[Current Inventory])

Total Safety Stock = 
SUM(FactInventoryRecommendation[Safety Stock])

Total Reorder Point = 
SUM(FactInventoryRecommendation[Reorder Point])

Total Inventory Gap = 
SUM(FactInventoryRecommendation[Inventory Gap])

Total Recommended Order = 
SUM(FactInventoryRecommendation[Recommended Order Quantity])

Total Excess Units = 
SUM(FactInventoryRecommendation[Excess_Inventory_Units])
```

### Risk & Priority Aggregations
```dax
High Risk Series Count = 
CALCULATE(
    COUNTROWS(FactInventoryRecommendation),
    FactInventoryRecommendation[Risk] = "High"
)

High Risk Percentage = 
DIVIDE([High Risk Series Count], COUNTROWS(FactInventoryRecommendation), 0)

Priority 1 Order Units = 
CALCULATE(
    [Total Recommended Order],
    FactInventoryRecommendation[Priority] = 1
)
```

---

## 4. Multi-Page Report Architecture

### Page 1 — Executive Overview
- **Header KPI Ribbon:**
  - `[Total Forecast Demand]` (278.4k units)
  - `[Total Current Inventory]` (29.0k units)
  - `[High Risk Series Count]` (95 of 100 series)
  - `[Total Recommended Order]` (52.1k units)
- **Visual 1.1 — 30-Day Aggregate Demand Trend (Line Chart):**
  - X-Axis: `DimDate[Date]`
  - Y-Axis: `[Total Forecast Demand]`
  - Tooltip: `[Average Daily Forecast]`, `Count of Active Series`
- **Visual 1.2 — Network Risk Distribution (Donut Chart):**
  - Legend: `FactInventoryRecommendation[Risk]`
  - Values: `COUNTROWS(FactInventoryRecommendation)`
  - Colors: High (`#a8433d`), Medium (`#d97706`), Low (`#6c7950`)
- **Visual 1.3 — Top Replenishment Priorities (Ranked Bar Chart):**
  - Category: `Store ID & " · " & Product ID`
  - Values: `[Total Recommended Order]` (Top 10 items)

### Page 2 — Demand Intelligence & Model Analysis
- **Slicers Panel:**
  - `DimStore[Store_ID]`
  - `DimProduct[Product_ID]`
  - `FactForecast[Selected_Model]`
  - `DimDate[Date]` (Between Slider)
- **Visual 2.1 — Demand by Store Node (Clustered Column Chart):**
  - X-Axis: `DimStore[Store_ID]`
  - Y-Axis: `[Total Forecast Demand]`
- **Visual 2.2 — Model Selection Breakdown (Donut Chart):**
  - Category: `FactForecast[Selected_Model]`
  - Values: `DISTINCTCOUNT(FactForecast[Series_Key])`
  - Series distribution: ARIMA (35), HistGradientBoosting (23), TunedRF (16), RF (15), Naive (9), SeasonalNaive (2)
- **Visual 2.3 — 3,000-Row Forecast Time-Series Ledger (Matrix Table):**
  - Rows: `Store ID` -> `Product ID` -> `Date`
  - Values: `[Total Forecast Demand]`, `Selected Model`

### Page 3 — Inventory Optimization & Decision Support
- **Visual 3.1 — Inventory Adequacy: Current Inventory vs Reorder Point (Clustered Bar Chart):**
  - X-Axis: `DimStore[Store_ID]`
  - Values: `[Total Current Inventory]`, `[Total Reorder Point]`
- **Visual 3.2 — Stockout Risk by Store (100% Stacked Column Chart):**
  - X-Axis: `DimStore[Store_ID]`
  - Series: `FactInventoryRecommendation[Risk]`
- **Visual 3.3 — Net Replenishment Demand by Product (Bar Chart):**
  - Y-Axis: `DimProduct[Product_ID]`
  - X-Axis: `[Total Recommended Order]`
- **Visual 3.4 — Store × Product Decision Matrix (Table):**
  - Columns: Priority, Store ID, Product ID, Current Inventory, Lead Time Demand, Safety Stock, Reorder Point, Inventory Gap, Recommended Order Quantity, Risk, Action.
  - Conditional formatting applied to Risk and Inventory Gap.

---

## 5. Web Platform Embedding & Configuration

The web application integrates with Power BI Service via standard web embedding:

- Set `NEXT_PUBLIC_POWERBI_REPORT_URL` in `.env.local` to point to the published Power BI report or embedded iframe URL.
- When configured, the **05 Analytics** workspace displays the direct launch action.
- When unconfigured, the workspace presents the architectural separation, live DAX measure documentation, and full report blueprint without broken frames or mock visual placeholders.
