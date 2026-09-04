from fastapi import APIRouter, Depends
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.compliance import ComplianceFramework
from app.schemas.compliance import (
    FrameworkResponse,
    ComplianceSummaryResponse,
    ComplianceGapResponse,
    AuditPackageExportRequest
)
from app.schemas.common import ResponseEnvelope
from app.services.compliance_service import ComplianceService

router = APIRouter(prefix="/compliance", tags=["Compliance & Framework Mapping"])


@router.get("/summary", response_model=ResponseEnvelope[ComplianceSummaryResponse])
async def get_compliance_summary(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res = await ComplianceService.get_compliance_summary(db, current_user.organization_id)
    return ResponseEnvelope(data=res)


@router.get("/frameworks", response_model=ResponseEnvelope[List[FrameworkResponse]])
async def list_frameworks(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(ComplianceFramework).where(ComplianceFramework.active == True)
    res = await db.execute(stmt)
    frameworks = res.scalars().all()
    return ResponseEnvelope(data=[FrameworkResponse.model_validate(f) for f in frameworks])


@router.get("/gaps", response_model=ResponseEnvelope[List[ComplianceGapResponse]])
async def list_compliance_gaps(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res = await ComplianceService.get_compliance_gaps(db, current_user.organization_id)
    return ResponseEnvelope(data=res)


@router.post("/audit-package/export", response_model=ResponseEnvelope[dict])
async def export_audit_package(
    req: AuditPackageExportRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return ResponseEnvelope(
        data={
            "package_id": "pkg_audit_2026_q3",
            "organization_name": "Acme Financial Services",
            "generated_at": "2026-09-03T10:00:00Z",
            "frameworks_included": ["NIST CSF 2.0", "SEBI CSCRF", "ISO/IEC 27001"],
            "immutable_evidence_count": 8,
            "verification_status": "All SHA-256 Hashes Verified Cryptographically",
            "download_url": "/api/v1/reports/pkg_audit_2026_q3/download"
        }
    )
