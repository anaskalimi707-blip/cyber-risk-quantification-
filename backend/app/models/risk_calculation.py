from sqlalchemy import Column, String, Float, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base
from app.models.base import TimestampMixin, generate_uuid


class RiskCalculation(Base, TimestampMixin):
    __tablename__ = "risk_calculations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    scenario_id = Column(String(36), ForeignKey("risk_scenarios.id", ondelete="CASCADE"), nullable=False, index=True)
    calculation_run_id = Column(String(64), nullable=False, index=True)
    model_version = Column(String(50), nullable=False, default="FAIR-2.1-Enterprise")
    
    # FAIR decomposition inputs
    threat_event_frequency = Column(Float, nullable=False, default=0.20)  # Events / year (lambda)
    vulnerability_factor = Column(Float, nullable=False, default=0.25)    # Vulnerability susceptibility
    control_strength = Column(Float, nullable=False, default=0.64)        # Effective defensive capability
    probability_of_success = Column(Float, nullable=False, default=0.09)  # Prob that threat event leads to loss
    
    # Financial Loss Distributions & Outputs (currency values, e.g. INR)
    loss_magnitude_distribution = Column(JSON, default=dict)  # {"distribution": "lognormal", "median": 50000000, "p95": 150000000}
    expected_annual_loss = Column(Float, nullable=False, default=900000.0)  # EAL in currency (₹9 Lakh)
    median_loss = Column(Float, nullable=False, default=45000000.0)
    percentile_90_loss = Column(Float, nullable=False, default=110000000.0)
    percentile_95_loss = Column(Float, nullable=False, default=150000000.0)
    value_at_risk = Column(Float, nullable=False, default=150000000.0)      # VaR (95%)
    expected_shortfall = Column(Float, nullable=False, default=180000000.0) # CVaR
    
    confidence_interval = Column(JSON, default=dict)  # {"lower_90": 200000, "upper_90": 2400000}
    assumptions = Column(JSON, default=list)
    evidence_references = Column(JSON, default=list)
    simulation_histogram = Column(JSON, default=list)  # Histogram bins for UI chart
    loss_exceedance_curve = Column(JSON, default=list) # [{loss: 1000000, prob: 0.95}, ...]
    
    calculated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    triggered_by = Column(String(100), nullable=False, default="manual_recalc")  # automated_sync, manual_recalc, what_if

    # Relationships
    scenario = relationship("RiskScenario", back_populates="calculations")
