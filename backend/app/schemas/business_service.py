from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field


class BusinessServiceCreate(BaseModel):
    name: str = Field(..., example="UPI & NetBanking Payment Gateway")
    description: Optional[str] = "High-throughput real-time payment settlement engine."
    business_unit: str = Field(default="Payments & Settlement")
    criticality: str = Field(default="Critical")
    revenue_dependency: float = Field(default=50000000.0, description="Financial loss per day of downtime in currency (e.g. ₹5 Crore)")
    regulatory_importance: str = Field(default="Critical")
    recovery_time_objective: float = Field(default=2.0, description="RTO in hours")
    recovery_point_objective: float = Field(default=0.5, description="RPO in hours")
    maximum_tolerable_downtime: float = Field(default=4.0, description="MTD in hours")
    dependencies: List[str] = Field(default_factory=list)


class BusinessServiceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    business_unit: Optional[str] = None
    criticality: Optional[str] = None
    revenue_dependency: Optional[float] = None
    regulatory_importance: Optional[str] = None
    recovery_time_objective: Optional[float] = None
    recovery_point_objective: Optional[float] = None
    maximum_tolerable_downtime: Optional[float] = None
    dependencies: Optional[List[str]] = None


class BusinessServiceResponse(BaseModel):
    id: str
    organization_id: str
    name: str
    description: Optional[str] = None
    owner_id: Optional[str] = None
    business_unit: str
    criticality: str
    revenue_dependency: float
    regulatory_importance: str
    recovery_time_objective: float
    recovery_point_objective: float
    maximum_tolerable_downtime: float
    dependencies: List[str] = []
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class BusinessServiceRiskResponse(BaseModel):
    service_id: str
    service_name: str
    total_expected_annual_loss: float
    maximum_single_event_loss: float
    risk_appetite_breached: bool
    underlying_assets_count: int
    critical_vulnerabilities_count: int
    top_threat_scenarios: List[Dict[str, Any]] = []
