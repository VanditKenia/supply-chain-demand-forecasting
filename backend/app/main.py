from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from datetime import datetime, timezone

from .data_service import (
    overview,
    get_forecasts,
    get_forecast_trend,
    get_inventory,
    get_risk_analytics,
    get_actions,
    get_stores,
    get_products,
    get_data_status,
)

app = FastAPI(
    title="Supply Chain Intelligence API",
    version="1.0.0",
    description="Operational and decision-support API layer for the Supply Chain Intelligence Platform.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    status = get_data_status()
    return {
        "status": "ok",
        "service": "supply-chain-intelligence-api",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "data_ready": status.get("valid", False),
    }

@app.get("/api")
def api_root():
    return {
        "name": "Supply Chain Intelligence API",
        "version": "1.0.0",
        "status": "operational",
        "endpoints": [
            "/health",
            "/api",
            "/api/overview",
            "/api/forecasts",
            "/api/forecasts/trend",
            "/api/inventory",
            "/api/risk",
            "/api/actions",
            "/api/stores",
            "/api/products",
        ],
    }

@app.get("/api/overview")
def get_overview_endpoint():
    try:
        return overview()
    except (FileNotFoundError, ValueError) as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc

@app.get("/api/forecasts")
def get_forecasts_endpoint(
    store_id: Optional[str] = Query(None, description="Filter by Store ID (e.g. S001)"),
    product_id: Optional[str] = Query(None, description="Filter by Product ID (e.g. P0001)"),
    model: Optional[str] = Query(None, description="Filter by Selected Model"),
    start_date: Optional[str] = Query(None, description="Filter starting from Date (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="Filter up to Date (YYYY-MM-DD)"),
    search: Optional[str] = Query(None, description="Search across store, product, model, date"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(50, ge=1, le=500, description="Page size"),
    sort_by: str = Query("Date", description="Field to sort by"),
    sort_asc: bool = Query(True, description="Ascending sort if true"),
):
    try:
        return get_forecasts(
            store_id=store_id,
            product_id=product_id,
            model=model,
            start_date=start_date,
            end_date=end_date,
            search=search,
            page=page,
            page_size=page_size,
            sort_by=sort_by,
            sort_asc=sort_asc,
        )
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc

@app.get("/api/forecasts/trend")
def get_forecast_trend_endpoint(
    store_id: Optional[str] = Query(None, description="Filter by Store ID"),
    product_id: Optional[str] = Query(None, description="Filter by Product ID"),
    model: Optional[str] = Query(None, description="Filter by Selected Model"),
    start_date: Optional[str] = Query(None, description="Filter starting from Date (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="Filter up to Date (YYYY-MM-DD)"),
    search: Optional[str] = Query(None, description="Search across store, product, model, date"),
):
    try:
        return get_forecast_trend(
            store_id=store_id,
            product_id=product_id,
            model=model,
            start_date=start_date,
            end_date=end_date,
            search=search,
        )
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc

@app.get("/api/inventory")
def get_inventory_endpoint(
    store_id: Optional[str] = Query(None, description="Filter by Store ID"),
    product_id: Optional[str] = Query(None, description="Filter by Product ID"),
    risk: Optional[str] = Query(None, description="Filter by Risk level (High, Medium, Low)"),
    priority: Optional[int] = Query(None, description="Filter by Priority (1, 2, 3)"),
    action: Optional[str] = Query(None, description="Filter by Action (Replenish, Monitor, Maintain, Review Excess)"),
    search: Optional[str] = Query(None, description="Search across store, product, action, risk"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(50, ge=1, le=100, description="Page size"),
    sort_by: str = Query("Priority", description="Field to sort by"),
    sort_asc: bool = Query(True, description="Ascending sort if true"),
):
    try:
        return get_inventory(
            store_id=store_id,
            product_id=product_id,
            risk=risk,
            priority=priority,
            action=action,
            search=search,
            page=page,
            page_size=page_size,
            sort_by=sort_by,
            sort_asc=sort_asc,
        )
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc

@app.get("/api/risk")
def get_risk_endpoint():
    try:
        return get_risk_analytics()
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc

@app.get("/api/actions")
def get_actions_endpoint(
    risk: Optional[str] = Query(None, description="Filter by Risk level (High, Medium, Low)"),
    priority: Optional[int] = Query(None, description="Filter by Priority (1, 2, 3)"),
    store_id: Optional[str] = Query(None, description="Filter by Store ID"),
    product_id: Optional[str] = Query(None, description="Filter by Product ID"),
    search: Optional[str] = Query(None, description="Search term"),
    limit: int = Query(100, ge=1, le=100, description="Max actions to return"),
):
    try:
        return get_actions(
            risk=risk,
            priority=priority,
            store_id=store_id,
            product_id=product_id,
            search=search,
            limit=limit,
        )
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc

@app.get("/api/stores")
def get_stores_endpoint():
    try:
        return get_stores()
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc

@app.get("/api/products")
def get_products_endpoint():
    try:
        return get_products()
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
