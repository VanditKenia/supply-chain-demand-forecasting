"use client";

import React, { useState } from "react";
import { KPICard } from "./KPICard";

export const AnalyticsView: React.FC = () => {
  const [activeSpecPage, setActiveSpecPage] = useState<1 | 2 | 3>(1);
  const powerBiUrl = process.env.NEXT_PUBLIC_POWERBI_REPORT_URL || "";

  const daxMeasures = [
    {
      name: "Total Forecast Demand",
      formula: "Total Forecast Demand = SUM(FactForecast[Forecast_Demand])",
      desc: "Calculates total units forecast across the selected Store, Product, or Date filters.",
    },
    {
      name: "Safety Stock",
      formula: "Safety Stock = [Z Value] * [Historical Demand StdDev] * SQRT([Lead Time Days])",
      desc: "Buffer stock calculated per Store × Product series under the 95% service level assumption (Z=1.6449).",
    },
    {
      name: "Reorder Point (ROP)",
      formula: "Reorder Point = [Lead Time Demand] + [Safety Stock]",
      desc: "Threshold inventory level triggering a replenishment order.",
    },
    {
      name: "Recommended Order Quantity",
      formula: "Recommended Order Quantity = MAX([Reorder Point] - [Current Inventory], 0)",
      desc: "Net units needed to bring inventory position back to target reorder point.",
    },
    {
      name: "Risk Classification",
      formula: `Risk Category = 
SWITCH(
    TRUE(),
    [Current Inventory] < [Reorder Point], "High",
    [Current Inventory] < 1.2 * [Reorder Point], "Medium",
    "Low"
)`,
      desc: "Deterministic 3-tier risk logic based on current inventory position relative to calculated ROP.",
    },
  ];

  return (
    <div className="workspace-view">
      <div className="workspace-header">
        <div>
          <span className="workspace-eyebrow">MODULE 05 / HYBRID BI LAYER</span>
          <h1 className="workspace-title">Power BI Analytical Workspace</h1>
          <p className="workspace-desc">
            Deep-dive multi-dimensional analytical reporting, DAX measure modeling, and executive BI layers connected to the validated project data model.
          </p>
        </div>
        <div className="header-badge-group">
          {powerBiUrl ? (
            <a
              href={powerBiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="action-pill-btn"
            >
              OPEN POWER BI ANALYTICS ↗
            </a>
          ) : (
            <span className="status-pill pill-default">
              STANDALONE REPORT CONFIG READY
            </span>
          )}
        </div>
      </div>

      {/* Architecture Hybrid Explainer Ribbon */}
      <div className="architecture-banner">
        <div className="arch-header">
          <span className="mono-label">HYBRID ARCHITECTURE DESIGNATION</span>
          <span className="source-label">Next.js + Power BI Separation of Concerns</span>
        </div>
        <div className="arch-grid">
          <div className="arch-col">
            <h4 className="arch-col-title">Native Next.js Application (Operational Layer)</h4>
            <p className="arch-col-text">
              Owns the live operational experience: Control Tower, Demand Intelligence, Inventory Intelligence, Action Center, dynamic KPI cards, interactive tables, filter slicing, detail drawers, and deterministic decision dispatching.
            </p>
          </div>
          <div className="arch-col">
            <h4 className="arch-col-title">Power BI (Analytical Reporting Layer)</h4>
            <p className="arch-col-text">
              Owns deeper BI exploration: DAX measures, cross-visual drill-throughs, multi-year comparative slicers, executive print-ready reporting, and ad-hoc dimensional slice-and-dice over the same validated Phase 5/6 datasets.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Ribbon */}
      <div className="kpi-grid">
        <KPICard
          label="Power BI Report Model"
          value="Star Schema (3 Dim, 2 Fact)"
          subtext="DimStore, DimProduct, DimDate"
          badge={{ text: "Data Model", type: "accent" }}
          delay={0.05}
        />
        <KPICard
          label="Core DAX Measures"
          value="12 Measures"
          subtext="Forecast, ROP, Safety Stock, Gap"
          badge={{ text: "DAX Library", type: "default" }}
          delay={0.1}
        />
        <KPICard
          label="Interactive Report Pages"
          value="3 Specialized Views"
          subtext="Overview, Demand, Inventory"
          badge={{ text: "Specification", type: "success" }}
          delay={0.15}
        />
        <KPICard
          label="Underlying Grain"
          value="Date × Store × Product"
          subtext="3,000 Forecast + 100 Decision Rows"
          badge={{ text: "Validated", type: "default" }}
          delay={0.2}
        />
      </div>

      {/* Power BI Status Card */}
      <div className="chart-panel">
        <div className="panel-header">
          <div>
            <span className="panel-category">DEPLOYMENT CONNECTOR</span>
            <h3 className="panel-title">Power BI Service Connection</h3>
          </div>
          <span className="panel-meta">
            {powerBiUrl ? "Configured in Environment" : "Ready for URL Deployment"}
          </span>
        </div>

        {powerBiUrl ? (
          <div className="powerbi-connected-box">
            <div className="pbi-icon-badge">PBI</div>
            <div>
              <h4>Power BI Report URL Configured</h4>
              <p className="pbi-url-text">{powerBiUrl}</p>
            </div>
            <a
              href={powerBiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="primary-action"
            >
              LAUNCH REPORT IN POWER BI SERVICE ↗
            </a>
          </div>
        ) : (
          <div className="powerbi-unconfigured-box">
            <div className="pbi-status-icon">ℹ</div>
            <div className="pbi-status-content">
              <h4>Power BI Analytical Specification Active</h4>
              <p>
                The Power BI report operates as a complementary deep analytical tool. To link a published Power BI service report, set <code>NEXT_PUBLIC_POWERBI_REPORT_URL</code> in <code>.env.local</code>.
              </p>
              <div className="spec-doc-link">
                Full schema specification documented in: <code>docs/POWER_BI_ANALYTICS.md</code>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3-Page Power BI Report Blueprint Viewer */}
      <div className="chart-panel">
        <div className="panel-header">
          <div>
            <span className="panel-category">REPORT BLUEPRINT</span>
            <h3 className="panel-title">Power BI 3-Page Analytical Architecture</h3>
          </div>
          <div className="table-tabs">
            <button
              className={`tab-btn ${activeSpecPage === 1 ? "active" : ""}`}
              onClick={() => setActiveSpecPage(1)}
            >
              Page 1: Executive Overview
            </button>
            <button
              className={`tab-btn ${activeSpecPage === 2 ? "active" : ""}`}
              onClick={() => setActiveSpecPage(2)}
            >
              Page 2: Demand Analysis
            </button>
            <button
              className={`tab-btn ${activeSpecPage === 3 ? "active" : ""}`}
              onClick={() => setActiveSpecPage(3)}
            >
              Page 3: Inventory Optimization
            </button>
          </div>
        </div>

        <div className="pbi-page-blueprint">
          {activeSpecPage === 1 && (
            <div className="blueprint-page">
              <div className="blueprint-header">
                <h3>Page 1 — Executive Overview</h3>
                <span className="mono-label">Target Audience: VP Supply Chain, Operations Director</span>
              </div>
              <div className="blueprint-visuals-grid">
                <div className="blueprint-card">
                  <span className="bp-num">Visual 1.1</span>
                  <h4>Executive KPI Ribbon</h4>
                  <p>Total Forecast Demand (278.4k), Current Inventory (29.0k), High-Risk Series (95), Recommended Order Units (52.1k).</p>
                </div>
                <div className="blueprint-card">
                  <span className="bp-num">Visual 1.2</span>
                  <h4>30-Day Aggregate Demand Trend</h4>
                  <p>Daily demand sum line chart from 2024-01-01 to 2024-01-30 across all 5 stores.</p>
                </div>
                <div className="blueprint-card">
                  <span className="bp-num">Visual 1.3</span>
                  <h4>Network Risk Profile Donut</h4>
                  <p>Risk distribution showing 95 High Risk, 2 Medium Risk, and 3 Low Risk decision units.</p>
                </div>
                <div className="blueprint-card">
                  <span className="bp-num">Visual 1.4</span>
                  <h4>Replenishment Ranking Bar</h4>
                  <p>Top 10 Store × Product series ranked by Recommended Order Quantity.</p>
                </div>
              </div>
            </div>
          )}

          {activeSpecPage === 2 && (
            <div className="blueprint-page">
              <div className="blueprint-header">
                <h3>Page 2 — Demand Analysis</h3>
                <span className="mono-label">Target Audience: Demand Planner, Forecast Analyst</span>
              </div>
              <div className="blueprint-visuals-grid">
                <div className="blueprint-card">
                  <span className="bp-num">Visual 2.1</span>
                  <h4>Interactive Slicer Panel</h4>
                  <p>Store ID (S001-S005), Product ID (P0001-P0020), Selected Model, Date Range Slider.</p>
                </div>
                <div className="blueprint-card">
                  <span className="bp-num">Visual 2.2</span>
                  <h4>Store & Product Demand Comparison</h4>
                  <p>Clustered column chart comparing forecast volume by Store and top SKUs.</p>
                </div>
                <div className="blueprint-card">
                  <span className="bp-num">Visual 2.3</span>
                  <h4>Model Selection Distribution</h4>
                  <p>Series count by model: ARIMA (35), HistGradientBoosting (23), TunedRF (16), RF (15), Naive (9), SeasonalNaive (2).</p>
                </div>
                <div className="blueprint-card">
                  <span className="bp-num">Visual 2.4</span>
                  <h4>3,000-Row Forecast Ledger</h4>
                  <p>Matrix visual supporting drill-down from Store to Product to daily forecast observation.</p>
                </div>
              </div>
            </div>
          )}

          {activeSpecPage === 3 && (
            <div className="blueprint-page">
              <div className="blueprint-header">
                <h3>Page 3 — Inventory Optimization</h3>
                <span className="mono-label">Target Audience: Inventory Manager, Procurement Specialist</span>
              </div>
              <div className="blueprint-visuals-grid">
                <div className="blueprint-card">
                  <span className="bp-num">Visual 3.1</span>
                  <h4>Inventory Adequacy Visual</h4>
                  <p>Current Inventory vs Reorder Point (ROP) clustered comparison chart per Store.</p>
                </div>
                <div className="blueprint-card">
                  <span className="bp-num">Visual 3.2</span>
                  <h4>Safety Stock Buffer Analysis</h4>
                  <p>Safety stock distribution calculated from demand standard deviation and 7-day lead time.</p>
                </div>
                <div className="blueprint-card">
                  <span className="bp-num">Visual 3.3</span>
                  <h4>Net Inventory Gap & Replenishment</h4>
                  <p>Recommended order quantities categorized by Priority 1, 2, and 3 dispatch tiers.</p>
                </div>
                <div className="blueprint-card">
                  <span className="bp-num">Visual 3.4</span>
                  <h4>Optimization Decision Table</h4>
                  <p>Full 100-row table with conditional color formatting for stockout risk and excess inventory.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Core DAX Formulas Ledger */}
      <div className="chart-panel">
        <div className="panel-header">
          <div>
            <span className="panel-category">ANALYTICAL MODELING</span>
            <h3 className="panel-title">Production DAX Measure Library</h3>
          </div>
          <span className="panel-meta">Implemented in Power BI Data Model</span>
        </div>

        <div className="dax-table-container">
          <table className="ops-table">
            <thead>
              <tr>
                <th style={{ width: "20%" }}>Measure Name</th>
                <th style={{ width: "45%" }}>DAX Formulation</th>
                <th style={{ width: "35%" }}>Business Description</th>
              </tr>
            </thead>
            <tbody>
              {daxMeasures.map((m) => (
                <tr key={m.name}>
                  <td className="bold-cell">{m.name}</td>
                  <td>
                    <code className="dax-code">{m.formula}</code>
                  </td>
                  <td className="mono-desc">{m.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
