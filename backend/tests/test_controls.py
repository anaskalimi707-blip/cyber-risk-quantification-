import pytest
from app.engines.control_evaluator import ControlEvaluator
from app.engines.what_if_engine import WhatIfEngine


def test_control_evaluator_formula():
    strength = ControlEvaluator.calculate_control_strength(
        coverage=0.80,
        implementation_percentage=0.85,
        test_effectiveness=0.90,
        failure_rate=0.05,
        evidence_freshness_score=0.95
    )
    # 0.80 * 0.85 * 0.95 * 0.90 * (1 - 0.05) = 0.5529
    assert 0.50 <= strength <= 0.65


def test_what_if_engine_difference():
    baseline = {
        "threat_event_frequency": 0.20,
        "vulnerability_factor": 0.25,
        "control_strength": 0.64,
        "loss_magnitude_median": 50000000.0,
        "loss_magnitude_p95": 150000000.0
    }
    modified = {
        "threat_event_frequency": 0.20,
        "vulnerability_factor": 0.25,
        "control_strength": 0.88,
        "loss_magnitude_median": 50000000.0,
        "loss_magnitude_p95": 150000000.0
    }
    diff = WhatIfEngine.simulate_difference(baseline, modified, iterations=5000)
    assert diff["difference"]["risk_reduction_amount"] > 0
    assert diff["difference"]["risk_reduction_percentage"] > 0
