from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class FrameworkResponse(BaseModel):
    id: str
    name: str
    version: str
    country: str
    source: str
    active: bool
    requirements_count: int = 0

    model_config = ConfigDict(from_attributes=True)


class RequirementResponse(BaseModel):
    id: str
    framework_id: str
    requirement_id: str
    title: str
    description: Optional[str] = None
    category: str
    related_controls: List[str] = []
    required_evidence: List[str] = []
    risk_relevance: str

    model_config = ConfigDict(from_attributes=True)


class ComplianceGapResponse(BaseModel):
    requirement_id: str
    framework_name: str
    title: str
    category: str
    compliance_status: str  # Compliant, Partially Compliant, Non-Compliant
    control_strength: float
    evidence_freshness_status: str
    financial_risk_exposure: float
    assigned_owner: Optional[str] = None


class ComplianceSummaryResponse(BaseModel):
    organization_name: str
    overall_compliance_score: float
    framework_scores: List[Dict[str, Any]]
    nist_csf_functions: Dict[str, float]  # Govern, Identify, Protect, Detect, Respond, Recover
    total_gaps_count: int
    critical_gaps_count: int


class AuditPackageExportRequest(BaseModel):
    framework_ids: List[str] = []
    include_evidence_hashes: bool = True
    include_risk_quantification: bool = True
    format: str = Field(default="JSON", pattern="^(JSON|PDF|CSV)$")
