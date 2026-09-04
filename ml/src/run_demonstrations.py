import sys
import os

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

from optimize_budget import optimize_security_budget
from calculate_eal import calculate_eal


def run_all_demonstrations():
    print("================================================================================")
    print("DEMONSTRATION 1: RANSOMWARE CASE STUDY (Before vs After Mitigation)")
    print("================================================================================")
    # Baseline Posture
    p_base = 0.30
    impact_base = 25000000.0  # INR 2.5 Crore
    eal_base = p_base * impact_base  # INR 75 Lakh

    # Mitigations Applied: EDR (INR 30L) + Immutable Backups (INR 35L) + MFA (INR 25L) + Microsegmentation (INR 70L)
    # Cost = INR 1.60 Crore
    p_after = p_base * (1.0 - 0.25) * (1.0 - 0.30) * (1.0 - 0.35)  # EDR, MFA, Segmentation
    impact_after = impact_base * (1.0 - 0.70) * (1.0 - 0.30)        # Backups, Segmentation
    eal_after = p_after * impact_after

    total_inv = 16000000.0
    risk_reduction_annual = eal_base - eal_after
    five_year_savings = (risk_reduction_annual * 5) - total_inv
    roi = ((risk_reduction_annual * 3 - total_inv) / total_inv) * 100 # 3-year horizon

    print(f"Baseline: P(Ransomware) = {p_base*100:.1f}%, Impact = INR {impact_base/10000000:.2f} Cr, EAL = INR {eal_base/100000:.2f} Lakh")
    print(f"After Defense Bundle: P(Ransomware) = {p_after*100:.2f}%, Impact = INR {impact_after/10000000:.2f} Cr, EAL = INR {eal_after/100000:.2f} Lakh")
    print(f"Annual Financial Loss Avoidance = INR {risk_reduction_annual/100000:.2f} Lakh (INR {risk_reduction_annual/10000000:.2f} Cr)")
    print(f"Total Capital Expenditure = INR {total_inv/10000000:.2f} Cr")
    print(f"Illustrative 3-Year ROI = {roi:.1f}%")
    print("Disclaimer: Illustrative estimate — not a guaranteed financial outcome.\n")

    print("================================================================================")
    print("DEMONSTRATION 2: INR 1 CRORE SECURITY BUDGET ALLOCATION (PuLP MIP Solver)")
    print("================================================================================")
    opt_result = optimize_security_budget(budget_inr=10000000.0)
    print(f"Budget Cap: INR {opt_result['budget_allocated_inr']/10000000:.2f} Crore")
    print(f"Total Capital Committed: INR {opt_result['total_cost_inr']/100000:.1f} Lakh")
    print(f"Remaining Capital: INR {opt_result['remaining_budget_inr']/100000:.1f} Lakh")
    print(f"Total Quantified Risk Reduction: INR {opt_result['total_risk_reduction_inr']/10000000:.2f} Crore")
    print(f"Residual Cyber Risk: INR {opt_result['residual_risk_inr']/10000000:.2f} Crore")
    print(f"Portfolio ROI: {opt_result['illustrative_roi_percent']}%\n")
    print("Selected Optimal Defense Bundle:")
    for ctrl in opt_result["selected_portfolio"]:
        print(f"  [x] {ctrl['control_name']} [{ctrl['control_id']}]: Cost {ctrl['cost_formatted']}, Risk Reduced {ctrl['delta_eal_formatted']} (Value/INR: {ctrl['value_per_rupee']})")
    print("\nExcluded Candidate Options (with Decision Rationale):")
    for ctrl in opt_result["rejected_options"]:
        print(f"  [ ] {ctrl['control_name']}: {ctrl['exclusion_reason']}")
    print("Disclaimer: Illustrative estimate — not a guaranteed financial outcome.\n")

    print("================================================================================")
    print("DEMONSTRATION 3: ILLUSTRATIVE FAIR QUANTIFICATION CALCULATION")
    print("================================================================================")
    tef = 0.20           # Threat Event Frequency (attempts/yr)
    p_success = 0.25     # Vulnerability / exploit probability
    control_eff = 0.64   # Effective defensive mitigation (1 - Failure)
    single_loss = 50000000.0 # INR 5.00 Crore loss magnitude

    # FAIR LEF formula
    lef = tef * p_success * (1.0 - control_eff)
    eal_fair = lef * single_loss

    print(f"Threat Event Frequency (TEF) = {tef} events/yr")
    print(f"Probability of Actionable Exploitation = {p_success}")
    print(f"Effective Control Strength = {control_eff} (64%)")
    print(f"Loss Event Frequency (LEF) = {tef} x {p_success} x (1 - {control_eff}) = {lef:.4f} breaches/yr")
    print(f"Average Single Loss Magnitude (LM) = INR {single_loss/10000000:.2f} Crore")
    print(f"Expected Annual Loss (EAL) = LEF x LM = {lef:.4f} x INR 5.00 Cr = INR {eal_fair/100000:.2f} Lakh")
    print("Disclaimer: Simplified illustrative calculation — not a guaranteed financial outcome.")
    print("================================================================================")


if __name__ == "__main__":
    run_all_demonstrations()
