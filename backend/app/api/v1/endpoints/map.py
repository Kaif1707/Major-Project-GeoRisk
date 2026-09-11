from typing import Optional, List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.response import StandardResponse
from app.schemas.map import MapDataResponse, MapCountryFeature
from app.services.map_service import MapService

router = APIRouter()


@router.get("/countries", response_model=StandardResponse[MapDataResponse])
async def get_map_data(
    year: Optional[int] = Query(None, description="Evaluation year"),
    region: Optional[str] = Query(None, description="Filter by region"),
    db: Session = Depends(get_db)
):
    """Fetch country risk feature dataset for map choropleth visualization."""
    features = MapService.get_map_features(db, year=year, region=region)
    res = MapDataResponse(
        total_countries=len(features),
        features=features
    )

    return StandardResponse(
        status="success",
        message="Map country data retrieved successfully",
        data=res
    )
