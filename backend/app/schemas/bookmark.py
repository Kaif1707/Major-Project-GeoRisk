from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field


class BookmarkResponse(BaseModel):
    id: str
    user_id: str
    item_type: str
    item_id: str
    title: str
    meta_json: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class BookmarkCreate(BaseModel):
    item_type: str = Field(..., description="country, report, forecast, article")
    item_id: str = Field(...)
    title: str = Field(...)
    meta_json: Optional[str] = None
