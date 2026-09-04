import abc
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from pydantic import BaseModel


class SyncResult(BaseModel):
    connector_name: str
    status: str  # Success, Partial_Failure, Failed
    records_processed: int
    records_ingested: int
    records_failed: int
    data_quality_score: float
    started_at: datetime
    completed_at: datetime
    error_message: Optional[str] = None


class BaseConnector(abc.ABC):
    """
    Abstract Base Class for Enterprise Cyber Security Ingestion Connectors.
    Supports idempotency, retries, checkpointing, and data quality scoring.
    """

    def __init__(self, organization_id: str, config: Dict[str, Any]):
        self.organization_id = organization_id
        self.config = config
        self.last_sync_checkpoint: Optional[str] = None

    @abc.abstractmethod
    async def test_connection(self) -> bool:
        """Verifies API credentials and connectivity."""
        pass

    @abc.abstractmethod
    async def sync(self, incremental: bool = True) -> SyncResult:
        """Executes full or incremental data ingestion."""
        pass
