from sqlalchemy import Column, String, DateTime, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.base import TimestampMixin, TenantMixin, generate_uuid


class User(Base, TimestampMixin, TenantMixin):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), nullable=False, unique=True, index=True)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="SOC Analyst")
    # Roles: "Board Viewer", "CFO", "CISO", "SOC Analyst", "GRC Analyst", "IT Owner", "Auditor", "Org Admin", "Platform Admin"
    status = Column(String(20), nullable=False, default="active")  # active, suspended, pending
    last_login_at = Column(DateTime, nullable=True)
    custom_permissions = Column(JSON, default=list)

    # Relationships
    organization = relationship("Organization", back_populates="users")
