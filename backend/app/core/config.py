from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import AnyHttpUrl, field_validator


class Settings(BaseSettings):
    PROJECT_NAME: str = "CyberOptix Enterprise"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # Security
    SECRET_KEY: str = "cyberoptix-super-secret-enterprise-signing-key-change-in-prod-2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./cyberoptix.db"
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:8000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:8000",
    ]
    
    # Evidence Storage
    EVIDENCE_STORAGE_PATH: str = "./storage/evidence"
    REPORT_STORAGE_PATH: str = "./storage/reports"
    
    # Simulation defaults
    DEFAULT_MONTE_CARLO_ITERATIONS: int = 10000
    HIGH_VALUE_MONTE_CARLO_ITERATIONS: int = 50000
    
    # AI / Model Defaults
    AI_MODEL_NAME: str = "cyberoptix-risk-reasoner-v1"
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )


settings = Settings()
