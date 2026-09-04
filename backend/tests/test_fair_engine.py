import pytest
from app.engines.fair_engine import FAIREngine


def test_fair_loss_event_frequency():
    # Threat Event Frequency: 0.20
    # Vulnerability Factor: 0.25
    # Control Strength: 0.64
    # Expected LEF = 0.20 * 0.25 * (1 - 0.64) = 0.018
    lef = FAIREngine.calculate_loss_event_frequency(
        threat_event_frequency=0.20,
        vulnerability_factor=0.25,
        control_strength=0.64
    )
    assert lef == 0.018


def test_fair_expected_annual_loss():
    # LEF: 0.018
    # Loss Magnitude: ₹5 Crore (50,000,000)
    # Expected Annual Loss = 0.018 * 50,000,000 = ₹900,000 (₹9 Lakh)
    eal = FAIREngine.calculate_expected_annual_loss(
        loss_event_frequency=0.018,
        loss_magnitude=50000000.0
    )
    assert eal == 900000.0


def test_lognormal_parameters():
    median = 50000000.0
    p95 = 150000000.0
    mu, sigma = FAIREngine.calculate_lognormal_parameters(median, p95)
    assert mu > 0
    assert sigma > 0
