from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class BreachPredictionRequest(BaseModel):
    cvss_score: float = Field(default=9.8, ge=0.0, le=10.0, example=9.8)
    epss_score: float = Field(default=0.82, ge=0.0, le=1.0, example=0.82)
    threat_capability: str = Field(default="High", pattern="^(Low|Medium|High|Very High)$", example="High")
    asset_criticality: str = Field(default="Critical", pattern="^(Low|Medium|High|Critical)$", example="Critical")
    internet_exposed: int = Field(default=1, ge=0, le=1, example=1)
    control_coverage: float = Field(default=0.80, ge=0.0, le=1.0, example=0.80)
    control_implementation: float = Field(default=0.85, ge=0.0, le=1.0, example=0.85)
    evidence_freshness: float = Field(default=0.95, ge=0.0, le=1.0, example=0.95)
    daily_revenue_at_risk_inr: float = Field(default=50000000.0, gt=0, example=50000000.0)
    rto_hours: float = Field(default=2.0, gt=0, example=2.0)


class BreachPredictionResponse(BaseModel):
    breach_probability: float
    risk_rating: str  # Critical, High, Medium, Low
    predicted_loss_magnitude_inr: float
    expected_annual_loss_inr: float
    confidence_interval_90: Dict[str, float]
    top_risk_drivers: List[Dict[str, Any]]
    model_version: str


class MLModelMetricsResponse(BaseModel):
    classifier_metrics: Dict[str, Any]
    regressor_metrics: Dict[str, Any]
    status: str


class FeatureImportanceResponse(BaseModel):
    features: List[Dict[str, Any]]
    model_type: str = "RandomForestClassifier"
