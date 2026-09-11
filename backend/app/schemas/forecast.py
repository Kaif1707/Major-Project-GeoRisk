from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field
from app.schemas.country import CountryResponse


class ForecastResponse(BaseModel):
    id: str
    country_id: str
    model_type: str
    target_metric: str
    forecast_horizon_days: int
    predicted_value: float
    lower_bound: float
    upper_bound: float
    trend_direction: str
    expected_change_pct: float
    confidence_interval: float
    calculated_at: datetime
    country: Optional[CountryResponse] = None

    class Config:
        from_attributes = True


class ScenarioRequest(BaseModel):
    country_code: str = Field(..., description="ISO alpha-3 country code")
    gdp_delta_pct: float = Field(default=0.0, description="Change in GDP growth %")
    inflation_delta_pct: float = Field(default=0.0, description="Change in inflation %")
    pol_instability_delta: float = Field(default=0.0, description="Change in political instability index")
    unemp_delta_pct: float = Field(default=0.0, description="Change in unemployment %")


class ScenarioResponse(BaseModel):
    country_code: str
    country_name: str
    original_score: float
    predicted_score: float
    score_delta: float
    predicted_category: str
    affected_dimensions: List[str]
