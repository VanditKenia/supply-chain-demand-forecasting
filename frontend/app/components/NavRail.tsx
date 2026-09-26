"use client";

import React from "react";
import { motion } from "framer-motion";

export interface NavModule {
  code: string;
  name: string;
  description: string;
}

interface NavRailProps {
  modules: NavModule[];
  activeModule: string;
  onSelectModule: (code: string) => void;
  isValidData?: boolean;
}

export const NavRail: React.FC<NavRailProps> = ({
  modules,
  activeModule,
  onSelectModule,
  isValidData = true,
}) => {
  return (
    <aside className="nav-rail">
      <div className="brand">
        <span className="brand-mark">S//I</span>
        <span>
          SUPPLY
          <br />
          INTELLIGENCE
        </span>
      </div>

      <nav>
        {modules.map((item) => {
          const isActive = activeModule === item.code;
          return (
            <motion.button
              key={item.code}
              className={`nav-item ${isActive ? "active" : ""}`}
              onClick={() => onSelectModule(item.code)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>{item.code}</span>
              <strong>{item.name}</strong>
            </motion.button>
          );
        })}
      </nav>

      <div className="nav-status">
        <span className={`status-dot ${isValidData ? "status-online" : "status-offline"}`} />
        <span>{isValidData ? "PLATFORM / OPERATIONAL" : "PLATFORM / DATA WARNING"}</span>
      </div>
    </aside>
  );
};
