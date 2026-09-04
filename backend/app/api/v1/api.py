from fastapi import APIRouter
from app.api.v1.auth import router as auth_router
from app.api.v1.organizations import router as org_router
from app.api.v1.assets import router as asset_router
from app.api.v1.business_services import router as bs_router
from app.api.v1.vulnerabilities import router as vuln_router
from app.api.v1.controls import router as control_router
from app.api.v1.evidence import router as evidence_router
from app.api.v1.risk_scenarios import router as risk_router
from app.api.v1.dashboard import router as dashboard_router
from app.api.v1.investments import router as investment_router
from app.api.v1.simulations import router as simulation_router
from app.api.v1.compliance import router as compliance_router
from app.api.v1.incidents import router as incident_router
from app.api.v1.vendors import router as vendor_router
from app.api.v1.reports import router as report_router
from app.api.v1.ai_copilot import router as ai_router
from app.api.v1.audit import router as audit_router
from app.api.v1.ml import router as ml_router

api_v1_router = APIRouter()

api_v1_router.include_router(auth_router)
api_v1_router.include_router(org_router)
api_v1_router.include_router(asset_router)
api_v1_router.include_router(bs_router)
api_v1_router.include_router(vuln_router)
api_v1_router.include_router(control_router)
api_v1_router.include_router(evidence_router)
api_v1_router.include_router(risk_router)
api_v1_router.include_router(dashboard_router)
api_v1_router.include_router(investment_router)
api_v1_router.include_router(simulation_router)
api_v1_router.include_router(compliance_router)
api_v1_router.include_router(incident_router)
api_v1_router.include_router(vendor_router)
api_v1_router.include_router(report_router)
api_v1_router.include_router(ai_router)
api_v1_router.include_router(audit_router)
api_v1_router.include_router(ml_router)

