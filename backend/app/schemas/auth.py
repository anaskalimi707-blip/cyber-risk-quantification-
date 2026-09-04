from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, EmailStr, ConfigDict


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RefreshRequest(BaseModel):
    refresh_token: str


class UserResponse(BaseModel):
    id: str
    organization_id: str
    email: str
    full_name: str
    role: str
    status: str
    last_login_at: Optional[datetime] = None
    created_at: datetime
    custom_permissions: List[str] = []

    model_config = ConfigDict(from_attributes=True)


class PermissionCheckResponse(BaseModel):
    user_id: str
    role: str
    permissions: List[str]
    accessible_services: List[str]
