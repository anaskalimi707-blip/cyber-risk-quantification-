from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field


class MonteCarloSimulationRequest(BaseModel):
    scenario_id: str
    iterations: int = Field(default=10000, ge=1000, le=100000)
    random_seed: Optional[int] = 42
    
    # Overrides for what-if probabilistic distributions
    threat_event_frequency_lambda: Optional[float] = None
    vulnerability_probability_mode: Optional[float] = None
    control_strength_override: Optional[float] = None
    loss_magnitude_median: Optional[float] = None
    loss_magnitude_p95: Optional[float] = None


class MonteCarloSimulationResult(BaseModel):
    simulation_id: str
    scenario_id: str
    iterations: int
    random_seed: Optional[int]
    expected_annual_loss: float
    median_loss: float
    percentile_90_loss: float
    percentile_95_loss: float
    value_at_risk_95: float
    expected_shortfall: float
    confidence_interval_90: Dict[str, float]
    histogram_bins: List[Dict[str, Any]]
    loss_exceedance_curve: List[Dict[str, Any]]
    sensitivity_rankings: List[Dict[str, Any]]
    execution_time_ms: float
    simulated_at: datetime


class WhatIfSimulationRequest(BaseModel):
    scenario_id: str
    name: str = Field(default="What-If: Deploy FIDO2 MFA & Microsegmentation")
    modified_controls: List[Dict[str, Any]] = Field(default_factory=list) # [{"control_id": "...", "new_coverage": 0.98}]
    budget_delta: Optional[float] = 0.0
    threat_frequency_multiplier: Optional[float] = 1.0


class WhatIfComparisonResponse(BaseModel):
    scenario_id: str
    scenario_name: str
    baseline: Dict[str, Any]
    projected: Dict[str, Any]
    difference: Dict[str, Any]  # {"risk_reduction_amount": 620000, "risk_reduction_pct": 68.8, "cost_incurred": 2500000}
    roi: float
    recommendation: str
