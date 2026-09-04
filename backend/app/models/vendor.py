from sqlalchemy import Column, String, Float, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base
from app.models.base import TimestampMixin, TenantMixin, generate_uuid


class ThirdPartyVendor(Base, TimestampMixin, TenantMixin):
    __tablename__ = "third_party_vendors"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False, index=True)
    vendor_type = Column(String(100), nullable=False, default="Cloud / SaaS Provider")
    owner_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    criticality = Column(String(50), nullable=False, default="High")  # Critical, High, Medium, Low
    inherent_risk = Column(String(50), nullable=False, default="High")
    external_risk_score = Column(Float, nullable=False, default=78.5) # SecurityScorecard/BitSight rating 0-100
    questionnaire_status = Column(String(50), nullable=False, default="Approved") # Pending, Under_Review, Approved, Flagged
    contract_status = Column(String(50), nullable=False, default="Active")
    fourth_party_dependencies = Column(JSON, default=list) # e.g. ["AWS", "Okta", "Cloudflare"]
    incident_history = Column(JSON, default=list)
    last_assessed_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    next_assessment_at = Column(DateTime, nullable=True)

    # Relationships
    organization = relationship("Organization", back_populates="vendors")
