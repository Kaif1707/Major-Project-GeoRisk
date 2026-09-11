from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from app.models.country import Country, Region
from app.models.indicator import EconomicIndicator, PoliticalIndicator, SocialIndicator, BusinessIndicator


class CountryService:
    @staticmethod
    def get_countries(db: Session, region: Optional[str] = None, search: Optional[str] = None, skip: int = 0, limit: int = 100) -> List[Country]:
        """Fetch list of sovereign countries with region filtering and search."""
        query = db.query(Country)
        if region:
            query = query.filter(Country.region == region)
        if search:
            query = query.filter((Country.name.ilike(f"%{search}%")) | (Country.iso_code.ilike(f"%{search}%")))
        return query.offset(skip).limit(limit).all()

    @staticmethod
    def get_country_by_id_or_code(db: Session, identifier: str) -> Optional[Country]:
        """Fetch single country details by UUID or ISO alpha-3 code."""
        return db.query(Country).filter(
            (Country.id == identifier) | (Country.iso_code == identifier.upper())
        ).first()

    @staticmethod
    def get_regions(db: Session) -> List[Region]:
        """Fetch list of regions."""
        return db.query(Region).all()

    @staticmethod
    def get_country_indicators(db: Session, country_id: str, year: Optional[int] = None) -> Dict[str, Any]:
        """Fetch all indicators for a specific country."""
        econ_q = db.query(EconomicIndicator).filter(EconomicIndicator.country_id == country_id)
        pol_q = db.query(PoliticalIndicator).filter(PoliticalIndicator.country_id == country_id)
        soc_q = db.query(SocialIndicator).filter(SocialIndicator.country_id == country_id)
        biz_q = db.query(BusinessIndicator).filter(BusinessIndicator.country_id == country_id)

        if year:
            econ_q = econ_q.filter(EconomicIndicator.year == year)
            pol_q = pol_q.filter(PoliticalIndicator.year == year)
            soc_q = soc_q.filter(SocialIndicator.year == year)
            biz_q = biz_q.filter(BusinessIndicator.year == year)

        return {
            "economic": econ_q.order_by(EconomicIndicator.year.desc()).all(),
            "political": pol_q.order_by(PoliticalIndicator.year.desc()).all(),
            "social": soc_q.order_by(SocialIndicator.year.desc()).all(),
            "business": biz_q.order_by(BusinessIndicator.year.desc()).all(),
        }
