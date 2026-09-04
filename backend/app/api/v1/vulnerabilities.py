from fastapi import APIRouter, Depends, status, Query
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.api.deps import get_current_user, require_permission
from app.models.user import User
from app.models.vulnerability import Vulnerability
from app.models.asset import Asset
from app.schemas.vulnerability import VulnerabilityCreate, VulnerabilityUpdate, VulnerabilityResponse, PrioritizedVulnerabilityResponse
from app.schemas.common import ResponseEnvelope, MetaData
from app.services.audit_service import AuditService
from app.core.errors import CyberOptixException

router = APIRouter(prefix="/vulnerabilities", tags=["Vulnerabilities & Exposures"])


@router.get("", response_model=ResponseEnvelope[List[VulnerabilityResponse]])
async def list_vulnerabilities(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Vulnerability).where(Vulnerability.organization_id == current_user.organization_id)
    res = await db.execute(stmt)
    vulns = res.scalars().all()
    return ResponseEnvelope(data=[VulnerabilityResponse.model_validate(v) for v in vulns])


@router.get("/prioritized", response_model=ResponseEnvelope[List[PrioritizedVulnerabilityResponse]])
async def get_prioritized_vulnerabilities(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Vulnerability).where(Vulnerability.organization_id == current_user.organization_id, Vulnerability.status == "Open")
    res = await db.execute(stmt)
    vulns = res.scalars().all()

    prioritized = []
    for v in vulns:
        asset_stmt = select(Asset).where(Asset.id == v.affected_asset_id)
        asset = (await db.execute(asset_stmt)).scalars().first()
        asset_name = asset.name if asset else "Unknown Asset"
        is_exp = asset.internet_exposed if asset else False
        
        # Financial Risk calculation based on exploitability & asset criticality
        exposure_inr = round(v.cvss_score * v.epss_score * (250000.0 if is_exp else 100000.0), 2)

        prioritized.append(
            PrioritizedVulnerabilityResponse(
                vulnerability_id=v.id,
                cve=v.cve,
                title=v.title,
                affected_asset_name=asset_name,
                affected_service_name="UPI & NetBanking Payment Gateway",
                financial_risk_exposure=exposure_inr,
                cvss_score=v.cvss_score,
                epss_score=v.epss_score,
                is_internet_exposed=is_exp,
                remediation_urgency="Immediate (24h)" if is_exp and v.cvss_score >= 9.0 else "High (7d)"
            )
        )
    prioritized.sort(key=lambda x: x.financial_risk_exposure, reverse=True)
    return ResponseEnvelope(data=prioritized)


@router.get("/{vulnerability_id}", response_model=ResponseEnvelope[VulnerabilityResponse])
async def get_vulnerability(
    vulnerability_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Vulnerability).where(Vulnerability.id == vulnerability_id, Vulnerability.organization_id == current_user.organization_id)
    vuln = (await db.execute(stmt)).scalars().first()
    if not vuln:
        raise CyberOptixException(status_code=status.HTTP_404_NOT_FOUND, title="Vulnerability Not Found", detail=f"Vulnerability {vulnerability_id} not found.")
    return ResponseEnvelope(data=VulnerabilityResponse.model_validate(vuln))


@router.post("/{vulnerability_id}/resolve", response_model=ResponseEnvelope[dict])
async def resolve_vulnerability(
    vulnerability_id: str,
    current_user: User = Depends(require_permission("vulnerability:manage")),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Vulnerability).where(Vulnerability.id == vulnerability_id, Vulnerability.organization_id == current_user.organization_id)
    vuln = (await db.execute(stmt)).scalars().first()
    if not vuln:
        raise CyberOptixException(status_code=status.HTTP_404_NOT_FOUND, title="Vulnerability Not Found", detail=f"Vulnerability {vulnerability_id} not found.")

    vuln.status = "Resolved"
    await db.commit()

    await AuditService.log_event(
        db,
        organization_id=current_user.organization_id,
        actor_id=current_user.id,
        action="vulnerability:resolve",
        resource_type="vulnerability",
        resource_id=vuln.id,
        new_value={"status": "Resolved"}
    )

    return ResponseEnvelope(data={"message": f"Vulnerability {vuln.cve} marked as resolved."})
