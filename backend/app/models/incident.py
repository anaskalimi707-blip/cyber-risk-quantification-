from sqlalchemy import Column, String, Float, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base
from app.models.base import TimestampMixin, TenantMixin, generate_uuid


class Incident(Base, TimestampMixin, TenantMixin):
    __tablename__ = "incidents"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    incident_number = Column(String(50), nullable=False, unique=True, index=True)  # INC-2026-001
    title = Column(String(255), nullable=False)
    type = Column(String(100), nullable=False, default="Ransomware Outbreak")
    severity = Column(String(50), nullable=False, default="Critical")  # Critical, High, Medium, Low
    status = Column(String(50), nullable=False, default="Contained")   # Detected, Contained, Eradicated, Recovered, Closed
    
    discovered_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    contained_at = Column(DateTime, nullable=True)
    recovered_at = Column(DateTime, nullable=True)
    
    affected_assets = Column(JSON, default=list)
    affected_business_services = Column(JSON, default=list)
    estimated_loss = Column(Float, nullable=False, default=15000000.0)  # Initial estimated loss (₹1.5 Crore)
    actual_loss = Column(Float, nullable=True)                          # Realized loss after recovery
    root_cause = Column(String(2000), nullable=True)
    control_failures = Column(JSON, default=list)                      # Controls that failed during incident
    lessons_learned = Column(String(2000), nullable=True)
    related_risk_scenarios = Column(JSON, default=list)

    # Relationships
    organization = relationship("Organization", back_populates="incidents")
