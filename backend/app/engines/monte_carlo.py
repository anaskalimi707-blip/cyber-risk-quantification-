import time
import numpy as np
from scipy import stats
from typing import Dict, Any, List, Optional
from app.engines.fair_engine import FAIREngine


class MonteCarloEngine:
    """
    Probabilistic Cyber Risk Simulator running 10,000 to 50,000 iterations.
    Simulates:
      - Threat events via Poisson distribution
      - Attack success via Beta/Triangular distribution
      - Financial loss magnitude via Lognormal distribution
    """

    @staticmethod
    def run_simulation(
        threat_event_frequency_lambda: float = 0.20,
        vulnerability_min: float = 0.10,
        vulnerability_mode: float = 0.25,
        vulnerability_max: float = 0.50,
        control_strength: float = 0.64,
        loss_magnitude_median: float = 50000000.0,  # ₹5 Crore
        loss_magnitude_p95: float = 150000000.0,    # ₹15 Crore
        iterations: int = 10000,
        random_seed: Optional[int] = 42,
    ) -> Dict[str, Any]:
        start_time = time.perf_counter()
        
        if random_seed is not None:
            np.random.seed(random_seed)

        # 1. Sample annual threat event occurrences (Poisson process)
        # Each trial simulates a 1-year realization
        event_counts = np.random.poisson(lam=max(0.001, threat_event_frequency_lambda), size=iterations)

        # 2. Sample probability of vulnerability exploitation (Triangular distribution)
        vuln_probabilities = np.random.triangular(
            left=max(0.01, vulnerability_min),
            mode=max(vulnerability_min, vulnerability_mode),
            right=max(vulnerability_mode, vulnerability_max),
            size=iterations
        )

        # 3. Defensive control barrier effectiveness (effective resistance = control_strength)
        effective_defense = max(0.0, min(0.99, control_strength))
        
        # Realized loss events per year = count * vuln_prob * (1 - defense)
        # Using binomial or compounding probability for discrete loss events
        annual_loss_events = np.zeros(iterations, dtype=int)
        for i in range(iterations):
            count = event_counts[i]
            if count > 0:
                p_success = vuln_probabilities[i] * (1.0 - effective_defense)
                annual_loss_events[i] = np.random.binomial(n=count, p=min(1.0, max(0.0, p_success)))

        # 4. Sample Loss Magnitude per loss event from Lognormal distribution
        mu, sigma = FAIREngine.calculate_lognormal_parameters(loss_magnitude_median, loss_magnitude_p95)
        
        annual_total_losses = np.zeros(iterations)
        for i in range(iterations):
            events = annual_loss_events[i]
            if events > 0:
                # Sum the loss magnitudes of all realized loss events in that year
                event_losses = np.random.lognormal(mean=mu, sigma=sigma, size=events)
                annual_total_losses[i] = np.sum(event_losses)

        # 5. Compute Financial Risk Metrics
        expected_annual_loss = float(np.mean(annual_total_losses))
        median_loss = float(np.median(annual_total_losses))
        p90_loss = float(np.percentile(annual_total_losses, 90))
        p95_loss = float(np.percentile(annual_total_losses, 95))
        p99_loss = float(np.percentile(annual_total_losses, 99))
        var_95 = p95_loss
        
        # Expected Shortfall (Conditional Value at Risk above P95)
        tail_losses = annual_total_losses[annual_total_losses >= p95_loss]
        expected_shortfall = float(np.mean(tail_losses)) if len(tail_losses) > 0 else p95_loss

        # 6. Confidence Interval for EAL (Bootstrap / Standard Error)
        std_err = float(np.std(annual_total_losses) / np.sqrt(iterations))
        ci_lower = max(0.0, expected_annual_loss - 1.645 * std_err)
        ci_upper = expected_annual_loss + 1.645 * std_err

        # 7. Generate Loss Exceedance Curve (P(Loss >= X))
        sorted_losses = np.sort(annual_total_losses)
        percentiles = np.linspace(50, 99.9, 20)
        loss_exceedance = []
        for p in percentiles:
            threshold = float(np.percentile(sorted_losses, p))
            exceedance_prob = float(np.mean(annual_total_losses >= threshold))
            loss_exceedance.append({
                "loss_threshold": round(threshold, 2),
                "exceedance_probability": round(exceedance_prob, 4),
                "percentile": round(p, 1)
            })

        # 8. Histogram Bins for Interactive UI
        max_plot_loss = max(p99_loss, expected_annual_loss * 2.5)
        bins = np.linspace(0, max_plot_loss, 15)
        counts, bin_edges = np.histogram(annual_total_losses, bins=bins)
        histogram_bins = []
        for j in range(len(counts)):
            histogram_bins.append({
                "bin_start": round(float(bin_edges[j]), 2),
                "bin_end": round(float(bin_edges[j+1]), 2),
                "count": int(counts[j]),
                "frequency": round(float(counts[j] / iterations), 4)
            })

        # 9. Sensitivity Rankings (Spearman Rank Correlation)
        corr_threat, _ = stats.spearmanr(event_counts, annual_total_losses)
        corr_vuln, _ = stats.spearmanr(vuln_probabilities, annual_total_losses)
        
        sensitivity_rankings = [
            {"factor": "Threat Event Frequency (Adversary Activity)", "correlation": round(float(corr_threat), 3), "rank": 1},
            {"factor": "Vulnerability Exposure & Exploitability", "correlation": round(float(corr_vuln), 3), "rank": 2},
            {"factor": "Control Defense Degradation", "correlation": round(float(1.0 - effective_defense), 3), "rank": 3},
        ]
        sensitivity_rankings.sort(key=lambda x: abs(x["correlation"]), reverse=True)

        exec_time = round((time.perf_counter() - start_time) * 1000, 2)

        return {
            "iterations": iterations,
            "random_seed": random_seed,
            "expected_annual_loss": round(expected_annual_loss, 2),
            "median_loss": round(median_loss, 2),
            "percentile_90_loss": round(p90_loss, 2),
            "percentile_95_loss": round(p95_loss, 2),
            "value_at_risk_95": round(var_95, 2),
            "expected_shortfall": round(expected_shortfall, 2),
            "confidence_interval_90": {
                "lower_bound": round(ci_lower, 2),
                "upper_bound": round(ci_upper, 2),
            },
            "histogram_bins": histogram_bins,
            "loss_exceedance_curve": loss_exceedance,
            "sensitivity_rankings": sensitivity_rankings,
            "execution_time_ms": exec_time,
        }
