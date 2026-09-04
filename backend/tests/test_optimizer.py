import pytest
from app.engines.optimizer import InvestmentOptimizer


def test_investment_optimizer_budget_constraint():
    investments = [
        {"id": "inv_1", "name": "FIDO2 MFA", "initial_cost": 2500000.0, "expected_risk_reduction_pct": 0.45, "base_risk_amount": 10000000.0},
        {"id": "inv_2", "name": "Immutable Backups", "initial_cost": 3500000.0, "expected_risk_reduction_pct": 0.40, "base_risk_amount": 10000000.0},
        {"id": "inv_3", "name": "Microsegmentation", "initial_cost": 7000000.0, "expected_risk_reduction_pct": 0.50, "base_risk_amount": 10000000.0},
        {"id": "inv_4", "name": "Recovery Exercises", "initial_cost": 1000000.0, "expected_risk_reduction_pct": 0.20, "base_risk_amount": 10000000.0},
    ]

    # Budget ₹60 Lakh (6,000,000) -> Should select inv_1 (25L) and inv_2 (35L) = 60L
    result = InvestmentOptimizer.optimize_portfolio(
        investments=investments,
        total_budget=6000000.0,
        objective_mode="Maximize Total Risk Reduction"
    )

    assert result["status"] == "Optimal"
    assert result["total_cost"] <= 6000000.0
    selected_ids = [inv["id"] for inv in result["selected_investments"]]
    assert "inv_1" in selected_ids
    assert "inv_2" in selected_ids
    assert "inv_3" not in selected_ids  # ₹70L exceeds budget
    assert result["total_risk_reduction"] > 0
