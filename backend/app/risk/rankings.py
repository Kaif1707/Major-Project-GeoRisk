from typing import List
from sqlalchemy.orm import Session
from app.models.risk import RiskScore
from app.models.country import Country


class RankingEngine:
    """Ranking Engine: Calculate global and regional country risk rankings."""

    @staticmethod
    def update_country_rankings(db: Session, year: int = 2024):
        """Update global and regional ranks for all risk scores of a specific year."""
        scores = db.query(RiskScore).filter(RiskScore.year == year).order_by(RiskScore.overall_score.asc()).all()

        # 1. Update Global Rank (1 = Safest, lowest risk score)
        for idx, score_obj in enumerate(scores, start=1):
            score_obj.global_rank = idx

        # 2. Update Regional Rank
        regions = db.query(Country.region).distinct().all()
        for reg_tuple in regions:
            reg_name = reg_tuple[0]
            if not reg_name:
                continue

            regional_scores = (
                db.query(RiskScore)
                .join(Country)
                .filter(RiskScore.year == year, Country.region == reg_name)
                .order_by(RiskScore.overall_score.asc())
                .all()
            )

            for idx, r_score in enumerate(regional_scores, start=1):
                r_score.regional_rank = idx

        db.commit()
