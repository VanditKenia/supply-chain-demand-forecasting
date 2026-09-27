"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  const [activeTab, setActiveTab] = useState<"all" | "p1" | "p2" | "p3">("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sortBy, setSortBy] = useState<string>("priority");
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);

  const loadActions = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch full set to allow unified tab and filter counts
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

  // Overall counts across active filters
  const p1Count = actions.filter((a) => a.priority === 1).length;
  const p2Count = actions.filter((a) => a.priority === 2).length;
  const p3Count = actions.filter((a) => a.priority === 3).length;
  const totalOrderUnits = actions.reduce((sum, a) => sum + a.recommended_order_quantity, 0);

  // Tab filtering
  const tabFiltered = useMemo(() => {
    return actions.filter((a) => {
      if (activeTab === "p1") return a.priority === 1;
      if (activeTab === "p2") return a.priority === 2;
      if (activeTab === "p3") return a.priority === 3;
      return true;
    });
  }, [actions, activeTab]);

  // Sorting: Default Priority ascending, then Recommended Order Quantity descending
  const sortedActions = useMemo(() => {
    const list = [...tabFiltered];
    list.sort((a, b) => {
      if (sortBy === "priority") {
        if (a.priority !== b.priority) {
          return sortAsc ? a.priority - b.priority : b.priority - a.priority;
        }
        return b.recommended_order_quantity - a.recommended_order_quantity;
      }
      if (sortBy === "store_id") {
        return sortAsc ? a.store_id.localeCompare(b.store_id) : b.store_id.localeCompare(a.store_id);
      }
      if (sortBy === "product_id") {
        return sortAsc ? a.product_id.localeCompare(b.product_id) : b.product_id.localeCompare(a.product_id);
      }
      if (sortBy === "risk") {
        return sortAsc ? a.risk.localeCompare(b.risk) : b.risk.localeCompare(a.risk);
      }
      if (sortBy === "current_inventory") {
        return sortAsc ? a.current_inventory - b.current_inventory : b.current_inventory - a.current_inventory;
      }
      if (sortBy === "reorder_point") {
        return sortAsc ? a.reorder_point - b.reorder_point : b.reorder_point - a.reorder_point;
      }
      if (sortBy === "inventory_gap") {
        return sortAsc ? a.inventory_gap - b.inventory_gap : b.inventory_gap - a.inventory_gap;
      }
      if (sortBy === "recommended_order_quantity") {
        return sortAsc
          ? a.recommended_order_quantity - b.recommended_order_quantity
          : b.recommended_order_quantity - a.recommended_order_quantity;
      }
      if (sortBy === "recommended_action") {
        return sortAsc
          ? a.recommended_action.localeCompare(b.recommended_action)
          : b.recommended_action.localeCompare(a.recommended_action);
      }
      return 0;
    });
    return list;
  }, [tabFiltered, sortBy, sortAsc]);

  // Pagination
  const totalRecords = sortedActions.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;
  const safePage = Math.max(1, Math.min(page, totalPages));
  const paginatedActions = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return sortedActions.slice(start, start + pageSize);
  }, [sortedActions, safePage, pageSize]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(field);
      setSortAsc(field === "priority"); // ascending for priority, descending for quantities
    }
  };

  return (
    <div className="workspace-view">
      <div className="workspace-header">
        <div>
          <span className="workspace-eyebrow">MODULE 04 / DECISION ENGINE & DISPATCH</span>
          <h1 className="workspace-title">Replenishment Action Center</h1>
          <p className="workspace-desc">
            Compact operational decision matrix ranking inventory replenishment dispatches from Phase 6 optimization rules. Click any row to inspect complete decision rationale.
          </p>
        </div>
      </div>

      {/* Filter Bar with Store, Product, Risk, Priority, and Search */}
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
          label="Priority 1 Immediate Action"
          value={`${p1Count} Series`}
          subtext="Current Inv < ROP (Urgent)"
          badge={{ text: "P1 = 95", type: "danger" }}
          delay={0.05}
        />
        <KPICard
          label="Total Recommended Units"
          value={`${(totalOrderUnits / 1000).toFixed(1)}k`}
          subtext="Policy: max(ROP - Inv, 0)"
          badge={{ text: "Net Order", type: "accent" }}
          delay={0.1}
        />
        <KPICard
          label="Priority 2 Scheduled Review"
          value={`${p2Count} Series`}
          subtext="ROP <= Inv < 1.2 ROP (Buffer)"
          badge={{ text: "P2 = 2", type: "warning" }}
          delay={0.15}
        />
        <KPICard
          label="Priority 3 Healthy / Excess"
          value={`${p3Count} Series`}
          subtext="Current Inv >= 1.2 ROP (Target met)"
          badge={{ text: "P3 = 3", type: "success" }}
          delay={0.2}
        />
        <KPICard
          label="Assumed Lead Time"
          value="7 Days"
          subtext="Scenario baseline parameter"
          badge={{ text: "Explicit Assumption", type: "default" }}
          delay={0.25}
        />
        <KPICard
          label="Service Level Target"
          value="95% Target"
          subtext="Z = 1.6449 Gaussian multiplier"
          badge={{ text: "Standard Base", type: "default" }}
          delay={0.3}
        />
      </div>

      {/* Primary Compact Operational Decision Table */}
      <div className="chart-panel">
        <div className="panel-header">
          <div>
            <span className="panel-category">DECISION DISPATCH MATRIX</span>
            <h3 className="panel-title">Operational Decision Ledger</h3>
          </div>
          <div className="table-tabs">
            <button
              className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("all");
                setPage(1);
              }}
            >
              All Decisions ({actions.length})
            </button>
            <button
              className={`tab-btn ${activeTab === "p1" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("p1");
                setPage(1);
              }}
            >
              P1 Urgent ({p1Count})
            </button>
            <button
              className={`tab-btn ${activeTab === "p2" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("p2");
                setPage(1);
              }}
            >
              P2 Monitor ({p2Count})
            </button>
            <button
              className={`tab-btn ${activeTab === "p3" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("p3");
                setPage(1);
              }}
            >
              P3 Maintain ({p3Count})
            </button>
          </div>
        </div>

        <div className="table-container">
          <table className="ops-table">
            <thead>
              <tr>
                <th onClick={() => handleSort("priority")} className="sortable-th">
                  Priority {sortBy === "priority" ? (sortAsc ? "▲" : "▼") : ""}
                </th>
                <th onClick={() => handleSort("store_id")} className="sortable-th">
                  Store {sortBy === "store_id" ? (sortAsc ? "▲" : "▼") : ""}
                </th>
                <th onClick={() => handleSort("product_id")} className="sortable-th">
                  Product {sortBy === "product_id" ? (sortAsc ? "▲" : "▼") : ""}
                </th>
                <th onClick={() => handleSort("risk")} className="sortable-th">
                  Risk {sortBy === "risk" ? (sortAsc ? "▲" : "▼") : ""}
                </th>
                <th onClick={() => handleSort("current_inventory")} className="sortable-th">
                  Current Inventory {sortBy === "current_inventory" ? (sortAsc ? "▲" : "▼") : ""}
                </th>
                <th onClick={() => handleSort("reorder_point")} className="sortable-th">
                  Reorder Point {sortBy === "reorder_point" ? (sortAsc ? "▲" : "▼") : ""}
                </th>
                <th onClick={() => handleSort("inventory_gap")} className="sortable-th">
                  Inventory Gap {sortBy === "inventory_gap" ? (sortAsc ? "▲" : "▼") : ""}
                </th>
                <th onClick={() => handleSort("recommended_order_quantity")} className="sortable-th">
                  Recommended Order {sortBy === "recommended_order_quantity" ? (sortAsc ? "▲" : "▼") : ""}
                </th>
                <th onClick={() => handleSort("recommended_action")} className="sortable-th">
                  Action {sortBy === "recommended_action" ? (sortAsc ? "▲" : "▼") : ""}
                </th>
                <th>Inspect</th>
              </tr>
            </thead>
            <tbody>
              {paginatedActions.map((action) => (
                <tr
                  key={`${action.store_id}-${action.product_id}`}
                  onClick={() => onSelectAction(action)}
                  className="clickable-row"
                >
                  <td>
                    <span className={`priority-pill priority-${action.priority}`}>
                      P{action.priority}
                    </span>
                  </td>
                  <td className="mono-cell">Store {action.store_id}</td>
                  <td className="mono-cell bold-cell">{action.product_id}</td>
                  <td>
                    <span className={`risk-badge badge-${action.risk.toLowerCase()}`}>
                      {action.risk}
                    </span>
                  </td>
                  <td className="mono-cell">{action.current_inventory.toLocaleString()}</td>
                  <td className="mono-cell">{action.reorder_point.toFixed(1)}</td>
                  <td className="mono-cell text-danger">
                    {action.inventory_gap > 0 ? action.inventory_gap.toFixed(1) : "0.0"}
                  </td>
                  <td className="mono-cell highlight-order">
                    {action.recommended_order_quantity.toFixed(0)}
                  </td>
                  <td>
                    <span className="action-label">{action.recommended_action}</span>
                  </td>
                  <td>
                    <button
                      className="inspect-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectAction(action);
                      }}
                      title="Inspect complete decision details"
                    >
                      DETAIL ↗
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedActions.length === 0 && (
                <tr>
                  <td colSpan={10} className="empty-table-cell">
                    {loading ? "Loading replenishment decisions..." : "No replenishment decisions match the current filters."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="pagination-bar">
          <div className="page-info">
            Showing <strong>{totalRecords === 0 ? 0 : (safePage - 1) * pageSize + 1}</strong>–<strong>{Math.min(safePage * pageSize, totalRecords)}</strong> of <strong>{totalRecords}</strong> decision series
          </div>
          <div className="page-nav">
            <button
              disabled={safePage <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="page-btn"
            >
              ← PREV
            </button>
            <span className="mono-cell" style={{ padding: "0 6px" }}>
              Page {safePage} of {totalPages}
            </span>
            <button
              disabled={safePage >= totalPages || loading}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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
