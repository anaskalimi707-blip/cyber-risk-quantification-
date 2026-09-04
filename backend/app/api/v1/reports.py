from fastapi import APIRouter, Depends
from datetime import datetime, timezone
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.report import ReportGenerateRequest, ReportResponse
from app.schemas.common import ResponseEnvelope

router = APIRouter(prefix="/reports", tags=["Reports & Executive Briefings"])


@router.post("/generate", response_model=ResponseEnvelope[ReportResponse])
async def generate_report(
    req: ReportGenerateRequest,
    current_user: User = Depends(get_current_user)
):
    rep_id = "rep_2026_q3_exec"
    return ResponseEnvelope(
        data=ReportResponse(
            id=rep_id,
            organization_id=current_user.organization_id,
            title=req.title,
            report_type=req.report_type,
            format=req.format,
            status="Generated",
            generated_at=datetime.now(timezone.utc),
            download_url=f"/api/v1/reports/{rep_id}/download",
            summary_data={
                "total_eal": 900000.0,
                "var_95": 150000000.0,
                "recommended_portfolio_cost": 6000000.0,
                "risk_reduction_achieved": 620000.0
            }
        )
    )


@router.get("/{report_id}/download", response_model=ResponseEnvelope[dict])
async def download_report(
    report_id: str,
    current_user: User = Depends(get_current_user)
):
    return ResponseEnvelope(
        data={
            "report_id": report_id,
            "filename": f"{report_id}.json",
            "content_type": "application/json",
            "download_token": "signed_expiring_s3_token_valid_15m"
        }
    )
