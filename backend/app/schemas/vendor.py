from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field


class VendorCreate(BaseModel):
    name: str = Field(..., example="CloudShield Managed SOC")
    vendor_type: str = Field(default="Cloud / SaaS Provider")
    criticality: str = Field(default="High")
    inherent_risk: str = Field(default="High")
    external_risk_score: float = Field(default=82.0)
    fourth_party_dependencies: List[str] = Field(default_factory=lambda: ["AWS", "Cloudflare"])


class VendorResponse(BaseModel):
    id: str
    organization_id: str
    name: str
    vendor_type: str
    owner_id: Optional[str] = None
    criticality: str
    inherent_risk: str
    external_risk_score: float
    questionnaire_status: str
    contract_status: str
    fourth_party_dependencies: List[str] = []
    incident_history: List[Dict[str, Any]] = []
    last_assessed_at: datetime
    next_assessment_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class VendorRiskResponse(BaseModel):
    vendor_id: str
    vendor_name: str
    financial_exposure: float
    inherent_risk_rating: str
    security_score: float
    fourth_party_risk_count: int
    recommendations: List[str] = []
