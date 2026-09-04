from sqlalchemy import Column, String, Float, JSON, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.base import TimestampMixin, TenantMixin, generate_uuid


class BusinessService(Base, TimestampMixin, TenantMixin):
    __tablename__ = "business_services"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False, index=True)
    description = Column(String(1000), nullable=True)
    owner_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    business_unit = Column(String(100), nullable=False, default="Core Banking")
    criticality = Column(String(50), nullable=False, default="Critical")  # Critical, High, Medium, Low
    revenue_dependency = Column(Float, nullable=False, default=50000000.0)  # Financial revenue at risk / day (e.g. ₹5 Cr)
    regulatory_importance = Column(String(50), nullable=False, default="High")  # Critical, High, Moderate, Low
    recovery_time_objective = Column(Float, nullable=False, default=4.0)  # RTO in hours
    recovery_point_objective = Column(Float, nullable=False, default=1.0)  # RPO in hours
    maximum_tolerable_downtime = Column(Float, nullable=False, default=8.0)  # MTD in hours
    dependencies = Column(JSON, default=list)  # list of dependent service IDs

    # Relationships
    organization = relationship("Organization", back_populates="business_services")
    assets = relationship("Asset", back_populates="business_service")
