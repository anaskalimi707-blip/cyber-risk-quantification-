from fastapi import APIRouter, Depends, status
from typing import List, Optional
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.api.deps import get_current_user, require_permission
from app.models.user import User
from app.models.risk_scenario import RiskScenario
from app.models.risk_calculation import RiskCalculation
from app.schemas.risk import RiskScenarioCreate, RiskScenarioResponse, RiskCalculationResponse, RiskTreatmentRequest
from app.schemas.common import ResponseEnvelope
from app.services.risk_service import RiskService
from app.services.audit_service import AuditService
from app.core.errors import CyberOptixException

router = APIRouter(prefix="/risk-scenarios", tags=["Risk Scenarios & Quantification"])


@router.get("", response_model=ResponseEnvelope[List[RiskScenarioResponse]])
async def list_risk_scenarios(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(RiskScenario).where(RiskScenario.organization_id == current_user.organization_id)
    res = await db.execute(stmt)
    scenarios = res.scalars().all()

    result = []
    for s in scenarios:
        calc_stmt = select(RiskCalculation).where(RiskCalculation.scenario_id == s.id).order_by(RiskCalculation.calculated_at.desc()).limit(1)
        calc = (await db.execute(calc_stmt)).scalars().first()
        s_resp = RiskScenarioResponse.model_validate(s)
        if calc:
            s_resp.latest_calculation = RiskCalculationResponse.model_validate(calc)
        result.append(s_resp)

    return ResponseEnvelope(data=result)


@router.post("", response_model=ResponseEnvelope[RiskScenarioResponse], status_code=status.HTTP_201_CREATED)
async def create_risk_scenario(
    req: RiskScenarioCreate,
    current_user: User = Depends(require_permission("risk:create")),
    db: AsyncSession = Depends(get_db)
):
    scenario = RiskScenario(
        organization_id=current_user.organization_id,
        risk_owner_id=current_user.id,
        **req.model_dump()
    )
    db.add(scenario)
    await db.commit()
    await db.refresh(scenario)

    # Automatically run initial quantification calculation
    calc = await RiskService.recalculate_scenario(db, scenario.id, current_user.organization_id, trigger="initial_creation")

    s_resp = RiskScenarioResponse.model_validate(scenario)
    s_resp.latest_calculation = RiskCalculationResponse.model_validate(calc)

    await AuditService.log_event(
        db,
        organization_id=current_user.organization_id,
        actor_id=current_user.id,
        action="risk:create",
        resource_type="risk_scenario",
        resource_id=scenario.id,
        new_value=req.model_dump()
    )

    return ResponseEnvelope(data=s_resp)


@router.get("/{scenario_id}", response_model=ResponseEnvelope[RiskScenarioResponse])
async def get_risk_scenario(
    scenario_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(RiskScenario).where(RiskScenario.id == scenario_id, RiskScenario.organization_id == current_user.organization_id)
    scenario = (await db.execute(stmt)).scalars().first()
    if not scenario:
        raise CyberOptixException(status_code=status.HTTP_404_NOT_FOUND, title="Scenario Not Found", detail=f"Risk Scenario {scenario_id} not found.")

    calc_stmt = select(RiskCalculation).where(RiskCalculation.scenario_id == scenario.id).order_by(RiskCalculation.calculated_at.desc()).limit(1)
    calc = (await db.execute(calc_stmt)).scalars().first()
    s_resp = RiskScenarioResponse.model_validate(scenario)
    if calc:
        s_resp.latest_calculation = RiskCalculationResponse.model_validate(calc)
    return ResponseEnvelope(data=s_resp)


@router.post("/{scenario_id}/calculate", response_model=ResponseEnvelope[RiskCalculationResponse])
async def recalculate_scenario(
    scenario_id: str,
    current_user: User = Depends(require_permission("risk:calculate")),
    db: AsyncSession = Depends(get_db)
):
    calc = await RiskService.recalculate_scenario(db, scenario_id, current_user.organization_id, trigger="manual_recalc")
    return ResponseEnvelope(data=RiskCalculationResponse.model_validate(calc))


@router.post("/{scenario_id}/treat", response_model=ResponseEnvelope[RiskScenarioResponse])
async def treat_risk_scenario(
    scenario_id: str,
    req: RiskTreatmentRequest,
    current_user: User = Depends(require_permission("risk:approve")),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(RiskScenario).where(RiskScenario.id == scenario_id, RiskScenario.organization_id == current_user.organization_id)
    scenario = (await db.execute(stmt)).scalars().first()
    if not scenario:
        raise CyberOptixException(status_code=status.HTTP_404_NOT_FOUND, title="Scenario Not Found", detail=f"Scenario {scenario_id} not found.")

    scenario.status = "Treated" if req.treatment_type == "Mitigate" else req.treatment_type
    scenario.treatment_type = req.treatment_type
    scenario.treatment_rationale = req.rationale
    scenario.treatment_approved_by = current_user.id
    scenario.treatment_approved_at = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(scenario)

    await AuditService.log_event(
        db,
        organization_id=current_user.organization_id,
        actor_id=current_user.id,
        action="risk:treat",
        resource_type="risk_scenario",
        resource_id=scenario.id,
        new_value=req.model_dump()
    )

    return ResponseEnvelope(data=RiskScenarioResponse.model_validate(scenario))
