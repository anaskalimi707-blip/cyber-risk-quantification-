import hashlib
import json
from datetime import datetime, timezone
from typing import Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.audit_event import AuditEvent
from app.core.logging import logger


class AuditService:
    """
    Tamper-Evident Audit Logging Service.
    Chains each audit event SHA-256 hash with the previous event hash to prevent alteration.
    """

    @staticmethod
    async def log_event(
        db: AsyncSession,
        organization_id: str,
        action: str,
        resource_type: str,
        resource_id: str,
        actor_id: Optional[str] = None,
        previous_value: Optional[Dict[str, Any]] = None,
        new_value: Optional[Dict[str, Any]] = None,
        reason: Optional[str] = None,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
    ) -> AuditEvent:
        # Get the latest audit event for hash chaining
        stmt = (
            select(AuditEvent)
            .where(AuditEvent.organization_id == organization_id)
            .order_by(AuditEvent.created_at.desc())
            .limit(1)
        )
        res = await db.execute(stmt)
        last_event = res.scalars().first()
        prev_hash = last_event.tamper_hash if last_event else "GENESIS_BLOCK_CYBEROPTIX_2026"

        now_utc = datetime.now(timezone.utc)
        payload_string = (
            f"{prev_hash}|{organization_id}|{actor_id}|{action}|{resource_type}|"
            f"{resource_id}|{json.dumps(previous_value, sort_keys=True)}|"
            f"{json.dumps(new_value, sort_keys=True)}|{now_utc.isoformat()}"
        )
        tamper_hash = hashlib.sha256(payload_string.encode("utf-8")).hexdigest()

        event = AuditEvent(
            organization_id=organization_id,
            actor_id=actor_id,
            action=action,
            resource_type=resource_type,
            resource_id=resource_id,
            previous_value=previous_value,
            new_value=new_value,
            reason=reason,
            ip_address=ip_address,
            user_agent=user_agent,
            created_at=now_utc,
            tamper_hash=tamper_hash,
        )
        db.add(event)
        await db.commit()
        await db.refresh(event)

        logger.info(f"Audit log created: {action} on {resource_type}:{resource_id} by {actor_id} [Hash: {tamper_hash[:8]}...]")
        return event
