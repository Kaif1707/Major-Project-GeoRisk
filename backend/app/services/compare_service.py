from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models.risk import RiskScore
from app.models.country import Country
from app.models.indicator import EconomicIndicator, PoliticalIndicator, SocialIndicator, BusinessIndicator
from app.schemas.compare import ComparisonSummary
from app.schemas.risk import RiskScoreResponse


class CompareService:
    @staticmethod
    def compare_countries(db: Session, country_codes: List[str], year: int = 2024) -> Dict[str, Any]:
        """Perform multi-country comparison analysis for 2 to 5 countries."""
        # Standardize codes
        clean_codes = [code.strip().upper() for code in country_codes]

        scores = (
            db.query(RiskScore)
            .join(Country)
            .filter(Country.iso_code.in_(clean_codes), RiskScore.year == year)
            .all()
        )

        scores_res = [RiskScoreResponse.model_validate(s) for s in scores]

        # Calculate Takeaways
        best_perf = min(scores, key=lambda s: s.overall_score) if scores else None
        highest_risk = max(scores, key=lambda s: s.overall_score) if scores else None
        strongest_econ = min(scores, key=lambda s: s.economic_score) if scores else None
        best_pol = min(scores, key=lambda s: s.political_score) if scores else None

        summary = ComparisonSummary(
            best_performing=f"{best_perf.country.name} ({best_perf.overall_score.toFixed(1) if hasattr(best_perf.overall_score, 'toFixed') else best_perf.overall_score})" if best_perf and best_perf.country else None,
            highest_risk=f"{highest_risk.country.name} ({highest_risk.overall_score})" if highest_risk and highest_risk.country else None,
            strongest_economy=f"{strongest_econ.country.name}" if strongest_econ and strongest_econ.country else None,
            best_political_stability=f"{best_pol.country.name}" if best_pol and best_pol.country else None,
            lowest_inflation=best_perf.country.name if best_perf and best_perf.country else None,
            highest_growth=best_perf.country.name if best_perf and best_perf.country else None,
        )

        # Assemble side-by-side indicator matrix
        matrix = []
        for s in scores:
            c = s.country
            if not c:
                continue

            econ = db.query(EconomicIndicator).filter_by(country_id=c.id, year=year).first()
            pol = db.query(PoliticalIndicator).filter_by(country_id=c.id, year=year).first()

            matrix.append({
                "country_name": c.name,
                "iso_code": c.iso_code,
                "flag": c.flag_url,
                "overall_score": s.overall_score,
                "category": s.category.name if s.category else "Moderate",
                "economic_score": s.economic_score,
                "political_score": s.political_score,
                "business_score": s.business_score,
                "social_score": s.social_score,
                "conflict_score": s.conflict_score,
                "gdp_growth_pct": econ.gdp_growth_pct if econ else None,
                "inflation_pct": econ.inflation_pct if econ else None,
                "unemployment_pct": econ.unemployment_pct if econ else None,
                "political_stability": pol.political_stability if pol else None,
                "govt_effectiveness": pol.govt_effectiveness if pol else None,
            })

        return {
            "year": year,
            "countries_count": len(scores),
            "summary": summary,
            "scores": scores_res,
            "indicator_matrix": matrix,
        }
