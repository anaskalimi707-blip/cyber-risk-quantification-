import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_health_check(client: AsyncClient):
    response = await client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"


@pytest.mark.asyncio
async def test_readiness_check(client: AsyncClient):
    response = await client.get("/ready")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ready"


@pytest.mark.asyncio
async def test_executive_dashboard(client: AsyncClient):
    response = await client.get("/api/v1/dashboard/executive")
    assert response.status_code == 200
    res = response.json()
    assert res["data"]["currency"] == "INR"
    assert res["data"]["expected_annual_loss_inr"] > 0
    assert res["data"]["money_at_risk_today_inr"] > 0


@pytest.mark.asyncio
async def test_ciso_dashboard(client: AsyncClient):
    response = await client.get("/api/v1/dashboard/ciso")
    assert response.status_code == 200
    res = response.json()
    assert "data" in res
    assert res["data"]["mean_control_effectiveness"] > 0


@pytest.mark.asyncio
async def test_risk_scenarios_list(client: AsyncClient):
    response = await client.get("/api/v1/risk-scenarios")
    assert response.status_code == 200
    res = response.json()
    assert len(res["data"]) > 0


@pytest.mark.asyncio
async def test_investment_optimization(client: AsyncClient):
    payload = {
        "budget": 6000000.0,
        "planning_period": "FY 2026-2027",
        "objective": "Maximize Total Risk Reduction"
    }
    response = await client.post("/api/v1/investments/optimize", json=payload)
    assert response.status_code == 200
    res = response.json()
    assert "data" in res
    assert res["data"]["total_cost"] <= 6000000.0
    assert len(res["data"]["selected_investments"]) > 0


@pytest.mark.asyncio
async def test_ai_copilot_chat(client: AsyncClient):
    payload = {
        "query": "What is our highest risk scenario and how do we reduce it?"
    }
    response = await client.post("/api/v1/ai/chat", json=payload)
    assert response.status_code == 200
    res = response.json()
    assert "data" in res
    assert "Ransomware" in res["data"]["answer"]
    assert len(res["data"]["evidence"]) > 0
    assert res["data"]["requires_human_approval"] is True
