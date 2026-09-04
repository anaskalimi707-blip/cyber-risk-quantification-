from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class InvestmentCreate(BaseModel):
    name: str = Field(..., json_schema_extra={"example": "Phishing-Resistant FIDO2 MFA"})
    description: Optional[str] = "Enforce hardware security keys for all privileged access."
    category: str = Field(default="Identity & Access")
    initial_cost: float = Field(default=2500000.0, description="Cost in currency (e.g. ₹25 Lakh)")
    recurring_cost: float = Field(default=300000.0, description="Annual maintenance (e.g. ₹3 Lakh)")
    implementation_time: int = Field(default=60, description="Days to implement")
    operational_impact: str = Field(default="Low")
    dependencies: List[str] = Field(default_factory=list)
    affected_controls: List[str] = Field(default_factory=list)
    affected_scenarios: List[str] = Field(default_factory=list)
    compliance_contribution: float = Field(default=0.25)
    resilience_contribution: float = Field(default=0.30)
    expected_risk_reduction_pct: float = Field(default=0.45)


class InvestmentResponse(BaseModel):
    id: str
    organization_id: str
    name: str
    description: Optional[str] = None
    category: str
    owner_id: Optional[str] = None
    initial_cost: float
    recurring_cost: float
    implementation_time: int
    operational_impact: str
    dependencies: List[str] = []
    affected_controls: List[str] = []
    affected_scenarios: List[str] = []
    compliance_contribution: float
    resilience_contribution: float
    expected_risk_reduction_pct: float
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class PortfolioOptimizationRequest(BaseModel):
    budget: float = Field(..., gt=0, description="Total budget in currency (e.g. ₹10,000,000)")
    planning_period: str = Field(default="FY 2026-2027")
    objective: str = Field(default="Maximize Total Risk Reduction")  # Maximize Total Risk Reduction, Maximize ROI, Highest Compliance
    mandatory_investment_ids: List[str] = Field(default_factory=list)
    max_implementation_days: Optional[int] = 365
    candidate_investment_ids: Optional[List[str]] = None


class PortfolioResponse(BaseModel):
    id: str
    organization_id: str
    name: str
    selected_investments: List[InvestmentResponse] = []
    budget: float
    planning_period: str
    objective: str
    expected_risk_reduction: float
    residual_risk: float
    total_cost: float
    risk_reduction_roi: float
    confidence_interval: Dict[str, Any] = {}
    assumptions: List[Any] = []
    optimization_version: str
    status: str
    approved_by: Optional[str] = None
    approved_at: Optional[datetime] = None
    rejection_reason: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class PortfolioApprovalRequest(BaseModel):
    action: str = Field(..., pattern="^(approve|reject)$")
    reason: Optional[str] = "Approved by CFO/CISO based on high risk reduction ROI."
