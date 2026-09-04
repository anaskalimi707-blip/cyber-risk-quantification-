import pytest
from app.engines.monte_carlo import MonteCarloEngine


def test_monte_carlo_reproducibility():
    res1 = MonteCarloEngine.run_simulation(
        threat_event_frequency_lambda=0.20,
        vulnerability_mode=0.25,
        control_strength=0.64,
        loss_magnitude_median=50000000.0,
        loss_magnitude_p95=150000000.0,
        iterations=5000,
        random_seed=42
    )
    res2 = MonteCarloEngine.run_simulation(
        threat_event_frequency_lambda=0.20,
        vulnerability_mode=0.25,
        control_strength=0.64,
        loss_magnitude_median=50000000.0,
        loss_magnitude_p95=150000000.0,
        iterations=5000,
        random_seed=42
    )
    assert res1["expected_annual_loss"] == res2["expected_annual_loss"]
    assert res1["value_at_risk_95"] == res2["value_at_risk_95"]
    assert len(res1["histogram_bins"]) > 0
    assert len(res1["loss_exceedance_curve"]) > 0
    assert len(res1["sensitivity_rankings"]) > 0


def test_monte_carlo_distribution_properties():
    res = MonteCarloEngine.run_simulation(iterations=10000, random_seed=123)
    assert res["expected_annual_loss"] > 0
    assert res["percentile_95_loss"] >= res["percentile_90_loss"]
    assert res["expected_shortfall"] >= res["value_at_risk_95"]
