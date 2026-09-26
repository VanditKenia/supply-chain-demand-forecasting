from pathlib import Path
import pandas as pd

DATA_ROOT = Path("/data")
SALES_PATH = DATA_ROOT / "raw" / "sales_data.csv"
FORECAST_PATH = DATA_ROOT / "processed" / "final_demand_forecasts.csv"
INVENTORY_PATH = DATA_ROOT / "processed" / "inventory_recommendations.csv"

def _require(path: Path) -> Path:
    if not path.exists():
        raise FileNotFoundError(f"Required analytical artifact not found: {path}")
    return path

def load_forecasts() -> pd.DataFrame:
    return pd.read_csv(_require(FORECAST_PATH))

def load_inventory() -> pd.DataFrame:
    return pd.read_csv(_require(INVENTORY_PATH))

def load_sales() -> pd.DataFrame:
    return pd.read_csv(_require(SALES_PATH))

def overview() -> dict:
    forecasts = load_forecasts()
    inventory = load_inventory()

    return {
        "forecast_records": int(len(forecasts)),
        "decision_units": int(len(inventory)),
        "stores": int(forecasts["Store ID"].nunique()),
        "products": int(forecasts["Product ID"].nunique()),
        "forecast_horizon_days": int(forecasts["Date"].nunique()),
        "total_forecast_demand": round(float(forecasts["Forecast_Demand"].sum()), 2),
        "high_risk_units": int((inventory["Risk"] == "High").sum()),
        "recommended_order_units": round(float(inventory["Recommended Order Quantity"].sum()), 2),
    }

def actions(risk: str | None = None) -> list[dict]:
    inventory = load_inventory().copy()

    if risk:
        inventory = inventory[inventory["Risk"].str.lower() == risk.lower()]

    columns = [
        "Store ID",
        "Product ID",
        "Current Inventory",
        "Lead Time Demand",
        "Safety Stock",
        "Reorder Point",
        "Inventory Gap",
        "Recommended Order Quantity",
        "Risk",
        "Recommended Action",
        "Priority",
    ]

    return inventory[columns].to_dict(orient="records")
