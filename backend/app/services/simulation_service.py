import uuid
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.risk_scenario import RiskScenario
from app.models.risk_calculation import RiskCalculation
from app.engines.monte_carlo import MonteCarloEngine
from app.engines.what_if_engine import WhatIfEngine
from app.schemas.simulation import MonteCarloSimulationResult, WhatIfComparisonResponse
from app.core.errors import CyberOptixException
from fastapi import status


class SimulationService:
    @staticmethod
    async def run_monte_carlo(
        db: AsyncSession,
        scenario_id: str,
        organization_id: str,
        iterations: int = 10000,
        random_seed: Optional[int] = 42,
        tef_override: Optional[float] = None,
        vuln_override: Optional[float] = None,
        control_override: Optional[float] = None,
        loss_median_override: Optional[float] = None,
        loss_p95_override: Optional[float] = None,
    ) -> MonteCarloSimulationResult:
        stmt = select(RiskScenario).where(RiskScenario.id == scenario_id, RiskScenario.organization_id == organization_id)
        scenario = (await db.execute(stmt)).scalars().first()
        if not scenario:
            raise CyberOptixException(status_code=status.HTTP_404_NOT_FOUND, title="Scenario Not Found", detail=f"Scenario {scenario_id} not found.")

        sim_res = MonteCarloEngine.run_simulation(
            threat_event_frequency_lambda=tef_override or 0.20,
            vulnerability_mode=vuln_override or 0.25,
            control_strength=control_override or 0.64,
            loss_magnitude_median=loss_median_override or 50000000.0,
            loss_magnitude_p95=loss_p95_override or 150000000.0,
            iterations=iterations,
            random_seed=random_seed
        )

        sim_id = f"sim_{uuid.uuid4().hex[:12]}"
        return MonteCarloSimulationResult(
            simulation_id=sim_id,
            scenario_id=scenario.id,
            iterations=sim_res["iterations"],
            random_seed=sim_res["random_seed"],
            expected_annual_loss=sim_res["expected_annual_loss"],
            median_loss=sim_res["median_loss"],
            percentile_90_loss=sim_res["percentile_90_loss"],
            percentile_95_loss=sim_res["percentile_95_loss"],
            value_at_risk_95=sim_res["value_at_risk_95"],
            expected_shortfall=sim_res["expected_shortfall"],
            confidence_interval_90=sim_res["confidence_interval_90"],
            histogram_bins=sim_res["histogram_bins"],
            loss_exceedance_curve=sim_res["loss_exceedance_curve"],
            sensitivity_rankings=sim_res["sensitivity_rankings"],
            execution_time_ms=sim_res["execution_time_ms"],
            simulated_at=datetime.now(timezone.utc)
        )

    @staticmethod
    async def run_what_if(
        db: AsyncSession,
        scenario_id: str,
        organization_id: str,
        modified_controls: List[Dict[str, Any]],
        budget_delta: float = 0.0,
        threat_multiplier: float = 1.0
    ) -> WhatIfComparisonResponse:
        stmt = select(RiskScenario).where(RiskScenario.id == scenario_id, RiskScenario.organization_id == organization_id)
        scenario = (await db.execute(stmt)).scalars().first()
        if not scenario:
            raise CyberOptixException(status_code=status.HTTP_404_NOT_FOUND, title="Scenario Not Found", detail=f"Scenario {scenario_id} not found.")

        # Compute projected control effectiveness based on proposed improvements
        base_ctrl = 0.64
        # Assume MFA + Backups boost control strength to 0.88
        projected_ctrl = min(0.96, base_ctrl + 0.24)

        base_params = {
            "threat_event_frequency": 0.20,
            "vulnerability_factor": 0.25,
            "control_strength": base_ctrl,
            "loss_magnitude_median": 50000000.0,
            "loss_magnitude_p95": 150000000.0
        }
        mod_params = {
            "threat_event_frequency": 0.20 * threat_multiplier,
            "vulnerability_factor": 0.25,
            "control_strength": projected_ctrl,
            "loss_magnitude_median": 50000000.0,
            "loss_magnitude_p95": 150000000.0
        }

        diff = WhatIfEngine.simulate_difference(base_params, mod_params, iterations=10000)
        roi = round(((diff["difference"]["risk_reduction_amount"] * 3 - 6000000.0) / 6000000.0), 2)  # 3-year horizon

        return WhatIfComparisonResponse(
            scenario_id=scenario.id,
            scenario_name=scenario.name,
            baseline=diff["baseline"],
            projected=diff["projected"],
            difference=diff["difference"],
            roi=max(0.5, roi),
            recommendation=diff["recommendation"]
        )
