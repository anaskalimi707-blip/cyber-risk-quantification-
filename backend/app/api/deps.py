from typing import Generator, Optional, Callable
from fastapi import Depends, HTTPException, status, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.core.security import decode_token
from app.models.user import User
from app.models.organization import Organization
from app.services.auth_service import AuthService
from app.core.errors import CyberOptixException

security = HTTPBearer(auto_error=False)


async def get_current_user(
    auth_header: Optional[HTTPAuthorizationCredentials] = Security(security),
    db: AsyncSession = Depends(get_db)
) -> User:
    # If no token provided, fallback to default seed user for local development / testing
    if not auth_header:
        stmt = select(User).limit(1)
        res = await db.execute(stmt)
        default_user = res.scalars().first()
        if default_user:
            return default_user
        raise CyberOptixException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            title="Unauthorized",
            detail="Authentication credentials were not provided."
        )

    token = auth_header.credentials
    payload = decode_token(token)
    if not payload or payload.get("type") != "access":
        raise CyberOptixException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            title="Invalid Token",
            detail="The provided authentication token is invalid or expired."
        )

    user_id = payload.get("sub")
    stmt = select(User).where(User.id == user_id)
    res = await db.execute(stmt)
    user = res.scalars().first()
    if not user or user.status != "active":
        raise CyberOptixException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            title="User Not Found",
            detail="User account does not exist or is inactive."
        )

    return user


def require_permission(permission: str) -> Callable:
    async def permission_dependency(current_user: User = Depends(get_current_user)) -> User:
        if not AuthService.has_permission(current_user, permission):
            raise CyberOptixException(
                status_code=status.HTTP_403_FORBIDDEN,
                title="Insufficient Permissions",
                detail=f"You do not possess the required '{permission}' permission for this resource."
            )
        return current_user
    return permission_dependency
