from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field
from app.schemas.country import CountryResponse


class WatchlistCountryResponse(BaseModel):
    id: str
    watchlist_id: str
    country_id: str
    added_at: datetime
    country: Optional[CountryResponse] = None

    class Config:
        from_attributes = True


class WatchlistResponse(BaseModel):
    id: str
    user_id: str
    name: str
    description: Optional[str] = None
    is_pinned: bool
    is_archived: bool
    created_at: datetime
    updated_at: datetime
    items: List[WatchlistCountryResponse] = []

    class Config:
        from_attributes = True


class WatchlistCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    is_pinned: bool = False


class WatchlistUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_pinned: Optional[bool] = None
    is_archived: Optional[bool] = None
