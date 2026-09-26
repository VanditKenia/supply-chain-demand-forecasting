# Supply Intelligence Design System

## 1. Product Character & Philosophy

Modern logistics SaaS / operations control center. The experience feels like high-performance operations software, not a presentation dashboard.

### Core Visual Principles
- **Warm Neutral Canvas:** `#eee9df` base background rather than generic blinding white or cliché dark blue templates.
- **Charcoal Surfaces & Typography:** `#191917` for crisp, high-contrast readability.
- **Burnt Orange / Terracotta Accent:** `#c75b32` used purposefully for calls to action, forecast curves, and key metrics.
- **Functional Status Indicators:**
  - Olive Green (`#6c7950`): Low risk / healthy inventory buffer.
  - Amber (`#d97706`): Medium risk / scheduled monitor buffer.
  - Brick Red (`#a8433d`): High risk / urgent stockout deficit.
  - Slate Blue (`#4f6d7a`): Dimensional comparisons and secondary series.
- **Restrained Borders & Generous Spacing:** `1px solid #d2ccc0` sparse lines and clean layout grids.
- **Functional Motion:** Subtle Framer Motion transitions (y: -3px on card hover, spring sliding drawers, smooth tabs).

---

## 2. Color System & Design Tokens

```css
:root {
  --bg: #eee9df;
  --surface: #f6f2ea;
  --surface-alt: #faf7f2;
  --surface-dark: #191917;
  --ink: #191917;
  --muted: #716e66;
  --line: #d2ccc0;
  --line-light: #e3ded4;
  --accent: #c75b32;
  --accent-light: #f5ebe6;
  --green: #6c7950;
  --green-light: #eff2eb;
  --warning: #d97706;
  --warning-light: #fdf5ea;
  --danger: #a8433d;
  --danger-light: #faeceb;
  --blue: #4f6d7a;
}
```

---

## 3. Typography & Hierarchy

- **Primary Sans:** `Manrope` (Weights: 400, 500, 600, 700, 800) — Used for headers, values, titles, and body text.
- **Monospace Telemetry:** `DM Mono` (Weights: 400, 500) — Used for telemetry banners, timestamps, dates, Store/SKU IDs, numerical metrics, code, and table figures.

---

## 4. UI Components

### 4.1 NavRail (`NavRail.tsx`)
- Fixed left sidebar in `#191917`.
- Numbered workspace codes (`01`, `02`, `03`, `04`, `05`).
- Active state highlighted in terracotta with active background.
- Live telemetry indicator with pulsing green dot.

### 4.2 KPI Ribbon (`KPICard.tsx`)
- Structured with title, numerical value, badge tag, and contextual subtext.
- Animated on entry with Framer Motion and responsive grid wrapping.

### 4.3 Interactive Visuals (`EChartWrapper.tsx`)
- Apache ECharts configured with responsive resize observers.
- Custom tooltip formatting matching the DM Mono palette.
- Dynamic data zoom, brushing, stacked risk bars, and smooth gradient areas.

### 4.4 Decision Inspector Drawer (`DetailDrawer.tsx`)
- Slides in smoothly from right with backdrop blur.
- Details all decision metrics: Current Inventory, Lead Time Demand, Demand Std Dev, Safety Stock, Reorder Point, Inventory Gap, Recommended Order Quantity, Risk, Priority, Recommended Action.
- Contains deterministic "Why this action?" explanation box.
- Renders a mini 30-day forecast series curve for that specific Store × Product node.

### 4.5 Filter Ribbon (`FilterBar.tsx`)
- Unified filter controls for Store, Product, Risk, Model, Priority, and Search.
- Active filter counter and one-click reset action.

---

## 5. Anti-Patterns & Prohibitions

Do NOT use:
- Generic Bootstrap/Material dashboards with heavy drop-shadows.
- Bright neon gradients or blinding white cards.
- Decorative 3D elements or empty placeholders.
- Rainbow-colored charts without semantic meaning.
- Fabricated metrics, AI hallucinated summaries, or ungrounded ROI figures.
