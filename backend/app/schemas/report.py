from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field


class ReportGenerateRequest(BaseModel):
    title: str = Field(..., json_schema_extra={"example": "Q3 2026 Executive Cyber Risk & Investment Optimization Report"})
    report_type: str = Field(default="Executive", json_schema_extra={"example": "Executive"})  # Executive, CISO, Investment, Compliance, Vendor, Incident
    format: str = Field(default="JSON", pattern="^(JSON|PDF|CSV)$")
    scenario_ids: Optional[List[str]] = None
    include_evidence: bool = True
    include_simulations: bool = True


class ReportResponse(BaseModel):
    id: str
    organization_id: str
    title: str
    report_type: str
    format: str
    status: str  # Generated, Processing, Failed
    generated_at: datetime
    file_uri: Optional[str] = None
    download_url: Optional[str] = None
    summary_data: Dict[str, Any] = {}
    model_version: str = "FAIR-2.1"
    disclaimer: str = "Estimates are probabilistic representations based on evidence collected to date."
