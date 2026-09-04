from typing import Dict, Any, List


class ControlEvaluator:
    """
    Evaluates cybersecurity control effectiveness based on verified telemetry & evidence.
    Formula:
        Control Strength = Coverage * Implementation Quality * Evidence Freshness * Test Effectiveness * (1 - Failure Rate)
    """

    @staticmethod
    def calculate_control_strength(
        coverage: float,
        implementation_percentage: float,
        test_effectiveness: float,
        failure_rate: float,
        evidence_freshness_score: float = 1.0,
    ) -> float:
        # Clamp inputs between 0.0 and 1.0
        cov = max(0.0, min(1.0, coverage))
        imp = max(0.0, min(1.0, implementation_percentage))
        test = max(0.0, min(1.0, test_effectiveness))
        fail = max(0.0, min(1.0, failure_rate))
        fresh = max(0.0, min(1.0, evidence_freshness_score))

        strength = cov * imp * fresh * test * (1.0 - fail)
        return round(max(0.0, min(1.0, strength)), 4)

    @staticmethod
    def explain_control_strength(
        control_name: str,
        coverage: float,
        implementation_percentage: float,
        test_effectiveness: float,
        failure_rate: float,
        evidence_freshness_score: float = 1.0,
    ) -> str:
        strength = ControlEvaluator.calculate_control_strength(
            coverage, implementation_percentage, test_effectiveness, failure_rate, evidence_freshness_score
        )
        cov_pct = round(coverage * 100, 1)
        imp_pct = round(implementation_percentage * 100, 1)
        fail_pct = round(failure_rate * 100, 1)
        fresh_pct = round(evidence_freshness_score * 100, 1)

        return (
            f"Control '{control_name}' is implemented at {imp_pct}% with {cov_pct}% environment coverage. "
            f"Recent verified evidence freshness is {fresh_pct}% with a recorded failure rate of {fail_pct}%. "
            f"Effective defensive control strength is quantified at {strength:.2f}."
        )
