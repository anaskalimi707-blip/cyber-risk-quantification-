import pytest
from httpx import AsyncClient
from app.engines.ml_risk_model import CyberBreachMLModel


def test_ml_synthetic_data_generation():
    model = CyberBreachMLModel()
    X, y_class, y_reg = model.generate_synthetic_training_data(n_samples=500, random_seed=42)
    assert len(X) == 500
    assert len(y_class) == 500
    assert len(y_reg) == 500
    assert "cvss_score" in X.columns
    assert "epss_score" in X.columns
    assert "daily_revenue_at_risk_inr" in X.columns


def test_ml_model_training_and_validation():
    model = CyberBreachMLModel()
    results = model.train_models(n_samples=600, random_seed=42)
    assert results["status"] == "Trained & Validated Successfully"
    
    # Check Classifier Metrics
    c_metrics = results["classifier_metrics"]
    assert c_metrics["roc_auc"] >= 0.70
    assert c_metrics["accuracy"] >= 0.70
    assert c_metrics["cv_roc_auc_mean"] >= 0.70

    # Check Regressor Metrics
    r_metrics = results["regressor_metrics"]
    assert r_metrics["r2_score"] >= 0.60
    assert r_metrics["rmse_inr"] > 0


def test_ml_breach_prediction_inference():
    model = CyberBreachMLModel()
    features = {
        "cvss_score": 9.8,
        "epss_score": 0.85,
        "threat_capability": "High",
        "asset_criticality": "Critical",
        "internet_exposed": 1,
        "control_coverage": 0.50,
        "control_implementation": 0.60,
        "evidence_freshness": 0.70,
        "daily_revenue_at_risk_inr": 50000000.0,
        "rto_hours": 4.0
    }
    pred = model.predict_breach_risk(features)
    assert 0.0 <= pred["breach_probability"] <= 1.0
    assert pred["expected_annual_loss_inr"] > 0
    assert pred["risk_rating"] in ["Critical", "High", "Medium", "Low"]
    assert len(pred["top_risk_drivers"]) > 0


def test_ml_feature_importances():
    model = CyberBreachMLModel()
    importances = model.get_feature_importances()
    assert len(importances) > 0
    # Top features should have highest positive importance
    assert importances[0]["importance_score"] >= importances[-1]["importance_score"]


@pytest.mark.asyncio
async def test_ml_api_predict_endpoint(client: AsyncClient):
    payload = {
        "cvss_score": 9.8,
        "epss_score": 0.82,
        "threat_capability": "High",
        "asset_criticality": "Critical",
        "internet_exposed": 1,
        "control_coverage": 0.80,
        "control_implementation": 0.85,
        "evidence_freshness": 0.95,
        "daily_revenue_at_risk_inr": 50000000.0,
        "rto_hours": 2.0
    }
    response = await client.post("/api/v1/ml/predict-breach-probability", json=payload)
    assert response.status_code == 200
    res = response.json()
    assert "data" in res
    assert "breach_probability" in res["data"]
    assert "expected_annual_loss_inr" in res["data"]


@pytest.mark.asyncio
async def test_ml_api_metrics_endpoint(client: AsyncClient):
    response = await client.get("/api/v1/ml/model-metrics")
    assert response.status_code == 200
    res = response.json()
    assert "classifier_metrics" in res["data"]
    assert "regressor_metrics" in res["data"]


@pytest.mark.asyncio
async def test_ml_api_feature_importance_endpoint(client: AsyncClient):
    response = await client.get("/api/v1/ml/feature-importance")
    assert response.status_code == 200
    res = response.json()
    assert len(res["data"]["features"]) > 0
