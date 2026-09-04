from typing import List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.compliance import ComplianceFramework, ComplianceRequirement
from app.models.control import Control
from app.schemas.compliance import ComplianceSummaryResponse, ComplianceGapResponse


class ComplianceService:
    @staticmethod
    async def get_compliance_summary(db: AsyncSession, organization_id: str) -> ComplianceSummaryResponse:
        return ComplianceSummaryResponse(
            organization_name="Acme Financial Services",
            overall_compliance_score=78.5,
            framework_scores=[
                {"framework": "NIST CSF 2.0", "score": 82.0, "status": "Substantially Compliant"},
                {"framework": "SEBI CSCRF", "score": 76.5, "status": "Action Required"},
                {"framework": "ISO/IEC 27001:2022", "score": 85.0, "status": "Certified / Compliant"},
                {"framework": "RBI Master Direction on Cyber Security", "score": 74.0, "status": "Action Required"}
            ],
            nist_csf_functions={
                "Govern": 85.0,
                "Identify": 90.0,
                "Protect": 72.0,
                "Detect": 80.0,
                "Respond": 75.0,
                "Recover": 68.0
            },
            total_gaps_count=4,
            critical_gaps_count=1
        )

    @staticmethod
    async def get_compliance_gaps(db: AsyncSession, organization_id: str) -> List[ComplianceGapResponse]:
        return [
            ComplianceGapResponse(
                requirement_id="PR.AC-1",
                framework_name="NIST CSF 2.0",
                title="Identity Management and Access Control (MFA for Admin Access)",
                category="Protect",
                compliance_status="Partially Compliant",
                control_strength=0.64,
                evidence_freshness_status="Fresh",
                financial_risk_exposure=450000.0,
                assigned_owner="CISO / IAM Lead"
            ),
            ComplianceGapResponse(
                requirement_id="RC.RP-1",
                framework_name="NIST CSF 2.0",
                title="Recovery Plan Execution & Immutable Backups",
                category="Recover",
                compliance_status="Partially Compliant",
                control_strength=0.55,
                evidence_freshness_status="Fresh",
                financial_risk_exposure=380000.0,
                assigned_owner="IT Ops / Resilience Lead"
            ),
            ComplianceGapResponse(
                requirement_id="SEBI-5.2",
                framework_name="SEBI CSCRF",
                title="API Security & Gateway Rate Limiting for Financial Interfaces",
                category="Protect",
                compliance_status="Partially Compliant",
                control_strength=0.70,
                evidence_freshness_status="Fresh",
                financial_risk_exposure=250000.0,
                assigned_owner="Lead API Architect"
            )
        ]
