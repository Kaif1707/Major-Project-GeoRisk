from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel
from app.schemas.country import CountryResponse


class NewsArticleResponse(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    content: Optional[str] = None
    source_name: str
    url: Optional[str] = None
    country_id: Optional[str] = None
    region: Optional[str] = None
    published_at: datetime
    category: str
    sentiment_score: float
    sentiment_label: str
    confidence_score: float
    ai_summary: Optional[str] = None
    impact_type: str
    country: Optional[CountryResponse] = None

    class Config:
        from_attributes = True


class NewsSentimentSummaryResponse(BaseModel):
    country_code: str
    total_articles: int
    average_sentiment_score: float
    overall_sentiment_label: str
    positive_count: int
    neutral_count: int
    negative_count: int
