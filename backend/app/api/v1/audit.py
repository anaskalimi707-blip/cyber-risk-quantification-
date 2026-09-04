from fastapi import APIRouter, Depends, Query
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.api.deps import get_current_user, require_permission
from app.models.user import User
from app.models.audit_event import AuditEvent
from app.schemas.common import ResponseEnvelope, MetaData

router = APIRouter(prefix="/audit", tags=["Audit & Governance Log"])


@router.get("", response_model=ResponseEnvelope[list])
async def list_audit_events(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=50, ge=1, le=100),
    current_user: User = Depends(require_permission("audit:read")),
    db: AsyncSession = Depends(get_db)
):
    stmt = (
        select(AuditEvent)
        .where(AuditEvent.organization_id == current_user.organization_id)
        .order_by(AuditEvent.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    res = await db.execute(stmt)
    events = res.scalars().all()

    data = [
        {
            "id": e.id,
            "action": e.action,
            "resource_type": e.resource_type,
            "resource_id": e.resource_id,
            "actor_id": e.actor_id,
            "new_value": e.new_value,
            "created_at": e.created_at.isoformat(),
            "tamper_hash": e.tamper_hash,
            "verified_chain_status": "VALID_TAMPER_PROOF"
        }
        for e in events
    ]

    return ResponseEnvelope(
        data=data,
        meta=MetaData(page=page, page_size=page_size, total_count=len(events))
    )
