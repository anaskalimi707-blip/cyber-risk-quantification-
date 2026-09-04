from sqlalchemy import Column, String, Float, Integer, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base
from app.models.base import TimestampMixin, TenantMixin, generate_uuid


class Investment(Base, TimestampMixin, TenantMixin):
    __tablename__ = "investments"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False, index=True)
    description = Column(String(1000), nullable=True)
    category = Column(String(100), nullable=False, default="Identity & Access")  # Identity, Data Protection, Network, Resilience
    owner_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    
    # Financials & Operational constraints
    initial_cost = Column(Float, nullable=False, default=2500000.0)      # e.g. ₹25 Lakh
    recurring_cost = Column(Float, nullable=False, default=300000.0)     # e.g. ₹3 Lakh / yr
    implementation_time = Column(Integer, nullable=False, default=60)    # In days
    operational_impact = Column(String(50), nullable=False, default="Low") # Low, Medium, High
    
    dependencies = Column(JSON, default=list)        # list of investment IDs required first
    affected_controls = Column(JSON, default=list)   # list of control IDs boosted
    affected_scenarios = Column(JSON, default=list)  # list of risk scenario IDs mitigated
    compliance_contribution = Column(Float, nullable=False, default=0.25) # 0.0 - 1.0
    resilience_contribution = Column(Float, nullable=False, default=0.30) # 0.0 - 1.0
    expected_risk_reduction_pct = Column(Float, nullable=False, default=0.45) # 45% reduction in primary scenario loss/prob
    
    status = Column(String(50), nullable=False, default="Proposed")  # Proposed, Approved, In_Progress, Deployed, Rejected

    # Relationships
    organization = relationship("Organization", back_populates="investments")


class InvestmentPortfolio(Base, TimestampMixin, TenantMixin):
    __tablename__ = "investment_portfolios"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    selected_investments = Column(JSON, default=list)  # List of investment IDs
    budget = Column(Float, nullable=False, default=10000000.0)  # Total available budget (e.g. ₹1 Crore)
    planning_period = Column(String(50), nullable=False, default="FY 2026-2027")
    objective = Column(String(100), nullable=False, default="Maximize Risk Reduction")
    constraints = Column(JSON, default=dict)
    
    expected_risk_reduction = Column(Float, nullable=False, default=0.0)  # Currency amount saved
    residual_risk = Column(Float, nullable=False, default=0.0)            # Remaining EAL
    total_cost = Column(Float, nullable=False, default=0.0)               # Total initial cost of selected investments
    risk_reduction_roi = Column(Float, nullable=False, default=0.0)       # (Risk Reduced - Cost) / Cost
    confidence_interval = Column(JSON, default=dict)
    assumptions = Column(JSON, default=list)
    optimization_version = Column(String(50), nullable=False, default="MIP-PuLP-1.0")
    
    status = Column(String(50), nullable=False, default="Draft")  # Draft, Under_Review, Approved, Rejected
    approved_by = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    approved_at = Column(DateTime, nullable=True)
    rejection_reason = Column(String(1000), nullable=True)

    # Relationships
    organization = relationship("Organization", back_populates="portfolios")
