from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.simulation import (
    MonteCarloSimulationRequest,
    MonteCarloSimulationResult,
    WhatIfSimulationRequest,
    WhatIfComparisonResponse
)
from app.schemas.common import ResponseEnvelope
from app.services.simulation_service import SimulationService

router = APIRouter(prefix="/simulations", tags=["Simulation & What-If Sandbox"])


@router.post("/monte-carlo", response_model=ResponseEnvelope[MonteCarloSimulationResult])
async def run_monte_carlo_simulation(
    req: MonteCarloSimulationRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res = await SimulationService.run_monte_carlo(
        db=db,
        scenario_id=req.scenario_id,
        organization_id=current_user.organization_id,
        iterations=req.iterations,
        random_seed=req.random_seed,
        distribution_type=req.distribution_type,
        tef_override=req.threat_event_frequency_lambda,
        vuln_override=req.vulnerability_probability_mode,
        control_override=req.control_strength_override,
        loss_median_override=req.loss_magnitude_median,
        loss_p95_override=req.loss_magnitude_p95
    )
    return ResponseEnvelope(data=res)


@router.post("/what-if", response_model=ResponseEnvelope[WhatIfComparisonResponse])
async def run_what_if_simulation(
    req: WhatIfSimulationRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res = await SimulationService.run_what_if(
        db=db,
        scenario_id=req.scenario_id,
        organization_id=current_user.organization_id,
        modified_controls=req.modified_controls,
        budget_delta=req.budget_delta or 0.0,
        threat_multiplier=req.threat_frequency_multiplier or 1.0
    )
    return ResponseEnvelope(data=res)
