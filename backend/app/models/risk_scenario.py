from sqlalchemy import Column, String, Float, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base
from app.models.base import TimestampMixin, TenantMixin, generate_uuid


class RiskScenario(Base, TimestampMixin, TenantMixin):
    __tablename__ = "risk_scenarios"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False, index=True)
    description = Column(String(2000), nullable=True)
    threat_id = Column(String(36), ForeignKey("threats.id", ondelete="SET NULL"), nullable=True)
    attack_techniques = Column(JSON, default=list)  # ["T1486", "T1078"]
    affected_assets = Column(JSON, default=list)    # list of asset IDs
    affected_business_services = Column(JSON, default=list)  # list of service IDs
    risk_owner_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    
    status = Column(String(50), nullable=False, default="Active")  # Active, Treated, Accepted, Transferred, Avoided
    risk_tolerance = Column(Float, nullable=False, default=5000000.0)  # Scenario specific threshold (e.g. ₹50 Lakh)
    assumptions = Column(JSON, default=dict)
    model_version = Column(String(50), nullable=False, default="FAIR-2.1-Enterprise")
    confidence = Column(String(50), nullable=False, default="High")  # High, Medium, Low
    data_quality_score = Column(Float, nullable=False, default=0.88)
    last_calculated_at = Column(DateTime, nullable=True)

    # Treatment decision fields
    treatment_type = Column(String(50), nullable=True)  # Mitigate, Accept, Transfer, Avoid
    treatment_rationale = Column(String(1000), nullable=True)
    treatment_approved_by = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    treatment_approved_at = Column(DateTime, nullable=True)

    # Relationships
    organization = relationship("Organization", back_populates="risk_scenarios")
    threat = relationship("Threat", back_populates="scenarios")
    calculations = relationship("RiskCalculation", back_populates="scenario", cascade="all, delete-orphan", order_by="desc(RiskCalculation.calculated_at)")
