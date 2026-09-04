from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field


class ControlCreate(BaseModel):
    name: str = Field(..., example="Phishing-Resistant Hardware MFA")
    description: Optional[str] = "FIDO2 WebAuthn authentication for all administrative access."
    category: str = Field(default="Preventive")
    implementation_percentage: float = Field(default=0.85, ge=0.0, le=1.0)
    coverage_percentage: float = Field(default=0.80, ge=0.0, le=1.0)
    test_effectiveness: float = Field(default=0.90, ge=0.0, le=1.0)
    failure_rate: float = Field(default=0.05, ge=0.0, le=1.0)
    maintenance_cost: float = Field(default=500000.0)
    framework_mappings: List[Dict[str, Any]] = Field(default_factory=list)


class ControlUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    status: Optional[str] = None
    implementation_percentage: Optional[float] = Field(None, ge=0.0, le=1.0)
    coverage_percentage: Optional[float] = Field(None, ge=0.0, le=1.0)
    test_effectiveness: Optional[float] = Field(None, ge=0.0, le=1.0)
    failure_rate: Optional[float] = Field(None, ge=0.0, le=1.0)
    maintenance_cost: Optional[float] = None
    framework_mappings: Optional[List[Dict[str, Any]]] = None


class ControlResponse(BaseModel):
    id: str
    organization_id: str
    name: str
    description: Optional[str] = None
    category: str
    owner_id: Optional[str] = None
    status: str
    implementation_percentage: float
    coverage_percentage: float
    test_effectiveness: float
    failure_rate: float
    effectiveness_score: float
    last_tested_at: Optional[datetime] = None
    next_test_due_at: Optional[datetime] = None
    maintenance_cost: float
    framework_mappings: List[Dict[str, Any]] = []
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ControlEffectivenessDetail(BaseModel):
    control_id: str
    control_name: str
    calculated_strength: float
    formula_explanation: str
    coverage: float
    implementation_quality: float
    evidence_freshness: float
    test_effectiveness: float
    failure_rate: float
    evidence_citations: List[Dict[str, Any]] = []
