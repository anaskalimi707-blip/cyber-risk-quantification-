from typing import Dict, List, Any, Optional
import pulp
import pandas as pd


def optimize_security_budget(
    controls_csv_path: str = "ml/data/security_controls.csv",
    budget_inr: float = 10000000.0, # ₹1.00 Crore default
    objective_mode: str = "max_risk_reduction"
) -> Dict[str, Any]:
    """
    Mixed-Integer Linear Programming (MIP) Security Investment Optimization.
    Objective:
      maximize sum(Delta_EAL_j * x_j)
      subject to sum(Cost_j * x_j) <= Budget
    """
    df = pd.read_csv(controls_csv_path)

    # Calculate estimated Delta EAL per control based on aggregate ₹4.2 Cr baseline exposure
    baseline_exposure = 42000000.0
    delta_eal = []
    for _, row in df.iterrows():
        # Weighted aggregate effectiveness across vectors
        eff = 0.40 * row["ransomware_impact_reduction"] + 0.30 * row["ransomware_prob_reduction"] + 0.30 * row["phishing_prob_reduction"]
        delta_eal.append(baseline_exposure * eff * 0.45) # conservative synergy scale

    df["delta_eal_inr"] = delta_eal
    df["value_per_rupee"] = df["delta_eal_inr"] / df["cost_inr"]

    # PuLP Optimization Problem
    prob = pulp.LpProblem("CyberOptix_Portfolio_Optimization", pulp.LpMaximize)

    # Decision variables x_j in {0, 1}
    control_vars = {
        row["control_id"]: pulp.LpVariable(f"x_{row['control_id']}", cat="Binary")
        for _, row in df.iterrows()
    }

    # Objective: Maximize total Risk Reduction
    prob += pulp.lpSum([
        df.loc[df["control_id"] == cid, "delta_eal_inr"].values[0] * control_vars[cid]
        for cid in control_vars
    ])

    # Constraint 1: Total Cost <= Budget
    prob += pulp.lpSum([
        df.loc[df["control_id"] == cid, "cost_inr"].values[0] * control_vars[cid]
        for cid in control_vars
    ]) <= budget_inr

    # Constraint 2: Dependency constraints (e.g. PAM requires MFA)
    for _, row in df.iterrows():
        dep = str(row["dependencies"])
        if dep != "None" and dep in control_vars:
            prob += control_vars[row["control_id"]] <= control_vars[dep]

    # Solve MIP using default CBC solver
    prob.solve(pulp.PULP_CBC_CMD(msg=0))

    selected_controls = []
    rejected_controls = []
    total_spent = 0.0
    total_reduction = 0.0

    for _, row in df.iterrows():
        cid = row["control_id"]
        val = pulp.value(control_vars[cid])
        item = {
            "control_id": cid,
            "control_name": row["control_name"],
            "cost_inr": float(row["cost_inr"]),
            "cost_formatted": f"₹{(row['cost_inr'] / 100000.0):.1f} Lakh",
            "delta_eal_inr": round(float(row["delta_eal_inr"]), 2),
            "delta_eal_formatted": f"₹{(row['delta_eal_inr'] / 10000000.0):.2f} Cr" if row["delta_eal_inr"] >= 10000000 else f"₹{(row['delta_eal_inr'] / 100000.0):.1f} Lakh",
            "value_per_rupee": round(float(row["value_per_rupee"]), 3),
            "implementation_days": int(row["implementation_days"])
        }
        if val and val > 0.5:
            selected_controls.append(item)
            total_spent += float(row["cost_inr"])
            total_reduction += float(row["delta_eal_inr"])
        else:
            reason = "Exceeds budget threshold for marginal risk return" if float(row["cost_inr"]) > (budget_inr - total_spent) else "Sub-optimal value-per-rupee compared to selected bundle"
            item["exclusion_reason"] = reason
            rejected_controls.append(item)

    residual_risk = max(0.0, baseline_exposure - total_reduction)
    roi_pct = round(((total_reduction - total_spent) / total_spent) * 100.0, 1) if total_spent > 0 else 0.0

    return {
        "budget_allocated_inr": budget_inr,
        "total_cost_inr": total_spent,
        "remaining_budget_inr": budget_inr - total_spent,
        "total_risk_reduction_inr": round(total_reduction, 2),
        "residual_risk_inr": round(residual_risk, 2),
        "illustrative_roi_percent": roi_pct,
        "selected_portfolio": selected_controls,
        "rejected_options": rejected_controls,
        "disclaimer": "Illustrative estimate — not a guaranteed financial outcome."
    }
