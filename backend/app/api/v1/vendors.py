from fastapi import APIRouter, Depends, status
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.vendor import ThirdPartyVendor
from app.schemas.vendor import VendorCreate, VendorResponse, VendorRiskResponse
from app.schemas.common import ResponseEnvelope

router = APIRouter(prefix="/vendors", tags=["Third-Party & Vendor Risk"])


@router.get("", response_model=ResponseEnvelope[List[VendorResponse]])
async def list_vendors(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(ThirdPartyVendor).where(ThirdPartyVendor.organization_id == current_user.organization_id)
    res = await db.execute(stmt)
    vendors = res.scalars().all()
    return ResponseEnvelope(data=[VendorResponse.model_validate(v) for v in vendors])


@router.get("/{vendor_id}/risk", response_model=ResponseEnvelope[VendorRiskResponse])
async def get_vendor_risk(
    vendor_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(ThirdPartyVendor).where(ThirdPartyVendor.id == vendor_id, ThirdPartyVendor.organization_id == current_user.organization_id)
    vendor = (await db.execute(stmt)).scalars().first()
    vendor_name = vendor.name if vendor else "Cloud Provider"

    return ResponseEnvelope(
        data=VendorRiskResponse(
            vendor_id=vendor_id,
            vendor_name=vendor_name,
            financial_exposure=2500000.0,
            inherent_risk_rating="High",
            security_score=82.0,
            fourth_party_risk_count=2,
            recommendations=[
                "Require quarterly SOC 2 Type II audit attestations",
                "Ensure contractual SLA of 99.99% with dedicated DDoS mitigations"
            ]
        )
    )
