from typing import Dict, List, Any
import numpy as np
import pandas as pd


def calculate_eal(probabilities: Dict[str, float], predicted_impacts: Dict[str, float]) -> Dict[str, Any]:
    """
    Computes Expected Annual Loss (EAL) across cyber incident categories:
      EAL_i = P_i * I_i
      Total EAL = sum_i(EAL_i)
    Returns per-incident expected loss, total EAL, and ranked risk ordering.
    """
    breakdown = []
    total_eal = 0.0

    for inc, prob in probabilities.items():
        impact = predicted_impacts.get(inc, 0.0)
        expected_loss = prob * impact
        total_eal += expected_loss
        breakdown.append({
            "incident_type": inc.capitalize(),
            "annual_probability": round(float(prob), 4),
            "estimated_impact_inr": round(float(impact), 2),
            "expected_annual_loss_inr": round(float(expected_loss), 2),
            "eal_formatted": f"₹{(expected_loss / 10000000.0):.2f} Cr" if expected_loss >= 10000000 else f"₹{(expected_loss / 100000.0):.2f} Lakh"
        })

    # Sort highest to lowest expected loss
    breakdown = sorted(breakdown, key=lambda x: x["expected_annual_loss_inr"], reverse=True)

    return {
        "total_expected_annual_loss_inr": round(float(total_eal), 2),
        "total_eal_formatted": f"₹{(total_eal / 10000000.0):.2f} Crore" if total_eal >= 10000000 else f"₹{(total_eal / 100000.0):.2f} Lakh",
        "risk_ranking": breakdown,
        "model_type": "ml_prediction",
        "disclaimer": "Illustrative estimate — not a guaranteed financial outcome."
    }
