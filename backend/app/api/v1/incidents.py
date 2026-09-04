from fastapi import APIRouter, Depends, status
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.api.deps import get_current_user, require_permission
from app.models.user import User
from app.models.incident import Incident
from app.schemas.incident import IncidentCreate, IncidentResponse
from app.schemas.common import ResponseEnvelope
from app.services.audit_service import AuditService

router = APIRouter(prefix="/incidents", tags=["Incidents & Resilience"])


@router.get("", response_model=ResponseEnvelope[List[IncidentResponse]])
async def list_incidents(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Incident).where(Incident.organization_id == current_user.organization_id)
    res = await db.execute(stmt)
    incidents = res.scalars().all()
    return ResponseEnvelope(data=[IncidentResponse.model_validate(i) for i in incidents])


@router.post("", response_model=ResponseEnvelope[IncidentResponse], status_code=status.HTTP_201_CREATED)
async def create_incident(
    req: IncidentCreate,
    current_user: User = Depends(require_permission("incident:manage")),
    db: AsyncSession = Depends(get_db)
):
    inc = Incident(
        organization_id=current_user.organization_id,
        **req.model_dump()
    )
    db.add(inc)
    await db.commit()
    await db.refresh(inc)

    await AuditService.log_event(
        db,
        organization_id=current_user.organization_id,
        actor_id=current_user.id,
        action="incident:create",
        resource_type="incident",
        resource_id=inc.id,
        new_value=req.model_dump()
    )

    return ResponseEnvelope(data=IncidentResponse.model_validate(inc))
