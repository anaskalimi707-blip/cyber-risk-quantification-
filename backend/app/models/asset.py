from sqlalchemy import Column, String, Boolean, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base
from app.models.base import TimestampMixin, TenantMixin, generate_uuid


class Asset(Base, TimestampMixin, TenantMixin):
    __tablename__ = "assets"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    external_id = Column(String(255), nullable=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    asset_type = Column(String(100), nullable=False, default="Server")  # Server, Database, Kubernetes, Endpoint, Cloud Service, API Gateway
    hostname = Column(String(255), nullable=True)
    ip_address = Column(String(100), nullable=True)
    cloud_account = Column(String(100), nullable=True)  # AWS / Azure / GCP Account ID
    environment = Column(String(50), nullable=False, default="Production")  # Production, Staging, Development
    owner_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    business_service_id = Column(String(36), ForeignKey("business_services.id", ondelete="SET NULL"), nullable=True)
    criticality = Column(String(50), nullable=False, default="High")  # Critical, High, Medium, Low
    data_classification = Column(String(50), nullable=False, default="Restricted")  # Public, Internal, Confidential, Restricted
    internet_exposed = Column(Boolean, default=False, nullable=False)
    lifecycle_status = Column(String(50), nullable=False, default="Active")  # Active, Decommissioned, Maintenance
    first_seen_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    last_seen_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    source_system = Column(String(100), nullable=False, default="CMDB / AWS Integration")
    source_record_id = Column(String(255), nullable=True)
    normalized_data = Column(JSON, default=dict)

    # Relationships
    organization = relationship("Organization", back_populates="assets")
    business_service = relationship("BusinessService", back_populates="assets")
    vulnerabilities = relationship("Vulnerability", back_populates="affected_asset", cascade="all, delete-orphan")
