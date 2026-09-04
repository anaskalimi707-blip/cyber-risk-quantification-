from sqlalchemy import Column, String, Float, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base
from app.models.base import TimestampMixin, TenantMixin, generate_uuid


class Control(Base, TimestampMixin, TenantMixin):
    __tablename__ = "controls"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False, index=True)
    description = Column(String(1000), nullable=True)
    category = Column(String(100), nullable=False, default="Preventive")  # Preventive, Detective, Responsive, Corrective
    owner_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    status = Column(String(50), nullable=False, default="Operational")  # Operational, Degraded, Failed, Planned
    
    # Mathematical effectiveness factors
    implementation_percentage = Column(Float, nullable=False, default=0.85)  # 0.0 - 1.0
    coverage_percentage = Column(Float, nullable=False, default=0.80)        # 0.0 - 1.0
    test_effectiveness = Column(Float, nullable=False, default=0.90)         # 0.0 - 1.0
    failure_rate = Column(Float, nullable=False, default=0.05)               # 0.0 - 1.0
    effectiveness_score = Column(Float, nullable=False, default=0.64)        # Computed compound strength
    
    last_tested_at = Column(DateTime, nullable=True)
    next_test_due_at = Column(DateTime, nullable=True)
    maintenance_cost = Column(Float, nullable=False, default=500000.0)  # INR per year
    framework_mappings = Column(JSON, default=list)  # e.g. [{"framework": "NIST CSF 2.0", "ref": "PR.AC-1"}]

    # Relationships
    organization = relationship("Organization", back_populates="controls")
