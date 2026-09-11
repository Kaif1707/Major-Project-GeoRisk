from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.response import StandardResponse
from app.schemas.compare import CompareRequest, CompareResponse
from app.services.compare_service import CompareService

router = APIRouter()


@router.post("", response_model=StandardResponse[CompareResponse])
async def compare_countries(request_data: CompareRequest, db: Session = Depends(get_db)):
    """Perform side-by-side comparative risk analysis for 2 to 5 countries."""
    comparison = CompareService.compare_countries(db, request_data.country_codes, year=request_data.year)
    return StandardResponse(
        status="success",
        message="Multi-country comparison completed",
        data=comparison
    )


@router.get("", response_model=StandardResponse[CompareResponse])
async def compare_countries_get(
    codes: str = Query(..., description="Comma-separated ISO codes (e.g. USA,DEU,IND)"),
    year: int = Query(2024, description="Evaluation year"),
    db: Session = Depends(get_db)
):
    """GET endpoint for multi-country comparison."""
    code_list = [c.strip() for c in codes.split(",") if c.strip()]
    comparison = CompareService.compare_countries(db, code_list, year=year)
    return StandardResponse(
        status="success",
        message="Multi-country comparison completed",
        data=comparison
    )
