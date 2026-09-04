from typing import Optional, List, Dict
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.user import User
from app.models.organization import Organization
from app.core.security import verify_password, create_access_token, create_refresh_token
from app.core.errors import CyberOptixException
from fastapi import status


ROLE_PERMISSIONS: Dict[str, List[str]] = {
    "Platform Admin": ["*"],
    "Org Admin": [
        "risk:read", "risk:create", "risk:calculate", "risk:approve",
        "investment:read", "investment:create", "investment:optimize", "investment:approve",
        "evidence:read", "evidence:upload", "evidence:verify",
        "compliance:manage", "integration:manage", "user:manage", "audit:read", "report:export", "ai:access"
    ],
    "CISO": [
        "risk:read", "risk:create", "risk:calculate", "risk:approve",
        "investment:read", "investment:create", "investment:optimize", "investment:approve",
        "evidence:read", "evidence:upload", "evidence:verify",
        "compliance:manage", "audit:read", "report:export", "ai:access"
    ],
    "CFO": [
        "risk:read", "investment:read", "investment:approve", "report:export", "audit:read", "ai:access"
    ],
    "Board Viewer": [
        "risk:read", "investment:read", "report:export", "ai:access"
    ],
    "SOC Analyst": [
        "risk:read", "asset:read", "vulnerability:manage", "incident:manage", "evidence:upload", "evidence:read"
    ],
    "GRC Analyst": [
        "risk:read", "risk:create", "control:manage", "evidence:read", "evidence:upload", "compliance:manage", "report:export"
    ],
    "IT Owner": [
        "asset:read", "asset:manage", "control:read", "vulnerability:read"
    ],
    "Auditor": [
        "audit:read", "evidence:read", "compliance:manage", "report:export"
    ]
}


class AuthService:
    @staticmethod
    async def authenticate_user(db: AsyncSession, email: str, password: str) -> User:
        stmt = select(User).where(User.email == email)
        res = await db.execute(stmt)
        user = res.scalars().first()

        if not user:
            raise CyberOptixException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                title="Authentication Failed",
                detail="Invalid email or password credentials."
            )

        if not verify_password(password, user.hashed_password):
            raise CyberOptixException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                title="Authentication Failed",
                detail="Invalid email or password credentials."
            )

        if user.status != "active":
            raise CyberOptixException(
                status_code=status.HTTP_403_FORBIDDEN,
                title="Account Suspended",
                detail="Your user account is suspended or pending verification."
            )

        return user

    @staticmethod
    def get_user_permissions(user: User) -> List[str]:
        base_permissions = ROLE_PERMISSIONS.get(user.role, [])
        custom = user.custom_permissions or []
        return list(set(base_permissions + custom))

    @staticmethod
    def has_permission(user: User, required_permission: str) -> bool:
        perms = AuthService.get_user_permissions(user)
        if "*" in perms:
            return True
        if required_permission in perms:
            return True
        # Prefix match (e.g. risk:* satisfies risk:read)
        prefix = required_permission.split(":")[0] + ":*"
        return prefix in perms
