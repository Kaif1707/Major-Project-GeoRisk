from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.user import User
from app.api.v1.endpoints.auth import get_current_user
from app.schemas.response import StandardResponse
from app.schemas.report import GeneratedReportResponse, ReportGenerateRequest
from app.services.report_service import ReportService

router = APIRouter()


@router.get("", response_model=StandardResponse[List[GeneratedReportResponse]])
async def list_user_reports(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Fetch report generation history for current user."""
    reports = ReportService.get_user_reports(db, current_user.id)
    res = [GeneratedReportResponse.model_validate(r) for r in reports]
    return StandardResponse(status="success", message="User reports retrieved", data=res)


@router.post("/generate", response_model=StandardResponse[GeneratedReportResponse])
async def generate_report(
    request: ReportGenerateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Generate institutional executive report brief."""
    rep = ReportService.generate_report(
        db, current_user.id, report_type=request.report_type,
        country_code=request.country_code, format=request.format
    )
    res = GeneratedReportResponse.model_validate(rep)
    return StandardResponse(status="success", message="Report generated successfully", data=res)
