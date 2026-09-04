import math
from typing import Dict, Any, Tuple


class FAIREngine:
    """
    FAIR (Factor Analysis of Information Risk) Quantitative Model.
    Decomposes Cyber Risk into:
      Loss Event Frequency (LEF) = Threat Event Frequency (TEF) * Vulnerability Factor * (1 - Control Strength)
      Expected Annual Loss (EAL) = Loss Event Frequency (LEF) * Loss Magnitude (LM)
    """

    @staticmethod
    def calculate_loss_event_frequency(
        threat_event_frequency: float,
        vulnerability_factor: float,
        control_strength: float,
    ) -> float:
        """
        Calculates annual Loss Event Frequency (LEF).
        threat_event_frequency: Annual attempts (e.g. 0.20)
        vulnerability_factor: Susceptibility (e.g. 0.25)
        control_strength: Effective defense (e.g. 0.64)
        Adjusted frequency = 0.20 * 0.25 * (1 - 0.64) = 0.018 events/year
        """
        threat_rate = max(0.0, threat_event_frequency)
        vuln_rate = max(0.0, min(1.0, vulnerability_factor))
        ctrl_eff = max(0.0, min(1.0, control_strength))

        lef = threat_rate * vuln_rate * (1.0 - ctrl_eff)
        return round(lef, 6)

    @staticmethod
    def calculate_expected_annual_loss(
        loss_event_frequency: float,
        loss_magnitude: float,
    ) -> float:
        """
        Calculates Expected Annual Loss (EAL).
        EAL = LEF * LM
        Example: 0.018 * 50,000,000 = 900,000 (₹9 Lakh)
        """
        eal = max(0.0, loss_event_frequency) * max(0.0, loss_magnitude)
        return round(eal, 2)

    @staticmethod
    def calculate_lognormal_parameters(median: float, p95: float) -> Tuple[float, float]:
        """
        Derives mu and sigma for a lognormal distribution given median (P50) and 95th percentile (P95).
        median = exp(mu) => mu = ln(median)
        p95 = exp(mu + 1.64485 * sigma) => sigma = (ln(p95) - mu) / 1.64485
        """
        if median <= 0 or p95 <= median:
            # Fallback safe defaults
            p95 = max(p95, median * 1.5 if median > 0 else 1000.0)
            median = max(median, 500.0)
        
        mu = math.log(median)
        sigma = (math.log(p95) - mu) / 1.6448536269514722
        return mu, max(0.01, sigma)
