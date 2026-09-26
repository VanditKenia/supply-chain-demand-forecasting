"use client";

import React from "react";

interface TopBarProps {
  activeModuleName: string;
  horizonDates?: string;
  dataValid?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeModuleName,
  horizonDates = "2024-01-01 → 2024-01-30",
  dataValid = true,
}) => {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <span className="topbar-project">SUPPLY CHAIN INTELLIGENCE PLATFORM</span>
        <span className="topbar-divider">/</span>
        <span className="topbar-module">{activeModuleName.toUpperCase()}</span>
      </div>

      <div className="topbar-right">
        <span className="topbar-horizon">HORIZON: {horizonDates}</span>
        <span className="topbar-divider">·</span>
        <span className={`topbar-status-badge ${dataValid ? "badge-online" : "badge-offline"}`}>
          {dataValid ? "SOURCE: VALIDATED" : "SOURCE: ERROR"}
        </span>
      </div>
    </header>
  );
};
