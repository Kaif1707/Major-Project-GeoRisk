import sys
import os
from sqlalchemy.orm import Session

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from app.database.session import SessionLocal, engine, Base
from app.models.risk import RiskCategory, RiskWeight, ScoreVersion
from app.risk.engine import GeoRiskEngine


def seed_risk_rules_and_calculate():
    """Seed default Risk Categories, Risk Weights, and compute initial GeoRisk scores."""
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    try:
        # 1. Default Risk Categories
        categories_data = [
            {"name": "Very Low", "min_score": 0.0, "max_score": 20.0, "color_code": "#10B981", "badge_style": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", "description": "Highly stable economic & political environment"},
            {"name": "Low", "min_score": 20.01, "max_score": 35.0, "color_code": "#34D399", "badge_style": "bg-green-500/10 text-green-400 border-green-500/20", "description": "Stable investment environment with minor exposure"},
            {"name": "Moderate", "min_score": 35.01, "max_score": 50.0, "color_code": "#FBBF24", "badge_style": "bg-amber-500/10 text-amber-400 border-amber-500/20", "description": "Moderate structural risk requiring monitor advisories"},
            {"name": "Elevated", "min_score": 50.01, "max_score": 65.0, "color_code": "#F97316", "badge_style": "bg-orange-500/10 text-orange-400 border-orange-500/20", "description": "Elevated economic volatility or policy uncertainty"},
            {"name": "High", "min_score": 65.01, "max_score": 80.0, "color_code": "#EF4444", "badge_style": "bg-red-500/10 text-red-400 border-red-500/20", "description": "High systemic risk, governance decay, or conflict exposure"},
            {"name": "Extreme", "min_score": 80.01, "max_score": 100.0, "color_code": "#991B1B", "badge_style": "bg-rose-900/30 text-rose-300 border-rose-700/50", "description": "Extreme risk, severe conflict, or economic collapse"},
        ]

        for cat_data in categories_data:
            cat = db.query(RiskCategory).filter_by(name=cat_data["name"]).first()
            if not cat:
                db.add(RiskCategory(**cat_data))

        # 2. Score Version
        ver = db.query(ScoreVersion).filter_by(version_code="1.0").first()
        if not ver:
            db.add(ScoreVersion(version_code="1.0", name="Standard Enterprise GeoRisk v1.0", description="Baseline weighted scoring model", is_active=True))

        # 3. Default Weight Distribution across 8 Dimensions
        weights_data = [
            # Economic (30%)
            {"dimension_name": "Economic", "metric_code": "gdp_growth_pct", "display_name": "Real GDP Growth Annual %", "weight_pct": 15.0, "min_value": -5.0, "max_value": 10.0, "is_inverted": True},
            {"dimension_name": "Economic", "metric_code": "inflation_pct", "display_name": "Consumer Price Inflation %", "weight_pct": 10.0, "min_value": 0.0, "max_value": 25.0, "is_inverted": False},
            {"dimension_name": "Economic", "metric_code": "govt_debt_pct_gdp", "display_name": "Gross Debt % GDP", "weight_pct": 5.0, "min_value": 10.0, "max_value": 150.0, "is_inverted": False},

            # Political (25%)
            {"dimension_name": "Political", "metric_code": "political_stability", "display_name": "Political Stability Index", "weight_pct": 15.0, "min_value": 0.0, "max_value": 100.0, "is_inverted": True},
            {"dimension_name": "Political", "metric_code": "govt_effectiveness", "display_name": "Government Effectiveness", "weight_pct": 10.0, "min_value": 0.0, "max_value": 100.0, "is_inverted": True},

            # Business (15%)
            {"dimension_name": "Business", "metric_code": "corporate_tax_rate_pct", "display_name": "Corporate Tax Rate %", "weight_pct": 15.0, "min_value": 0.0, "max_value": 40.0, "is_inverted": False},

            # Social (10%)
            {"dimension_name": "Social", "metric_code": "hdi_score", "display_name": "Human Development Index", "weight_pct": 10.0, "min_value": 0.3, "max_value": 1.0, "is_inverted": True},

            # Conflict (10%)
            {"dimension_name": "Conflict", "metric_code": "unemployment_pct", "display_name": "Unemployment Stress Index", "weight_pct": 10.0, "min_value": 1.0, "max_value": 25.0, "is_inverted": False},

            # Trade (5%)
            {"dimension_name": "Trade", "metric_code": "fdi_usd", "display_name": "Foreign Direct Investment", "weight_pct": 5.0, "min_value": 0.0, "max_value": 100000000000.0, "is_inverted": True},

            # Currency (3%)
            {"dimension_name": "Currency", "metric_code": "exchange_rate_usd", "display_name": "Currency Stability Index", "weight_pct": 3.0, "min_value": 0.1, "max_value": 50.0, "is_inverted": False},

            # External Relations (2%)
            {"dimension_name": "External Relations", "metric_code": "population_growth_pct", "display_name": "Demographic Volatility", "weight_pct": 2.0, "min_value": -1.0, "max_value": 4.0, "is_inverted": False},
        ]

        for w_data in weights_data:
            w = db.query(RiskWeight).filter_by(metric_code=w_data["metric_code"]).first()
            if not w:
                db.add(RiskWeight(**w_data))

        db.commit()

        # 4. Trigger Initial GeoRisk Score Calculation for All Countries
        print("Calculating GeoRisk scores & country rankings...")
        risk_engine = GeoRiskEngine(db)
        risk_engine.recalculate_all_countries(year=2024, job_type="InitialSeed")

        print("GeoRisk rules seeded and initial country risk scores calculated successfully.")
    except Exception as e:
        db.rollback()
        print(f"Error seeding risk rules: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_risk_rules_and_calculate()
