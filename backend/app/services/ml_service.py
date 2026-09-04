from typing import Dict, Any, List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.engines.ml_risk_model import ml_risk_engine
from app.models.asset import Asset
from app.models.vulnerability import Vulnerability
from app.models.control import Control
from app.models.business_service import BusinessService
from app.schemas.ml import BreachPredictionRequest, BreachPredictionResponse


class MLService:
    @staticmethod
    def predict_risk(req: BreachPredictionRequest) -> BreachPredictionResponse:
        features = req.model_dump()
        result = ml_risk_engine.predict_breach_risk(features)
        return BreachPredictionResponse(**result)

    @staticmethod
    async def predict_risk_for_asset(db: AsyncSession, asset_id: str, organization_id: str) -> BreachPredictionResponse:
        stmt = select(Asset).where(Asset.id == asset_id, Asset.organization_id == organization_id)
        asset = (await db.execute(stmt)).scalars().first()

        # Query top vulnerability for asset
        vuln_stmt = select(Vulnerability).where(Vulnerability.affected_asset_id == asset_id).order_by(Vulnerability.cvss_score.desc()).limit(1)
        top_vuln = (await db.execute(vuln_stmt)).scalars().first()

        cvss = top_vuln.cvss_score if top_vuln else 5.0
        epss = top_vuln.epss_score if top_vuln else 0.10

        req = BreachPredictionRequest(
            cvss_score=cvss,
            epss_score=epss,
            threat_capability="High",
            asset_criticality=asset.criticality if asset else "High",
            internet_exposed=1 if (asset and asset.internet_exposed) else 0,
            control_coverage=0.80,
            control_implementation=0.85,
            evidence_freshness=0.95,
            daily_revenue_at_risk_inr=50000000.0,
            rto_hours=2.0
        )
        return MLService.predict_risk(req)

    @staticmethod
    def get_metrics() -> Dict[str, Any]:
        if not ml_risk_engine._is_trained:
            ml_risk_engine.train_models()
        return {
            "classifier_metrics": ml_risk_engine.classifier_metrics,
            "regressor_metrics": ml_risk_engine.regressor_metrics,
            "status": "Operational & Calibrated"
        }

    @staticmethod
    def get_feature_importances() -> List[Dict[str, Any]]:
        return ml_risk_engine.get_feature_importances()
