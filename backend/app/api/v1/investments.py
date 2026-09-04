from fastapi import APIRouter, Depends, status
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.api.deps import get_current_user, require_permission
from app.models.user import User
from app.models.investment import Investment, InvestmentPortfolio
from app.schemas.investment import (
    InvestmentCreate,
    InvestmentResponse,
    PortfolioOptimizationRequest,
    PortfolioResponse,
    PortfolioApprovalRequest
)
from app.schemas.common import ResponseEnvelope
from app.services.optimization_service import OptimizationService
from app.services.audit_service import AuditService
from app.core.errors import CyberOptixException

router = APIRouter(prefix="/investments", tags=["Investment Optimization & Portfolio Engine"])


@router.get("", response_model=ResponseEnvelope[List[InvestmentResponse]])
async def list_investments(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Investment).where(Investment.organization_id == current_user.organization_id)
    res = await db.execute(stmt)
    invs = res.scalars().all()
    return ResponseEnvelope(data=[InvestmentResponse.model_validate(i) for i in invs])


@router.post("", response_model=ResponseEnvelope[InvestmentResponse], status_code=status.HTTP_201_CREATED)
async def create_investment(
    req: InvestmentCreate,
    current_user: User = Depends(require_permission("investment:create")),
    db: AsyncSession = Depends(get_db)
):
    inv = Investment(
        organization_id=current_user.organization_id,
        owner_id=current_user.id,
        **req.model_dump()
    )
    db.add(inv)
    await db.commit()
    await db.refresh(inv)

    await AuditService.log_event(
        db,
        organization_id=current_user.organization_id,
        actor_id=current_user.id,
        action="investment:create",
        resource_type="investment",
        resource_id=inv.id,
        new_value=req.model_dump()
    )

    return ResponseEnvelope(data=InvestmentResponse.model_validate(inv))


@router.post("/optimize", response_model=ResponseEnvelope[PortfolioResponse])
async def optimize_portfolio(
    req: PortfolioOptimizationRequest,
    current_user: User = Depends(require_permission("investment:optimize")),
    db: AsyncSession = Depends(get_db)
):
    res = await OptimizationService.optimize_portfolio(
        db=db,
        organization_id=current_user.organization_id,
        budget=req.budget,
        planning_period=req.planning_period,
        objective=req.objective,
        mandatory_investment_ids=req.mandatory_investment_ids,
        max_implementation_days=req.max_implementation_days
    )

    await AuditService.log_event(
        db,
        organization_id=current_user.organization_id,
        actor_id=current_user.id,
        action="investment:optimize",
        resource_type="investment_portfolio",
        resource_id=res.id,
        new_value={"budget": req.budget, "objective": req.objective, "total_cost": res.total_cost}
    )

    return ResponseEnvelope(data=res)


@router.post("/portfolios/{portfolio_id}/approve", response_model=ResponseEnvelope[dict])
async def approve_portfolio(
    portfolio_id: str,
    req: PortfolioApprovalRequest,
    current_user: User = Depends(require_permission("investment:approve")),
    db: AsyncSession = Depends(get_db)
):
    portfolio = await OptimizationService.approve_or_reject_portfolio(
        db=db,
        portfolio_id=portfolio_id,
        organization_id=current_user.organization_id,
        user_id=current_user.id,
        action=req.action,
        reason=req.reason
    )

    await AuditService.log_event(
        db,
        organization_id=current_user.organization_id,
        actor_id=current_user.id,
        action=f"investment_portfolio:{req.action}",
        resource_type="investment_portfolio",
        resource_id=portfolio.id,
        new_value={"status": portfolio.status, "reason": req.reason}
    )

    return ResponseEnvelope(data={"message": f"Portfolio {portfolio.id} has been {portfolio.status.lower()}."})
