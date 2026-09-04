from typing import Generic, TypeVar, Optional, List, Any, Dict
from datetime import datetime, timezone
from pydantic import BaseModel, Field

DataT = TypeVar("DataT")


class MetaData(BaseModel):
    request_id: str = "req_default"
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    total_count: Optional[int] = None
    page: Optional[int] = None
    page_size: Optional[int] = None


class ResponseEnvelope(BaseModel, Generic[DataT]):
    data: DataT
    meta: MetaData = Field(default_factory=MetaData)
    errors: List[Dict[str, Any]] = []


class PaginationParams(BaseModel):
    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=20, ge=1, le=100)
    search: Optional[str] = None
    sort_by: Optional[str] = None
    sort_order: Optional[str] = Field(default="desc", pattern="^(asc|desc)$")
