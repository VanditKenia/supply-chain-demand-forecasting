from pathlib import Path
import os
import math
import pandas as pd
from typing import Optional, Dict, Any, List

def resolve_data_root() -> Path:
    candidates = [
        os.environ.get("DATA_PATH"),
        Path("/data"),
        Path(__file__).resolve().parent.parent.parent / "data",
        Path.cwd() / "data",
        Path.cwd().parent / "data",
    ]
    for c in candidates:
        if c:
            p = Path(c)
            if p.exists() and (p / "processed" / "final_demand_forecasts.csv").exists():
                return p
    # Fallback to repo root data
    return Path(__file__).resolve().parent.parent.parent / "data"

DATA_ROOT = resolve_data_root()
SALES_PATH = DATA_ROOT / "raw" / "sales_data.csv"
FORECAST_PATH = DATA_ROOT / "processed" / "final_demand_forecasts.csv"
INVENTORY_PATH = DATA_ROOT / "processed" / "inventory_recommendations.csv"

# In-memory cache for validated dataframes
_CACHE: Dict[str, pd.DataFrame] = {}
_VALIDATION_REPORT: Optional[Dict[str, Any]] = None

def _require_file(path: Path) -> Path:
    if not path.exists():
        raise FileNotFoundError(f"Required analytical artifact not found: {path}")
    return path

def validate_datasets() -> Dict[str, Any]:
    global _VALIDATION_REPORT
    errors = []
    
    # Check file existence
    try:
        f_path = _require_file(FORECAST_PATH)
        i_path = _require_file(INVENTORY_PATH)
    except FileNotFoundError as e:
        return {
            "valid": False,
            "errors": [str(e)],
            "historical_rows": 0,
            "forecast_rows": 0,
            "inventory_rows": 0
        }

    forecast_df = pd.read_csv(f_path)
    inventory_df = pd.read_csv(i_path)
    
    sales_rows = 0
    if SALES_PATH.exists():
        sales_df = pd.read_csv(SALES_PATH)
        sales_rows = len(sales_df)
        if sales_rows != 76000:
            errors.append(f"Expected 76,000 historical rows, found {sales_rows}")
        _CACHE["sales"] = sales_df
    
    # Forecast validation
    if len(forecast_df) != 3000:
        errors.append(f"Expected 3,000 forecast rows, found {len(forecast_df)}")
    
    required_f_cols = {"Date", "Store ID", "Product ID", "Forecast_Demand", "Selected_Model"}
    if not required_f_cols.issubset(forecast_df.columns):
        errors.append(f"Forecast missing required columns: {required_f_cols - set(forecast_df.columns)}")
    
    dup_f = forecast_df.duplicated(subset=["Date", "Store ID", "Product ID"]).sum()
    if dup_f > 0:
        errors.append(f"Found {dup_f} duplicate Date x Store ID x Product ID forecast keys")
        
    neg_f = (forecast_df["Forecast_Demand"] < 0).sum()
    if neg_f > 0:
        errors.append(f"Found {neg_f} negative forecast demand values")

    # Inventory validation
    if len(inventory_df) != 100:
        errors.append(f"Expected 100 inventory rows, found {len(inventory_df)}")

    required_i_cols = {
        "Inventory Snapshot Date", "Store ID", "Product ID", "Forecast_Start", "Forecast_End",
        "Forecast_Days", "Current Inventory", "Lead Time", "Lead Time Demand", "Demand Std Dev",
        "Service Level", "Z_Value", "Safety Stock", "Reorder Point", "Inventory Gap",
        "Excess_Inventory_Units", "Excess_Inventory_Flag", "Recommended Order Quantity",
        "Risk", "Recommended Action", "Priority"
    }
    if not required_i_cols.issubset(inventory_df.columns):
        errors.append(f"Inventory missing required columns: {required_i_cols - set(inventory_df.columns)}")

    neg_rec = (inventory_df["Recommended Order Quantity"] < 0).sum()
    if neg_rec > 0:
        errors.append(f"Found {neg_rec} negative recommended order quantities")

    valid_risks = {"High", "Medium", "Low"}
    invalid_risks = set(inventory_df["Risk"].unique()) - valid_risks
    if invalid_risks:
        errors.append(f"Found invalid risk values: {invalid_risks}")

    _CACHE["forecasts"] = forecast_df
    _CACHE["inventory"] = inventory_df

    _VALIDATION_REPORT = {
        "valid": len(errors) == 0,
        "errors": errors,
        "historical_rows": sales_rows,
        "forecast_rows": len(forecast_df),
        "inventory_rows": len(inventory_df),
        "stores_count": int(forecast_df["Store ID"].nunique()),
        "products_count": int(forecast_df["Product ID"].nunique()),
        "forecast_start": str(forecast_df["Date"].min()),
        "forecast_end": str(forecast_df["Date"].max()),
        "forecast_horizon_days": int(forecast_df["Date"].nunique()),
    }
    return _VALIDATION_REPORT

def get_forecasts_df() -> pd.DataFrame:
    if "forecasts" not in _CACHE:
        validate_datasets()
    if "forecasts" not in _CACHE:
        raise FileNotFoundError(f"Required forecast artifact not found: {FORECAST_PATH}")
    return _CACHE["forecasts"]

def get_inventory_df() -> pd.DataFrame:
    if "inventory" not in _CACHE:
        validate_datasets()
    if "inventory" not in _CACHE:
        raise FileNotFoundError(f"Required inventory artifact not found: {INVENTORY_PATH}")
    return _CACHE["inventory"]

def get_sales_df() -> Optional[pd.DataFrame]:
    if "sales" not in _CACHE and SALES_PATH.exists():
        _CACHE["sales"] = pd.read_csv(SALES_PATH)
    return _CACHE.get("sales")

def get_data_status() -> Dict[str, Any]:
    if _VALIDATION_REPORT is None:
        return validate_datasets()
    return _VALIDATION_REPORT

def overview() -> Dict[str, Any]:
    status = get_data_status()
    if not status["valid"]:
        raise ValueError(f"Analytical data invalid: {status['errors']}")
        
    forecasts = get_forecasts_df()
    inventory = get_inventory_df()

    total_demand = float(forecasts["Forecast_Demand"].sum())
    total_current_inv = float(inventory["Current Inventory"].sum())
    total_safety_stock = float(inventory["Safety Stock"].sum())
    total_reorder_point = float(inventory["Reorder Point"].sum())
    total_inventory_gap = float(inventory["Inventory Gap"].sum())
    total_rec_order = float(inventory["Recommended Order Quantity"].sum())
    total_excess_units = float(inventory["Excess_Inventory_Units"].sum())

    risk_counts = inventory["Risk"].value_counts().to_dict()
    priority_counts = inventory["Priority"].value_counts().to_dict()

    snapshot_date = str(inventory["Inventory Snapshot Date"].iloc[0]) if "Inventory Snapshot Date" in inventory.columns else "2024-01-01"

    return {
        "status": "operational",
        "data_status": status,
        "forecast_records": int(len(forecasts)),
        "decision_units": int(len(inventory)),
        "stores": int(forecasts["Store ID"].nunique()),
        "products": int(forecasts["Product ID"].nunique()),
        "forecast_horizon_days": int(forecasts["Date"].nunique()),
        "forecast_start_date": str(forecasts["Date"].min()),
        "forecast_end_date": str(forecasts["Date"].max()),
        "inventory_snapshot_date": snapshot_date,
        "total_forecast_demand": round(total_demand, 2),
        "average_daily_demand": round(total_demand / forecasts["Date"].nunique(), 2),
        "total_current_inventory": round(total_current_inv, 2),
        "total_safety_stock": round(total_safety_stock, 2),
        "total_reorder_point": round(total_reorder_point, 2),
        "total_inventory_gap": round(total_inventory_gap, 2),
        "recommended_order_units": round(total_rec_order, 2),
        "excess_inventory_units": round(total_excess_units, 2),
        "high_risk_units": int(risk_counts.get("High", 0)),
        "medium_risk_units": int(risk_counts.get("Medium", 0)),
        "low_risk_units": int(risk_counts.get("Low", 0)),
        "priority_1_units": int(priority_counts.get(1, 0)),
        "priority_2_units": int(priority_counts.get(2, 0)),
        "priority_3_units": int(priority_counts.get(3, 0)),
    }

def get_forecasts(
    store_id: Optional[str] = None,
    product_id: Optional[str] = None,
    model: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    search: Optional[str] = None,
    page: int = 1,
    page_size: int = 50,
    sort_by: str = "Date",
    sort_asc: bool = True,
) -> Dict[str, Any]:
    df = get_forecasts_df().copy()

    if store_id:
        df = df[df["Store ID"] == store_id]
    if product_id:
        df = df[df["Product ID"] == product_id]
    if model:
        df = df[df["Selected_Model"] == model]
    if start_date:
        df = df[df["Date"] >= start_date]
    if end_date:
        df = df[df["Date"] <= end_date]
    if search:
        s = search.strip().lower()
        df = df[
            df["Store ID"].str.lower().str.contains(s) |
            df["Product ID"].str.lower().str.contains(s) |
            df["Selected_Model"].str.lower().str.contains(s) |
            df["Date"].str.contains(s)
        ]

    total_records = len(df)
    total_demand = float(df["Forecast_Demand"].sum()) if total_records > 0 else 0.0
    avg_demand = float(df["Forecast_Demand"].mean()) if total_records > 0 else 0.0
    max_demand = float(df["Forecast_Demand"].max()) if total_records > 0 else 0.0
    series_count = int(df.groupby(["Store ID", "Product ID"]).ngroups) if total_records > 0 else 0
    unique_dates = int(df["Date"].nunique()) if total_records > 0 else 0

    # Model breakdown in current slice
    model_breakdown = df["Selected_Model"].value_counts().to_dict() if total_records > 0 else {}

    # Sort
    if sort_by in df.columns:
        df = df.sort_values(by=sort_by, ascending=sort_asc)

    # Paginate
    total_pages = math.ceil(total_records / page_size) if total_records > 0 else 1
    page = max(1, min(page, total_pages))
    start_idx = (page - 1) * page_size
    paged_df = df.iloc[start_idx : start_idx + page_size]

    records = paged_df.to_dict(orient="records")
    for r in records:
        r["Forecast_Demand"] = round(float(r["Forecast_Demand"]), 2)

    return {
        "items": records,
        "total_records": total_records,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages,
        "summary": {
            "total_demand": round(total_demand, 2),
            "average_daily_demand": round(avg_demand, 2),
            "max_daily_demand": round(max_demand, 2),
            "series_count": series_count,
            "forecast_days": unique_dates,
            "model_distribution": model_breakdown,
        },
    }

def get_forecast_trend(
    store_id: Optional[str] = None,
    product_id: Optional[str] = None,
    model: Optional[str] = None,
) -> Dict[str, Any]:
    df = get_forecasts_df().copy()

    if store_id:
        df = df[df["Store ID"] == store_id]
    if product_id:
        df = df[df["Product ID"] == product_id]
    if model:
        df = df[df["Selected_Model"] == model]

    if df.empty:
        return {"dates": [], "series": [], "summary": {}}

    daily = df.groupby("Date").agg(
        forecast_demand=("Forecast_Demand", "sum"),
        series_count=("Product ID", "count"),
        avg_demand=("Forecast_Demand", "mean"),
    ).reset_index()

    trend = []
    for _, row in daily.iterrows():
        trend.append({
            "date": str(row["Date"]),
            "forecast_demand": round(float(row["forecast_demand"]), 2),
            "avg_demand": round(float(row["avg_demand"]), 2),
            "series_count": int(row["series_count"]),
        })

    # Store comparison breakdown
    store_breakdown = df.groupby("Store ID")["Forecast_Demand"].sum().round(2).to_dict()
    # Product comparison breakdown (top 10)
    prod_breakdown = df.groupby("Product ID")["Forecast_Demand"].sum().round(2).sort_values(ascending=False).to_dict()
    # Model breakdown
    model_breakdown = df.groupby("Selected_Model")["Forecast_Demand"].sum().round(2).to_dict()

    return {
        "trend": trend,
        "store_breakdown": store_breakdown,
        "product_breakdown": prod_breakdown,
        "model_breakdown": model_breakdown,
        "summary": {
            "total_forecast": round(float(df["Forecast_Demand"].sum()), 2),
            "days_count": int(df["Date"].nunique()),
            "series_count": int(df.groupby(["Store ID", "Product ID"]).ngroups),
        }
    }

def get_inventory(
    store_id: Optional[str] = None,
    product_id: Optional[str] = None,
    risk: Optional[str] = None,
    priority: Optional[int] = None,
    action: Optional[str] = None,
    search: Optional[str] = None,
    page: int = 1,
    page_size: int = 50,
    sort_by: str = "Priority",
    sort_asc: bool = True,
) -> Dict[str, Any]:
    df = get_inventory_df().copy()

    if store_id:
        df = df[df["Store ID"] == store_id]
    if product_id:
        df = df[df["Product ID"] == product_id]
    if risk:
        df = df[df["Risk"].str.lower() == risk.lower()]
    if priority is not None:
        df = df[df["Priority"] == priority]
    if action:
        df = df[df["Recommended Action"].str.lower() == action.lower()]
    if search:
        s = search.strip().lower()
        df = df[
            df["Store ID"].str.lower().str.contains(s) |
            df["Product ID"].str.lower().str.contains(s) |
            df["Risk"].str.lower().str.contains(s) |
            df["Recommended Action"].str.lower().str.contains(s)
        ]

    total_records = len(df)
    
    summary = {
        "total_units": total_records,
        "current_inventory": round(float(df["Current Inventory"].sum()), 2) if total_records > 0 else 0.0,
        "lead_time_demand": round(float(df["Lead Time Demand"].sum()), 2) if total_records > 0 else 0.0,
        "safety_stock": round(float(df["Safety Stock"].sum()), 2) if total_records > 0 else 0.0,
        "reorder_point": round(float(df["Reorder Point"].sum()), 2) if total_records > 0 else 0.0,
        "inventory_gap": round(float(df["Inventory Gap"].sum()), 2) if total_records > 0 else 0.0,
        "recommended_order": round(float(df["Recommended Order Quantity"].sum()), 2) if total_records > 0 else 0.0,
        "excess_inventory_units": round(float(df["Excess_Inventory_Units"].sum()), 2) if total_records > 0 else 0.0,
        "high_risk_count": int((df["Risk"] == "High").sum()) if total_records > 0 else 0,
        "medium_risk_count": int((df["Risk"] == "Medium").sum()) if total_records > 0 else 0,
        "low_risk_count": int((df["Risk"] == "Low").sum()) if total_records > 0 else 0,
    }

    if sort_by in df.columns:
        df = df.sort_values(by=sort_by, ascending=sort_asc)

    total_pages = math.ceil(total_records / page_size) if total_records > 0 else 1
    page = max(1, min(page, total_pages))
    start_idx = (page - 1) * page_size
    paged_df = df.iloc[start_idx : start_idx + page_size]

    records = paged_df.to_dict(orient="records")
    for r in records:
        for k in ["Lead Time Demand", "Demand Std Dev", "Safety Stock", "Reorder Point", "Inventory Gap", "Excess_Inventory_Units", "Recommended Order Quantity"]:
            if k in r and r[k] is not None:
                r[k] = round(float(r[k]), 2)
        r["Current Inventory"] = int(r["Current Inventory"])
        r["Priority"] = int(r["Priority"])
        r["Lead Time"] = int(r["Lead Time"])

    return {
        "items": records,
        "total_records": total_records,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages,
        "summary": summary,
    }

def get_risk_analytics() -> Dict[str, Any]:
    inventory = get_inventory_df()

    # Risk distribution
    risk_counts = inventory["Risk"].value_counts().to_dict()
    total = len(inventory)
    risk_dist = [
        {"risk": "High", "count": int(risk_counts.get("High", 0)), "pct": round(int(risk_counts.get("High", 0)) / total * 100, 1)},
        {"risk": "Medium", "count": int(risk_counts.get("Medium", 0)), "pct": round(int(risk_counts.get("Medium", 0)) / total * 100, 1)},
        {"risk": "Low", "count": int(risk_counts.get("Low", 0)), "pct": round(int(risk_counts.get("Low", 0)) / total * 100, 1)},
    ]

    # Risk by store
    store_risk = []
    for store_id, group in inventory.groupby("Store ID"):
        c = group["Risk"].value_counts().to_dict()
        store_risk.append({
            "store_id": store_id,
            "high": int(c.get("High", 0)),
            "medium": int(c.get("Medium", 0)),
            "low": int(c.get("Low", 0)),
            "total_rec_order": round(float(group["Recommended Order Quantity"].sum()), 2),
            "current_inv": int(group["Current Inventory"].sum()),
            "reorder_point": round(float(group["Reorder Point"].sum()), 2),
        })
    store_risk = sorted(store_risk, key=lambda x: x["store_id"])

    # Replenishment ranking (top 10 by recommended order)
    top_replenishment = inventory.sort_values(by="Recommended Order Quantity", ascending=False).head(10)
    replenishment_ranking = []
    for _, row in top_replenishment.iterrows():
        replenishment_ranking.append({
            "store_id": row["Store ID"],
            "product_id": row["Product ID"],
            "recommended_order": round(float(row["Recommended Order Quantity"]), 2),
            "reorder_point": round(float(row["Reorder Point"]), 2),
            "current_inventory": int(row["Current Inventory"]),
            "risk": row["Risk"],
            "priority": int(row["Priority"]),
        })

    # Recommended order by product
    prod_rec = inventory.groupby("Product ID")["Recommended Order Quantity"].sum().round(2).sort_values(ascending=False).to_dict()

    return {
        "risk_distribution": risk_dist,
        "risk_by_store": store_risk,
        "replenishment_ranking": replenishment_ranking,
        "recommended_order_by_product": prod_rec,
    }

def generate_action_explanation(row: pd.Series) -> str:
    risk = str(row.get("Risk", "")).lower()
    curr = int(row.get("Current Inventory", 0))
    rop = round(float(row.get("Reorder Point", 0)), 1)
    rec = round(float(row.get("Recommended Order Quantity", 0)), 1)
    gap = round(float(row.get("Inventory Gap", 0)), 1)
    lead_time = int(row.get("Lead Time", 7))
    sl = int(float(row.get("Service Level", 0.95)) * 100)
    excess = round(float(row.get("Excess_Inventory_Units", 0)), 1)

    if risk == "high":
        return f"Current inventory ({curr}) is below reorder point ({rop}) by an inventory gap of {gap} units. Under {sl}% service level and {lead_time}-day lead time, recommended replenishment is {rec} units to prevent stockout risk."
    elif risk == "medium":
        return f"Current inventory ({curr}) is within the 20% safety threshold above reorder point ({rop}). Scheduled monitoring recommended without immediate order."
    elif excess > 0:
        return f"Current inventory ({curr}) exceeds reorder point ({rop}) with {excess} excess units above target buffer. Maintain current inventory and review excess."
    else:
        return f"Current inventory ({curr}) satisfies the reorder point requirement ({rop}). Target stock level is maintained."

def get_actions(
    risk: Optional[str] = None,
    priority: Optional[int] = None,
    store_id: Optional[str] = None,
    product_id: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 100,
) -> List[Dict[str, Any]]:
    df = get_inventory_df().copy()

    if risk:
        df = df[df["Risk"].str.lower() == risk.lower()]
    if priority is not None:
        df = df[df["Priority"] == priority]
    if store_id:
        df = df[df["Store ID"] == store_id]
    if product_id:
        df = df[df["Product ID"] == product_id]
    if search:
        s = search.strip().lower()
        df = df[
            df["Store ID"].str.lower().str.contains(s) |
            df["Product ID"].str.lower().str.contains(s) |
            df["Recommended Action"].str.lower().str.contains(s)
        ]

    # Deterministic sorting: Priority asc, Recommended Order Quantity desc
    df = df.sort_values(by=["Priority", "Recommended Order Quantity"], ascending=[True, False]).head(limit)

    # Attach model from forecast summary if available
    forecasts = get_forecasts_df()
    model_map = forecasts.groupby(["Store ID", "Product ID"])["Selected_Model"].first().to_dict()

    results = []
    for _, row in df.iterrows():
        key = (row["Store ID"], row["Product ID"])
        model_name = model_map.get(key, "ARIMA/ML")
        
        explanation = generate_action_explanation(row)
        
        results.append({
            "store_id": row["Store ID"],
            "product_id": row["Product ID"],
            "current_inventory": int(row["Current Inventory"]),
            "lead_time": int(row["Lead Time"]),
            "lead_time_demand": round(float(row["Lead Time Demand"]), 2),
            "demand_std_dev": round(float(row["Demand Std Dev"]), 2),
            "service_level": round(float(row["Service Level"]), 2),
            "z_value": round(float(row["Z_Value"]), 4),
            "safety_stock": round(float(row["Safety Stock"]), 2),
            "reorder_point": round(float(row["Reorder Point"]), 2),
            "inventory_gap": round(float(row["Inventory Gap"]), 2),
            "excess_inventory_units": round(float(row["Excess_Inventory_Units"]), 2),
            "excess_inventory_flag": bool(row["Excess_Inventory_Flag"]),
            "recommended_order_quantity": round(float(row["Recommended Order Quantity"]), 2),
            "risk": row["Risk"],
            "recommended_action": row["Recommended Action"],
            "priority": int(row["Priority"]),
            "forecast_start": str(row["Forecast_Start"]),
            "forecast_end": str(row["Forecast_End"]),
            "selected_model": model_name,
            "explanation": explanation,
        })
    return results

def get_stores() -> List[Dict[str, Any]]:
    forecasts = get_forecasts_df()
    inventory = get_inventory_df()

    store_list = []
    for store_id in sorted(forecasts["Store ID"].unique()):
        f_sub = forecasts[forecasts["Store ID"] == store_id]
        i_sub = inventory[inventory["Store ID"] == store_id]

        total_demand = round(float(f_sub["Forecast_Demand"].sum()), 2)
        total_rec_order = round(float(i_sub["Recommended Order Quantity"].sum()), 2)
        total_curr_inv = int(i_sub["Current Inventory"].sum())
        high_risk_count = int((i_sub["Risk"] == "High").sum())
        products_count = int(f_sub["Product ID"].nunique())

        store_list.append({
            "store_id": store_id,
            "total_forecast_demand": total_demand,
            "recommended_order_quantity": total_rec_order,
            "current_inventory": total_curr_inv,
            "high_risk_count": high_risk_count,
            "products_count": products_count,
        })
    return store_list

def get_products() -> List[Dict[str, Any]]:
    forecasts = get_forecasts_df()
    inventory = get_inventory_df()

    prod_list = []
    for prod_id in sorted(forecasts["Product ID"].unique()):
        f_sub = forecasts[forecasts["Product ID"] == prod_id]
        i_sub = inventory[inventory["Product ID"] == prod_id]

        total_demand = round(float(f_sub["Forecast_Demand"].sum()), 2)
        avg_demand = round(float(f_sub["Forecast_Demand"].mean()), 2)
        total_rec_order = round(float(i_sub["Recommended Order Quantity"].sum()), 2)
        total_curr_inv = int(i_sub["Current Inventory"].sum())
        high_risk_count = int((i_sub["Risk"] == "High").sum())
        models_used = sorted(f_sub["Selected_Model"].unique().tolist())

        prod_list.append({
            "product_id": prod_id,
            "total_forecast_demand": total_demand,
            "average_daily_demand": avg_demand,
            "recommended_order_quantity": total_rec_order,
            "current_inventory": total_curr_inv,
            "high_risk_count": high_risk_count,
            "stores_count": int(f_sub["Store ID"].nunique()),
            "models_used": models_used,
        })
    return prod_list
