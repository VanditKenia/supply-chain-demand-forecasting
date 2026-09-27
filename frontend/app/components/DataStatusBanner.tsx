"use client";

import React from "react";
import { DataStatus } from "../types";

interface DataStatusBannerProps {
  status?: DataStatus;
  horizonDays?: number;
  startDate?: string;
  endDate?: string;
  snapshotDate?: string;
  onRefresh?: () => void;
  loading?: boolean;
}

export const DataStatusBanner: React.FC<DataStatusBannerProps> = ({
  status,
  horizonDays = 30,
  startDate = "2024-01-01",
  endDate = "2024-01-30",
  snapshotDate = "2024-01-01",
  onRefresh,
  loading = false,
}) => {
  const isValid = status ? status.valid : true;

  return (
    <div className={`data-status-banner ${isValid ? "status-valid" : "status-invalid"}`}>
      <div className="status-indicator-group">
        <span className={`status-pill ${isValid ? "pill-live" : "pill-warn"}`}>
          <span className="pulsing-dot" />
          {isValid ? "ANALYTICAL SOURCE CONNECTED" : "DATA VALIDATION WARNING"}
        </span>
        <span className="status-meta">
          <strong>Forecast Horizon:</strong> {startDate} → {endDate} ({horizonDays} days)
        </span>
        <span className="status-divider">|</span>
        <span className="status-meta">
          <strong>Planning Snapshot:</strong> {snapshotDate}
        </span>
        <span className="status-divider">|</span>
        <span className="status-meta">
          <strong>Source Grain:</strong> Date × Store ID × Product ID (100 Series)
        </span>
      </div>

      <div className="status-actions">
        {status && (
          <span className="status-counts">
            {status.historical_rows.toLocaleString()} Hist · {status.forecast_rows.toLocaleString()} Fcst · {status.inventory_rows} Dec
          </span>
        )}
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="refresh-btn"
            disabled={loading}
            title="Reload live analytical data"
          >
            {loading ? "SYNCING..." : "↻ REFRESH"}
          </button>
        )}
      </div>
    </div>
  );
};
