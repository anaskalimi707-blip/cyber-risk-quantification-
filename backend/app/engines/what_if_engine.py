from typing import Dict, Any, List, Optional
from app.engines.fair_engine import FAIREngine
from app.engines.monte_carlo import MonteCarloEngine


class WhatIfEngine:
    """
    Simulates counterfactual security postures and calculates differential risk metrics.
    Compares Baseline Posture vs Projected Posture.
    """

    @staticmethod
    def simulate_difference(
        baseline_params: Dict[str, Any],
        modified_params: Dict[str, Any],
        iterations: int = 10000,
    ) -> Dict[str, Any]:
        # Run Baseline Monte Carlo
        base_res = MonteCarloEngine.run_simulation(
            threat_event_frequency_lambda=baseline_params.get("threat_event_frequency", 0.20),
            vulnerability_mode=baseline_params.get("vulnerability_factor", 0.25),
            control_strength=baseline_params.get("control_strength", 0.64),
            loss_magnitude_median=baseline_params.get("loss_magnitude_median", 50000000.0),
            loss_magnitude_p95=baseline_params.get("loss_magnitude_p95", 150000000.0),
            iterations=iterations,
            random_seed=42,
        )

        # Run Projected Monte Carlo
        proj_res = MonteCarloEngine.run_simulation(
            threat_event_frequency_lambda=modified_params.get("threat_event_frequency", baseline_params.get("threat_event_frequency", 0.20)),
            vulnerability_mode=modified_params.get("vulnerability_factor", baseline_params.get("vulnerability_factor", 0.25)),
            control_strength=modified_params.get("control_strength", 0.88),  # e.g., improved with FIDO2 MFA & backups
            loss_magnitude_median=modified_params.get("loss_magnitude_median", baseline_params.get("loss_magnitude_median", 50000000.0)),
            loss_magnitude_p95=modified_params.get("loss_magnitude_p95", baseline_params.get("loss_magnitude_p95", 150000000.0)),
            iterations=iterations,
            random_seed=42,
        )

        base_eal = base_res["expected_annual_loss"]
        proj_eal = proj_res["expected_annual_loss"]
        risk_reduction = max(0.0, base_eal - proj_eal)
        reduction_pct = round((risk_reduction / base_eal * 100), 1) if base_eal > 0 else 0.0

        return {
            "baseline": {
                "expected_annual_loss": base_eal,
                "value_at_risk_95": base_res["value_at_risk_95"],
                "control_strength": baseline_params.get("control_strength", 0.64),
            },
            "projected": {
                "expected_annual_loss": proj_eal,
                "value_at_risk_95": proj_res["value_at_risk_95"],
                "control_strength": modified_params.get("control_strength", 0.88),
            },
            "difference": {
                "risk_reduction_amount": round(risk_reduction, 2),
                "risk_reduction_percentage": reduction_pct,
                "var_95_reduction": round(base_res["value_at_risk_95"] - proj_res["value_at_risk_95"], 2),
            },
            "recommendation": (
                f"Implementing the simulated security improvements delivers a ₹{risk_reduction:,.2f} "
                f"({reduction_pct}%) reduction in Expected Annual Cyber Loss."
            ),
        }
