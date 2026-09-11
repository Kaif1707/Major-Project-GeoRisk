from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from app.models.forecast import ForecastModel, ScenarioSimulationLog
from app.models.country import Country
from app.models.risk import RiskScore
from app.services.country_service import CountryService
from app.forecast.models import ForecastingEngine
from app.forecast.scenario import ScenarioSimulator


class ForecastService:
    @staticmethod
    def get_country_forecasts(db: Session, country_code: str) -> List[ForecastModel]:
        """Fetch all horizon forecasts for a country."""
        country = CountryService.get_country_by_id_or_code(db, country_code)
        if not country:
            return []

        return db.query(ForecastModel).filter_by(country_id=country.id).order_by(ForecastModel.forecast_horizon_days.asc()).all()

    @staticmethod
    def generate_country_forecast(db: Session, country_code: str, horizon_days: int = 90) -> ForecastModel:
        """Generate/update dynamic forecast model for a country."""
        country = CountryService.get_country_by_id_or_code(db, country_code)
        if not country:
            raise ValueError(f"Country {country_code} not found")

        risk_score = db.query(RiskScore).filter_by(country_id=country.id).first()
        current_s = risk_score.overall_score if risk_score else 30.0

        res = ForecastingEngine.forecast_score(current_s, [current_s - 0.5, current_s], horizon_days=horizon_days)

        fc = db.query(ForecastModel).filter_by(country_id=country.id, forecast_horizon_days=horizon_days).first()
        if not fc:
            fc = ForecastModel(country_id=country.id, forecast_horizon_days=horizon_days, predicted_value=res["predicted_value"], lower_bound=res["lower_bound"], upper_bound=res["upper_bound"])
            db.add(fc)

        fc.predicted_value = res["predicted_value"]
        fc.lower_bound = res["lower_bound"]
        fc.upper_bound = res["upper_bound"]
        fc.trend_direction = res["trend_direction"]
        fc.expected_change_pct = res["expected_change_pct"]
        db.commit()
        db.refresh(fc)
        return fc

    @staticmethod
    def run_scenario(
        db: Session,
        country_code: str,
        gdp_delta_pct: float = 0.0,
        inflation_delta_pct: float = 0.0,
        pol_instability_delta: float = 0.0,
        unemp_delta_pct: float = 0.0
    ) -> Dict[str, Any]:
        """Run what-if scenario simulation for a country."""
        country = CountryService.get_country_by_id_or_code(db, country_code)
        if not country:
            raise ValueError(f"Country {country_code} not found")

        risk_score = db.query(RiskScore).filter_by(country_id=country.id).first()
        current_s = risk_score.overall_score if risk_score else 30.0

        sim_res = ScenarioSimulator.simulate_scenario(
            current_s, gdp_delta_pct, inflation_delta_pct, pol_instability_delta, unemp_delta_pct
        )

        return {
            "country_code": country.iso_code,
            "country_name": country.name,
            "original_score": sim_res["original_score"],
            "predicted_score": sim_res["predicted_score"],
            "score_delta": sim_res["score_delta"],
            "predicted_category": sim_res["predicted_category"],
            "affected_dimensions": sim_res["affected_dimensions"],
        }
