from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .data_service import actions, overview

app = FastAPI(
    title="Supply Chain Intelligence API",
    version="0.1.0",
    description="API layer for the Supply Chain Intelligence Platform.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok", "service": "supply-chain-intelligence-api"}

@app.get("/api")
def api_root():
    return {
        "name": "Supply Chain Intelligence API",
        "version": "0.1.0",
        "status": "foundation",
    }

@app.get("/api/overview")
def get_overview():
    try:
        return overview()
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc

@app.get("/api/actions")
def get_actions(risk: str | None = None):
    try:
        return actions(risk)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
