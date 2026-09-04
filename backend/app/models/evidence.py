from sqlalchemy import Column, String, Float, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base
from app.models.base import TimestampMixin, TenantMixin, generate_uuid


class Evidence(Base, TimestampMixin, TenantMixin):
    __tablename__ = "evidence"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    evidence_type = Column(String(100), nullable=False, default="Configuration Log")  # Scan Report, Config Log, IAM Policy, Penetration Test, Audit Report
    source_system = Column(String(100), nullable=False, default="AWS GuardDuty / Okta")
    source_record_id = Column(String(255), nullable=True)
    file_uri = Column(String(500), nullable=True)
    content_hash = Column(String(64), nullable=False)  # SHA-256 hash for immutable verification
    
    collected_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    valid_from = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    valid_until = Column(DateTime, nullable=True)
    freshness_status = Column(String(50), nullable=False, default="Fresh")  # Fresh, Expiring_Soon, Stale, Expired
    reliability_score = Column(Float, nullable=False, default=0.95)  # 0.0 - 1.0 based on source system veracity
    
    related_assets = Column(JSON, default=list)      # list of asset IDs
    related_controls = Column(JSON, default=list)    # list of control IDs
    related_risks = Column(JSON, default=list)       # list of risk scenario IDs
    metadata_json = Column(JSON, default=dict)
    created_by = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    version = Column(String(50), nullable=False, default="1.0")

    # Relationships
    organization = relationship("Organization", back_populates="evidence_records")
