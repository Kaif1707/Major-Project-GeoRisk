from typing import Optional, List, Dict, Any
from pydantic import BaseModel


class MapCountryFeature(BaseModel):
    country_id: str
    name: str
    iso_code: str
    iso_alpha2: str
    region: str
    continent: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    overall_score: float
    category_name: str
    color_code: str
    economic_score: float
    political_score: float
    business_score: float


class MapDataResponse(BaseModel):
    total_countries: int
    features: List[MapCountryFeature]
