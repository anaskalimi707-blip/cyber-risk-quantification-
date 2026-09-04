from typing import Optional, Dict, Any, List
from fastapi import APIRouter, Query, Body, HTTPException, status
from pydantic import BaseModel, Field
from app.engines.crim_x_engine import CRIMXEngine

router = APIRouter(prefix="/crim-x", tags=["CRIM-X Apex Engine"])


class QuantifyRequest(BaseModel):
    budget_limit_inr: float = Field(15000000.0, description="Available capital investment budget in INR")
    target_coverage: float = Field(0.90, description="Conformal prediction nominal coverage (e.g. 0.90 for 90%)")
    cross_domain_prior: bool = Field(True, description="Enable Layer 0 Foundation Encoder few-shot prior")


class ContinualFeedbackRequest(BaseModel):
    quarter: str = Field("2026-Q3", description="Quarterly financial cycle")
    approved_portfolio_id: str = Field(..., description="ID of the executed Pareto portfolio")
    realized_loss_inr: float = Field(..., description="Observed quarterly loss impact in INR")
    realized_cost_inr: float = Field(..., description="Actual implementation and operational expenditure in INR")


@router.post("/quantify", summary="Execute Full 8-Layer CRIM-X Pipeline")
async def execute_crim_x_quantification(payload: Optional[QuantifyRequest] = Body(default=None)):
    """
    Executes the end-to-end 8-layer CRIM-X architecture:
    Representation (L0) -> TGN Dynamics (L1) -> Causal DML (L2) ->
    Conformal Coverage (L3) -> MoE Gating (L4) -> Adversarial Stress Test (L5) ->
    5D Pareto Frontier (L6) -> Governance Lineage (L8).
    """
    budget = payload.budget_limit_inr if payload else 15000000.0
    coverage = payload.target_coverage if payload else 0.90
    return CRIMXEngine.execute_full_crim_x_pipeline(budget_inr=budget, target_coverage=coverage)


@router.get("/causal-effects", summary="Double Machine Learning (DML) Causal Estimates")
async def get_causal_treatment_effects():
    """
    Retrieves candidate control investments with true causal treatment effect (theta),
    removing observational correlation bias and documenting identification strategy.
    """
    effects = CRIMXEngine.estimate_causal_treatment_effects()
    return {
        "candidate_interventions": [
            {
                "control_id": c.control_id,
                "name": c.name,
                "category": c.category,
                "cost_inr": c.cost_inr,
                "implementation_days": c.implementation_days,
                "compliance_boost_pct": c.compliance_boost_pct,
                "disruption_index": c.disruption_index,
                "naive_correlational_risk_reduction_inr": c.naive_correlational_risk_reduction_inr,
                "causal_effect_theta_inr": c.causal_effect_theta_inr,
                "causal_identification_strategy": c.causal_identification_strategy,
                "causal_confidence_score": c.causal_confidence_score,
                "p_value": c.p_value,
                "instrument_name": c.instrument_name
            }
            for c in effects
        ]
    }


@router.get("/pareto-frontier", summary="5D Multi-Objective Pareto Frontier (NSGA-II)")
async def get_pareto_frontier(
    budget_limit_inr: float = Query(15000000.0, description="Maximum budget threshold in INR"),
    max_days: int = Query(120, description="Maximum deployment timeline in days")
):
    """
    Computes non-dominated Pareto portfolios balancing Risk Reduction, Cost, Days, Compliance, and Disruption.
    """
    return CRIMXEngine.compute_multi_objective_pareto_frontier(
        budget_limit_inr=budget_limit_inr,
        max_days=max_days
    )


@router.get("/conformal-bounds", summary="Split Conformal Prediction Coverage Bands")
async def get_conformal_bounds(
    nominal_coverage: float = Query(0.90, ge=0.50, le=0.99, description="Target coverage probability")
):
    """
    Returns mathematically guaranteed distribution-free confidence intervals for Value-at-Risk.
    """
    return CRIMXEngine.calculate_conformal_coverage(target_coverage=nominal_coverage)


@router.get("/red-team-stress", summary="Adversarial Minimax Red-Team Stress Test")
async def get_red_team_stress_test():
    """
    Simulates novel attack mutations and identifies unmodeled blind-spot vulnerabilities.
    """
    return CRIMXEngine.run_adversarial_red_team_simulation()


@router.get("/model-card", summary="Governance Model Card & Decision Lineage")
async def get_governance_model_card():
    """
    Retrieves verifiable model cards and cryptographic SHA-256 decision lineage hashes.
    """
    return CRIMXEngine.generate_governance_model_card()


@router.post("/continual-feedback", summary="Register Realized Outcomes (Safe Bandit Update)")
async def post_continual_learning_feedback(payload: ContinualFeedbackRequest):
    """
    Safe closed-loop learning: projects realized outcomes onto policy space to refine next-cycle weights.
    """
    return CRIMXEngine.process_continual_learning_update(
        quarter=payload.quarter,
        approved_portfolio_id=payload.approved_portfolio_id,
        realized_loss_inr=payload.realized_loss_inr,
        realized_cost_inr=payload.realized_cost_inr
    )
