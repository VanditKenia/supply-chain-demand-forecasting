"use client";

import { motion } from "framer-motion";

const modules = [
  { code: "01", name: "Control Tower", description: "See the current supply-chain situation." },
  { code: "02", name: "Demand", description: "Explore the 30-day forecast horizon." },
  { code: "03", name: "Inventory", description: "Understand inventory pressure and risk." },
  { code: "04", name: "Actions", description: "Investigate replenishment decisions." },
];

export default function Home() {
  return (
    <main className="platform-shell">
      <aside className="nav-rail">
        <div className="brand">
          <span className="brand-mark">S//I</span>
          <span>SUPPLY<br />INTELLIGENCE</span>
        </div>
        <nav>
          {modules.map((item, index) => (
            <motion.button
              key={item.code}
              className={index === 0 ? "nav-item active" : "nav-item"}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>{item.code}</span>
              <strong>{item.name}</strong>
            </motion.button>
          ))}
        </nav>
        <div className="nav-status">
          <span className="status-dot" />
          PLATFORM / FOUNDATION
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <span>SUPPLY CHAIN / INTELLIGENCE PLATFORM</span>
          <span>PHASE 07 · FOUNDATION</span>
        </header>

        <div className="hero">
          <p className="eyebrow">OPERATIONS CONTROL SYSTEM</p>
          <h1>From forecast<br /><em>to decision.</em></h1>
          <p className="hero-copy">
            An interactive supply-chain intelligence platform connecting demand
            forecasting, inventory risk, and replenishment decisions.
          </p>
          <div className="hero-actions">
            <button className="primary-action">ENTER CONTROL TOWER <span>→</span></button>
            <button className="secondary-action">VIEW ARCHITECTURE</button>
          </div>
        </div>

        <div className="module-grid">
          {modules.map((item, index) => (
            <motion.article
              key={item.code}
              className="module-card"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -6 }}
            >
              <span className="module-code">{item.code}</span>
              <h2>{item.name}</h2>
              <p>{item.description}</p>
              <span className="module-arrow">↗</span>
            </motion.article>
          ))}
        </div>
      </section>
    </main>
  );
}
