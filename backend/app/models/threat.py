from sqlalchemy import Column, String, Float, JSON, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base
from app.models.base import TimestampMixin, TenantMixin, generate_uuid


class Threat(Base, TimestampMixin, TenantMixin):
    __tablename__ = "threats"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False, index=True)
    threat_type = Column(String(100), nullable=False, default="Ransomware")  # Ransomware, APT, Insider, Phishing, Supply Chain
    threat_actor = Column(String(255), nullable=True)  # LockBit 3.0, BlackCat, Anonymous Sudan
    motivation = Column(String(100), nullable=False, default="Financial Extortion")
    capability = Column(String(50), nullable=False, default="High")  # Very High, High, Moderate, Low
    intent = Column(String(50), nullable=False, default="High")  # High, Moderate, Low
    source = Column(String(255), nullable=False, default="Mandiant / CISA Advisory")
    confidence = Column(Float, nullable=False, default=0.85)  # 0.0 - 1.0
    last_updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    ttp_tags = Column(JSON, default=list)  # MITRE ATT&CK techniques list

    # Relationships
    organization = relationship("Organization", back_populates="threats")
    scenarios = relationship("RiskScenario", back_populates="threat")


class AttackTechnique(Base, TimestampMixin):
    __tablename__ = "attack_techniques"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    framework = Column(String(50), nullable=False, default="MITRE ATT&CK v15")
    external_id = Column(String(50), nullable=False, unique=True, index=True)  # T1486
    name = Column(String(255), nullable=False)
    description = Column(String(2000), nullable=True)
    tactics = Column(JSON, default=list)  # ["Impact", "Initial Access"]
    techniques = Column(JSON, default=list)
    data_source = Column(String(255), nullable=True)
