"use client";

import React from "react";
import { GlobalFilters } from "../types";

interface FilterBarProps {
  filters: GlobalFilters;
  onChange: (newFilters: GlobalFilters) => void;
  showRisk?: boolean;
  showModel?: boolean;
  showPriority?: boolean;
  stores?: string[];
  products?: string[];
  models?: string[];
}

const DEFAULT_STORES = ["S001", "S002", "S003", "S004", "S005"];
const DEFAULT_PRODUCTS = [
  "P0001", "P0002", "P0003", "P0004", "P0005",
  "P0006", "P0007", "P0008", "P0009", "P0010",
  "P0011", "P0012", "P0013", "P0014", "P0015",
  "P0016", "P0017", "P0018", "P0019", "P0020"
];
const DEFAULT_MODELS = [
  "ARIMA(1,0,1)",
  "HistGradientBoosting",
  "TunedRF_300_depth12_leaf1",
  "RandomForest",
  "Naive",
  "SeasonalNaive7"
];

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onChange,
  showRisk = true,
  showModel = true,
  showPriority = false,
  stores = DEFAULT_STORES,
  products = DEFAULT_PRODUCTS,
  models = DEFAULT_MODELS,
}) => {
  const hasActiveFilters = Boolean(
    filters.store_id ||
    filters.product_id ||
    filters.risk ||
    filters.model ||
    filters.priority !== undefined ||
    filters.search
  );

  const handleClear = () => {
    onChange({});
  };

  return (
    <div className="filter-bar">
      <div className="filter-controls">
        {/* Store selector */}
        <div className="filter-group">
          <label htmlFor="store-filter">Store</label>
          <select
            id="store-filter"
            value={filters.store_id || ""}
            onChange={(e) => onChange({ ...filters, store_id: e.target.value || undefined })}
          >
            <option value="">All Stores (5)</option>
            {stores.map((s) => (
              <option key={s} value={s}>Store {s}</option>
            ))}
          </select>
        </div>

        {/* Product selector */}
        <div className="filter-group">
          <label htmlFor="product-filter">Product</label>
          <select
            id="product-filter"
            value={filters.product_id || ""}
            onChange={(e) => onChange({ ...filters, product_id: e.target.value || undefined })}
          >
            <option value="">All Products (20)</option>
            {products.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* Risk selector */}
        {showRisk && (
          <div className="filter-group">
            <label htmlFor="risk-filter">Risk Level</label>
            <select
              id="risk-filter"
              value={filters.risk || ""}
              onChange={(e) => onChange({ ...filters, risk: e.target.value || undefined })}
            >
              <option value="">All Risks</option>
              <option value="High">High Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="Low">Low Risk</option>
            </select>
          </div>
        )}

        {/* Model selector */}
        {showModel && (
          <div className="filter-group">
            <label htmlFor="model-filter">Model</label>
            <select
              id="model-filter"
              value={filters.model || ""}
              onChange={(e) => onChange({ ...filters, model: e.target.value || undefined })}
            >
              <option value="">All Models (6)</option>
              {models.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        )}

        {/* Priority selector */}
        {showPriority && (
          <div className="filter-group">
            <label htmlFor="priority-filter">Priority</label>
            <select
              id="priority-filter"
              value={filters.priority !== undefined ? String(filters.priority) : ""}
              onChange={(e) => onChange({ ...filters, priority: e.target.value ? Number(e.target.value) : undefined })}
            >
              <option value="">All Priorities</option>
              <option value="1">Priority 1 (Urgent)</option>
              <option value="2">Priority 2 (Monitor)</option>
              <option value="3">Priority 3 (Maintain)</option>
            </select>
          </div>
        )}

        {/* Search input */}
        <div className="filter-group filter-search">
          <label htmlFor="search-input">Search Series</label>
          <input
            id="search-input"
            type="text"
            placeholder="Search Store, Product..."
            value={filters.search || ""}
            onChange={(e) => onChange({ ...filters, search: e.target.value || undefined })}
          />
        </div>
      </div>

      {hasActiveFilters && (
        <div className="filter-active-group">
          <span className="active-tag">Active Filters</span>
          <button onClick={handleClear} className="reset-filter-btn">
            ✕ Reset All
          </button>
        </div>
      )}
    </div>
  );
};
