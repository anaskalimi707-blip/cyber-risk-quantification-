from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.ml import (
    BreachPredictionRequest,
    BreachPredictionResponse,
    MLModelMetricsResponse,
    FeatureImportanceResponse
)
from app.schemas.common import ResponseEnvelope
from app.services.ml_service import MLService

router = APIRouter(prefix="/ml", tags=["Machine Learning Risk Engine"])


@router.post("/predict-breach-probability", response_model=ResponseEnvelope[BreachPredictionResponse])
async def predict_breach_probability(
    req: BreachPredictionRequest,
    current_user: User = Depends(get_current_user)
):
    res = MLService.predict_risk(req)
    return ResponseEnvelope(data=res)


@router.post("/predict-asset-risk/{asset_id}", response_model=ResponseEnvelope[BreachPredictionResponse])
async def predict_asset_risk(
    asset_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res = await MLService.predict_risk_for_asset(db, asset_id, current_user.organization_id)
    return ResponseEnvelope(data=res)


@router.get("/model-metrics", response_model=ResponseEnvelope[MLModelMetricsResponse])
async def get_model_metrics(
    current_user: User = Depends(get_current_user)
):
    metrics = MLService.get_metrics()
    return ResponseEnvelope(data=MLModelMetricsResponse(**metrics))


@router.get("/feature-importance", response_model=ResponseEnvelope[FeatureImportanceResponse])
async def get_feature_importance(
    current_user: User = Depends(get_current_user)
):
    features = MLService.get_feature_importances()
    return ResponseEnvelope(
        data=FeatureImportanceResponse(
            features=features,
            model_type="RandomForestClassifier"
        )
    )
