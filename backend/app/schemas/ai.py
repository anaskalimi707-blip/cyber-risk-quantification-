from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field


class EvidenceCitation(BaseModel):
    evidence_id: str
    source_system: str
    collected_at: str
    content_summary: Optional[str] = None


class AIChatRequest(BaseModel):
    query: str = Field(..., json_schema_extra={"example": "What is our highest financial risk scenario and what investment reduces it most?"})
    conversation_id: Optional[str] = None
    context_filters: Dict[str, Any] = Field(default_factory=dict)


class AIChatResponse(BaseModel):
    query_id: str
    conversation_id: str
    answer: str
    key_findings: List[str] = []
    evidence: List[EvidenceCitation] = []
    assumptions: List[str] = []
    confidence: str = "High"  # High, Moderate, Low
    data_freshness: str = "Current (Last 24h)"
    suggested_actions: List[Dict[str, Any]] = []
    requires_human_approval: bool = True
    model_version: str = "cyberoptix-copilot-v1.0"
    created_at: str


class AIFeedbackRequest(BaseModel):
    query_id: str
    rating: int = Field(..., ge=1, le=5)  # 1 to 5 stars
    feedback_text: Optional[str] = None
    correction: Optional[str] = None
