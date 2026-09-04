from fastapi import APIRouter, Depends, status, Query
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.api.deps import get_current_user, require_permission
from app.models.user import User
from app.models.asset import Asset
from app.schemas.asset import AssetCreate, AssetUpdate, AssetResponse, AssetRiskContribution, AttackPathResponse
from app.schemas.common import ResponseEnvelope, MetaData
from app.services.asset_service import AssetService
from app.services.audit_service import AuditService
from app.core.errors import CyberOptixException

router = APIRouter(prefix="/assets", tags=["Asset Inventory & Business Graph"])


@router.get("", response_model=ResponseEnvelope[List[AssetResponse]])
async def list_assets(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Asset).where(Asset.organization_id == current_user.organization_id).offset((page - 1) * page_size).limit(page_size)
    res = await db.execute(stmt)
    assets = res.scalars().all()
    return ResponseEnvelope(
        data=[AssetResponse.model_validate(a) for a in assets],
        meta=MetaData(page=page, page_size=page_size, total_count=len(assets))
    )


@router.post("", response_model=ResponseEnvelope[AssetResponse], status_code=status.HTTP_201_CREATED)
async def create_asset(
    req: AssetCreate,
    current_user: User = Depends(require_permission("asset:manage")),
    db: AsyncSession = Depends(get_db)
):
    asset = Asset(
        organization_id=current_user.organization_id,
        owner_id=current_user.id,
        **req.model_dump()
    )
    db.add(asset)
    await db.commit()
    await db.refresh(asset)

    await AuditService.log_event(
        db,
        organization_id=current_user.organization_id,
        actor_id=current_user.id,
        action="asset:create",
        resource_type="asset",
        resource_id=asset.id,
        new_value=req.model_dump()
    )

    return ResponseEnvelope(data=AssetResponse.model_validate(asset))


@router.get("/{asset_id}", response_model=ResponseEnvelope[AssetResponse])
async def get_asset(
    asset_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Asset).where(Asset.id == asset_id, Asset.organization_id == current_user.organization_id)
    asset = (await db.execute(stmt)).scalars().first()
    if not asset:
        raise CyberOptixException(status_code=status.HTTP_404_NOT_FOUND, title="Asset Not Found", detail=f"Asset {asset_id} not found.")
    return ResponseEnvelope(data=AssetResponse.model_validate(asset))


@router.patch("/{asset_id}", response_model=ResponseEnvelope[AssetResponse])
async def update_asset(
    asset_id: str,
    req: AssetUpdate,
    current_user: User = Depends(require_permission("asset:manage")),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Asset).where(Asset.id == asset_id, Asset.organization_id == current_user.organization_id)
    asset = (await db.execute(stmt)).scalars().first()
    if not asset:
        raise CyberOptixException(status_code=status.HTTP_404_NOT_FOUND, title="Asset Not Found", detail=f"Asset {asset_id} not found.")
    
    prev = {k: getattr(asset, k) for k in req.model_dump(exclude_unset=True).keys()}
    for k, v in req.model_dump(exclude_unset=True).items():
        setattr(asset, k, v)
    await db.commit()
    await db.refresh(asset)

    await AuditService.log_event(
        db,
        organization_id=current_user.organization_id,
        actor_id=current_user.id,
        action="asset:update",
        resource_type="asset",
        resource_id=asset.id,
        previous_value=prev,
        new_value=req.model_dump(exclude_unset=True)
    )

    return ResponseEnvelope(data=AssetResponse.model_validate(asset))


@router.get("/{asset_id}/risk-contribution", response_model=ResponseEnvelope[AssetRiskContribution])
async def get_asset_risk_contribution(
    asset_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res = await AssetService.get_asset_risk_contribution(db, asset_id, current_user.organization_id)
    return ResponseEnvelope(data=res)


@router.get("/{asset_id}/attack-paths", response_model=ResponseEnvelope[AttackPathResponse])
async def get_asset_attack_paths(
    asset_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res = await AssetService.get_attack_paths(db, asset_id, current_user.organization_id)
    return ResponseEnvelope(data=res)
