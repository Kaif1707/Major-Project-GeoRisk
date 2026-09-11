from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from app.models.risk import RiskScore, RiskCategory, RiskHistory, RiskFactor, ScoreCalculationLog
from app.models.country import Country
from app.risk.engine import GeoRiskEngine
from app.services.country_service import CountryService


class RiskService:
    @staticmethod
    def get_risk_scores(
        db: Session,
        region: Optional[str] = None,
        risk_category: Optional[str] = None,
        min_score: Optional[float] = None,
        max_score: Optional[float] = None,
        search: Optional[str] = None,
        sort_by: str = "rank",
        year: int = 2024,
        skip: int = 0,
        limit: int = 100
    ) -> List[RiskScore]:
        """Query risk scores with filtering by region, category, score range, and sorting."""
        query = db.query(RiskScore).join(Country).filter(RiskScore.year == year)

        if region:
            query = query.filter(Country.region == region)
        if risk_category:
            query = query.join(RiskCategory).filter(RiskCategory.name == risk_category)
        if min_score is not None:
            query = query.filter(RiskScore.overall_score >= min_score)
        if max_score is not None:
            query = query.filter(RiskScore.overall_score <= max_score)
        if search:
            query = query.filter((Country.name.ilike(f"%{search}%")) | (Country.iso_code.ilike(f"%{search}%")))

        if sort_by == "score_desc":
            query = query.order_by(RiskScore.overall_score.desc())
        elif sort_by == "name":
            query = query.order_by(Country.name.asc())
        else:
            query = query.order_by(RiskScore.global_rank.asc())

        return query.offset(skip).limit(limit).all()

    @staticmethod
    def get_country_risk_score(db: Session, identifier: str, year: int = 2024) -> Optional[RiskScore]:
        """Fetch GeoRisk score for a single country by ID or ISO alpha-3 code."""
        country = CountryService.get_country_by_id_or_code(db, identifier)
        if not country:
            return None
        return db.query(RiskScore).filter_by(country_id=country.id, year=year).first()

    @staticmethod
    def get_rankings(db: Session, year: int = 2024) -> Dict[str, Any]:
        """Fetch global ranking statistics (Top 5 safest, Top 5 highest risk, regional leaders)."""
        safest = (
            db.query(RiskScore)
            .filter(RiskScore.year == year)
            .order_by(RiskScore.overall_score.asc())
            .limit(5)
            .all()
        )
        highest_risk = (
            db.query(RiskScore)
            .filter(RiskScore.year == year)
            .order_by(RiskScore.overall_score.desc())
            .limit(5)
            .all()
        )
        total = db.query(RiskScore).filter(RiskScore.year == year).count()

        return {
            "total_countries": total,
            "top_safest": safest,
            "top_highest_risk": highest_risk,
            "regional_leaders": safest
        }

    @staticmethod
    def get_country_risk_history(db: Session, identifier: str) -> List[RiskHistory]:
        """Fetch historical risk timeline for a country."""
        country = CountryService.get_country_by_id_or_code(db, identifier)
        if not country:
            return []
        return db.query(RiskHistory).filter_by(country_id=country.id).order_by(RiskHistory.year.desc()).all()

    @staticmethod
    def get_risk_categories(db: Session) -> List[RiskCategory]:
        """List active risk category threshold rules."""
        return db.query(RiskCategory).order_by(RiskCategory.min_score.asc()).all()

    @staticmethod
    def get_risk_breakdown(db: Session, identifier: str, year: int = 2024) -> Optional[Dict[str, Any]]:
        """Generate factor contribution breakdown for a country."""
        country = CountryService.get_country_by_id_or_code(db, identifier)
        if not country:
            return None

        risk_score = db.query(RiskScore).filter_by(country_id=country.id, year=year).first()
        if not risk_score:
            return None

        factors = db.query(RiskFactor).filter_by(risk_score_id=risk_score.id).all()
        positive_factors = [f for f in factors if f.impact_type == "positive"]
        negative_factors = [f for f in factors if f.impact_type == "negative"]

        return {
            "country_id": country.id,
            "country_name": country.name,
            "iso_code": country.iso_code,
            "overall_score": risk_score.overall_score,
            "risk_category": risk_score.category.name if risk_score.category else "Unknown",
            "global_rank": risk_score.global_rank,
            "dimension_scores": {
                "economic": risk_score.economic_score,
                "political": risk_score.political_score,
                "business": risk_score.business_score,
                "social": risk_score.social_score,
                "trade": risk_score.trade_score,
                "currency": risk_score.currency_score,
                "external": risk_score.external_score,
                "conflict": risk_score.conflict_score,
            },
            "top_positive_factors": positive_factors,
            "top_negative_factors": negative_factors,
            "all_factors": factors,
        }

    @staticmethod
    def recalculate_single_country(db: Session, identifier: str, year: int = 2024) -> Optional[RiskScore]:
        """Recalculate risk score for a single country."""
        country = CountryService.get_country_by_id_or_code(db, identifier)
        if not country:
            return None
        engine = GeoRiskEngine(db)
        score_obj = engine.calculate_country_score(country, year=year)
        engine.recalculate_all_countries(year=year, job_type="ManualSingle")
        return score_obj

    @staticmethod
    def recalculate_all(db: Session, year: int = 2024) -> ScoreCalculationLog:
        """Trigger recalculation across all sovereign nations."""
        engine = GeoRiskEngine(db)
        return engine.recalculate_all_countries(year=year, job_type="ManualAll")
