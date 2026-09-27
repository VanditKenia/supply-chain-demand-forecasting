"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { EChartsOption } from "echarts";
import { InventoryDecision, ActionItem, ForecastRecord } from "../types";
import { api } from "../services/api";
import { EChartWrapper } from "./EChartWrapper";

interface DetailDrawerProps {
  item: InventoryDecision | ActionItem | null;
  onClose: () => void;
}

export const DetailDrawer: React.FC<DetailDrawerProps> = ({ item, onClose }) => {
  const [forecasts, setForecasts] = useState<ForecastRecord[]>([]);
  const [loadingForecasts, setLoadingForecasts] = useState(false);

  const getProp = <T,>(invKey: keyof InventoryDecision, actKey: keyof ActionItem, fallback: T): T => {
    if (!item) return fallback;
    if ("Store ID" in item && item[invKey] !== undefined) {
      return item[invKey] as unknown as T;
    }
    if (actKey in item && (item as ActionItem)[actKey] !== undefined) {
      return (item as ActionItem)[actKey] as unknown as T;
    }
    return fallback;
  };

  const storeId = getProp<string>("Store ID", "store_id", "");
  const productId = getProp<string>("Product ID", "product_id", "");
  const risk = getProp<string>("Risk", "risk", "High");
  const priority = getProp<number>("Priority", "priority", 1);
  const action = getProp<string>("Recommended Action", "recommended_action", "Replenish");
  const currentInv = getProp<number>("Current Inventory", "current_inventory", 0);
  const rop = getProp<number>("Reorder Point", "reorder_point", 0);
  const safetyStock = getProp<number>("Safety Stock", "safety_stock", 0);
  const leadTimeDemand = getProp<number>("Lead Time Demand", "lead_time_demand", 0);
  const invGap = getProp<number>("Inventory Gap", "inventory_gap", 0);
  const recOrder = getProp<number>("Recommended Order Quantity", "recommended_order_quantity", 0);
  const excessUnits = getProp<number>("Excess_Inventory_Units", "excess_inventory_units", 0);
  const leadTime = getProp<number>("Lead Time", "lead_time", 7);
  const serviceLevel = getProp<number>("Service Level", "service_level", 0.95);
  const model = getProp<string>("selected_model", "selected_model", forecasts[0]?.Selected_Model ?? "ARIMA/ML");

  useEffect(() => {
    if (!item) return;
    if (storeId && productId) {
      setLoadingForecasts(true);
      api
        .getForecasts({ store_id: storeId, product_id: productId, page_size: 50 })
        .then((res) => {
          setForecasts(res.items);
        })
        .catch((err) => {
          console.error("Failed to load drawer series forecast", err);
        })
        .finally(() => {
          setLoadingForecasts(false);
        });
    }
  }, [item, storeId, productId]);

  if (!item) return null;

  // Deterministic explanation
  const explanation =
    item.explanation ||
    (risk === "High"
      ? `Current inventory (${currentInv}) is below reorder point (${rop.toFixed(1)}) by an inventory gap of ${invGap.toFixed(1)} units. Under ${(serviceLevel * 100).toFixed(0)}% service level and ${leadTime}-day lead time, recommended replenishment is ${recOrder.toFixed(0)} units to prevent stockout risk.`
      : risk === "Medium"
      ? `Current inventory (${currentInv}) is within the 20% safety threshold above reorder point (${rop.toFixed(1)}). Scheduled monitoring recommended without immediate order.`
      : excessUnits > 0
      ? `Current inventory (${currentInv}) exceeds reorder point (${rop.toFixed(1)}) with ${excessUnits.toFixed(1)} excess units above target buffer. Maintain current inventory and review excess.`
      : `Current inventory (${currentInv}) satisfies the reorder point requirement (${rop.toFixed(1)}). Target stock level is maintained.`);

  // Mini forecast trend chart options
  const chartDates = forecasts.map((f) => f.Date);
  const chartDemands = forecasts.map((f) => f.Forecast_Demand);

  const miniChartOptions: EChartsOption = {
    tooltip: {
      trigger: "axis",
      backgroundColor: "#191917",
      borderColor: "#302f2a",
      textStyle: { color: "#eee9df", fontFamily: "DM Mono", fontSize: 11 },
      formatter: (params: any) => {
        const p = Array.isArray(params) ? params[0] : params;
        return `<div style="font-family: 'DM Mono', monospace; font-size: 11px;">
          <div><strong>Date:</strong> ${p.name}</div>
          <div style="color: #c75b32;"><strong>Forecast:</strong> ${p.value} units</div>
          <div style="color: #716e66;"><strong>Model:</strong> ${model}</div>
        </div>`;
      },
    },
    grid: { left: 40, right: 20, top: 25, bottom: 25 },
    xAxis: {
      type: "category",
      data: chartDates,
      axisLine: { lineStyle: { color: "#d2ccc0" } },
      axisLabel: {
        color: "#716e66",
        fontFamily: "DM Mono",
        fontSize: 9,
        formatter: (val: string) => val.slice(5),
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
        name: "Forecast Demand",
        type: "line",
        smooth: true,
        data: chartDemands,
        symbolSize: 4,
        itemStyle: { color: "#c75b32" },
        lineStyle: { width: 2, color: "#c75b32" },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(199, 91, 50, 0.25)" },
              { offset: 1, color: "rgba(199, 91, 50, 0.0)" },
            ],
          },
        },
      },
    ],
  };

  return (
    <AnimatePresence>
      <motion.div
        className="drawer-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="detail-drawer"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 280 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="drawer-header">
            <div>
              <span className="drawer-eyebrow">DECISION UNIT INSPECTOR</span>
              <h2>
                Store {storeId} · <span className="highlight-text">{productId}</span>
              </h2>
            </div>
            <button onClick={onClose} className="drawer-close-btn" aria-label="Close drawer">
              ✕
            </button>
          </div>

          <div className="drawer-body">
            {/* Status & Priority Badge Header */}
            <div className="drawer-tags">
              <span className={`risk-tag risk-${risk.toLowerCase()}`}>
                RISK: {risk.toUpperCase()}
              </span>
              <span className={`priority-tag priority-${priority}`}>
                PRIORITY {priority}
              </span>
              <span className="action-tag">
                ACTION: {action.toUpperCase()}
              </span>
              <span className="model-tag">
                MODEL: {model}
              </span>
            </div>

            {/* Why This Action Rationale Card */}
            <div className="rationale-box">
              <div className="rationale-title">
                <span className="mono-label">DETERMINISTIC RATIONALE</span>
                <span className="source-label">Phase 6 Policy Engine</span>
              </div>
              <p className="rationale-text">{explanation}</p>
            </div>

            {/* Core Decision Formula Grid */}
            <div className="drawer-section">
              <span className="section-subtitle">INVENTORY OPTIMIZATION METRICS</span>
              <div className="metrics-spec-grid">
                <div className="spec-item">
                  <span className="spec-label">Current Inventory</span>
                  <span className="spec-value">{currentInv.toLocaleString()}</span>
                  <span className="spec-unit">units on hand</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Reorder Point</span>
                  <span className="spec-value">{rop.toLocaleString(undefined, { maximumFractionDigits: 1 })}</span>
                  <span className="spec-unit">Lead-Time Demand + Safety Stock</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Recommended Order Quantity</span>
                  <span className="spec-value highlight-orange">
                    {recOrder.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                  </span>
                  <span className="spec-unit">ceil(max(ROP - Current Inventory, 0))</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Inventory Gap</span>
                  <span className="spec-value">{invGap.toLocaleString(undefined, { maximumFractionDigits: 1 })}</span>
                  <span className="spec-unit">Reorder Point - Current Inventory</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Safety Stock</span>
                  <span className="spec-value">{safetyStock.toLocaleString(undefined, { maximumFractionDigits: 1 })}</span>
                  <span className="spec-unit">Z × Demand Std Dev × √Lead Time</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Lead-Time Demand</span>
                  <span className="spec-value">{leadTimeDemand.toLocaleString(undefined, { maximumFractionDigits: 1 })}</span>
                  <span className="spec-unit">7-day forecast demand sum</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Service Level Target</span>
                  <span className="spec-value">{(serviceLevel * 100).toFixed(0)}%</span>
                  <span className="spec-unit">Z = 1.6449</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Assumed Lead Time</span>
                  <span className="spec-value">{leadTime} days</span>
                  <span className="spec-unit">explicit scenario</span>
                </div>
              </div>
            </div>

            {/* 30-Day Series Forecast mini chart */}
            <div className="drawer-section">
              <span className="section-subtitle">
                30-DAY DEMAND FORECAST HORIZON (JAN 2024)
              </span>
              <div className="drawer-chart-card">
                {loadingForecasts ? (
                  <div className="chart-loading">Loading series trajectory...</div>
                ) : chartDates.length > 0 ? (
                  <EChartWrapper options={miniChartOptions} height={180} />
                ) : (
                  <div className="chart-empty">No series forecast records available</div>
                )}
              </div>
            </div>

            {/* Scenario Analysis Notes */}
            <div className="drawer-footer-note">
              <strong>Audit Note:</strong> Safety stock and replenishment quantities follow the frozen Phase 6 methodology. Underprediction for demand spikes (&gt;=125 units) is preserved downstream without undocumented adjustments.
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
