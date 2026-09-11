from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel


class RegionResponse(BaseModel):
    id: str
    name: str
    code: str
    description: Optional[str] = None

    class Config:
        from_attributes = True


class CountryResponse(BaseModel):
    id: str
    name: str
    iso_code: str
    iso_alpha2: str
    region: str
    subregion: Optional[str] = None
    continent: str
    capital: Optional[str] = None
    population: Optional[int] = None
    currency_code: Optional[str] = None
    currency_name: Optional[str] = None
    flag_url: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    created_at: datetime

    class Config:
        from_attributes = True
