from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class EvidenceCreate(BaseModel):
    evidence_type: str = Field(default="Configuration Log", json_schema_extra={"example": "Configuration Log"})
    source_system: str = Field(default="AWS GuardDuty / Okta", json_schema_extra={"example": "AWS GuardDuty / Okta"})
    source_record_id: Optional[str] = None
    file_uri: Optional[str] = None
    content_hash: str = Field(..., json_schema_extra={"example": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"})
    valid_from: Optional[datetime] = None
    valid_until: Optional[datetime] = None
    reliability_score: float = Field(default=0.95, ge=0.0, le=1.0)
    related_assets: List[str] = Field(default_factory=list)
    related_controls: List[str] = Field(default_factory=list)
    related_risks: List[str] = Field(default_factory=list)
    metadata_json: Dict[str, Any] = Field(default_factory=dict)


class EvidenceResponse(BaseModel):
    id: str
    organization_id: str
    evidence_type: str
    source_system: str
    source_record_id: Optional[str] = None
    file_uri: Optional[str] = None
    content_hash: str
    collected_at: datetime
    valid_from: datetime
    valid_until: Optional[datetime] = None
    freshness_status: str
    reliability_score: float
    related_assets: List[str] = []
    related_controls: List[str] = []
    related_risks: List[str] = []
    metadata_json: Dict[str, Any] = {}
    created_by: Optional[str] = None
    version: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class EvidenceVerificationResponse(BaseModel):
    evidence_id: str
    is_valid: bool
    calculated_hash: str
    expected_hash: str
    tamper_detected: bool
    freshness_status: str
    days_until_expiration: Optional[int] = None
