from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.api.deps import get_current_user, require_permission
from app.models.user import User
from app.models.organization import Organization
from app.schemas.common import ResponseEnvelope
from pydantic import BaseModel
from typing import Optional, List

router = APIRouter(prefix="/organizations", tags=["Organization & Governance"])


class OrgUpdate(BaseModel):
    name: Optional[str] = None
    legal_name: Optional[str] = None
    industry: Optional[str] = None
    country: Optional[str] = None
    currency: Optional[str] = None
    risk_appetite: Optional[float] = None
    default_frameworks: Optional[List[str]] = None


@router.get("/current", response_model=ResponseEnvelope[dict])
async def get_current_org(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Organization).where(Organization.id == current_user.organization_id)
    res = await db.execute(stmt)
    org = res.scalars().first()
    return ResponseEnvelope(
        data={
            "id": org.id,
            "name": org.name,
            "legal_name": org.legal_name,
            "industry": org.industry,
            "country": org.country,
            "timezone": org.timezone,
            "currency": org.currency,
            "risk_appetite": org.risk_appetite,
            "default_frameworks": org.default_frameworks,
            "created_at": org.created_at.isoformat()
        }
    )


@router.patch("/current", response_model=ResponseEnvelope[dict])
async def update_current_org(
    req: OrgUpdate,
    current_user: User = Depends(require_permission("organization:manage")),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Organization).where(Organization.id == current_user.organization_id)
    res = await db.execute(stmt)
    org = res.scalars().first()
    for field, val in req.model_dump(exclude_unset=True).items():
        setattr(org, field, val)
    await db.commit()
    await db.refresh(org)
    return ResponseEnvelope(data={"message": "Organization settings updated successfully."})


@router.get("/current/risk-appetite", response_model=ResponseEnvelope[dict])
async def get_risk_appetite(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Organization).where(Organization.id == current_user.organization_id)
    org = (await db.execute(stmt)).scalars().first()
    return ResponseEnvelope(
        data={
            "currency": org.currency,
            "risk_appetite_limit": org.risk_appetite,
            "rationale": "Approved by Board of Directors for FY 2026-2027 based on regulatory thresholds."
        }
    )
