from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.risk import ExecutiveDashboardResponse, CISODashboardResponse
from app.schemas.common import ResponseEnvelope
from app.services.risk_service import RiskService

router = APIRouter(prefix="/dashboard", tags=["Executive & CISO Dashboards"])


@router.get("/executive", response_model=ResponseEnvelope[ExecutiveDashboardResponse])
async def get_executive_dashboard(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res = await RiskService.get_executive_dashboard(db, current_user.organization_id)
    return ResponseEnvelope(data=res)


@router.get("/ciso", response_model=ResponseEnvelope[CISODashboardResponse])
async def get_ciso_dashboard(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res = await RiskService.get_ciso_dashboard(db, current_user.organization_id)
    return ResponseEnvelope(data=res)


@router.get("/risk-trends", response_model=ResponseEnvelope[list])
async def get_risk_trends(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Trend history
    trends = [
        {"month": "May 2026", "expected_annual_loss": 1450000.0, "var_95": 210000000.0},
        {"month": "Jun 2026", "expected_annual_loss": 1280000.0, "var_95": 195000000.0},
        {"month": "Jul 2026", "expected_annual_loss": 1100000.0, "var_95": 175000000.0},
        {"month": "Aug 2026", "expected_annual_loss": 980000.0,  "var_95": 160000000.0},
        {"month": "Sep 2026", "expected_annual_loss": 900000.0,  "var_95": 150000000.0},
    ]
    return ResponseEnvelope(data=trends)
