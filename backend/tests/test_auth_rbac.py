import pytest
from app.core.security import get_password_hash, verify_password, create_access_token, decode_token
from app.services.auth_service import AuthService
from app.models.user import User


def test_password_hashing():
    pwd = "EnterpriseSecretPassword123!"
    hashed = get_password_hash(pwd)
    assert hashed != pwd
    assert verify_password(pwd, hashed) is True
    assert verify_password("WrongPassword", hashed) is False


def test_jwt_token_generation_and_decoding():
    token = create_access_token(subject="user_123", claims={"role": "CISO", "org_id": "org_456"})
    decoded = decode_token(token)
    assert decoded is not None
    assert decoded["sub"] == "user_123"
    assert decoded["role"] == "CISO"
    assert decoded["org_id"] == "org_456"


def test_rbac_permissions():
    ciso_user = User(id="u1", organization_id="o1", email="ciso@acme.com", hashed_password="xxx", full_name="CISO", role="CISO", status="active")
    soc_user = User(id="u2", organization_id="o1", email="soc@acme.com", hashed_password="xxx", full_name="SOC", role="SOC Analyst", status="active")

    # CISO can approve risk & investments
    assert AuthService.has_permission(ciso_user, "risk:calculate") is True
    assert AuthService.has_permission(ciso_user, "investment:approve") is True

    # SOC analyst can manage vulnerabilities & incidents, but not approve multi-crore investment portfolios
    assert AuthService.has_permission(soc_user, "vulnerability:manage") is True
    assert AuthService.has_permission(soc_user, "investment:approve") is False
