import logging
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models.country import Country
from app.models.indicator import EconomicIndicator, PoliticalIndicator, SocialIndicator, BusinessIndicator, DataQualityLog

logger = logging.getLogger("georisk.etl.loader")


class DataLoader:
    """ETL Database Loader: Bulk upserts, relational mapping, transaction safety."""

    @classmethod
    def load_transformed_records(cls, db: Session, records: List[Dict[str, Any]], rejected_records: List[Dict[str, Any]]) -> int:
        """Load records into database tables."""
        if rejected_records:
            quality_entry = DataQualityLog(
                dataset_name="ETL_Ingestion_Job",
                rule_violated="Validation Rules",
                rejected_count=len(rejected_records),
                details=f"Rejected {len(rejected_records)} malformed records during pipeline execution."
            )
            db.add(quality_entry)

        # Pre-cache country ISO -> ID map
        country_map = {c.iso_code: c.id for c in db.query(Country).all()}
        inserted_count = 0

        for item in records:
            iso = item.get("iso_code")
            country_id = country_map.get(iso)
            if not country_id:
                continue

            year = item.get("year")
            field_name = item.get("indicator_field")
            val = item.get("value")

            # Route to economic indicator table if field matches
            if field_name in ["gdp_usd", "gdp_growth_pct", "inflation_pct", "fdi_usd", "unemployment_pct", "exchange_rate_usd", "govt_debt_pct_gdp"]:
                econ = db.query(EconomicIndicator).filter_by(country_id=country_id, year=year).first()
                if not econ:
                    econ = EconomicIndicator(country_id=country_id, year=year)
                    db.add(econ)
                
                setattr(econ, field_name, val)
                inserted_count += 1

            # Route to political indicator table if field matches
            elif field_name in ["political_stability", "govt_effectiveness", "rule_of_law", "regulatory_quality", "control_of_corruption"]:
                pol = db.query(PoliticalIndicator).filter_by(country_id=country_id, year=year).first()
                if not pol:
                    pol = PoliticalIndicator(country_id=country_id, year=year)
                    db.add(pol)

                setattr(pol, field_name, val)
                inserted_count += 1

            # Route to social indicator table if field matches
            elif field_name in ["population", "population_growth_pct", "hdi_score", "life_expectancy_years"]:
                soc = db.query(SocialIndicator).filter_by(country_id=country_id, year=year).first()
                if not soc:
                    soc = SocialIndicator(country_id=country_id, year=year)
                    db.add(soc)

                setattr(soc, field_name, val)
                inserted_count += 1

        db.commit()
        logger.info(f"Loaded {inserted_count} indicator fields into database.")
        return inserted_count
