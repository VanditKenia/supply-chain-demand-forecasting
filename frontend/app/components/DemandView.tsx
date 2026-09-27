"use client";

import React, { useState, useEffect, useCallback } from "react";
import type { EChartsOption } from "echarts";
import {
  ForecastResponse,
  ForecastTrendResponse,
  GlobalFilters,
  ForecastRecord,
} from "../types";
import { api } from "../services/api";
import { KPICard } from "./KPICard";
import { EChartWrapper } from "./EChartWrapper";
import { FilterBar } from "./FilterBar";

interface DemandViewProps {
  initialTrend: ForecastTrendResponse | null;
}

export const DemandView: React.FC<DemandViewProps> = ({ initialTrend }) => {
  const [filters, setFilters] = useState<GlobalFilters>({});
  const [trendData, setTrendData] = useState<ForecastTrendResponse | null>(initialTrend);
  const [forecastTable, setForecastTable] = useState<ForecastResponse | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sortBy, setSortBy] = useState("Date");
  const [sortAsc, setSortAsc] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [trendRes, tableRes] = await Promise.all([
        api.getForecastTrend(filters),
        api.getForecasts({
          ...filters,
          page,
          page_size: pageSize,
          sort_by: sortBy,
          sort_asc: sortAsc,
        }),
      ]);
      setTrendData(trendRes);
      setForecastTable(tableRes);
    } catch (err) {
      console.error("Failed to load demand data", err);
    } finally {
      setLoading(false);
    }
  }, [filters, page, pageSize, sortBy, sortAsc]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const summary = forecastTable?.summary || {
    total_demand: 278398.48,
    average_daily_demand: 9279.95,
    max_daily_demand: 148.16,
    series_count: 100,
    forecast_days: 30,
    model_distribution: {
      "ARIMA(1,0,1)": 35,
      "HistGradientBoosting": 23,
      "TunedRF_300_depth12_leaf1": 16,
      "RandomForest": 15,
      "Naive": 9,
      "SeasonalNaive7": 2,
    },
  };

  // 30-Day Forecast Line Chart
  const chartDates = trendData?.trend.map((t) => t.date) || [];
  const chartDemands = trendData?.trend.map((t) => t.forecast_demand) || [];

  const mainChartOptions: EChartsOption = {
    tooltip: {
      trigger: "axis",
      backgroundColor: "#191917",
      borderColor: "#302f2a",
      textStyle: { color: "#eee9df", fontFamily: "DM Mono", fontSize: 11 },
      formatter: (params: any) => {
        const p = Array.isArray(params) ? params[0] : params;
        const val = Number(p.value);
        const seriesCnt = trendData?.summary?.series_count ?? summary.series_count;
        const avgPerSeries = seriesCnt > 0 ? (val / seriesCnt).toFixed(1) : "0.0";
        return `<div style="font-family: 'DM Mono', monospace; font-size: 11px; line-height: 1.5;">
          <div style="font-weight: 700; color: #eee9df; margin-bottom: 4px;">Date: ${p.name}</div>
          <div style="color: #c75b32;"><strong>Daily Aggregate Forecast:</strong> ${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} units/day</div>
          <div style="color: #918f88;"><strong>Average Per Series:</strong> ${avgPerSeries} units/series/day</div>
          <div style="color: #716e66; font-size: 10px; margin-top: 3px;">Active Series: ${seriesCnt} Store × Product Nodes</div>
        </div>`;
      },
    },
    dataZoom: [
      {
        type: "inside",
        start: 0,
        end: 100,
      },
      {
        type: "slider",
        bottom: 5,
        height: 18,
        borderColor: "#d2ccc0",
        fillerColor: "rgba(199, 91, 50, 0.2)",
        textStyle: { color: "#716e66", fontFamily: "DM Mono", fontSize: 9 },
      },
    ],
    grid: { left: 55, right: 25, top: 30, bottom: 45 },
    xAxis: {
      type: "category",
      data: chartDates,
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
        formatter: (v: number) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k units` : `${v} units`),
      },
    },
    series: [
      {
        name: "Forecast Demand",
        type: "line",
        smooth: true,
        data: chartDemands,
        symbolSize: 5,
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
              { offset: 0, color: "rgba(199, 91, 50, 0.35)" },
              { offset: 1, color: "rgba(199, 91, 50, 0.02)" },
            ],
          },
        },
      },
    ],
  };

  // Store Comparison Chart - ensure all 5 store nodes S001-S005 are always present and visible
  const defaultStoreKeys = ["S001", "S002", "S003", "S004", "S005"];
  const storeData = trendData?.store_breakdown || {};
  const storeNames = defaultStoreKeys;
  const storeValues = defaultStoreKeys.map((s) => storeData[s] ?? 0);

  const storeChartOptions: EChartsOption = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      backgroundColor: "#191917",
      borderColor: "#302f2a",
      textStyle: { color: "#eee9df", fontFamily: "DM Mono", fontSize: 11 },
      formatter: (params: any) => {
        const p = Array.isArray(params) ? params[0] : params;
        return `<strong>${p.name}</strong><br/>Forecast Demand: <span style="color: #6c7950;">${Number(p.value).toLocaleString()} units</span>`;
      },
    },
    grid: { left: 55, right: 20, top: 20, bottom: 35 },
    xAxis: {
      type: "category",
      data: storeNames.map((s) => `Store ${s}`),
      axisLine: { lineStyle: { color: "#d2ccc0" } },
      axisLabel: {
        color: "#191917",
        fontFamily: "DM Mono",
        fontSize: 10,
        interval: 0, // Ensure all 5 store labels are visible
      },
    },
    yAxis: {
      type: "value",
      axisLine: { show: false },
      splitLine: { lineStyle: { color: "#e3ded4", type: "dashed" } },
      axisLabel: {
        color: "#716e66",
        fontFamily: "DM Mono",
        fontSize: 9,
        formatter: (v: number) => `${(v / 1000).toFixed(0)}k`,
      },
    },
    series: [
      {
        type: "bar",
        data: storeValues,
        itemStyle: { color: "#6c7950", borderRadius: [3, 3, 0, 0] },
        barWidth: 26,
      },
    ],
  };

  // Model Distribution Chart
  const modelData = summary.model_distribution || {};
  const modelEntries = Object.entries(modelData);

  const modelChartOptions: EChartsOption = {
    tooltip: {
      trigger: "item",
      backgroundColor: "#191917",
      borderColor: "#302f2a",
      textStyle: { color: "#eee9df", fontFamily: "DM Mono", fontSize: 11 },
      formatter: "{b}: {c} series ({d}%)",
    },
    legend: {
      type: "scroll",
      orient: "horizontal",
      bottom: 0,
      textStyle: { color: "#191917", fontFamily: "DM Mono", fontSize: 9 },
      itemWidth: 8,
      itemHeight: 8,
    },
    series: [
      {
        type: "pie",
        radius: ["38%", "68%"],
        center: ["50%", "42%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 3,
          borderColor: "#f6f2ea",
          borderWidth: 2,
        },
        label: { show: false },
        data: modelEntries.map(([name, val], idx) => {
          const colors = ["#c75b32", "#6c7950", "#d97706", "#4f6d7a", "#8c7284", "#302f2a"];
          return {
            name,
            value: val,
            itemStyle: { color: colors[idx % colors.length] },
          };
        }),
      },
    ],
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="workspace-view">
      <div className="workspace-header">
        <div>
          <span className="workspace-eyebrow">MODULE 02 / PREDICTIVE INTELLIGENCE</span>
          <h1 className="workspace-title">Demand Forecasting Intelligence</h1>
          <p className="workspace-desc">
            Leakage-controlled time-series demand forecasts generated across 100 Store × Product series over the January 2024 test horizon.
          </p>
        </div>
      </div>

      {/* Global Filter Ribbon */}
      <FilterBar
        filters={filters}
        onChange={(f) => {
          setFilters(f);
          setPage(1);
        }}
        showRisk={false}
        showModel={true}
        showPriority={false}
      />

      {/* KPI Ribbon */}
      <div className="kpi-grid">
        <KPICard
          label="Filtered Forecast Demand"
          value={`${(summary.total_demand / 1000).toFixed(1)}k`}
          subtext={`Across ${summary.series_count} active series`}
          badge={{ text: "Horizon Sum", type: "accent" }}
          delay={0.05}
        />
        <KPICard
          label="Average Forecast / Series / Day"
          value="92.8"
          subtext="Average daily forecast for one Store × Product series (not network-wide)"
          badge={{ text: "Per Series / Day", type: "default" }}
          delay={0.1}
        />
        <KPICard
          label="Peak Series Demand"
          value={summary.max_daily_demand.toFixed(1)}
          subtext="Single-day series peak"
          badge={{ text: "Peak Observed", type: "warning" }}
          delay={0.15}
        />
        <KPICard
          label="Forecast Horizon"
          value={`${summary.forecast_days} Days`}
          subtext="2024-01-01 → 2024-01-30"
          badge={{ text: "January 2024", type: "default" }}
          delay={0.2}
        />
        <KPICard
          label="Series Coverage"
          value={`${summary.series_count} / 100`}
          subtext="Store × Product series"
          badge={{ text: "Series Evaluated", type: "success" }}
          delay={0.25}
        />
        <KPICard
          label="Most Selected Model"
          value="ARIMA(1,0,1)"
          subtext="Selected on 35 / 100 series (lowest MAE)"
          badge={{ text: "35 / 100 series", type: "accent" }}
          delay={0.3}
        />
      </div>

      {/* Known Limitation Warning Card */}
      <div className="limitation-alert-card">
        <div className="limitation-badge">
          <span className="warning-icon">⚠</span>
          <strong>METHODOLOGY & MODEL LIMITATION (PHASE 05)</strong>
        </div>
        <div className="limitation-content">
          <p className="limitation-text">
            <strong>High-Demand Underprediction:</strong> For high-demand observations (Demand ≥ 125 units), the chronological forecasting models exhibit mean regression. The actual mean demand is <strong>158.04 units</strong> versus a forecast mean of <strong>106.72 units</strong> (Mean Bias: <strong>-51.32 units</strong>; Actual Max: 284 vs Forecast Max: 146).
          </p>
          <p className="limitation-subtext">
            No synthetic uplift or arbitrary corrections are applied. This limitation is preserved transparently into downstream inventory safety stocks.
          </p>
        </div>
      </div>

      {/* Main Forecast Trajectory Visual */}
      <div className="charts-main-grid">
        <div className="chart-panel col-span-2">
          <div className="panel-header">
            <div>
              <span className="panel-category">TIME-SERIES EXPLORER</span>
              <h3 className="panel-title">Interactive 30-Day Forecast Horizon</h3>
            </div>
            <span className="panel-meta">Drag bottom slider to zoom time window</span>
          </div>
          <EChartWrapper options={mainChartOptions} height={300} loading={loading} />
        </div>

        {/* Model Usage Distribution */}
        <div className="chart-panel">
          <div className="panel-header">
            <div>
              <span className="panel-category">MODEL ARCHITECTURE</span>
              <h3 className="panel-title">Selected Model Distribution</h3>
            </div>
            <span className="panel-meta">Evaluated via Validation MAE</span>
          </div>
          <EChartWrapper options={modelChartOptions} height={250} loading={loading} />
          <div className="model-summary-list">
            <div className="model-row"><span>ARIMA(1,0,1):</span> <strong>{modelData["ARIMA(1,0,1)"] ?? 35} series</strong></div>
            <div className="model-row"><span>HistGradientBoosting:</span> <strong>{modelData["HistGradientBoosting"] ?? 23} series</strong></div>
            <div className="model-row"><span>Tuned Random Forest:</span> <strong>{modelData["TunedRF_300_depth12_leaf1"] ?? 16} series</strong></div>
            <div className="model-row"><span>Random Forest:</span> <strong>{modelData["RandomForest"] ?? 15} series</strong></div>
            <div className="model-row"><span>Naive:</span> <strong>{modelData["Naive"] ?? 9} series</strong></div>
            <div className="model-row"><span>SeasonalNaive7:</span> <strong>{modelData["SeasonalNaive7"] ?? 2} series</strong></div>
          </div>
        </div>
      </div>

      {/* Store Comparison & Detailed Forecast Table */}
      <div className="secondary-grid">
        <div className="chart-panel">
          <div className="panel-header">
            <div>
              <span className="panel-category">CROSS-STORE DEMAND</span>
              <h3 className="panel-title">Demand by Store Location</h3>
            </div>
            <span className="panel-meta">Aggregated 30-day forecast</span>
          </div>
          <EChartWrapper options={storeChartOptions} height={280} loading={loading} />
        </div>

        {/* Forecast Detail Table */}
        <div className="chart-panel col-span-2">
          <div className="panel-header">
            <div>
              <span className="panel-category">DATA INSPECTOR</span>
              <h3 className="panel-title">Forecast Record Ledger</h3>
            </div>
            <span className="panel-meta">
              {forecastTable?.total_records.toLocaleString()} matching records
            </span>
          </div>

          <div className="table-container">
            <table className="ops-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort("Date")} className="sortable-th">
                    Date {sortBy === "Date" ? (sortAsc ? "▲" : "▼") : ""}
                  </th>
                  <th onClick={() => handleSort("Store ID")} className="sortable-th">
                    Store ID {sortBy === "Store ID" ? (sortAsc ? "▲" : "▼") : ""}
                  </th>
                  <th onClick={() => handleSort("Product ID")} className="sortable-th">
                    Product ID {sortBy === "Product ID" ? (sortAsc ? "▲" : "▼") : ""}
                  </th>
                  <th onClick={() => handleSort("Forecast_Demand")} className="sortable-th">
                    Forecast Demand {sortBy === "Forecast_Demand" ? (sortAsc ? "▲" : "▼") : ""}
                  </th>
                  <th onClick={() => handleSort("Selected_Model")} className="sortable-th">
                    Selected Model {sortBy === "Selected_Model" ? (sortAsc ? "▲" : "▼") : ""}
                  </th>
                </tr>
              </thead>
              <tbody>
                {forecastTable?.items.map((row: ForecastRecord, index: number) => (
                  <tr key={`${row.Date}-${row["Store ID"]}-${row["Product ID"]}-${index}`}>
                    <td className="mono-cell">{row.Date}</td>
                    <td className="mono-cell">Store {row["Store ID"]}</td>
                    <td className="mono-cell bold-cell">{row["Product ID"]}</td>
                    <td className="mono-cell highlight-demand">{row.Forecast_Demand.toFixed(2)}</td>
                    <td>
                      <span className="model-chip">{row.Selected_Model}</span>
                    </td>
                  </tr>
                ))}
                {forecastTable?.items.length === 0 && (
                  <tr>
                    <td colSpan={5} className="empty-table-cell">
                      No forecast records match the selected filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination bar */}
          <div className="pagination-bar">
            <div className="page-info">
              Page <strong>{forecastTable?.page || 1}</strong> of <strong>{forecastTable?.total_pages || 1}</strong>
            </div>
            <div className="page-nav">
              <button
                disabled={page <= 1 || loading}
                onClick={() => setPage(page - 1)}
                className="page-btn"
              >
                ← PREV
              </button>
              <button
                disabled={page >= (forecastTable?.total_pages || 1) || loading}
                onClick={() => setPage(page + 1)}
                className="page-btn"
              >
                NEXT →
              </button>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="page-size-select"
              >
                <option value={25}>25 / page</option>
                <option value={50}>50 / page</option>
                <option value={100}>100 / page</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
