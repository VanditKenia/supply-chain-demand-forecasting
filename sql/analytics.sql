-- Phase 3 — SQL Analytics
-- Status: COMPLETE
-- Repository checkpoint: 2026-09-25
--
-- The analytical queries below operate on the validated MySQL schema.
-- Analytical grain:
--   one row = one Product × Store × Date
--
-- Important:
--   potential_inventory_pressure is a screening indicator only.
--   It must not be interpreted as confirmed stockout without stronger
--   operational semantics.
--
-- The final analytical view is defined in this file.

CREATE OR REPLACE VIEW vw_demand_analysis AS
SELECT
    f.date_key,
    c.year,
    c.quarter,
    c.month,
    c.month_name,
    c.week,
    c.day_of_month,
    c.day_of_week,
    c.day_name,
    f.store_id,
    s.region,
    f.product_id,
    f.category,
    f.inventory_level,
    f.units_sold,
    f.units_ordered,
    f.price,
    f.discount,
    f.weather_condition,
    f.promotion,
    f.competitor_pricing,
    f.seasonality,
    f.epidemic,
    f.demand,
    CASE
        WHEN f.inventory_level < f.demand THEN 1
        ELSE 0
    END AS potential_inventory_pressure,
    ROUND(
        f.inventory_level / NULLIF(f.demand, 0),
        2
    ) AS inventory_to_demand_ratio,
    ROUND(
        f.units_ordered / NULLIF(f.demand, 0),
        2
    ) AS ordered_to_demand_ratio
FROM fact_demand f
JOIN dim_calendar c
    ON f.date_key = c.date_key
JOIN dim_store s
    ON f.store_id = s.store_id;

-- Validation completed:
-- total_rows = 76000
-- unique_dates = 760
-- unique_stores = 5
-- unique_products = 20

-- Phase 3 descriptive analyses were executed during development and
-- validated against the final analytical view. Detailed exploratory
-- results belong in the Phase 4 EDA artifacts rather than being encoded
-- as hard-coded result tables in this SQL file.
