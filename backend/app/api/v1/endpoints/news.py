from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.response import StandardResponse
from app.schemas.news import NewsArticleResponse, NewsSentimentSummaryResponse
from app.services.news_service import NewsService

router = APIRouter()


@router.get("", response_model=StandardResponse[List[NewsArticleResponse]])
async def list_news_articles(
    country_code: Optional[str] = Query(None, description="Filter by country ISO code"),
    region: Optional[str] = Query(None, description="Filter by region"),
    category: Optional[str] = Query(None, description="Filter by category"),
    search: Optional[str] = Query(None, description="Search query"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db)
):
    """Fetch paginated geopolitical news articles with multi-filtering."""
    articles = NewsService.get_articles(
        db, country_code=country_code, region=region,
        category=category, search=search, skip=skip, limit=limit
    )
    res = [NewsArticleResponse.model_validate(a) for a in articles]
    return StandardResponse(
        status="success",
        message="News articles retrieved successfully",
        data=res
    )


@router.get("/trending", response_model=StandardResponse[List[NewsArticleResponse]])
async def get_trending_news(
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db)
):
    """Fetch top trending high-impact geopolitical news."""
    articles = NewsService.get_trending_news(db, limit=limit)
    res = [NewsArticleResponse.model_validate(a) for a in articles]
    return StandardResponse(
        status="success",
        message="Trending news retrieved successfully",
        data=res
    )


@router.post("/sync", response_model=StandardResponse[List[NewsArticleResponse]])
async def sync_live_news_feed(db: Session = Depends(get_db)):
    """Fetch and ingest real-time live geopolitical news feed."""
    new_articles = NewsService.sync_live_news(db)
    res = [NewsArticleResponse.model_validate(a) for a in new_articles]
    return StandardResponse(
        status="success",
        message=f"Live feed sync complete. {len(new_articles)} new intelligence articles ingested.",
        data=res
    )


@router.get("/sentiment/{country_code}", response_model=StandardResponse[NewsSentimentSummaryResponse])
async def get_country_sentiment(country_code: str, db: Session = Depends(get_db)):
    """Fetch country NLP sentiment analysis summary."""
    summary = NewsService.get_country_sentiment_summary(db, country_code)
    return StandardResponse(
        status="success",
        message="Country sentiment summary retrieved",
        data=summary
    )


@router.get("/{country_code}", response_model=StandardResponse[List[NewsArticleResponse]])
async def get_country_news(country_code: str, db: Session = Depends(get_db)):
    """Fetch news articles specific to a country."""
    articles = NewsService.get_articles(db, country_code=country_code)
    res = [NewsArticleResponse.model_validate(a) for a in articles]
    return StandardResponse(
        status="success",
        message=f"News for {country_code} retrieved",
        data=res
    )
