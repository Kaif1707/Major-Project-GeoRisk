import sys
import os
from datetime import datetime, timedelta
from sqlalchemy.orm import Session

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from app.database.session import SessionLocal, engine, Base
import app.models.indicator
from app.models.country import Country
from app.models.news import NewsArticle, NewsCategory, NewsSentiment
from app.models.forecast import ForecastModel
from app.news.sentiment import SentimentAnalyzer
from app.forecast.models import ForecastingEngine


def seed_news_and_forecasts():
    """Seed news articles, NLP sentiment scores, and time-series forecast models."""
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    try:
        # 1. News Categories
        categories_data = [
            {"name": "Macroeconomic Policy", "code": "macro", "description": "Central bank interest rates, inflation, and GDP reports"},
            {"name": "Geopolitical Conflict", "code": "conflict", "description": "Armed conflicts, maritime security, and border disputes"},
            {"name": "Trade & Tariffs", "code": "trade", "description": "International trade agreements and tariff barriers"},
            {"name": "Sanctions & Compliance", "code": "sanctions", "description": "International sanctions and regulatory compliance"},
            {"name": "Governance & Rule of Law", "code": "governance", "description": "Elections, anti-corruption, and institutional stability"},
        ]

        for cat_data in categories_data:
            cat = db.query(NewsCategory).filter_by(code=cat_data["code"]).first()
            if not cat:
                db.add(NewsCategory(**cat_data))

        # 2. Sample News Articles
        articles_data = [
            {
                "title": "Federal Reserve Signals Stabilizing Rate Benchmarks Amid Declining Inflation",
                "description": "Central bank officials indicate monetary policy tightening has achieved target inflation stabilization corridors.",
                "source_name": "Reuters Macro",
                "iso_code": "USA",
                "category": "Macroeconomic Policy",
                "impact_type": "low"
            },
            {
                "title": "European Union Expands Technology Infrastructure Investment Package",
                "description": "European Commission approves €45 billion semiconductor and green transition funding initiative for member states.",
                "source_name": "Financial Times",
                "iso_code": "DEU",
                "category": "Trade & Tariffs",
                "impact_type": "low"
            },
            {
                "title": "India Manufacturing Purchasing Managers Index Hits 16-Year High",
                "description": "Strong domestic demand and expanding foreign direct investment propel industrial manufacturing growth across major urban hubs.",
                "source_name": "Bloomberg Asia",
                "iso_code": "IND",
                "category": "Macroeconomic Policy",
                "impact_type": "medium"
            },
            {
                "title": "Brazil Central Bank Reduces Selic Rate Following Favorable Fiscal Deficit Figures",
                "description": "Monetary policy committee lowers interest benchmark by 50 basis points citing easing food and energy price indices.",
                "source_name": "Wall Street Journal",
                "iso_code": "BRA",
                "category": "Macroeconomic Policy",
                "impact_type": "medium"
            },
            {
                "title": "Maritime Corridor Security Advisories Updated for Red Sea & Bab-el-Mandeb Strait",
                "description": "Naval coalition forces issue elevated security advisories for commercial container traffic following regional military exercises.",
                "source_name": "AP World News",
                "iso_code": "UKR",
                "category": "Geopolitical Conflict",
                "impact_type": "high"
            },
        ]

        country_map = {c.iso_code: c for c in db.query(Country).all()}

        for a_data in articles_data:
            art = db.query(NewsArticle).filter_by(title=a_data["title"]).first()
            if not art:
                iso = a_data["iso_code"]
                c_obj = country_map.get(iso)

                # Analyze Sentiment
                full_text = f"{a_data['title']} {a_data['description']}"
                score, label, keywords = SentimentAnalyzer.analyze_text(full_text)

                summary = (
                    f"**Executive Briefing**: {a_data['description']}\n\n"
                    f"- **Investment Impact**: {a_data['impact_type'].upper()} impact on regional market risk corridors.\n"
                    f"- **Key Sentiment Drivers**: {', '.join(keywords) if keywords else 'Stability indices'}."
                )

                art = NewsArticle(
                    title=a_data["title"],
                    description=a_data["description"],
                    content=a_data["description"],
                    source_name=a_data["source_name"],
                    country_id=c_obj.id if c_obj else None,
                    region=c_obj.region if c_obj else "Global",
                    category=a_data["category"],
                    sentiment_score=score,
                    sentiment_label=label,
                    confidence_score=0.92,
                    ai_summary=summary,
                    impact_type=a_data["impact_type"],
                    published_at=datetime.utcnow() - timedelta(hours=2)
                )
                db.add(art)
                db.flush()

                # Add Sentiment Detail
                db.add(NewsSentiment(
                    article_id=art.id,
                    positive_score=0.7 if score > 0 else 0.1,
                    neutral_score=0.2,
                    negative_score=0.7 if score < 0 else 0.1,
                    keywords=", ".join(keywords)
                ))

        # 3. Seed Time-Series Forecast Models for All Sovereign Countries
        horizons = [30, 90, 180, 365]
        for iso, c_obj in country_map.items():
            current_s = 25.0 if iso in ["USA", "DEU", "GBR"] else 40.0 if iso in ["IND", "BRA"] else 80.0

            for h in horizons:
                fc = db.query(ForecastModel).filter_by(country_id=c_obj.id, forecast_horizon_days=h).first()
                if not fc:
                    forecast_res = ForecastingEngine.forecast_score(current_s, [current_s - 1.0, current_s], horizon_days=h)
                    db.add(ForecastModel(
                        country_id=c_obj.id,
                        model_type="LinearRegression",
                        target_metric="overall_georisk",
                        forecast_horizon_days=h,
                        predicted_value=forecast_res["predicted_value"],
                        lower_bound=forecast_res["lower_bound"],
                        upper_bound=forecast_res["upper_bound"],
                        trend_direction=forecast_res["trend_direction"],
                        expected_change_pct=forecast_res["expected_change_pct"],
                        confidence_interval=95.0
                    ))

        db.commit()
        print("Geopolitical news and time-series forecast models seeded successfully.")
    except Exception as e:
        db.rollback()
        print(f"Error seeding news & forecasts: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_news_and_forecasts()
