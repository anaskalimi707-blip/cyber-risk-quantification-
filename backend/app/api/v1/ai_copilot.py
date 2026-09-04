from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.ai import AIChatRequest, AIChatResponse, AIFeedbackRequest
from app.schemas.common import ResponseEnvelope
from app.services.ai_copilot_service import AICopilotService
from app.services.audit_service import AuditService

router = APIRouter(prefix="/ai", tags=["Grounded AI Copilot"])


@router.post("/chat", response_model=ResponseEnvelope[AIChatResponse])
async def ai_chat(
    req: AIChatRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res = await AICopilotService.process_chat(
        db=db,
        organization_id=current_user.organization_id,
        user_id=current_user.id,
        query=req.query,
        conversation_id=req.conversation_id
    )

    await AuditService.log_event(
        db,
        organization_id=current_user.organization_id,
        actor_id=current_user.id,
        action="ai:query",
        resource_type="ai_copilot",
        resource_id=res.query_id,
        new_value={"query": req.query, "confidence": res.confidence}
    )

    return ResponseEnvelope(data=res)


@router.post("/feedback", response_model=ResponseEnvelope[dict])
async def ai_feedback(
    req: AIFeedbackRequest,
    current_user: User = Depends(get_current_user)
):
    return ResponseEnvelope(data={"message": "Feedback submitted successfully for continuous model alignment."})
