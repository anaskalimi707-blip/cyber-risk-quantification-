from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field


class AssetCreate(BaseModel):
    name: str = Field(..., example="api-gateway-prod-01")
    asset_type: str = Field(default="API Gateway", example="API Gateway")
    hostname: Optional[str] = "gw.prod.cyberoptix.internal"
    ip_address: Optional[str] = "10.0.4.15"
    cloud_account: Optional[str] = "aws-prod-12345678"
    environment: str = Field(default="Production")
    business_service_id: Optional[str] = None
    criticality: str = Field(default="Critical")
    data_classification: str = Field(default="Restricted")
    internet_exposed: bool = True
    source_system: str = Field(default="AWS Integration")
    normalized_data: Dict[str, Any] = Field(default_factory=dict)


class AssetUpdate(BaseModel):
    name: Optional[str] = None
    asset_type: Optional[str] = None
    hostname: Optional[str] = None
    ip_address: Optional[str] = None
    business_service_id: Optional[str] = None
    criticality: Optional[str] = None
    data_classification: Optional[str] = None
    internet_exposed: Optional[bool] = None
    lifecycle_status: Optional[str] = None


class AssetResponse(BaseModel):
    id: str
    organization_id: str
    external_id: Optional[str] = None
    name: str
    asset_type: str
    hostname: Optional[str] = None
    ip_address: Optional[str] = None
    cloud_account: Optional[str] = None
    environment: str
    owner_id: Optional[str] = None
    business_service_id: Optional[str] = None
    criticality: str
    data_classification: str
    internet_exposed: bool
    lifecycle_status: str
    first_seen_at: datetime
    last_seen_at: datetime
    source_system: str
    normalized_data: Dict[str, Any] = {}
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class AssetRiskContribution(BaseModel):
    asset_id: str
    asset_name: str
    expected_annual_loss_contribution: float
    percentage_of_total_risk: float
    active_vulnerabilities_count: int
    attack_path_depth: int
    top_cve: Optional[str] = None


class AttackPathNode(BaseModel):
    id: str
    type: str  # internet, asset, service, database
    name: str
    status: str
    exploit_chain: List[str] = []


class AttackPathResponse(BaseModel):
    asset_id: str
    target_business_service: Optional[str] = None
    likelihood: float
    nodes: List[AttackPathNode]
    edges: List[Dict[str, str]]
