import {
  OverviewMetrics,
  ForecastResponse,
  ForecastTrendResponse,
  InventoryResponse,
  RiskAnalyticsResponse,
  ActionItem,
  StoreSummary,
  ProductSummary,
  GlobalFilters,
} from "../types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function buildQuery(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();
  for (const key of Object.keys(params)) {
    const val = params[key];
    if (val !== undefined && val !== null && val !== "") {
      searchParams.append(key, String(val));
    }
  }
  const qs = searchParams.toString();
  return qs ? `?${qs}` : "";
}

async function fetchJson<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      cache: "no-store",
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`API Error [${res.status}]: ${errorText || res.statusText}`);
    }
    return await res.json();
  } catch (err: any) {
    console.error(`Fetch error for ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  async getHealth() {
    return fetchJson<{ status: string; service: string; timestamp: string; data_ready: boolean }>("/health");
  },

  async getOverview(): Promise<OverviewMetrics> {
    return fetchJson<OverviewMetrics>("/api/overview");
  },

  async getForecasts(filters: GlobalFilters & { page?: number; page_size?: number; sort_by?: string; sort_asc?: boolean }): Promise<ForecastResponse> {
    const qs = buildQuery({
      store_id: filters.store_id,
      product_id: filters.product_id,
      model: filters.model,
      start_date: filters.start_date,
      end_date: filters.end_date,
      search: filters.search,
      page: filters.page || 1,
      page_size: filters.page_size || 50,
      sort_by: filters.sort_by || "Date",
      sort_asc: filters.sort_asc ?? true,
    });
    return fetchJson<ForecastResponse>(`/api/forecasts${qs}`);
  },

  async getForecastTrend(filters: GlobalFilters): Promise<ForecastTrendResponse> {
    const qs = buildQuery({
      store_id: filters.store_id,
      product_id: filters.product_id,
      model: filters.model,
    });
    return fetchJson<ForecastTrendResponse>(`/api/forecasts/trend${qs}`);
  },

  async getInventory(filters: GlobalFilters & { action?: string; page?: number; page_size?: number; sort_by?: string; sort_asc?: boolean }): Promise<InventoryResponse> {
    const qs = buildQuery({
      store_id: filters.store_id,
      product_id: filters.product_id,
      risk: filters.risk,
      priority: filters.priority,
      action: filters.action,
      search: filters.search,
      page: filters.page || 1,
      page_size: filters.page_size || 50,
      sort_by: filters.sort_by || "Priority",
      sort_asc: filters.sort_asc ?? true,
    });
    return fetchJson<InventoryResponse>(`/api/inventory${qs}`);
  },

  async getRisk(): Promise<RiskAnalyticsResponse> {
    return fetchJson<RiskAnalyticsResponse>("/api/risk");
  },

  async getActions(filters: GlobalFilters & { limit?: number }): Promise<ActionItem[]> {
    const qs = buildQuery({
      risk: filters.risk,
      priority: filters.priority,
      store_id: filters.store_id,
      product_id: filters.product_id,
      search: filters.search,
      limit: filters.limit || 100,
    });
    return fetchJson<ActionItem[]>(`/api/actions${qs}`);
  },

  async getStores(): Promise<StoreSummary[]> {
    return fetchJson<StoreSummary[]>("/api/stores");
  },

  async getProducts(): Promise<ProductSummary[]> {
    return fetchJson<ProductSummary[]>("/api/products");
  },
};
