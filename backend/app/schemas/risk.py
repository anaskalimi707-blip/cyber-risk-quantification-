from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class RiskScenarioCreate(BaseModel):
    name: str = Field(..., json_schema_extra={"example": "Ransomware affecting Core Payment Gateway"})
    description: Optional[str] = "Adversary exploits external API vulnerability, performs lateral movement, and deploys ransomware."
    threat_id: Optional[str] = None
    attack_techniques: List[str] = Field(default_factory=lambda: ["T1486", "T1078"])
    affected_assets: List[str] = Field(default_factory=list)
    affected_business_services: List[str] = Field(default_factory=list)
    risk_tolerance: float = Field(default=5000000.0, description="Risk tolerance in currency (e.g. ₹50 Lakh)")
    assumptions: Dict[str, Any] = Field(default_factory=dict)


class RiskCalculationResponse(BaseModel):
    id: str
    scenario_id: str
    calculation_run_id: str
    model_version: str
    threat_event_frequency: float
    vulnerability_factor: float
    control_strength: float
    probability_of_success: float
    loss_magnitude_distribution: Dict[str, Any] = {}
    expected_annual_loss: float
    median_loss: float
    percentile_90_loss: float
    percentile_95_loss: float
    value_at_risk: float
    expected_shortfall: float
    confidence_interval: Dict[str, Any] = {}
    assumptions: List[Any] = []
    evidence_references: List[Any] = []
    simulation_histogram: List[Dict[str, Any]] = []
    loss_exceedance_curve: List[Dict[str, Any]] = []
    calculated_at: datetime
    triggered_by: str

    model_config = ConfigDict(from_attributes=True)


class RiskScenarioResponse(BaseModel):
    id: str
    organization_id: str
    name: str
    description: Optional[str] = None
    threat_id: Optional[str] = None
    attack_techniques: List[str] = []
    affected_assets: List[str] = []
    affected_business_services: List[str] = []
    risk_owner_id: Optional[str] = None
    status: str
    risk_tolerance: float
    assumptions: Dict[str, Any] = {}
    model_version: str
    confidence: str
    data_quality_score: float
    last_calculated_at: Optional[datetime] = None
    treatment_type: Optional[str] = None
    treatment_rationale: Optional[str] = None
    treatment_approved_by: Optional[str] = None
    treatment_approved_at: Optional[datetime] = None
    latest_calculation: Optional[RiskCalculationResponse] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class RiskTreatmentRequest(BaseModel):
    treatment_type: str = Field(..., pattern="^(Mitigate|Accept|Transfer|Avoid)$")
    rationale: str = Field(..., min_length=10)
    target_risk_reduction_pct: Optional[float] = None
    insurance_policy_reference: Optional[str] = None


class ExecutiveDashboardResponse(BaseModel):
    organization_name: str
    currency: str
    period: str = "For the period ending 3 September 2026"
    money_at_risk_today_inr: float = 184000000.0
    risk_appetite_limit_inr: float = 100000000.0
    appetite_exceedance_pct: float = 8.0
    expected_annual_loss_inr: float = 86000000.0
    confidence_level: str = "Medium"
    high_risk_services_count: int = 3
    risk_reduced_quarter_inr: float = 21000000.0
    risk_reduced_quarter_vs_plan_pct: float = 18.0
    data_quality_pct: float = 86.0
    trend_90d: List[Dict[str, Any]] = []
    what_needs_attention: List[Dict[str, Any]] = []
    service_breakdown: List[Dict[str, Any]] = []
    investment_performance: Dict[str, Any] = {}
    regulatory_readiness: Dict[str, Any] = {}



class CISODashboardResponse(BaseModel):
    organization_name: str
    total_assets: int
    unpatched_critical_cves: int
    mean_control_effectiveness: float
    evidence_freshness_pct: float
    data_quality_index: float
    top_attack_paths: List[Dict[str, Any]] = []
    remediation_queue: List[Dict[str, Any]] = []
    recent_incidents: List[Dict[str, Any]] = []
