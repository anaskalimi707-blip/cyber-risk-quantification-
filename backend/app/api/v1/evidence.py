import hashlib
from fastapi import APIRouter, Depends, status, UploadFile, File
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.api.deps import get_current_user, require_permission
from app.models.user import User
from app.models.evidence import Evidence
from app.schemas.evidence import EvidenceCreate, EvidenceResponse, EvidenceVerificationResponse
from app.schemas.common import ResponseEnvelope
from app.services.evidence_service import EvidenceService
from app.services.audit_service import AuditService
from app.core.errors import CyberOptixException

router = APIRouter(prefix="/evidence", tags=["Evidence & Veracity Engine"])


@router.get("", response_model=ResponseEnvelope[List[EvidenceResponse]])
async def list_evidence(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Evidence).where(Evidence.organization_id == current_user.organization_id)
    res = await db.execute(stmt)
    ev_list = res.scalars().all()
    return ResponseEnvelope(data=[EvidenceResponse.model_validate(e) for e in ev_list])


@router.post("", response_model=ResponseEnvelope[EvidenceResponse], status_code=status.HTTP_201_CREATED)
async def create_evidence(
    req: EvidenceCreate,
    current_user: User = Depends(require_permission("evidence:upload")),
    db: AsyncSession = Depends(get_db)
):
    ev = Evidence(
        organization_id=current_user.organization_id,
        created_by=current_user.id,
        **req.model_dump()
    )
    db.add(ev)
    await db.commit()
    await db.refresh(ev)

    await AuditService.log_event(
        db,
        organization_id=current_user.organization_id,
        actor_id=current_user.id,
        action="evidence:create",
        resource_type="evidence",
        resource_id=ev.id,
        new_value={"content_hash": ev.content_hash, "type": ev.evidence_type}
    )

    return ResponseEnvelope(data=EvidenceResponse.model_validate(ev))


@router.post("/upload", response_model=ResponseEnvelope[EvidenceResponse])
async def upload_evidence_file(
    file: UploadFile = File(...),
    current_user: User = Depends(require_permission("evidence:upload")),
    db: AsyncSession = Depends(get_db)
):
    contents = await file.read()
    content_hash = hashlib.sha256(contents).hexdigest()

    ev = Evidence(
        organization_id=current_user.organization_id,
        evidence_type="Audit File Upload",
        source_system="Manual Secure Upload",
        file_uri=f"storage/evidence/{file.filename}",
        content_hash=content_hash,
        reliability_score=0.98,
        created_by=current_user.id
    )
    db.add(ev)
    await db.commit()
    await db.refresh(ev)

    return ResponseEnvelope(data=EvidenceResponse.model_validate(ev))


@router.get("/{evidence_id}/verify", response_model=ResponseEnvelope[EvidenceVerificationResponse])
async def verify_evidence(
    evidence_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res = await EvidenceService.verify_evidence(db, evidence_id, current_user.organization_id)
    return ResponseEnvelope(data=res)
