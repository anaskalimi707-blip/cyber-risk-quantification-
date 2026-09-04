from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field


class IncidentCreate(BaseModel):
    incident_number: str = Field(..., example="INC-2026-001")
    title: str = Field(..., example="Ransomware Outbreak on Payment Gateway")
    type: str = Field(default="Ransomware Outbreak")
    severity: str = Field(default="Critical")
    affected_assets: List[str] = Field(default_factory=list)
    affected_business_services: List[str] = Field(default_factory=list)
    estimated_loss: float = Field(default=15000000.0)
    root_cause: Optional[str] = None
    related_risk_scenarios: List[str] = Field(default_factory=list)


class IncidentResponse(BaseModel):
    id: str
    organization_id: str
    incident_number: str
    title: str
    type: str
    severity: str
    status: str
    discovered_at: datetime
    contained_at: Optional[datetime] = None
    recovered_at: Optional[datetime] = None
    affected_assets: List[str] = []
    affected_business_services: List[str] = []
    estimated_loss: float
    actual_loss: Optional[float] = None
    root_cause: Optional[str] = None
    control_failures: List[str] = []
    lessons_learned: Optional[str] = None
    related_risk_scenarios: List[str] = []
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


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
