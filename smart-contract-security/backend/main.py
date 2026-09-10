from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import tempfile
import os

from scanner.slither_runner import run_slither
from scanner.parser import parse_slither_output
app = FastAPI(title="ContractGuard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def api_health_check():
    return {
        "status": "ok",
        "service": "contractguard-api",
    }

@app.get("/health")
def health_check():
    return {"status": "ok"}

class AnalyzeRequest(BaseModel):
    source: str

@app.post("/api/analyze")
def analyze_contract(req: AnalyzeRequest):
    if not req.source or not req.source.strip():
        raise HTTPException(status_code=400, detail="Source code cannot be empty")
        
    with tempfile.NamedTemporaryFile(suffix=".sol", delete=False, mode="w", encoding="utf-8") as tmp:
        tmp.write(req.source)
        tmp_path = tmp.name

    try:
        raw_result = run_slither(tmp_path)
        normalized = parse_slither_output(raw_result)
        return normalized
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)
