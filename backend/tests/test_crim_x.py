import pytest
from httpx import AsyncClient
from app.engines.crim_x_engine import CRIMXEngine


def test_crim_x_layer0_foundation_encoder():
    """Verify Layer 0 masked feature representation produces normalized embeddings."""
    entity_feat = {
        "technical_debt_score": 0.52,
        "internet_facing_ratio": 0.40,
        "cloud_density": 0.70,
        "mfa_coverage": 0.90,
        "edr_coverage": 0.85,
        "vendor_exposure_index": 0.35
    }
    res = CRIMXEngine.encode_foundation_representation(entity_feat, cross_domain_prior=True)
    assert res["embedding_dim"] == 4
    assert len(res["latent_vector"]) == 4
    assert res["few_shot_transferability_score"] > 0.80
    assert res["representation_stability"] >= 0.90


def test_crim_x_layer1_tgn_dynamics():
    """Verify Layer 1 spatio-temporal dynamics detection."""
    tgn = CRIMXEngine.evaluate_temporal_graph_dynamics(node_count=1000, recent_edge_mutations=50, time_window_days=30)
    assert tgn["monitored_nodes"] == 1000
    assert tgn["temporal_drift_velocity"] > 0.0
    assert tgn["compound_exposure_amplification"] >= 1.0
    assert len(tgn["joint_attention_hotspots"]) >= 1


def test_crim_x_layer2_causal_dml():
    """Verify Layer 2 Double Machine Learning isolates causal treatment effect theta."""
    interventions = CRIMXEngine.estimate_causal_treatment_effects()
    assert len(interventions) >= 5

    for c in interventions:
        assert c.causal_effect_theta_inr > 0
        assert c.causal_identification_strategy in [
            "natural_experiment", "instrumental_variable", "synthetic_control", "observational_dml"
        ]
        assert 0.0 <= c.causal_confidence_score <= 1.0
        assert c.p_value < 0.05
        # Causal theta should not exceed naive correlational estimate (protects against omitted variable bias)
        assert c.causal_effect_theta_inr <= c.naive_correlational_risk_reduction_inr


def test_crim_x_layer3_conformal_prediction():
    """Verify Layer 3 finite-sample coverage guarantee computation."""
    res = CRIMXEngine.calculate_conformal_coverage(
        point_prediction_eal_inr=184200000.0,
        target_coverage=0.90
    )
    assert res["nominal_target_coverage"] == 0.90
    assert res["lower_bound_inr"] < res["point_prediction_eal_inr"]
    assert res["upper_bound_inr"] > res["point_prediction_eal_inr"]
    assert res["interval_width_inr"] == round(res["upper_bound_inr"] - res["lower_bound_inr"], 2)
    assert res["is_coverage_valid"] is True


def test_crim_x_layer4_moe_gating():
    """Verify Layer 4 mixture-of-experts gating softmax normalization."""
    moe = CRIMXEngine.evaluate_moe_gating(data_maturity_years=3.0, record_count=20000)
    contributions = moe["expert_contributions"]
    total_w = sum(e["weight"] for e in contributions)
    assert pytest.approx(total_w, 0.05) == 1.0
    assert any(e["expert"] == "Causal DML Estimator" for e in contributions)


def test_crim_x_layer5_adversarial_red_team():
    """Verify Layer 5 minimax adversarial perturbation stress testing."""
    red_team = CRIMXEngine.run_adversarial_red_team_simulation(base_eal_inr=100000000.0)
    assert len(red_team["adversarial_scenarios"]) >= 3
    assert red_team["minimax_worst_case_eal_inr"] > 100000000.0
    assert 0.0 <= red_team["model_adversarial_robustness_index"] <= 1.0


def test_crim_x_layer6_pareto_frontier():
    """Verify Layer 6 NSGA-II non-dominated Pareto sorting."""
    res = CRIMXEngine.compute_multi_objective_pareto_frontier(budget_limit_inr=15000000.0, max_days=100)
    portfolios = res["portfolios"]
    assert len(portfolios) >= 1

    for p in portfolios:
        assert p["total_cost_inr"] <= 15000000.0
        assert p["total_implementation_days"] <= 100
        assert p["causal_risk_reduction_inr"] > 0
        assert p["rosi_ratio"] >= 0

    # Ensure tagged portfolios exist
    tags = [p["tag"] for p in portfolios]
    assert "balanced" in tags or "max_reduction" in tags


def test_crim_x_layer7_continual_learning():
    """Verify Layer 7 safe online bandit feedback update."""
    fb = CRIMXEngine.process_continual_learning_update(
        quarter="2026-Q3",
        approved_portfolio_id="port_01",
        realized_loss_inr=10000000.0,
        realized_cost_inr=5000000.0
    )
    assert fb["model_weight_update_applied"] is True
    assert "Bounded" in fb["safety_projection_status"]


def test_crim_x_layer8_governance():
    """Verify Layer 8 governance model card and cryptographic SHA-256 hash."""
    gov = CRIMXEngine.generate_governance_model_card()
    assert len(gov["sha256_governance_hash"]) == 64
    assert gov["verification_status"] == "Cryptographically Sealed & Verified"
    assert "model_card" in gov


@pytest.mark.asyncio
async def test_crim_x_api_endpoints(client: AsyncClient):
    """Test full CRIM-X API suite endpoints."""
    # 1. Full pipeline execution
    resp = await client.post("/api/v1/crim-x/quantify", json={"budget_limit_inr": 12000000.0, "target_coverage": 0.90})
    assert resp.status_code == 200
    data = resp.json()
    assert "layer_0_foundation_encoder" in data
    assert "layer_2_causal_dml_effects" in data
    assert "layer_6_pareto_frontier" in data

    # 2. Causal effects endpoint
    resp = await client.get("/api/v1/crim-x/causal-effects")
    assert resp.status_code == 200
    assert len(resp.json()["candidate_interventions"]) >= 5

    # 3. Pareto frontier endpoint
    resp = await client.get("/api/v1/crim-x/pareto-frontier?budget_limit_inr=10000000.0&max_days=90")
    assert resp.status_code == 200
    assert resp.json()["budget_limit_inr"] == 10000000.0

    # 4. Conformal bounds endpoint
    resp = await client.get("/api/v1/crim-x/conformal-bounds?nominal_coverage=0.95")
    assert resp.status_code == 200
    assert resp.json()["nominal_target_coverage"] == 0.95

    # 5. Red team stress endpoint
    resp = await client.get("/api/v1/crim-x/red-team-stress")
    assert resp.status_code == 200
    assert "adversarial_scenarios" in resp.json()

    # 6. Model card endpoint
    resp = await client.get("/api/v1/crim-x/model-card")
    assert resp.status_code == 200
    assert "sha256_governance_hash" in resp.json()

    # 7. Continual feedback endpoint
    resp = await client.post("/api/v1/crim-x/continual-feedback", json={
        "quarter": "2026-Q3",
        "approved_portfolio_id": "port_01",
        "realized_loss_inr": 11000000.0,
        "realized_cost_inr": 4000000.0
    })
    assert resp.status_code == 200
    assert resp.json()["model_weight_update_applied"] is True

