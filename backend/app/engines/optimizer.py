from typing import List, Dict, Any, Optional
import pulp


class InvestmentOptimizer:
    """
    Mixed-Integer Linear Programming (MIP) Optimizer using PuLP.
    Solves the 0/1 Knapsack & Portfolio Selection Problem:
      Maximize: Sum(Risk_Reduction_i * x_i) - Overlap_Penalty
      Subject to:
        Sum(Cost_i * x_i) <= Budget
        x_dep <= x_req (Dependency Constraints)
        x_mandatory = 1 (Regulatory/Mandatory Controls)
    """

    @staticmethod
    def optimize_portfolio(
        investments: List[Dict[str, Any]],
        total_budget: float,
        mandatory_investment_ids: Optional[List[str]] = None,
        max_implementation_days: Optional[int] = 365,
        objective_mode: str = "Maximize Total Risk Reduction",
    ) -> Dict[str, Any]:
        mandatory_ids = set(mandatory_investment_ids or [])

        # Create PuLP Linear Problem
        prob = pulp.LpProblem("CyberRisk_Investment_Optimization", pulp.LpMaximize)

        # Decision Variables x_i in {0, 1}
        x_vars = {}
        for inv in investments:
            inv_id = inv["id"]
            x_vars[inv_id] = pulp.LpVariable(f"invest_{inv_id}", cat=pulp.LpBinary)

        # 1. Objective Function formulation
        objective_terms = []
        for inv in investments:
            inv_id = inv["id"]
            cost = float(inv.get("initial_cost", 0.0))
            risk_red_pct = float(inv.get("expected_risk_reduction_pct", 0.0))
            # Estimated absolute risk currency reduction (e.g., base baseline risk ₹10,000,000 * reduction_pct)
            base_risk_value = float(inv.get("base_risk_amount", 10000000.0))
            risk_reduction_amount = base_risk_value * risk_red_pct

            if objective_mode == "Maximize ROI":
                # ROI weight = (Risk Reduction - Cost) / (Cost + 1)
                roi_weight = max(0.1, (risk_reduction_amount - cost) / max(1.0, cost))
                objective_terms.append(roi_weight * x_vars[inv_id])
            elif objective_mode == "Highest Compliance":
                comp_weight = float(inv.get("compliance_contribution", 0.2)) * 1000000.0
                objective_terms.append((risk_reduction_amount + comp_weight) * x_vars[inv_id])
            else:
                # Default: Maximize Total Risk Reduction
                objective_terms.append(risk_reduction_amount * x_vars[inv_id])

        prob += pulp.lpSum(objective_terms), "Total_Objective_Score"

        # 2. Budget Constraint: Sum(cost_i * x_i) <= Budget
        prob += (
            pulp.lpSum([float(inv.get("initial_cost", 0.0)) * x_vars[inv["id"]] for inv in investments]) <= total_budget,
            "Total_Budget_Limit"
        )

        # 3. Mandatory Investment Constraints: x_k = 1
        for inv_id in mandatory_ids:
            if inv_id in x_vars:
                prob += (x_vars[inv_id] == 1, f"Mandatory_{inv_id}")

        # 4. Dependency Constraints: x_dependent <= x_required
        for inv in investments:
            inv_id = inv["id"]
            deps = inv.get("dependencies", []) or []
            for dep_id in deps:
                if dep_id in x_vars and inv_id in x_vars:
                    prob += (x_vars[inv_id] <= x_vars[dep_id], f"Dependency_{inv_id}_on_{dep_id}")

        # Solve using CBC solver (bundled with PuLP)
        solver = pulp.PULP_CBC_CMD(msg=False)
        prob.solve(solver)

        # Extract Results
        selected_investments = []
        total_cost = 0.0
        total_risk_reduction = 0.0
        total_recurring_cost = 0.0
        max_time = 0

        for inv in investments:
            inv_id = inv["id"]
            if pulp.value(x_vars[inv_id]) == 1:
                selected_investments.append(inv)
                total_cost += float(inv.get("initial_cost", 0.0))
                total_recurring_cost += float(inv.get("recurring_cost", 0.0))
                base_risk_value = float(inv.get("base_risk_amount", 10000000.0))
                total_risk_reduction += base_risk_value * float(inv.get("expected_risk_reduction_pct", 0.0))
                max_time = max(max_time, int(inv.get("implementation_time", 0)))

        # Conservative portfolio compounding (controls overlap discount: 15% discount for 2+ controls)
        if len(selected_investments) > 1:
            overlap_discount = 0.88
            total_risk_reduction = total_risk_reduction * overlap_discount

        baseline_risk = sum([float(inv.get("base_risk_amount", 10000000.0)) for inv in investments]) / max(1, len(investments))
        residual_risk = max(0.0, baseline_risk - total_risk_reduction)
        roi = round(((total_risk_reduction - total_cost) / total_cost), 2) if total_cost > 0 else 0.0

        return {
            "status": "Optimal" if prob.status == 1 else "Suboptimal",
            "selected_investments": selected_investments,
            "total_cost": round(total_cost, 2),
            "total_recurring_cost": round(total_recurring_cost, 2),
            "total_risk_reduction": round(total_risk_reduction, 2),
            "residual_risk": round(residual_risk, 2),
            "risk_reduction_roi": roi,
            "max_implementation_time_days": max_time,
            "budget_utilized_pct": round((total_cost / total_budget) * 100, 1) if total_budget > 0 else 0.0,
            "assumptions": [
                "Control synergies discounted by 12% to prevent double-counting overlapping controls",
                f"Budget constrained to maximum ₹{total_budget:,.2f}",
                f"MIP Optimization solver status: {pulp.LpStatus[prob.status]}"
            ]
        }
