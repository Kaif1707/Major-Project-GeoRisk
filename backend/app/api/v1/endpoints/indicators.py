from typing import Optional
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.response import StandardResponse
from app.services.country_service import CountryService

router = APIRouter()


@router.get("", response_model=StandardResponse[dict])
async def get_indicators(
    country_code: str = Query(..., description="ISO alpha-3 country code (e.g. USA, DEU)"),
    year: Optional[int] = Query(None, description="Filter by year"),
    db: Session = Depends(get_db)
):
    """Fetch raw macroeconomic, political, social, and business indicators for a country."""
    country = CountryService.get_country_by_id_or_code(db, country_code)
    if not country:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Country not found")

    indicators = CountryService.get_country_indicators(db, country.id, year=year)

    return StandardResponse(
        status="success",
        message="Indicators retrieved successfully",
        data={
            "country_id": country.id,
            "iso_code": country.iso_code,
            "country_name": country.name,
            "indicators": indicators
        }
    )
