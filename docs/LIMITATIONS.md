# Limitations

The project is intentionally transparent about limitations that affect interpretation.

## 1. High-demand forecast underestimation

The final January 2024 test underpredicts high-demand observations.

For Demand >= 125:

- Actual mean: 158.04
- Forecast mean: 106.72
- Mean bias: -51.32
- Actual maximum: 284
- Forecast maximum: 146

This is material because downstream inventory calculations depend on the forecast layer.

## 2. Retrospective planning data

The forecast and inventory artifacts are based on historical/retrospective project data. They should not be described as live operational intelligence.

## 3. Lead time is an assumption

The source data does not contain observed supplier lead time. The Phase 6 base scenario therefore assumes 7 days and tests 3/7/14-day scenarios.

This is not a measurement of actual supplier performance.

## 4. Service level is an assumption

The base Phase 6 service level is 95%, with 90% and 99% scenario analysis.

The service level is a planning target, not an observed service-level result.

## 5. No live telemetry

The project does not consume live store, warehouse, IoT, point-of-sale, or supplier telemetry.

## 6. No real-time ERP/WMS integration

The current system reads analytical CSV artifacts and provides a FastAPI application layer. It does not integrate with a live ERP or WMS.

## 7. Separate Power BI analytical layer

Power BI/DAX is treated as a deeper analytical/BI layer separate from the operational web application. The current repository does not claim a completed embedded Power BI experience.

## 8. Application foundation is incomplete

The current Phase 7 code is a foundation. The repository contains the Next.js/FastAPI/MySQL/Docker foundation and a four-module frontend surface, but the richer Store Explorer, Product Explorer, cross-filtering, drill-through, 3D network, and full Power BI integration described in the blueprint are not all implemented.

## 9. Risk is not probability

High/Medium/Low risk is a business-rule classification. It is not a calibrated probability of stockout.

## 10. No guaranteed financial impact

The project does not measure or claim guaranteed savings, ROI, holding-cost reduction, revenue improvement, or procurement savings.

## 11. Artifact synchronization

The validated Phase 5/6 CSVs are recorded in the artifact manifest but are not currently committed in the GitHub repository tree. The application therefore requires safe synchronization of the real artifacts before its data endpoints can operate against them.

These limitations are part of the project's interpretation boundary, not defects to hide in portfolio presentation.
