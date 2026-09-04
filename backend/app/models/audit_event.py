from sqlalchemy import Column, String, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base
from app.models.base import generate_uuid


class AuditEvent(Base):
    __tablename__ = "audit_events"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    actor_id = Column(String(36), nullable=True, index=True)  # User ID or 'system:connector'
    action = Column(String(100), nullable=False, index=True)  # e.g. "risk:calculate", "investment:approve", "evidence:upload"
    resource_type = Column(String(100), nullable=False, index=True) # e.g. "risk_scenario", "investment_portfolio"
    resource_id = Column(String(255), nullable=False, index=True)
    previous_value = Column(JSON, nullable=True)
    new_value = Column(JSON, nullable=True)
    reason = Column(String(1000), nullable=True)
    ip_address = Column(String(100), nullable=True)
    user_agent = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False, index=True)
    tamper_hash = Column(String(64), nullable=False)  # Cryptographically chained SHA-256 hash

    # Relationships
    organization = relationship("Organization", back_populates="audit_events")
