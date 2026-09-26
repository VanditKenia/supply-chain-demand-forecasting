"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  OverviewMetrics,
  ForecastTrendResponse,
  RiskAnalyticsResponse,
  ActionItem,
  InventoryDecision,
} from "./types";
import { api } from "./services/api";
import { NavRail, NavModule } from "./components/NavRail";
import { TopBar } from "./components/TopBar";
import { DataStatusBanner } from "./components/DataStatusBanner";
import { DetailDrawer } from "./components/DetailDrawer";
import { ControlTowerView } from "./components/ControlTowerView";
import { DemandView } from "./components/DemandView";
import { InventoryView } from "./components/InventoryView";
import { ActionCenterView } from "./components/ActionCenterView";
import { AnalyticsView } from "./components/AnalyticsView";

const MODULES: NavModule[] = [
  { code: "01", name: "Control Tower", description: "Operational overview of demand & inventory risk" },
  { code: "02", name: "Demand", description: "30-day forecast trajectories & model evaluation" },
  { code: "03", name: "Inventory", description: "Safety stock, reorder point & stockout risks" },
  { code: "04", name: "Actions", description: "Prioritized replenishment dispatch queue" },
  { code: "05", name: "Analytics", description: "Power BI analytical reporting & DAX layer" },
];

export default function Home() {
  const [activeModule, setActiveModule] = useState<string>("01");
  const [overview, setOverview] = useState<OverviewMetrics | null>(null);
  const [trendData, setTrendData] = useState<ForecastTrendResponse | null>(null);
  const [riskData, setRiskData] = useState<RiskAnalyticsResponse | null>(null);
  const [priorityActions, setPriorityActions] = useState<ActionItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<InventoryDecision | ActionItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadInitialData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [overviewRes, trendRes, riskRes, actionsRes] = await Promise.all([
        api.getOverview(),
        api.getForecastTrend({}),
        api.getRisk(),
        api.getActions({ limit: 100 }),
      ]);
      setOverview(overviewRes);
      setTrendData(trendRes);
      setRiskData(riskRes);
      setPriorityActions(actionsRes);
    } catch (err: any) {
      console.error("Initial data load error:", err);
      setError(err.message || "Failed to connect to Supply Chain Intelligence API");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const activeModuleObj = MODULES.find((m) => m.code === activeModule) || MODULES[0];

  return (
    <main className="platform-shell">
      {/* Persistent NavRail */}
      <NavRail
        modules={MODULES}
        activeModule={activeModule}
        onSelectModule={(code) => setActiveModule(code)}
        isValidData={overview?.data_status?.valid ?? true}
      />

      {/* Main Workspace Area */}
      <section className="workspace">
        <TopBar
          activeModuleName={activeModuleObj.name}
          horizonDates={
            overview
              ? `${overview.forecast_start_date} → ${overview.forecast_end_date}`
              : "2024-01-01 → 2024-01-30"
          }
          dataValid={overview?.data_status?.valid ?? true}
        />

        <div className="workspace-inner">
          {/* Real Data Status Telemetry */}
          <DataStatusBanner
            status={overview?.data_status}
            horizonDays={overview?.forecast_horizon_days ?? 30}
            startDate={overview?.forecast_start_date ?? "2024-01-01"}
            endDate={overview?.forecast_end_date ?? "2024-01-30"}
            snapshotDate={overview?.inventory_snapshot_date ?? "2024-01-01"}
            onRefresh={loadInitialData}
            loading={loading}
          />

          {error && (
            <div className="api-error-banner">
              <div className="error-title">⚠ API Connection Error</div>
              <p>{error}</p>
              <button onClick={loadInitialData} className="retry-btn">
                Retry Connection
              </button>
            </div>
          )}

          {/* Active Workspace View */}
          {activeModule === "01" && (
            <ControlTowerView
              overview={overview}
              trendData={trendData}
              riskData={riskData}
              priorityActions={priorityActions}
              onSelectAction={(item) => setSelectedItem(item)}
              onNavigate={(code) => setActiveModule(code)}
              loading={loading}
            />
          )}

          {activeModule === "02" && (
            <DemandView initialTrend={trendData} />
          )}

          {activeModule === "03" && (
            <InventoryView onSelectDecision={(item) => setSelectedItem(item)} />
          )}

          {activeModule === "04" && (
            <ActionCenterView onSelectAction={(item) => setSelectedItem(item)} />
          )}

          {activeModule === "05" && (
            <AnalyticsView />
          )}
        </div>
      </section>

      {/* Detail Drawer for Inspecting any Series / Decision Node */}
      <DetailDrawer
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </main>
  );
}
