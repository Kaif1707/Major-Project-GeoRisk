import time
import logging
from datetime import datetime
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.models.country import Country
from app.models.indicator import EconomicIndicator, PoliticalIndicator, SocialIndicator, BusinessIndicator
from app.models.risk import RiskWeight, RiskCategory, RiskScore, RiskFactor, RiskHistory, ScoreCalculationLog
from app.risk.normalizer import ScoreNormalizer
from app.risk.rankings import RankingEngine

logger = logging.getLogger("georisk.risk.engine")


class GeoRiskEngine:
    """Core GeoRisk Scoring Engine."""

    def __init__(self, db: Session):
        self.db = db

    def calculate_country_score(self, country: Country, year: int = 2024) -> Optional[RiskScore]:
        """Calculate complete GeoRisk Score, dimension sub-scores, and factor breakdown for a single country."""
        # 1. Fetch active weights & categories
        weights = self.db.query(RiskWeight).filter(RiskWeight.is_active == True).all()
        categories = self.db.query(RiskCategory).order_by(RiskCategory.min_score.asc()).all()

        if not weights or not categories:
            logger.error("Cannot calculate score: RiskWeights or RiskCategories not seeded")
            return None

        # 2. Fetch country indicator records for year
        econ = self.db.query(EconomicIndicator).filter_by(country_id=country.id, year=year).first()
        pol = self.db.query(PoliticalIndicator).filter_by(country_id=country.id, year=year).first()
        soc = self.db.query(SocialIndicator).filter_by(country_id=country.id, year=year).first()
        biz = self.db.query(BusinessIndicator).filter_by(country_id=country.id, year=year).first()

        # Combine indicator values in a dictionary
        indicator_values = {}
        if econ:
            indicator_values.update({
                "gdp_growth_pct": econ.gdp_growth_pct,
                "inflation_pct": econ.inflation_pct,
                "unemployment_pct": econ.unemployment_pct,
                "govt_debt_pct_gdp": econ.govt_debt_pct_gdp,
                "exchange_rate_usd": econ.exchange_rate_usd,
                "fdi_usd": econ.fdi_usd
            })
        if pol:
            indicator_values.update({
                "political_stability": pol.political_stability,
                "govt_effectiveness": pol.govt_effectiveness,
                "rule_of_law": pol.rule_of_law,
                "regulatory_quality": pol.regulatory_quality,
                "control_of_corruption": pol.control_of_corruption
            })
        if soc:
            indicator_values.update({
                "hdi_score": soc.hdi_score,
                "life_expectancy_years": soc.life_expectancy_years,
                "population_growth_pct": soc.population_growth_pct
            })
        if biz:
            indicator_values.update({
                "corporate_tax_rate_pct": biz.corporate_tax_rate_pct,
                "ease_of_business_rank": biz.ease_of_business_rank
            })

        # 3. Compute dimension scores & factor contributions
        dimension_accumulators = {}
        dimension_weight_totals = {}
        factor_objects = []
        overall_weighted_score = 0.0

        for w in weights:
            raw_val = indicator_values.get(w.metric_code)
            min_v = w.min_value if w.min_value is not None else 0.0
            max_v = w.max_value if w.max_value is not None else 100.0

            norm_score = ScoreNormalizer.normalize_minmax(raw_val, min_v, max_v, w.is_inverted)
            weighted_contrib = (norm_score * w.weight_pct) / 100.0

            # Accumulate per dimension
            dim = w.dimension_name
            dimension_accumulators[dim] = dimension_accumulators.get(dim, 0.0) + (norm_score * w.weight_pct)
            dimension_weight_totals[dim] = dimension_weight_totals.get(dim, 0.0) + w.weight_pct

            overall_weighted_score += weighted_contrib

            # Determine impact type
            impact = "negative" if norm_score > 50.0 else "positive"

            factor_objects.append({
                "dimension_name": dim,
                "metric_code": w.metric_code,
                "raw_value": raw_val,
                "normalized_score": norm_score,
                "weighted_score": round(weighted_contrib, 2),
                "contribution_pct": round(w.weight_pct, 2),
                "impact_type": impact
            })

        # 3.5 Incorporate Live News NLP Sentiment Impact into overall risk score
        try:
            from app.models.news import NewsArticle
            recent_news = self.db.query(NewsArticle).filter_by(country_id=country.id).order_by(NewsArticle.published_at.desc()).limit(15).all()
            if recent_news:
                avg_sent = sum(a.sentiment_score for a in recent_news) / float(len(recent_news))
                overall_weighted_score += (-avg_sent * 10.0)
        except Exception:
            pass

        final_overall_score = round(max(0.0, min(100.0, overall_weighted_score)), 2)

        # 4. Map Risk Category
        matched_cat = categories[0]
        for cat in categories:
            if cat.min_score <= final_overall_score <= cat.max_score:
                matched_cat = cat
                break

        # 5. Dimension Sub-scores
        get_dim_score = lambda d: round(dimension_accumulators[d] / dimension_weight_totals[d], 2) if dimension_weight_totals.get(d) else 50.0

        # Upsert RiskScore object
        risk_score_obj = self.db.query(RiskScore).filter_by(country_id=country.id, year=year).first()
        if not risk_score_obj:
            risk_score_obj = RiskScore(country_id=country.id, year=year, overall_score=final_overall_score, risk_category_id=matched_cat.id)
            self.db.add(risk_score_obj)
            self.db.flush()

        risk_score_obj.overall_score = final_overall_score
        risk_score_obj.risk_category_id = matched_cat.id
        risk_score_obj.economic_score = get_dim_score("Economic")
        risk_score_obj.political_score = get_dim_score("Political")
        risk_score_obj.business_score = get_dim_score("Business")
        risk_score_obj.social_score = get_dim_score("Social")
        risk_score_obj.trade_score = get_dim_score("Trade")
        risk_score_obj.currency_score = get_dim_score("Currency")
        risk_score_obj.external_score = get_dim_score("External Relations")
        risk_score_obj.conflict_score = get_dim_score("Conflict")

        # Clear old factor objects and recreate
        self.db.query(RiskFactor).filter(RiskFactor.risk_score_id == risk_score_obj.id).delete()
        for f_dict in factor_objects:
            self.db.add(RiskFactor(risk_score_id=risk_score_obj.id, **f_dict))

        # Record History
        history_obj = self.db.query(RiskHistory).filter_by(country_id=country.id, year=year).first()
        if not history_obj:
            self.db.add(RiskHistory(
                country_id=country.id,
                year=year,
                overall_score=final_overall_score,
                risk_category=matched_cat.name
            ))
        else:
            history_obj.overall_score = final_overall_score
            history_obj.risk_category = matched_cat.name

        self.db.commit()
        return risk_score_obj

    def recalculate_all_countries(self, year: int = 2024, job_type: str = "RecalculateAll") -> ScoreCalculationLog:
        """Recalculate GeoRisk Scores and rankings for all countries."""
        start_time = time.time()
        countries = self.db.query(Country).all()
        processed = 0

        for c in countries:
            res = self.calculate_country_score(c, year=year)
            if res:
                processed += 1

        # Update Rankings across all calculated scores
        RankingEngine.update_country_rankings(self.db, year=year)

        duration = round(time.time() - start_time, 2)
        log_entry = ScoreCalculationLog(
            job_type=job_type,
            countries_processed=processed,
            execution_time_seconds=duration,
            status="success",
            log_details=f"Successfully calculated scores & rankings for {processed} countries."
        )
        self.db.add(log_entry)
        self.db.commit()
        return log_entry
