from fastapi import APIRouter, Depends, status, Query
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.api.deps import get_current_user, require_permission
from app.models.user import User
from app.models.business_service import BusinessService
from app.schemas.business_service import BusinessServiceCreate, BusinessServiceUpdate, BusinessServiceResponse, BusinessServiceRiskResponse
from app.schemas.common import ResponseEnvelope, MetaData
from app.services.audit_service import AuditService
from app.core.errors import CyberOptixException

router = APIRouter(prefix="/business-services", tags=["Business Services & Context"])


@router.get("", response_model=ResponseEnvelope[List[BusinessServiceResponse]])
async def list_business_services(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(BusinessService).where(BusinessService.organization_id == current_user.organization_id)
    res = await db.execute(stmt)
    services = res.scalars().all()
    return ResponseEnvelope(data=[BusinessServiceResponse.model_validate(s) for s in services])


@router.post("", response_model=ResponseEnvelope[BusinessServiceResponse], status_code=status.HTTP_201_CREATED)
async def create_business_service(
    req: BusinessServiceCreate,
    current_user: User = Depends(require_permission("business_service:manage")),
    db: AsyncSession = Depends(get_db)
):
    svc = BusinessService(
        organization_id=current_user.organization_id,
        owner_id=current_user.id,
        **req.model_dump()
    )
    db.add(svc)
    await db.commit()
    await db.refresh(svc)

    await AuditService.log_event(
        db,
        organization_id=current_user.organization_id,
        actor_id=current_user.id,
        action="business_service:create",
        resource_type="business_service",
        resource_id=svc.id,
        new_value=req.model_dump()
    )

    return ResponseEnvelope(data=BusinessServiceResponse.model_validate(svc))


@router.get("/{service_id}", response_model=ResponseEnvelope[BusinessServiceResponse])
async def get_business_service(
    service_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(BusinessService).where(BusinessService.id == service_id, BusinessService.organization_id == current_user.organization_id)
    svc = (await db.execute(stmt)).scalars().first()
    if not svc:
        raise CyberOptixException(status_code=status.HTTP_404_NOT_FOUND, title="Service Not Found", detail=f"Business Service {service_id} not found.")
    return ResponseEnvelope(data=BusinessServiceResponse.model_validate(svc))


@router.get("/{service_id}/risk", response_model=ResponseEnvelope[BusinessServiceRiskResponse])
async def get_business_service_risk(
    service_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(BusinessService).where(BusinessService.id == service_id, BusinessService.organization_id == current_user.organization_id)
    svc = (await db.execute(stmt)).scalars().first()
    if not svc:
        raise CyberOptixException(status_code=status.HTTP_404_NOT_FOUND, title="Service Not Found", detail=f"Business Service {service_id} not found.")

    return ResponseEnvelope(
        data=BusinessServiceRiskResponse(
            service_id=svc.id,
            service_name=svc.name,
            total_expected_annual_loss=900000.0,
            maximum_single_event_loss=50000000.0,
            risk_appetite_breached=False,
            underlying_assets_count=4,
            critical_vulnerabilities_count=1,
            top_threat_scenarios=[
                {"name": "Ransomware affecting Payment Processing", "expected_annual_loss": 900000.0}
            ]
        )
    )
