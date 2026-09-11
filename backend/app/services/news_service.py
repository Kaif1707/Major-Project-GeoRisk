from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.news import NewsArticle, NewsSentiment
from app.models.country import Country
from app.services.country_service import CountryService
from app.news.fetcher import NewsFetcher


class NewsService:
    @staticmethod
    def get_articles(
        db: Session,
        country_code: Optional[str] = None,
        region: Optional[str] = None,
        category: Optional[str] = None,
        search: Optional[str] = None,
        skip: int = 0,
        limit: int = 50
    ) -> List[NewsArticle]:
        """Fetch news articles with country, region, category, and keyword search filters."""
        query = db.query(NewsArticle)

        if country_code:
            country = CountryService.get_country_by_id_or_code(db, country_code)
            if country:
                query = query.filter(NewsArticle.country_id == country.id)
        if region:
            query = query.filter(NewsArticle.region == region)
        if category:
            query = query.filter(NewsArticle.category == category)
        if search:
            query = query.filter((NewsArticle.title.ilike(f"%{search}%")) | (NewsArticle.description.ilike(f"%{search}%")))

        return query.order_by(NewsArticle.published_at.desc()).offset(skip).limit(limit).all()

    @staticmethod
    def sync_live_news(db: Session) -> List[NewsArticle]:
        """Fetch real-time news articles and save to DB."""
        countries = db.query(Country).all()
        c_map = {c.iso_code: c for c in countries}

        fresh_items = NewsFetcher.fetch_live_feed(c_map)
        new_articles = []

        for item in fresh_items:
            existing = db.query(NewsArticle).filter(NewsArticle.title == item["title"]).first()
            if existing:
                continue

            art = NewsArticle(
                country_id=item["country_id"],
                region=item["region"],
                title=item["title"],
                description=item["description"],
                content=item["content"],
                source_name=item["source_name"],
                url=item["url"],
                category=item["category"],
                impact_type=item["impact_type"],
                sentiment_score=item["sentiment_score"],
                sentiment_label=item["sentiment_label"],
                published_at=item["published_at"]
            )
            db.add(art)
            new_articles.append(art)

        db.commit()

        # Recalculate all sovereign nation scores & rankings based on newly ingested live news sentiment & data
        try:
            from app.risk.engine import GeoRiskEngine
            engine = GeoRiskEngine(db)
            engine.recalculate_all_countries(year=2024, job_type="LiveNewsSync")
        except Exception as e:
            pass

        if not new_articles:
            return db.query(NewsArticle).order_by(NewsArticle.published_at.desc()).limit(15).all()

        return new_articles

    @staticmethod
    def get_trending_news(db: Session, limit: int = 10) -> List[NewsArticle]:
        """Fetch trending high-impact geopolitical news."""
        return db.query(NewsArticle).order_by(NewsArticle.impact_type.desc(), NewsArticle.published_at.desc()).limit(limit).all()

    @staticmethod
    def get_country_sentiment_summary(db: Session, country_code: str) -> dict:
        """Fetch sentiment summary stats for a country."""
        country = CountryService.get_country_by_id_or_code(db, country_code)
        if not country:
            return {
                "country_code": country_code,
                "total_articles": 0,
                "average_sentiment_score": 0.0,
                "overall_sentiment_label": "Neutral",
                "positive_count": 0,
                "neutral_count": 0,
                "negative_count": 0,
            }

        articles = db.query(NewsArticle).filter(NewsArticle.country_id == country.id).all()
        total = len(articles)
        if total == 0:
            return {
                "country_code": country_code,
                "total_articles": 0,
                "average_sentiment_score": 0.0,
                "overall_sentiment_label": "Neutral",
                "positive_count": 0,
                "neutral_count": 0,
                "negative_count": 0,
            }

        avg_score = sum(a.sentiment_score for a in articles) / float(total)
        pos = sum(1 for a in articles if a.sentiment_score > 0.1)
        neg = sum(1 for a in articles if a.sentiment_score < -0.1)
        neu = total - pos - neg

        label = "Positive" if avg_score > 0.2 else "Negative" if avg_score < -0.2 else "Neutral"

        return {
            "country_code": country.iso_code,
            "total_articles": total,
            "average_sentiment_score": round(avg_score, 2),
            "overall_sentiment_label": label,
            "positive_count": pos,
            "neutral_count": neu,
            "negative_count": neg,
        }
