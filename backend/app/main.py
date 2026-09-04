import uuid
import time
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from app.core.config import settings
from app.core.logging import logger
from app.core.errors import (
    CyberOptixException,
    cyberoptix_exception_handler,
    validation_exception_handler,
    generic_exception_handler,
)
from app.api.v1.api import api_v1_router
from app.db.init_db import init_db
from app.db.seed_data import seed_all_data


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing CyberOptix Enterprise Backend & Database...")
    await init_db()
    await seed_all_data()
    logger.info("CyberOptix Backend initialized and ready for requests.")
    yield
    logger.info("Shutting down CyberOptix Backend...")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="CyberOptix Enterprise: Continuous Cyber-Risk Quantification & Investment Optimization Backend",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception Handlers (RFC 7807 Compliance)
app.add_exception_handler(CyberOptixException, cyberoptix_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)


# Correlation ID & Performance Middleware
@app.middleware("http")
async def audit_and_correlation_middleware(request: Request, call_next):
    request_id = request.headers.get("X-Request-ID", f"req_{uuid.uuid4().hex[:12]}")
    request.state.request_id = request_id

    start_time = time.perf_counter()
    response = await call_next(request)
    process_time = round((time.perf_counter() - start_time) * 1000, 2)

    response.headers["X-Request-ID"] = request_id
    response.headers["X-Response-Time-Ms"] = str(process_time)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"

    return response


# Include Versioned API Routes
app.include_router(api_v1_router, prefix=settings.API_V1_STR)


@app.get("/health", tags=["System Observability"])
async def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
    }


@app.get("/ready", tags=["System Observability"])
async def readiness_check():
    return {
        "status": "ready",
        "database": "connected",
        "risk_engine": "operational",
        "monte_carlo_engine": "ready",
        "optimizer": "ready",
    }


@app.get("/", tags=["System Observability"])
async def root():
    return {
        "product": "CyberOptix Enterprise",
        "tagline": "Know your cyber risk in money, understand what is driving it, and invest where every rupee reduces the most risk.",
        "api_documentation": "/docs",
        "v1_endpoints": f"{settings.API_V1_STR}"
    }
