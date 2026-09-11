from typing import List, Optional
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.response import StandardResponse
from app.schemas.forecast import ForecastResponse, ScenarioRequest, ScenarioResponse
from app.services.forecast_service import ForecastService

router = APIRouter()


@router.post("/scenario", response_model=StandardResponse[ScenarioResponse])
async def run_scenario_simulation(request: ScenarioRequest, db: Session = Depends(get_db)):
    """Run what-if macro event scenario simulation."""
    res = ForecastService.run_scenario(
        db,
        request.country_code,
        request.gdp_delta_pct,
        request.inflation_delta_pct,
        request.pol_instability_delta,
        request.unemp_delta_pct
    )
    return StandardResponse(
        status="success",
        message="Scenario simulation completed",
        data=res
    )


@router.post("/{country_code}", response_model=StandardResponse[ForecastResponse])
async def generate_country_forecast(
    country_code: str,
    horizon_days: int = Query(90, description="Horizon in days: 30, 90, 180, 365"),
    db: Session = Depends(get_db)
):
    """Generate dynamic forecast model for a country."""
    try:
        fc = ForecastService.generate_country_forecast(db, country_code, horizon_days=horizon_days)
        res = ForecastResponse.model_validate(fc)
        return StandardResponse(
            status="success",
            message=f"Forecast generated for {country_code}",
            data=res
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.get("/history/{country_code}", response_model=StandardResponse[List[ForecastResponse]])
async def get_forecast_history(country_code: str, db: Session = Depends(get_db)):
    """Fetch stored time-series forecasts across horizons for a country."""
    forecasts = ForecastService.get_country_forecasts(db, country_code)
    res = [ForecastResponse.model_validate(f) for f in forecasts]
    return StandardResponse(
        status="success",
        message=f"Forecast history retrieved for {country_code}",
        data=res
    )
