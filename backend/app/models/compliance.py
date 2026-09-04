from sqlalchemy import Column, String, Boolean, JSON, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.base import TimestampMixin, generate_uuid


class ComplianceFramework(Base, TimestampMixin):
    __tablename__ = "compliance_frameworks"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(100), nullable=False, index=True)  # NIST CSF 2.0, SEBI CSCRF, ISO/IEC 27001, RBI Cybersecurity
    version = Column(String(50), nullable=False, default="2.0")
    country = Column(String(100), nullable=False, default="Global")
    source = Column(String(255), nullable=False, default="Official Standard Body")
    active = Column(Boolean, default=True, nullable=False)
    mapping_metadata = Column(JSON, default=dict)

    # Relationships
    requirements = relationship("ComplianceRequirement", back_populates="framework", cascade="all, delete-orphan")


class ComplianceRequirement(Base, TimestampMixin):
    __tablename__ = "compliance_requirements"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    framework_id = Column(String(36), ForeignKey("compliance_frameworks.id", ondelete="CASCADE"), nullable=False, index=True)
    requirement_id = Column(String(100), nullable=False, index=True)  # PR.AC-1, SEBI-5.2, ISO-A.9.2
    title = Column(String(255), nullable=False)
    description = Column(String(2000), nullable=True)
    category = Column(String(100), nullable=False, default="Protect")  # Govern, Identify, Protect, Detect, Respond, Recover
    related_controls = Column(JSON, default=list)  # list of control IDs
    required_evidence = Column(JSON, default=list)
    risk_relevance = Column(String(50), nullable=False, default="High")

    # Relationships
    framework = relationship("ComplianceFramework", back_populates="requirements")
