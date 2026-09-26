export interface DataStatus {
  valid: boolean;
  errors: string[];
  historical_rows: number;
  forecast_rows: number;
  inventory_rows: number;
  stores_count: number;
  products_count: number;
  forecast_start: string;
  forecast_end: string;
  forecast_horizon_days: number;
}

export interface OverviewMetrics {
  status: string;
  data_status: DataStatus;
  forecast_records: number;
  decision_units: number;
  stores: number;
  products: number;
  forecast_horizon_days: number;
  forecast_start_date: string;
  forecast_end_date: string;
  inventory_snapshot_date: string;
  total_forecast_demand: number;
  average_daily_demand: number;
  total_current_inventory: number;
  total_safety_stock: number;
  total_reorder_point: number;
  total_inventory_gap: number;
  recommended_order_units: number;
  excess_inventory_units: number;
  high_risk_units: number;
  medium_risk_units: number;
  low_risk_units: number;
  priority_1_units: number;
  priority_2_units: number;
  priority_3_units: number;
}

export interface ForecastRecord {
  Date: string;
  "Store ID": string;
  "Product ID": string;
  Forecast_Demand: number;
  Selected_Model: string;
}

export interface ForecastTrendPoint {
  date: string;
  forecast_demand: number;
  avg_demand: number;
  series_count: number;
}

export interface ForecastResponse {
  items: ForecastRecord[];
  total_records: number;
  page: number;
  page_size: number;
  total_pages: number;
  summary: {
    total_demand: number;
    average_daily_demand: number;
    max_daily_demand: number;
    series_count: number;
    forecast_days: number;
    model_distribution: Record<string, number>;
  };
}

export interface ForecastTrendResponse {
  trend: ForecastTrendPoint[];
  store_breakdown: Record<string, number>;
  product_breakdown: Record<string, number>;
  model_breakdown: Record<string, number>;
  summary: {
    total_forecast: number;
    days_count: number;
    series_count: number;
  };
}

export interface InventoryDecision {
  "Inventory Snapshot Date"?: string;
  "Store ID": string;
  "Product ID": string;
  Forecast_Start?: string;
  Forecast_End?: string;
  Forecast_Days?: number;
  "Current Inventory": number;
  "Lead Time": number;
  "Lead Time Demand": number;
  "Demand Std Dev": number;
  "Service Level": number;
  Z_Value?: number;
  "Safety Stock": number;
  "Reorder Point": number;
  "Inventory Gap": number;
  Excess_Inventory_Units: number;
  Excess_Inventory_Flag: boolean;
  "Recommended Order Quantity": number;
  Risk: "High" | "Medium" | "Low";
  "Recommended Action": string;
  Priority: number;
  selected_model?: string;
  explanation?: string;
}

export interface InventoryResponse {
  items: InventoryDecision[];
  total_records: number;
  page: number;
  page_size: number;
  total_pages: number;
  summary: {
    total_units: number;
    current_inventory: number;
    lead_time_demand: number;
    safety_stock: number;
    reorder_point: number;
    inventory_gap: number;
    recommended_order: number;
    excess_inventory_units: number;
    high_risk_count: number;
    medium_risk_count: number;
    low_risk_count: number;
  };
}

export interface RiskDistributionItem {
  risk: "High" | "Medium" | "Low";
  count: number;
  pct: number;
}

export interface StoreRiskItem {
  store_id: string;
  high: number;
  medium: number;
  low: number;
  total_rec_order: number;
  current_inv: number;
  reorder_point: number;
}

export interface ReplenishmentRankingItem {
  store_id: string;
  product_id: string;
  recommended_order: number;
  reorder_point: number;
  current_inventory: number;
  risk: string;
  priority: number;
}

export interface RiskAnalyticsResponse {
  risk_distribution: RiskDistributionItem[];
  risk_by_store: StoreRiskItem[];
  replenishment_ranking: ReplenishmentRankingItem[];
  recommended_order_by_product: Record<string, number>;
}

export interface ActionItem {
  store_id: string;
  product_id: string;
  current_inventory: number;
  lead_time: number;
  lead_time_demand: number;
  demand_std_dev: number;
  service_level: number;
  z_value: number;
  safety_stock: number;
  reorder_point: number;
  inventory_gap: number;
  excess_inventory_units: number;
  excess_inventory_flag: boolean;
  recommended_order_quantity: number;
  risk: "High" | "Medium" | "Low";
  recommended_action: string;
  priority: number;
  forecast_start: string;
  forecast_end: string;
  selected_model: string;
  explanation: string;
}

export interface StoreSummary {
  store_id: string;
  total_forecast_demand: number;
  recommended_order_quantity: number;
  current_inventory: number;
  high_risk_count: number;
  products_count: number;
}

export interface ProductSummary {
  product_id: string;
  total_forecast_demand: number;
  average_daily_demand: number;
  recommended_order_quantity: number;
  current_inventory: number;
  high_risk_count: number;
  stores_count: number;
  models_used: string[];
}

export interface GlobalFilters {
  store_id?: string;
  product_id?: string;
  risk?: string;
  priority?: number;
  model?: string;
  start_date?: string;
  end_date?: string;
  search?: string;
}
