from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.security import create_access_token, create_refresh_token, decode_token
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.auth import LoginRequest, TokenResponse, RefreshRequest, UserResponse, PermissionCheckResponse
from app.schemas.common import ResponseEnvelope, MetaData
from app.services.auth_service import AuthService
from app.core.errors import CyberOptixException

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=ResponseEnvelope[TokenResponse])
async def login(req: LoginRequest, db: AsyncSession = Depends(get_db)):
    user = await AuthService.authenticate_user(db, email=req.email, password=req.password)
    access_token = create_access_token(subject=user.id, claims={"org_id": user.organization_id, "role": user.role})
    refresh_token = create_refresh_token(subject=user.id)

    return ResponseEnvelope(
        data=TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            expires_in=86400
        )
    )


@router.post("/refresh", response_model=ResponseEnvelope[TokenResponse])
async def refresh_token(req: RefreshRequest, db: AsyncSession = Depends(get_db)):
    payload = decode_token(req.refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise CyberOptixException(status_code=status.HTTP_401_UNAUTHORIZED, title="Invalid Token", detail="Invalid refresh token.")

    user_id = payload.get("sub")
    access_token = create_access_token(subject=user_id)
    new_refresh = create_refresh_token(subject=user_id)

    return ResponseEnvelope(
        data=TokenResponse(
            access_token=access_token,
            refresh_token=new_refresh,
            token_type="bearer",
            expires_in=86400
        )
    )


@router.post("/logout", response_model=ResponseEnvelope[dict])
async def logout(current_user: User = Depends(get_current_user)):
    return ResponseEnvelope(data={"message": "Successfully logged out."})


@router.get("/me", response_model=ResponseEnvelope[UserResponse])
async def get_current_user_profile(current_user: User = Depends(get_current_user)):
    return ResponseEnvelope(data=UserResponse.model_validate(current_user))


@router.get("/permissions", response_model=ResponseEnvelope[PermissionCheckResponse])
async def get_user_permissions(current_user: User = Depends(get_current_user)):
    perms = AuthService.get_user_permissions(current_user)
    return ResponseEnvelope(
        data=PermissionCheckResponse(
            user_id=current_user.id,
            role=current_user.role,
            permissions=perms,
            accessible_services=["*"] if current_user.role in ["CISO", "Org Admin"] else ["Core Banking"]
        )
    )
