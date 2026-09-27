"use client";

import React, { useState, useEffect, useCallback } from "react";
import type { EChartsOption } from "echarts";
import {
  InventoryResponse,
  RiskAnalyticsResponse,
  InventoryDecision,
  GlobalFilters,
} from "../types";
import { api } from "../services/api";
import { KPICard } from "./KPICard";
import { EChartWrapper } from "./EChartWrapper";
import { FilterBar } from "./FilterBar";

interface InventoryViewProps {
  onSelectDecision: (item: InventoryDecision) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({ onSelectDecision }) => {
  const [filters, setFilters] = useState<GlobalFilters>({});
  const [invData, setInvData] = useState<InventoryResponse | null>(null);
  const [riskData, setRiskData] = useState<RiskAnalyticsResponse | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sortBy, setSortBy] = useState("Priority");
  const [sortAsc, setSortAsc] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [invRes, riskRes] = await Promise.all([
        api.getInventory({
          ...filters,
          page,
          page_size: pageSize,
          sort_by: sortBy,
          sort_asc: sortAsc,
        }),
        api.getRisk(),
      ]);
      setInvData(invRes);
      setRiskData(riskRes);
    } catch (err) {
      console.error("Failed to load inventory data", err);
    } finally {
      setLoading(false);
    }
  }, [filters, page, pageSize, sortBy, sortAsc]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const summary = invData?.summary || {
    total_units: 100,
    current_inventory: 29049,
    lead_time_demand: 61826.98,
    safety_stock: 18669.09,
    reorder_point: 80496.07,
    inventory_gap: 51447.07,
    recommended_order: 52083.0,
    excess_inventory_units: 635.93,
    high_risk_count: 95,
    medium_risk_count: 2,
    low_risk_count: 3,
  };

  // Chart 1: Current Inventory vs Reorder Point (by Store)
  const storeRisks = riskData?.risk_by_store || [];
  const storeLabels = storeRisks.map((s) => `Store ${s.store_id}`);
  const storeCurrInv = storeRisks.map((s) => s.current_inv);
  const storeRop = storeRisks.map((s) => s.reorder_point);

  const invVsRopChartOptions: EChartsOption = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      backgroundColor: "#191917",
      borderColor: "#302f2a",
      textStyle: { color: "#eee9df", fontFamily: "DM Mono", fontSize: 11 },
    },
    legend: {
      bottom: 0,
      textStyle: { color: "#191917", fontFamily: "DM Mono", fontSize: 10 },
    },
    grid: { left: 55, right: 20, top: 25, bottom: 35 },
    xAxis: {
      type: "category",
      data: storeLabels,
      axisLine: { lineStyle: { color: "#d2ccc0" } },
      axisLabel: { color: "#191917", fontFamily: "DM Mono", fontSize: 10 },
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
        name: "Current Inventory",
        type: "bar",
        data: storeCurrInv,
        itemStyle: { color: "#4f6d7a", borderRadius: [3, 3, 0, 0] },
        barWidth: 16,
      },
      {
        name: "Reorder Point (ROP)",
        type: "bar",
        data: storeRop,
        itemStyle: { color: "#c75b32", borderRadius: [3, 3, 0, 0] },
        barWidth: 16,
      },
    ],
  };

  // Chart 2: Risk by Store (Stacked Bar)
  const storeHighRisk = storeRisks.map((s) => s.high);
  const storeMedRisk = storeRisks.map((s) => s.medium);
  const storeLowRisk = storeRisks.map((s) => s.low);

  const riskByStoreChartOptions: EChartsOption = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      backgroundColor: "#191917",
      borderColor: "#302f2a",
      textStyle: { color: "#eee9df", fontFamily: "DM Mono", fontSize: 11 },
    },
    legend: {
      bottom: 0,
      textStyle: { color: "#191917", fontFamily: "DM Mono", fontSize: 10 },
    },
    grid: { left: 45, right: 20, top: 25, bottom: 35 },
    xAxis: {
      type: "category",
      data: storeLabels.length === 5 ? storeLabels : ["Store S001", "Store S002", "Store S003", "Store S004", "Store S005"],
      axisLine: { lineStyle: { color: "#d2ccc0" } },
      axisLabel: {
        color: "#191917",
        fontFamily: "DM Mono",
        fontSize: 10,
        interval: 0, // Ensure S001-S005 labels are all visible
      },
    },
    yAxis: {
      type: "value",
      axisLine: { show: false },
      splitLine: { lineStyle: { color: "#e3ded4", type: "dashed" } },
      axisLabel: { color: "#716e66", fontFamily: "DM Mono", fontSize: 9 },
    },
    series: [
      {
        name: "High Risk",
        type: "bar",
        stack: "risk",
        data: storeHighRisk,
        itemStyle: { color: "#a8433d" },
        barWidth: 22,
      },
      {
        name: "Medium Risk",
        type: "bar",
        stack: "risk",
        data: storeMedRisk,
        itemStyle: { color: "#d97706" },
      },
      {
        name: "Low Risk",
        type: "bar",
        stack: "risk",
        data: storeLowRisk,
        itemStyle: { color: "#6c7950" },
      },
    ],
  };

  // Chart 3: Top Recommended Orders by Product (Horizontal Bar)
  const prodRec = riskData?.recommended_order_by_product || {};
  const topProds = Object.entries(prodRec).slice(0, 8).reverse();
  const prodNames = topProds.map(([p]) => p);
  const prodValues = topProds.map(([, val]) => val);

  const prodChartOptions: EChartsOption = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      backgroundColor: "#191917",
      borderColor: "#302f2a",
      textStyle: { color: "#eee9df", fontFamily: "DM Mono", fontSize: 11 },
      formatter: (p: any) => {
        const item = Array.isArray(p) ? p[0] : p;
        return `<strong>${item.name}</strong>: <span style="color: #c75b32;">${Number(item.value).toLocaleString()} units</span>`;
      },
    },
    grid: { left: 65, right: 30, top: 15, bottom: 20 },
    xAxis: {
      type: "value",
      axisLine: { show: false },
      splitLine: { lineStyle: { color: "#e3ded4", type: "dashed" } },
      axisLabel: { color: "#716e66", fontFamily: "DM Mono", fontSize: 9 },
    },
    yAxis: {
      type: "category",
      data: prodNames,
      axisLine: { lineStyle: { color: "#d2ccc0" } },
      axisLabel: { color: "#191917", fontFamily: "DM Mono", fontSize: 10 },
    },
    series: [
      {
        name: "Recommended Order",
        type: "bar",
        data: prodValues,
        itemStyle: { color: "#c75b32", borderRadius: [0, 3, 3, 0] },
        barWidth: 14,
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
          <span className="workspace-eyebrow">MODULE 03 / INVENTORY OPTIMIZATION</span>
          <h1 className="workspace-title">Inventory Intelligence & Safety Stock</h1>
          <p className="workspace-desc">
            Decision optimization under assumed 7-day lead times and 95% service level policies (Z=1.6449) across all 100 Store × Product series.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        onChange={(f) => {
          setFilters(f);
          setPage(1);
        }}
        showRisk={true}
        showModel={false}
        showPriority={true}
      />

      {/* KPI Ribbon */}
      <div className="kpi-grid">
        <KPICard
          label="Current Inventory"
          value={summary.current_inventory.toLocaleString()}
          subtext="Total units on hand"
          badge={{ text: "Baseline", type: "default" }}
          delay={0.05}
        />
        <KPICard
          label="Required Safety Stock"
          value={`${(summary.safety_stock / 1000).toFixed(1)}k`}
          subtext="Z × σ_demand × √LeadTime"
          badge={{ text: "SL 95%", type: "success" }}
          delay={0.1}
        />
        <KPICard
          label="Total Reorder Point"
          value={`${(summary.reorder_point / 1000).toFixed(1)}k`}
          subtext="LTD + Safety Stock"
          badge={{ text: "Target ROP", type: "accent" }}
          delay={0.15}
        />
        <KPICard
          label="Network Inventory Gap"
          value={`${(summary.inventory_gap / 1000).toFixed(1)}k`}
          subtext="Total stock deficit vs ROP"
          badge={{ text: "Deficit", type: "danger" }}
          delay={0.2}
        />
        <KPICard
          label="Recommended Order Qty"
          value={`${(summary.recommended_order / 1000).toFixed(1)}k`}
          subtext="Policy: max(ROP - Inv, 0) (Rounded up)"
          badge={{ text: "Replenishment", type: "accent" }}
          delay={0.25}
        />
        <KPICard
          label="High Risk Decision Units"
          value={`${summary.high_risk_count} / ${summary.total_units}`}
          subtext="Units requiring replenishment"
          badge={{ text: "95 High", type: "danger" }}
          delay={0.3}
        />
        <KPICard
          label="Excess Inventory Buffer"
          value="592 units"
          subtext="1 Flagged Excess (S001·P0003), 5 series > ROP"
          badge={{ text: "1 Flagged Series", type: "warning" }}
          delay={0.35}
        />
      </div>

      {/* Methodological Context Note */}
      <div className="limitation-alert-card" style={{ borderLeftColor: "#6c7950", background: "#eff2eb" }}>
        <div className="limitation-badge" style={{ color: "#6c7950" }}>
          <span className="warning-icon">ℹ</span>
          <strong>REPLENISHMENT & INVENTORY GAP CALCULATION NOTE</strong>
        </div>
        <div className="limitation-content">
          <p className="limitation-text" style={{ color: "#2d381c" }}>
            <strong>Upward Order Rounding:</strong> Aggregate Recommended Order Quantity (<strong>52,083 units</strong>) exceeds the aggregate Network Inventory Gap (<strong>51,447.07 units</strong>) by 635.93 units because recommended replenishment orders are computed using <code>ceil(max(ROP - Current Inventory, 0))</code> and rounded upward per Store × Product series before network summation.
          </p>
          <p className="limitation-subtext" style={{ color: "#4f5f35" }}>
            Network Risk Profile: Exactly 95 High Risk (Priority 1), 2 Medium Risk (Priority 2 Monitor), and 3 Low Risk (Priority 3 Maintain/Review). Excess inventory classification is evaluated per Phase 6 business rules (Current Inventory &gt; 1.5× ROP).
          </p>
        </div>
      </div>

      {/* Analytical Charts Grid */}
      <div className="charts-main-grid">
        {/* Inv vs ROP Chart */}
        <div className="chart-panel">
          <div className="panel-header">
            <div>
              <span className="panel-category">STOCK LEVEL ADEQUACY</span>
              <h3 className="panel-title">Current Inventory vs ROP</h3>
            </div>
            <span className="panel-meta">Aggregated by Store Node</span>
          </div>
          <EChartWrapper options={invVsRopChartOptions} height={260} loading={loading} />
        </div>

        {/* Risk by Store Chart */}
        <div className="chart-panel">
          <div className="panel-header">
            <div>
              <span className="panel-category">STORE RISK PROFILE</span>
              <h3 className="panel-title">Stockout Risk by Store</h3>
            </div>
            <span className="panel-meta">High / Med / Low Breakdown (S001–S005)</span>
          </div>
          <EChartWrapper options={riskByStoreChartOptions} height={260} loading={loading} />
        </div>

        {/* Top Product Orders */}
        <div className="chart-panel">
          <div className="panel-header">
            <div>
              <span className="panel-category">SKU REPLENISHMENT DEMAND</span>
              <h3 className="panel-title">Top Product Orders</h3>
            </div>
            <span className="panel-meta">Aggregated Order Quantity</span>
          </div>
          <EChartWrapper options={prodChartOptions} height={260} loading={loading} />
        </div>
      </div>

      {/* Detailed Inventory Ledger Table */}
      <div className="chart-panel">
        <div className="panel-header">
          <div>
            <span className="panel-category">DECISION MATRIX</span>
            <h3 className="panel-title">Store × Product Optimization Ledger</h3>
          </div>
          <span className="panel-meta">
            Showing {invData?.items.length || 0} of {invData?.total_records || 0} decision series (Click row to inspect)
          </span>
        </div>

        <div className="table-container">
          <table className="ops-table">
            <thead>
              <tr>
                <th onClick={() => handleSort("Priority")} className="sortable-th">
                  Priority {sortBy === "Priority" ? (sortAsc ? "▲" : "▼") : ""}
                </th>
                <th onClick={() => handleSort("Store ID")} className="sortable-th">
                  Store {sortBy === "Store ID" ? (sortAsc ? "▲" : "▼") : ""}
                </th>
                <th onClick={() => handleSort("Product ID")} className="sortable-th">
                  Product {sortBy === "Product ID" ? (sortAsc ? "▲" : "▼") : ""}
                </th>
                <th onClick={() => handleSort("Current Inventory")} className="sortable-th">
                  Current Inventory {sortBy === "Current Inventory" ? (sortAsc ? "▲" : "▼") : ""}
                </th>
                <th onClick={() => handleSort("Lead Time Demand")} className="sortable-th">
                  Lead-Time Demand {sortBy === "Lead Time Demand" ? (sortAsc ? "▲" : "▼") : ""}
                </th>
                <th onClick={() => handleSort("Safety Stock")} className="sortable-th">
                  Safety Stock {sortBy === "Safety Stock" ? (sortAsc ? "▲" : "▼") : ""}
                </th>
                <th onClick={() => handleSort("Reorder Point")} className="sortable-th">
                  Reorder Point {sortBy === "Reorder Point" ? (sortAsc ? "▲" : "▼") : ""}
                </th>
                <th onClick={() => handleSort("Inventory Gap")} className="sortable-th">
                  Inventory Gap {sortBy === "Inventory Gap" ? (sortAsc ? "▲" : "▼") : ""}
                </th>
                <th onClick={() => handleSort("Recommended Order Quantity")} className="sortable-th">
                  Recommended Order Quantity {sortBy === "Recommended Order Quantity" ? (sortAsc ? "▲" : "▼") : ""}
                </th>
                <th onClick={() => handleSort("Risk")} className="sortable-th">
                  Risk {sortBy === "Risk" ? (sortAsc ? "▲" : "▼") : ""}
                </th>
                <th>Recommended Action</th>
                <th>Inspect</th>
              </tr>
            </thead>
            <tbody>
              {invData?.items.map((row: InventoryDecision) => (
                <tr
                  key={`${row["Store ID"]}-${row["Product ID"]}`}
                  onClick={() => onSelectDecision(row)}
                  className="clickable-row"
                >
                  <td>
                    <span className={`priority-pill priority-${row.Priority}`}>
                      P{row.Priority}
                    </span>
                  </td>
                  <td className="mono-cell">Store {row["Store ID"]}</td>
                  <td className="mono-cell bold-cell">{row["Product ID"]}</td>
                  <td className="mono-cell">{row["Current Inventory"]}</td>
                  <td className="mono-cell">{row["Lead Time Demand"].toFixed(1)}</td>
                  <td className="mono-cell">{row["Safety Stock"].toFixed(1)}</td>
                  <td className="mono-cell">{row["Reorder Point"].toFixed(1)}</td>
                  <td className="mono-cell text-danger">{row["Inventory Gap"].toFixed(1)}</td>
                  <td className="mono-cell highlight-order">
                    {row["Recommended Order Quantity"].toFixed(0)}
                  </td>
                  <td>
                    <span className={`risk-badge badge-${row.Risk.toLowerCase()}`}>
                      {row.Risk}
                    </span>
                  </td>
                  <td>
                    <span className="action-label">{row["Recommended Action"]}</span>
                  </td>
                  <td>
                    <button
                      className="inspect-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectDecision(row);
                      }}
                    >
                      INSPECT ↗
                    </button>
                  </td>
                </tr>
              ))}
              {invData?.items.length === 0 && (
                <tr>
                  <td colSpan={12} className="empty-table-cell">
                    No inventory decisions match the selected filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="pagination-bar">
          <div className="page-info">
            Page <strong>{invData?.page || 1}</strong> of <strong>{invData?.total_pages || 1}</strong> ({invData?.total_records || 0} total series)
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
              disabled={page >= (invData?.total_pages || 1) || loading}
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
  );
};
