from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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
