from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.investment import Investment, InvestmentPortfolio
from app.engines.optimizer import InvestmentOptimizer
from app.schemas.investment import PortfolioResponse, InvestmentResponse
from app.core.errors import CyberOptixException
from fastapi import status


class OptimizationService:
    @staticmethod
    async def optimize_portfolio(
        db: AsyncSession,
        organization_id: str,
        budget: float,
        planning_period: str = "FY 2026-2027",
        objective: str = "Maximize Total Risk Reduction",
        mandatory_investment_ids: Optional[List[str]] = None,
        max_implementation_days: Optional[int] = 365,
    ) -> PortfolioResponse:
        stmt = select(Investment).where(Investment.organization_id == organization_id)
        investments = (await db.execute(stmt)).scalars().all()

        inv_dicts = []
        for inv in investments:
            inv_dicts.append({
                "id": inv.id,
                "name": inv.name,
                "initial_cost": inv.initial_cost,
                "recurring_cost": inv.recurring_cost,
                "implementation_time": inv.implementation_time,
                "dependencies": inv.dependencies or [],
                "compliance_contribution": inv.compliance_contribution,
                "expected_risk_reduction_pct": inv.expected_risk_reduction_pct,
                "base_risk_amount": 10000000.0,  # Base scenario risk
                "obj": inv
            })

        opt_result = InvestmentOptimizer.optimize_portfolio(
            investments=inv_dicts,
            total_budget=budget,
            mandatory_investment_ids=mandatory_investment_ids,
            max_implementation_days=max_implementation_days,
            objective_mode=objective
        )

        selected_models = [item["obj"] for item in opt_result["selected_investments"]]
        selected_ids = [m.id for m in selected_models]

        portfolio = InvestmentPortfolio(
            organization_id=organization_id,
            name=f"Optimal Portfolio ({planning_period}) - ₹{budget/10000000:.1f} Cr Budget",
            selected_investments=selected_ids,
            budget=budget,
            planning_period=planning_period,
            objective=objective,
            expected_risk_reduction=opt_result["total_risk_reduction"],
            residual_risk=opt_result["residual_risk"],
            total_cost=opt_result["total_cost"],
            risk_reduction_roi=opt_result["risk_reduction_roi"],
            confidence_interval={"lower_bound": opt_result["total_risk_reduction"] * 0.85, "upper_bound": opt_result["total_risk_reduction"] * 1.15},
            assumptions=opt_result["assumptions"],
            optimization_version="MIP-PuLP-1.0",
            status="Draft"
        )
        db.add(portfolio)
        await db.commit()
        await db.refresh(portfolio)

        return PortfolioResponse(
            id=portfolio.id,
            organization_id=portfolio.organization_id,
            name=portfolio.name,
            selected_investments=[InvestmentResponse.model_validate(m) for m in selected_models],
            budget=portfolio.budget,
            planning_period=portfolio.planning_period,
            objective=portfolio.objective,
            expected_risk_reduction=portfolio.expected_risk_reduction,
            residual_risk=portfolio.residual_risk,
            total_cost=portfolio.total_cost,
            risk_reduction_roi=portfolio.risk_reduction_roi,
            confidence_interval=portfolio.confidence_interval or {},
            assumptions=portfolio.assumptions or [],
            optimization_version=portfolio.optimization_version,
            status=portfolio.status,
            approved_by=portfolio.approved_by,
            approved_at=portfolio.approved_at,
            rejection_reason=portfolio.rejection_reason,
            created_at=portfolio.created_at
        )

    @staticmethod
    async def approve_or_reject_portfolio(
        db: AsyncSession,
        portfolio_id: str,
        organization_id: str,
        user_id: str,
        action: str,
        reason: Optional[str] = None
    ) -> InvestmentPortfolio:
        stmt = select(InvestmentPortfolio).where(InvestmentPortfolio.id == portfolio_id, InvestmentPortfolio.organization_id == organization_id)
        portfolio = (await db.execute(stmt)).scalars().first()
        if not portfolio:
            raise CyberOptixException(status_code=status.HTTP_404_NOT_FOUND, title="Portfolio Not Found", detail=f"Portfolio {portfolio_id} not found.")

        if action.lower() == "approve":
            portfolio.status = "Approved"
            portfolio.approved_by = user_id
            portfolio.approved_at = datetime.now(timezone.utc)
        else:
            portfolio.status = "Rejected"
            portfolio.rejection_reason = reason or "Rejected by reviewer."

        await db.commit()
        await db.refresh(portfolio)
        return portfolio

    @staticmethod
    async def get_pareto_frontier(
        db: AsyncSession,
        organization_id: str,
        min_budget: float = 1000000.0,
        max_budget: float = 20000000.0,
        steps: int = 8,
    ) -> Dict[str, Any]:
        stmt = select(Investment).where(Investment.organization_id == organization_id)
        investments = (await db.execute(stmt)).scalars().all()

        inv_dicts = []
        for inv in investments:
            inv_dicts.append({
                "id": inv.id,
                "name": inv.name,
                "initial_cost": inv.initial_cost,
                "recurring_cost": inv.recurring_cost,
                "implementation_time": inv.implementation_time,
                "dependencies": inv.dependencies or [],
                "compliance_contribution": inv.compliance_contribution,
                "expected_risk_reduction_pct": inv.expected_risk_reduction_pct,
                "base_risk_amount": 10000000.0,
            })

        return InvestmentOptimizer.generate_pareto_frontier(
            investments=inv_dicts,
            min_budget=min_budget,
            max_budget=max_budget,
            steps=steps
        )

    @staticmethod
    async def get_strategy_comparison(
        db: AsyncSession,
        organization_id: str,
        target_budget: float = 10000000.0,
    ) -> List[Dict[str, Any]]:
        stmt = select(Investment).where(Investment.organization_id == organization_id)
        investments = (await db.execute(stmt)).scalars().all()

        inv_dicts = []
        for inv in investments:
            inv_dicts.append({
                "id": inv.id,
                "name": inv.name,
                "initial_cost": inv.initial_cost,
                "recurring_cost": inv.recurring_cost,
                "implementation_time": inv.implementation_time,
                "dependencies": inv.dependencies or [],
                "compliance_contribution": inv.compliance_contribution,
                "expected_risk_reduction_pct": inv.expected_risk_reduction_pct,
                "base_risk_amount": 10000000.0,
            })

        return InvestmentOptimizer.compare_portfolio_strategies(
            investments=inv_dicts,
            target_budget=target_budget
        )

