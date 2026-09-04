from sqlalchemy import Column, String, Float, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.base import TimestampMixin, generate_uuid


class Organization(Base, TimestampMixin):
    __tablename__ = "organizations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False, unique=True, index=True)
    legal_name = Column(String(255), nullable=True)
    industry = Column(String(100), nullable=False, default="Financial Services")
    country = Column(String(100), nullable=False, default="India")
    timezone = Column(String(50), nullable=False, default="Asia/Kolkata")
    currency = Column(String(10), nullable=False, default="INR")
    risk_appetite = Column(Float, nullable=False, default=10000000.0)  # e.g. ₹1 Crore default
    default_frameworks = Column(JSON, default=lambda: ["NIST CSF 2.0", "SEBI CSCRF", "ISO/IEC 27001"])
    settings = Column(JSON, default=dict)

    # Relationships
    users = relationship("User", back_populates="organization", cascade="all, delete-orphan")
    assets = relationship("Asset", back_populates="organization", cascade="all, delete-orphan")
    business_services = relationship("BusinessService", back_populates="organization", cascade="all, delete-orphan")
    vulnerabilities = relationship("Vulnerability", back_populates="organization", cascade="all, delete-orphan")
    threats = relationship("Threat", back_populates="organization", cascade="all, delete-orphan")
    controls = relationship("Control", back_populates="organization", cascade="all, delete-orphan")
    evidence_records = relationship("Evidence", back_populates="organization", cascade="all, delete-orphan")
    risk_scenarios = relationship("RiskScenario", back_populates="organization", cascade="all, delete-orphan")
    investments = relationship("Investment", back_populates="organization", cascade="all, delete-orphan")
    portfolios = relationship("InvestmentPortfolio", back_populates="organization", cascade="all, delete-orphan")
    incidents = relationship("Incident", back_populates="organization", cascade="all, delete-orphan")
    vendors = relationship("ThirdPartyVendor", back_populates="organization", cascade="all, delete-orphan")
    audit_events = relationship("AuditEvent", back_populates="organization", cascade="all, delete-orphan")
