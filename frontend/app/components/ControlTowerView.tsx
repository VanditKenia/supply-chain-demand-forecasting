"use client";

import React, { useState } from "react";
import type { EChartsOption } from "echarts";
import {
  OverviewMetrics,
  ForecastTrendResponse,
  RiskAnalyticsResponse,
  ActionItem,
  InventoryDecision,
} from "../types";
import { KPICard } from "./KPICard";
import { EChartWrapper } from "./EChartWrapper";

interface ControlTowerViewProps {
  overview: OverviewMetrics | null;
  trendData: ForecastTrendResponse | null;
  riskData: RiskAnalyticsResponse | null;
  priorityActions: ActionItem[];
  onSelectAction: (item: ActionItem | InventoryDecision) => void;
  onNavigate: (moduleCode: string) => void;
  loading?: boolean;
}

export const ControlTowerView: React.FC<ControlTowerViewProps> = ({
  overview,
  trendData,
  riskData,
  priorityActions,
  onSelectAction,
  onNavigate,
  loading = false,
}) => {
  const [activeTab, setActiveTab] = useState<"all" | "high" | "priority1">("all");

  const totalDemand = overview?.total_forecast_demand ?? 278398.48;
  const decisionUnits = overview?.decision_units ?? 100;
  const highRiskUnits = overview?.high_risk_units ?? 95;
  const recOrder = overview?.recommended_order_units ?? 52083.0;
  const storesCount = overview?.stores ?? 5;
  const productsCount = overview?.products ?? 20;
  const currInv = overview?.total_current_inventory ?? 29049;
  const safetyStock = overview?.total_safety_stock ?? 18669.1;

  // 30-Day Forecast Trend Chart Options
  const trendDates = trendData?.trend.map((t) => t.date) || [];
  const trendValues = trendData?.trend.map((t) => t.forecast_demand) || [];

  const trendChartOptions: EChartsOption = {
    tooltip: {
      trigger: "axis",
      backgroundColor: "#191917",
      borderColor: "#302f2a",
      textStyle: { color: "#eee9df", fontFamily: "DM Mono", fontSize: 11 },
      formatter: (params: any) => {
        const p = Array.isArray(params) ? params[0] : params;
        return `<div style="font-family: 'DM Mono', monospace; font-size: 11px;">
          <div><strong>Date:</strong> ${p.name}</div>
          <div style="color: #c75b32;"><strong>Total Forecast:</strong> ${Number(p.value).toLocaleString()} units</div>
          <div style="color: #716e66;">100 Store × Product Series</div>
        </div>`;
      },
    },
    grid: { left: 55, right: 25, top: 30, bottom: 35 },
    xAxis: {
      type: "category",
      data: trendDates,
      axisLine: { lineStyle: { color: "#d2ccc0" } },
      axisLabel: {
        color: "#716e66",
        fontFamily: "DM Mono",
        fontSize: 10,
        formatter: (val: string) => val.slice(5),
      },
    },
    yAxis: {
      type: "value",
      axisLine: { show: false },
      splitLine: { lineStyle: { color: "#e3ded4", type: "dashed" } },
      axisLabel: {
        color: "#716e66",
        fontFamily: "DM Mono",
        fontSize: 10,
        formatter: (v: number) => `${(v / 1000).toFixed(1)}k`,
      },
    },
    series: [
      {
        name: "Forecast Demand",
        type: "line",
        smooth: true,
        data: trendValues,
        symbolSize: 6,
        itemStyle: { color: "#c75b32" },
        lineStyle: { width: 2.5, color: "#c75b32" },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(199, 91, 50, 0.3)" },
              { offset: 1, color: "rgba(199, 91, 50, 0.02)" },
            ],
          },
        },
      },
    ],
  };

  // Risk Distribution Chart Options (Horizontal stacked or Donut / Bar)
  const riskDist = riskData?.risk_distribution || [
    { risk: "High", count: 95, pct: 95.0 },
    { risk: "Low", count: 3, pct: 3.0 },
    { risk: "Medium", count: 2, pct: 2.0 },
  ];

  const riskChartOptions: EChartsOption = {
    tooltip: {
      trigger: "item",
      backgroundColor: "#191917",
      borderColor: "#302f2a",
      textStyle: { color: "#eee9df", fontFamily: "DM Mono", fontSize: 11 },
      formatter: (p: any) =>
        `<strong>${p.name} Risk:</strong> ${p.value} series (${p.percent}%)`,
    },
    legend: {
      bottom: 0,
      textStyle: { color: "#191917", fontFamily: "DM Mono", fontSize: 10 },
      itemWidth: 10,
      itemHeight: 10,
    },
    series: [
      {
        name: "Risk Distribution",
        type: "pie",
        radius: ["45%", "72%"],
        center: ["50%", "45%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 4,
          borderColor: "#f6f2ea",
          borderWidth: 2,
        },
        label: { show: false },
        emphasis: {
          label: {
            show: true,
            fontSize: 12,
            fontWeight: "bold",
            color: "#191917",
            fontFamily: "DM Mono",
          },
        },
        data: riskDist.map((r) => ({
          name: r.risk,
          value: r.count,
          itemStyle: {
            color:
              r.risk === "High"
                ? "#a8433d"
                : r.risk === "Medium"
                ? "#d97706"
                : "#6c7950",
          },
        })),
      },
    ],
  };

  // Replenishment Ranking Top Bar Chart
  const ranking = riskData?.replenishment_ranking?.slice(0, 7) || [];
  const rankingNames = ranking.map((r) => `${r.store_id} · ${r.product_id}`).reverse();
  const rankingValues = ranking.map((r) => r.recommended_order).reverse();

  const rankingChartOptions: EChartsOption = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      backgroundColor: "#191917",
      borderColor: "#302f2a",
      textStyle: { color: "#eee9df", fontFamily: "DM Mono", fontSize: 11 },
      formatter: (p: any) => {
        const item = Array.isArray(p) ? p[0] : p;
        return `<strong>${item.name}</strong><br/>Recommended Order: <span style="color: #c75b32;">${item.value} units</span>`;
      },
    },
    grid: { left: 95, right: 30, top: 15, bottom: 20 },
    xAxis: {
      type: "value",
      axisLine: { show: false },
      splitLine: { lineStyle: { color: "#e3ded4", type: "dashed" } },
      axisLabel: { color: "#716e66", fontFamily: "DM Mono", fontSize: 9 },
    },
    yAxis: {
      type: "category",
      data: rankingNames,
      axisLine: { lineStyle: { color: "#d2ccc0" } },
      axisLabel: { color: "#191917", fontFamily: "DM Mono", fontSize: 10 },
    },
    series: [
      {
        name: "Recommended Order",
        type: "bar",
        data: rankingValues,
        itemStyle: { color: "#c75b32", borderRadius: [0, 3, 3, 0] },
        barWidth: 14,
      },
    ],
  };

  // Filter actions for mini table
  const filteredActions = priorityActions.filter((a) => {
    if (activeTab === "high") return a.risk.toLowerCase() === "high";
    if (activeTab === "priority1") return a.priority === 1;
    return true;
  });

  return (
    <div className="workspace-view">
      <div className="workspace-header">
        <div>
          <span className="workspace-eyebrow">MODULE 01 / OPERATIONAL CONTROL CENTER</span>
          <h1 className="workspace-title">Supply Chain Control Tower</h1>
          <p className="workspace-desc">
            Integrated multi-tier operational control center linking 30-day demand forecasts, stockout risk exposures, and priority replenishment orders.
          </p>
        </div>
        <div className="header-badge-group">
          <span className="live-status-pill">
            <span className="status-dot" /> LIVE TELEMETRY
          </span>
          <button onClick={() => onNavigate("04")} className="action-pill-btn">
            ACTION QUEUE ({priorityActions.length}) →
          </button>
        </div>
      </div>

      {/* Primary KPI Ribbon */}
      <div className="kpi-grid">
        <KPICard
          label="Total Forecast Demand"
          value={`${(totalDemand / 1000).toFixed(1)}k`}
          subtext="30-day sum across 100 series"
          badge={{ text: "Jan 2024", type: "accent" }}
          delay={0.05}
        />
        <KPICard
          label="Recommended Order Qty"
          value={`${(recOrder / 1000).toFixed(1)}k`}
          subtext="Policy: max(ROP - Inv, 0)"
          badge={{ text: "Urgent", type: "danger" }}
          delay={0.1}
        />
        <KPICard
          label="High-Risk Decision Units"
          value={`${highRiskUnits} / ${decisionUnits}`}
          subtext="Current Inv < Reorder Point"
          badge={{ text: "95% of network", type: "danger" }}
          delay={0.15}
        />
        <KPICard
          label="Current Network Inventory"
          value={currInv.toLocaleString()}
          subtext="Units on hand across 5 stores"
          badge={{ text: "Audited", type: "default" }}
          delay={0.2}
        />
        <KPICard
          label="Safety Stock Buffer"
          value={`${(safetyStock / 1000).toFixed(1)}k`}
          subtext="Z=1.645 · 95% Service Level"
          badge={{ text: "7-day Lead", type: "success" }}
          delay={0.25}
        />
        <KPICard
          label="Network Dimensions"
          value={`${storesCount} Stores · ${productsCount} SKUs`}
          subtext="100 distinct Store × SKU nodes"
          badge={{ text: "Balanced", type: "default" }}
          delay={0.3}
        />
      </div>

      {/* Main Analytical Visuals Grid */}
      <div className="charts-main-grid">
        {/* 30-Day Trend Chart */}
        <div className="chart-panel col-span-2">
          <div className="panel-header">
            <div>
              <span className="panel-category">TIME-SERIES FORECAST</span>
              <h3 className="panel-title">30-Day Aggregate Demand Trajectory</h3>
            </div>
            <span className="panel-meta">Daily Series Sum (Jan 01 – Jan 30)</span>
          </div>
          <EChartWrapper options={trendChartOptions} height={280} loading={loading} />
          <div className="panel-footer-caption">
            Chronological multi-model forecasts evaluated without leakage; high-demand spikes (&gt;=125) are subject to known regression toward mean.
          </div>
        </div>

        {/* Risk Distribution Chart */}
        <div className="chart-panel">
          <div className="panel-header">
            <div>
              <span className="panel-category">INVENTORY EXPOSURE</span>
              <h3 className="panel-title">Network Risk Profile</h3>
            </div>
            <span className="panel-meta">100 Decision Series</span>
          </div>
          <EChartWrapper options={riskChartOptions} height={230} loading={loading} />
          <div className="risk-legend-bar">
            <div className="risk-metric-stat">
              <span className="stat-num text-danger">{highRiskUnits}</span>
              <span className="stat-label">High Risk</span>
            </div>
            <div className="risk-metric-stat">
              <span className="stat-num text-warning">{overview?.medium_risk_units ?? 2}</span>
              <span className="stat-label">Medium</span>
            </div>
            <div className="risk-metric-stat">
              <span className="stat-num text-success">{overview?.low_risk_units ?? 3}</span>
              <span className="stat-label">Low</span>
            </div>
          </div>
        </div>
      </div>

      {/* Replenishment Ranking & Priority Table Split */}
      <div className="secondary-grid">
        {/* Replenishment Ranking Bar Chart */}
        <div className="chart-panel">
          <div className="panel-header">
            <div>
              <span className="panel-category">REPLENISHMENT PRIORITIES</span>
              <h3 className="panel-title">Top Replenishment Demands</h3>
            </div>
            <span className="panel-meta">Highest Recommended Orders</span>
          </div>
          <EChartWrapper options={rankingChartOptions} height={270} loading={loading} />
        </div>

        {/* Priority Action Table */}
        <div className="chart-panel col-span-2">
          <div className="panel-header">
            <div>
              <span className="panel-category">DECISION PIPELINE</span>
              <h3 className="panel-title">Immediate Action Queue</h3>
            </div>
            <div className="table-tabs">
              <button
                className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
                onClick={() => setActiveTab("all")}
              >
                All ({priorityActions.length})
              </button>
              <button
                className={`tab-btn ${activeTab === "high" ? "active" : ""}`}
                onClick={() => setActiveTab("high")}
              >
                High Risk ({highRiskUnits})
              </button>
              <button
                className={`tab-btn ${activeTab === "priority1" ? "active" : ""}`}
                onClick={() => setActiveTab("priority1")}
              >
                Priority 1
              </button>
            </div>
          </div>

          <div className="table-container">
            <table className="ops-table">
              <thead>
                <tr>
                  <th>Priority</th>
                  <th>Store</th>
                  <th>Product</th>
                  <th>Risk</th>
                  <th>Current Inv</th>
                  <th>Reorder Point</th>
                  <th>Inv Gap</th>
                  <th>Recommended Order</th>
                  <th>Action</th>
                  <th>Inspect</th>
                </tr>
              </thead>
              <tbody>
                {filteredActions.slice(0, 6).map((item) => (
                  <tr
                    key={`${item.store_id}-${item.product_id}`}
                    onClick={() => onSelectAction(item)}
                    className="clickable-row"
                  >
                    <td>
                      <span className={`priority-pill priority-${item.priority}`}>
                        P{item.priority}
                      </span>
                    </td>
                    <td className="mono-cell">Store {item.store_id}</td>
                    <td className="mono-cell bold-cell">{item.product_id}</td>
                    <td>
                      <span className={`risk-badge badge-${item.risk.toLowerCase()}`}>
                        {item.risk}
                      </span>
                    </td>
                    <td className="mono-cell">{item.current_inventory}</td>
                    <td className="mono-cell">{item.reorder_point.toFixed(1)}</td>
                    <td className="mono-cell text-danger">{item.inventory_gap.toFixed(1)}</td>
                    <td className="mono-cell highlight-order">
                      {item.recommended_order_quantity.toFixed(0)}
                    </td>
                    <td>
                      <span className="action-label">{item.recommended_action}</span>
                    </td>
                    <td>
                      <button className="inspect-btn" onClick={(e) => { e.stopPropagation(); onSelectAction(item); }}>
                        DETAIL ↗
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="table-footer-bar">
            <span>Showing top {Math.min(6, filteredActions.length)} of {filteredActions.length} prioritized series</span>
            <button onClick={() => onNavigate("04")} className="text-link-btn">
              Open Full Action Center →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
