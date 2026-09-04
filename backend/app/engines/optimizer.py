from typing import List, Dict, Any, Optional
import pulp


class InvestmentOptimizer:
    """
    Mixed-Integer Linear Programming (MILP) Optimizer using PuLP.
    Solves the Multi-Objective 0/1 Knapsack & Portfolio Selection Problem:
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
        eligible_investments = [
            inv for inv in investments
            if max_implementation_days is None
            or int(inv.get("implementation_time", 0)) <= max_implementation_days
        ]
        eligible_ids = {inv["id"] for inv in eligible_investments}
        excluded_mandatory_ids = mandatory_ids - eligible_ids

        if excluded_mandatory_ids:
            return {
                "status": "Infeasible",
                "selected_investments": [],
                "total_cost": 0.0,
                "total_recurring_cost": 0.0,
                "total_risk_reduction": 0.0,
                "residual_risk": 0.0,
                "risk_reduction_roi": 0.0,
                "max_implementation_time_days": 0,
                "budget_utilized_pct": 0.0,
                "assumptions": [
                    "A mandatory investment exceeds the maximum implementation-time constraint.",
                    f"Excluded mandatory investment IDs: {', '.join(sorted(excluded_mandatory_ids))}",
                ],
            }

        if not eligible_investments:
            return {
                "status": "Infeasible",
                "selected_investments": [],
                "total_cost": 0.0,
                "total_recurring_cost": 0.0,
                "total_risk_reduction": 0.0,
                "residual_risk": 0.0,
                "risk_reduction_roi": 0.0,
                "max_implementation_time_days": 0,
                "budget_utilized_pct": 0.0,
                "assumptions": ["No investment candidates meet the maximum implementation-time constraint."],
            }

        # Create PuLP Linear Problem
        prob = pulp.LpProblem("CyberRisk_Investment_Optimization", pulp.LpMaximize)

        # Decision Variables x_i in {0, 1}
        x_vars = {}
        for inv in eligible_investments:
            inv_id = inv["id"]
            x_vars[inv_id] = pulp.LpVariable(f"invest_{inv_id}", cat=pulp.LpBinary)

        # 1. Objective Function formulation
        objective_terms = []
        for inv in eligible_investments:
            inv_id = inv["id"]
            cost = float(inv.get("initial_cost", 0.0))
            risk_red_pct = float(inv.get("expected_risk_reduction_pct", 0.0))
            base_risk_value = float(inv.get("base_risk_amount", 10000000.0))
            risk_reduction_amount = base_risk_value * risk_red_pct

            if objective_mode == "Maximize ROI":
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
            pulp.lpSum([float(inv.get("initial_cost", 0.0)) * x_vars[inv["id"]] for inv in eligible_investments]) <= total_budget,
            "Total_Budget_Limit"
        )

        # 3. Mandatory Investment Constraints: x_k = 1
        for inv_id in mandatory_ids:
            if inv_id in x_vars:
                prob += (x_vars[inv_id] == 1, f"Mandatory_{inv_id}")

        # 4. Dependency Constraints: x_dependent <= x_required
        for inv in eligible_investments:
            inv_id = inv["id"]
            deps = inv.get("dependencies", []) or []
            for dep_id in deps:
                if dep_id in x_vars and inv_id in x_vars:
                    prob += (x_vars[inv_id] <= x_vars[dep_id], f"Dependency_{inv_id}_on_{dep_id}")

        # Solve using CBC solver
        solver = pulp.PULP_CBC_CMD(msg=False)
        prob.solve(solver)

        if prob.status != pulp.LpStatusOptimal:
            return {
                "status": "Infeasible",
                "selected_investments": [],
                "total_cost": 0.0,
                "total_recurring_cost": 0.0,
                "total_risk_reduction": 0.0,
                "residual_risk": 0.0,
                "risk_reduction_roi": 0.0,
                "max_implementation_time_days": 0,
                "budget_utilized_pct": 0.0,
                "assumptions": [
                    f"MIP Optimization solver status: {pulp.LpStatus[prob.status]}",
                    f"Budget constrained to maximum ₹{total_budget:,.2f}",
                ],
            }

        # Extract Results
        selected_investments = []
        total_cost = 0.0
        total_risk_reduction = 0.0
        total_recurring_cost = 0.0
        max_time = 0

        for inv in eligible_investments:
            inv_id = inv["id"]
            if pulp.value(x_vars[inv_id]) == 1:
                selected_investments.append(inv)
                total_cost += float(inv.get("initial_cost", 0.0))
                total_recurring_cost += float(inv.get("recurring_cost", 0.0))
                base_risk_value = float(inv.get("base_risk_amount", 10000000.0))
                total_risk_reduction += base_risk_value * float(inv.get("expected_risk_reduction_pct", 0.0))
                max_time = max(max_time, int(inv.get("implementation_time", 0)))

        # Controls synergy & overlap discount
        if len(selected_investments) > 1:
            overlap_discount = 0.88
            total_risk_reduction = total_risk_reduction * overlap_discount

        baseline_risk = sum([float(inv.get("base_risk_amount", 10000000.0)) for inv in eligible_investments]) / max(1, len(eligible_investments))
        residual_risk = max(0.0, baseline_risk - total_risk_reduction)
        roi = round(((total_risk_reduction - total_cost) / total_cost), 2) if total_cost > 0 else 0.0

        # Payback period in months
        monthly_risk_savings = (total_risk_reduction / 12.0)
        payback_months = round(total_cost / max(1.0, monthly_risk_savings), 1) if monthly_risk_savings > 0 else 12.0

        return {
            "status": "Optimal" if prob.status == 1 else "Suboptimal",
            "selected_investments": selected_investments,
            "total_cost": round(total_cost, 2),
            "total_recurring_cost": round(total_recurring_cost, 2),
            "total_risk_reduction": round(total_risk_reduction, 2),
            "residual_risk": round(residual_risk, 2),
            "risk_reduction_roi": roi,
            "payback_period_months": payback_months,
            "max_implementation_time_days": max_time,
            "budget_utilized_pct": round((total_cost / total_budget) * 100, 1) if total_budget > 0 else 0.0,
            "assumptions": [
                "Control synergies discounted by 12% to prevent double-counting overlapping controls",
                f"Budget constrained to maximum ₹{total_budget:,.2f}",
                f"Implementation time constrained to {max_implementation_days if max_implementation_days is not None else 'no maximum'} days",
                f"MIP Optimization solver status: {pulp.LpStatus[prob.status]}"
            ]
        }

    @staticmethod
    def generate_pareto_frontier(
        investments: List[Dict[str, Any]],
        min_budget: float = 1000000.0,
        max_budget: float = 20000000.0,
        steps: int = 8,
    ) -> Dict[str, Any]:
        """
        Generates the continuous Pareto Optimal Frontier by executing sequential
        MILP optimizations across budget slices.
        Identifies the Diminishing Marginal Returns 'Efficiency Sweet Spot'.
        """
        budgets = [min_budget + i * (max_budget - min_budget) / max(1, steps - 1) for i in range(steps)]
        frontier_points = []
        max_roi = -1.0
        sweet_spot_point = None

        for b in budgets:
            res = InvestmentOptimizer.optimize_portfolio(
                investments=investments,
                total_budget=b,
                objective_mode="Maximize Total Risk Reduction"
            )
            if res["status"] in ("Optimal", "Suboptimal") and res["total_cost"] > 0:
                cost = res["total_cost"]
                risk_red = res["total_risk_reduction"]
                roi = res["risk_reduction_roi"]
                point = {
                    "budget": round(b, 2),
                    "total_cost": round(cost, 2),
                    "total_risk_reduction": round(risk_red, 2),
                    "residual_risk": round(res["residual_risk"], 2),
                    "risk_reduction_roi": roi,
                    "selected_count": len(res["selected_investments"]),
                    "selected_names": [x["name"] for x in res["selected_investments"]]
                }
                frontier_points.append(point)
                if roi > max_roi:
                    max_roi = roi
                    sweet_spot_point = point

        return {
            "frontier_points": frontier_points,
            "sweet_spot": sweet_spot_point or (frontier_points[len(frontier_points)//2] if frontier_points else {}),
            "min_budget": min_budget,
            "max_budget": max_budget,
            "steps": steps
        }

    @staticmethod
    def compare_portfolio_strategies(
        investments: List[Dict[str, Any]],
        target_budget: float = 10000000.0
    ) -> List[Dict[str, Any]]:
        """
        Evaluates 4 distinct security investment strategies side-by-side:
          1. Status Quo (Zero New Investment)
          2. Max ROI / Quick Wins (ROSI Maximization)
          3. AI-Optimal Balanced Portfolio (MILP Risk Reduction)
          4. Aggressive Defense (Zero-Breach Tolerance / High Budget)
        """
        # 1. Status Quo
        baseline_risk = sum([float(inv.get("base_risk_amount", 10000000.0)) for inv in investments]) / max(1, len(investments))
        
        # 2. Max ROI
        opt_roi = InvestmentOptimizer.optimize_portfolio(investments, target_budget * 0.7, objective_mode="Maximize ROI")
        
        # 3. AI-Optimal
        opt_balanced = InvestmentOptimizer.optimize_portfolio(investments, target_budget, objective_mode="Maximize Total Risk Reduction")
        
        # 4. Aggressive
        opt_aggressive = InvestmentOptimizer.optimize_portfolio(investments, target_budget * 1.5, objective_mode="Maximize Total Risk Reduction")

        return [
            {
                "strategy_id": "status_quo",
                "name": "Status Quo (No Action)",
                "total_cost": 0.0,
                "expected_risk_reduction": 0.0,
                "residual_risk": round(baseline_risk, 2),
                "risk_reduction_roi": 0.0,
                "payback_months": 0.0,
                "selected_count": 0,
                "badge": "High Exposure",
                "badge_color": "rose",
                "description": "Retains all existing vulnerability and compliance gaps without capital expenditure."
            },
            {
                "strategy_id": "max_roi",
                "name": "Quick Wins (Max ROSI)",
                "total_cost": opt_roi["total_cost"],
                "expected_risk_reduction": opt_roi["total_risk_reduction"],
                "residual_risk": opt_roi["residual_risk"],
                "risk_reduction_roi": opt_roi["risk_reduction_roi"],
                "payback_months": opt_roi.get("payback_period_months", 4.2),
                "selected_count": len(opt_roi["selected_investments"]),
                "badge": f"{opt_roi['risk_reduction_roi']}x ROI",
                "badge_color": "amber",
                "description": "Focuses capital strictly on lowest-cost, highest-leverage security controls."
            },
            {
                "strategy_id": "ai_optimal",
                "name": "AI-Optimal Balanced",
                "total_cost": opt_balanced["total_cost"],
                "expected_risk_reduction": opt_balanced["total_risk_reduction"],
                "residual_risk": opt_balanced["residual_risk"],
                "risk_reduction_roi": opt_balanced["risk_reduction_roi"],
                "payback_months": opt_balanced.get("payback_period_months", 6.5),
                "selected_count": len(opt_balanced["selected_investments"]),
                "badge": "Recommended",
                "badge_color": "cyan",
                "description": "Mathematically optimal Knapsack allocation maximizing risk reduction within target budget."
            },
            {
                "strategy_id": "aggressive",
                "name": "Zero-Tolerance Defense",
                "total_cost": opt_aggressive["total_cost"],
                "expected_risk_reduction": opt_aggressive["total_risk_reduction"],
                "residual_risk": opt_aggressive["residual_risk"],
                "risk_reduction_roi": opt_aggressive["risk_reduction_roi"],
                "payback_months": opt_aggressive.get("payback_period_months", 11.2),
                "selected_count": len(opt_aggressive["selected_investments"]),
                "badge": "Max Protection",
                "badge_color": "indigo",
                "description": "Deploys comprehensive defense-in-depth addressing all active attack vectors."
            }
        ]
