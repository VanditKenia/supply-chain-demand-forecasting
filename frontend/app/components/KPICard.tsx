"use client";

import React from "react";
import { motion } from "framer-motion";

interface KPICardProps {
  label: string;
  value: string | number;
  subtext?: string;
  badge?: {
    text: string;
    type?: "default" | "danger" | "warning" | "success" | "accent";
  };
  delay?: number;
}

export const KPICard: React.FC<KPICardProps> = ({
  label,
  value,
  subtext,
  badge,
  delay = 0,
}) => {
  return (
    <motion.div
      className="kpi-card"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      whileHover={{ y: -3, transition: { duration: 0.15 } }}
    >
      <div className="kpi-header">
        <span className="kpi-label">{label}</span>
        {badge && (
          <span className={`kpi-badge badge-${badge.type || "default"}`}>
            {badge.text}
          </span>
        )}
      </div>
      <div className="kpi-value">{value}</div>
      {subtext && <div className="kpi-subtext">{subtext}</div>}
    </motion.div>
  );
};
