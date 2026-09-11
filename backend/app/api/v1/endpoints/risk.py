from typing import List, Optional
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.response import StandardResponse
from app.schemas.risk import (
    RiskScoreResponse, RiskCategoryResponse, RiskHistoryResponse, 
    RankingsSummaryResponse, RiskBreakdownResponse
)
from app.services.risk_service import RiskService

router = APIRouter()


@router.get("", response_model=StandardResponse[List[RiskScoreResponse]])
async def list_risk_scores(
    region: Optional[str] = Query(None, description="Filter by region name"),
    risk_category: Optional[str] = Query(None, description="Filter by category name (e.g. Low, Moderate, High)"),
    min_score: Optional[float] = Query(None, ge=0, le=100, description="Minimum GeoRisk score"),
    max_score: Optional[float] = Query(None, ge=0, le=100, description="Maximum GeoRisk score"),
    search: Optional[str] = Query(None, description="Search by country name or ISO code"),
    sort_by: str = Query("rank", description="Sort by 'rank', 'score_desc', or 'name'"),
    year: int = Query(2024, description="Evaluation year"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=250),
    db: Session = Depends(get_db)
):
    """Fetch paginated list of sovereign country GeoRisk scores with advanced filtering."""
    scores = RiskService.get_risk_scores(
        db, region=region, risk_category=risk_category,
        min_score=min_score, max_score=max_score, search=search,
        sort_by=sort_by, year=year, skip=skip, limit=limit
    )
    res = [RiskScoreResponse.model_validate(s) for s in scores]

    return StandardResponse(
        status="success",
        message="Risk scores retrieved successfully",
        data=res
    )


@router.get("/rankings", response_model=StandardResponse[RankingsSummaryResponse])
async def get_rankings(
    year: int = Query(2024, description="Evaluation year"),
    db: Session = Depends(get_db)
):
    """Fetch global risk rankings, top safest, and highest risk country leaderboards."""
    summary = RiskService.get_rankings(db, year=year)
    return StandardResponse(
        status="success",
        message="Rankings summary retrieved successfully",
        data=summary
    )


@router.get("/categories", response_model=StandardResponse[List[RiskCategoryResponse]])
async def list_risk_categories(db: Session = Depends(get_db)):
    """Fetch system risk category threshold rules."""
    cats = RiskService.get_risk_categories(db)
    res = [RiskCategoryResponse.model_validate(c) for c in cats]

    return StandardResponse(
        status="success",
        message="Risk categories retrieved successfully",
        data=res
    )


@router.get("/{country_id_or_code}", response_model=StandardResponse[RiskScoreResponse])
async def get_country_risk_score(
    country_id_or_code: str,
    year: int = Query(2024, description="Evaluation year"),
    db: Session = Depends(get_db)
):
    """Fetch detailed GeoRisk score and dimension sub-scores for a country."""
    score = RiskService.get_country_risk_score(db, country_id_or_code, year=year)
    if not score:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Risk score not found for country")

    res = RiskScoreResponse.model_validate(score)
    return StandardResponse(
        status="success",
        message="Country risk score retrieved successfully",
        data=res
    )


@router.get("/breakdown/{country_id_or_code}", response_model=StandardResponse[RiskBreakdownResponse])
async def get_risk_breakdown(
    country_id_or_code: str,
    year: int = Query(2024, description="Evaluation year"),
    db: Session = Depends(get_db)
):
    """Fetch factor contribution breakdown for a country."""
    breakdown = RiskService.get_risk_breakdown(db, country_id_or_code, year=year)
    if not breakdown:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Risk breakdown not found for country")

    return StandardResponse(
        status="success",
        message="Risk breakdown retrieved successfully",
        data=breakdown
    )


@router.get("/history/{country_id_or_code}", response_model=StandardResponse[List[RiskHistoryResponse]])
async def get_risk_history(
    country_id_or_code: str,
    db: Session = Depends(get_db)
):
    """Fetch historical risk score timeline for a country."""
    history = RiskService.get_country_risk_history(db, country_id_or_code)
    res = [RiskHistoryResponse.model_validate(h) for h in history]

    return StandardResponse(
        status="success",
        message="Risk history retrieved successfully",
        data=res
    )


@router.post("/recalculate", response_model=StandardResponse[RiskScoreResponse])
async def recalculate_single_country(
    country_code: str = Query(..., description="ISO alpha-3 code (e.g. USA, DEU)"),
    year: int = Query(2024, description="Evaluation year"),
    db: Session = Depends(get_db)
):
    """Recalculate GeoRisk score for a single country."""
    score_obj = RiskService.recalculate_single_country(db, country_code, year=year)
    if not score_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Country not found for recalculation")

    res = RiskScoreResponse.model_validate(score_obj)
    return StandardResponse(
        status="success",
        message=f"Risk score recalculated for {country_code}",
        data=res
    )


@router.post("/recalculate/all", response_model=StandardResponse[dict])
async def recalculate_all_scores(
    year: int = Query(2024, description="Evaluation year"),
    db: Session = Depends(get_db)
):
    """Trigger recalculation across all sovereign nations."""
    log_entry = RiskService.recalculate_all(db, year=year)
    return StandardResponse(
        status="success",
        message="Global risk score recalculation completed",
        data={
            "job_type": log_entry.job_type,
            "countries_processed": log_entry.countries_processed,
            "execution_time_seconds": log_entry.execution_time_seconds,
            "status": log_entry.status
        }
    )
