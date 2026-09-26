"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ActionItem, GlobalFilters } from "../types";
import { api } from "../services/api";
import { KPICard } from "./KPICard";
import { FilterBar } from "./FilterBar";

interface ActionCenterViewProps {
  onSelectAction: (item: ActionItem) => void;
}

export const ActionCenterView: React.FC<ActionCenterViewProps> = ({ onSelectAction }) => {
  const [filters, setFilters] = useState<GlobalFilters>({});
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "p1" | "p2" | "p3" | "high">("all");
  const [loading, setLoading] = useState(false);

  const loadActions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getActions({
        ...filters,
        limit: 100,
      });
      setActions(data);
    } catch (err) {
      console.error("Failed to load actions", err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadActions();
  }, [loadActions]);

  const p1Count = actions.filter((a) => a.priority === 1).length;
  const p2Count = actions.filter((a) => a.priority === 2).length;
  const p3Count = actions.filter((a) => a.priority === 3).length;
  const highRiskCount = actions.filter((a) => a.risk.toLowerCase() === "high").length;
  const totalOrderUnits = actions.reduce((sum, a) => sum + a.recommended_order_quantity, 0);

  const displayedActions = actions.filter((a) => {
    if (activeTab === "p1") return a.priority === 1;
    if (activeTab === "p2") return a.priority === 2;
    if (activeTab === "p3") return a.priority === 3;
    if (activeTab === "high") return a.risk.toLowerCase() === "high";
    return true;
  });

  return (
    <div className="workspace-view">
      <div className="workspace-header">
        <div>
          <span className="workspace-eyebrow">MODULE 04 / DECISION ENGINE & DISPATCH</span>
          <h1 className="workspace-title">Replenishment Action Center</h1>
          <p className="workspace-desc">
            Prioritized operational dispatch queue ranking inventory replenishment decisions from Phase 6 optimization rules.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        onChange={setFilters}
        showRisk={true}
        showModel={false}
        showPriority={true}
      />

      {/* KPI Ribbon */}
      <div className="kpi-grid">
        <KPICard
          label="Priority 1 Immediate Action"
          value={`${p1Count} Series`}
          subtext="Current Inv < ROP"
          badge={{ text: "Urgent Replenish", type: "danger" }}
          delay={0.05}
        />
        <KPICard
          label="Total Recommended Units"
          value={`${(totalOrderUnits / 1000).toFixed(1)}k`}
          subtext="Units to dispatch across network"
          badge={{ text: "Net Order", type: "accent" }}
          delay={0.1}
        />
        <KPICard
          label="Priority 2 Scheduled Review"
          value={`${p2Count} Series`}
          subtext="ROP <= Inv < 1.2 ROP"
          badge={{ text: "Monitor Buffer", type: "warning" }}
          delay={0.15}
        />
        <KPICard
          label="Priority 3 Healthy / Excess"
          value={`${p3Count} Series`}
          subtext="Current Inv >= 1.2 ROP"
          badge={{ text: "Maintain / Excess", type: "success" }}
          delay={0.2}
        />
        <KPICard
          label="High-Risk Exposure"
          value={`${highRiskCount} / ${actions.length}`}
          subtext="Series in stockout vulnerability"
          badge={{ text: "Policy Warning", type: "danger" }}
          delay={0.25}
        />
        <KPICard
          label="Policy Protocol"
          value="Service Level 95%"
          subtext="Lead Time: 7 Days (Z=1.6449)"
          badge={{ text: "Standard Base", type: "default" }}
          delay={0.3}
        />
      </div>

      {/* Action Queue Container */}
      <div className="chart-panel">
        <div className="panel-header">
          <div>
            <span className="panel-category">DECISION DISPATCH QUEUE</span>
            <h3 className="panel-title">Prioritized Replenishment Action Log</h3>
          </div>
          <div className="table-tabs">
            <button
              className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              All Decisions ({actions.length})
            </button>
            <button
              className={`tab-btn ${activeTab === "p1" ? "active" : ""}`}
              onClick={() => setActiveTab("p1")}
            >
              Priority 1 Urgent ({p1Count})
            </button>
            <button
              className={`tab-btn ${activeTab === "p2" ? "active" : ""}`}
              onClick={() => setActiveTab("p2")}
            >
              Priority 2 Monitor ({p2Count})
            </button>
            <button
              className={`tab-btn ${activeTab === "p3" ? "active" : ""}`}
              onClick={() => setActiveTab("p3")}
            >
              Priority 3 Maintain ({p3Count})
            </button>
          </div>
        </div>

        <div className="action-queue-list">
          {displayedActions.map((action, idx) => (
            <div
              key={`${action.store_id}-${action.product_id}`}
              className="action-card-item"
              onClick={() => onSelectAction(action)}
            >
              <div className="action-card-left">
                <div className="action-priority-rank">
                  <span className={`priority-badge-lg priority-${action.priority}`}>
                    P{action.priority}
                  </span>
                  <span className="rank-num">#{idx + 1}</span>
                </div>
                <div className="action-main-info">
                  <div className="action-node-title">
                    <span className="node-store">Store {action.store_id}</span>
                    <span className="node-sep">/</span>
                    <span className="node-sku">{action.product_id}</span>
                    <span className={`risk-badge badge-${action.risk.toLowerCase()}`}>
                      {action.risk} Risk
                    </span>
                    <span className="action-type-pill">{action.recommended_action}</span>
                  </div>
                  <p className="action-reason">{action.explanation}</p>
                </div>
              </div>

              <div className="action-card-right">
                <div className="action-stat">
                  <span className="stat-name">Current Inv</span>
                  <span className="stat-val">{action.current_inventory}</span>
                </div>
                <div className="action-stat">
                  <span className="stat-name">Reorder Point</span>
                  <span className="stat-val">{action.reorder_point.toFixed(1)}</span>
                </div>
                <div className="action-stat">
                  <span className="stat-name">Deficit Gap</span>
                  <span className="stat-val text-danger">
                    {action.inventory_gap > 0 ? `-${action.inventory_gap.toFixed(1)}` : "0.0"}
                  </span>
                </div>
                <div className="action-stat highlight-order-box">
                  <span className="stat-name">Order Qty</span>
                  <span className="stat-val-rec">
                    {action.recommended_order_quantity.toFixed(0)}
                  </span>
                </div>
                <button
                  className="action-open-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectAction(action);
                  }}
                >
                  AUDIT ↗
                </button>
              </div>
            </div>
          ))}

          {displayedActions.length === 0 && (
            <div className="empty-queue-message">
              No actions match the selected filter configuration.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
