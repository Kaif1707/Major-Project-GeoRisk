from typing import List, Optional
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.response import StandardResponse
from app.schemas.country import CountryResponse, RegionResponse
from app.services.country_service import CountryService

router = APIRouter()


@router.get("", response_model=StandardResponse[List[CountryResponse]])
async def list_countries(
    region: Optional[str] = Query(None, description="Filter by region name"),
    search: Optional[str] = Query(None, description="Search by country name or ISO code"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=250),
    db: Session = Depends(get_db)
):
    """Fetch paginated list of sovereign countries."""
    countries = CountryService.get_countries(db, region=region, search=search, skip=skip, limit=limit)
    res = [CountryResponse.model_validate(c) for c in countries]

    return StandardResponse(
        status="success",
        message="Countries retrieved successfully",
        data=res
    )


@router.get("/regions", response_model=StandardResponse[List[RegionResponse]])
async def list_regions(db: Session = Depends(get_db)):
    """List global regions."""
    regions = CountryService.get_regions(db)
    res = [RegionResponse.model_validate(r) for r in regions]

    return StandardResponse(
        status="success",
        message="Regions retrieved successfully",
        data=res
    )


@router.get("/{id_or_code}", response_model=StandardResponse[dict])
async def get_country_detail(id_or_code: str, db: Session = Depends(get_db)):
    """Fetch country profile and full indicator suite."""
    country = CountryService.get_country_by_id_or_code(db, id_or_code)
    if not country:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Country not found")

    indicators = CountryService.get_country_indicators(db, country.id)
    country_res = CountryResponse.model_validate(country)

    return StandardResponse(
        status="success",
        message="Country profile retrieved successfully",
        data={
            "country": country_res,
            "indicators": indicators
        }
    )
