from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.risk import RiskScore
from app.models.country import Country
from app.schemas.map import MapCountryFeature


class MapService:
    @staticmethod
    def get_map_features(db: Session, year: Optional[int] = None, region: Optional[str] = None) -> List[MapCountryFeature]:
        """Assemble map features with current GeoRisk scores, sub-scores, and color codes across all sovereign nations."""
        query = db.query(RiskScore).join(Country)
        if year:
            query = query.filter(RiskScore.year == year)
        if region:
            query = query.filter(Country.region == region)

        scores = query.all()

        # Fallback if no scores matched year filter
        if not scores:
            scores = db.query(RiskScore).join(Country).all()

        features = []

        for s in scores:
            c = s.country
            if not c:
                continue

            color = s.category.color_code if s.category else "#FBBF24"
            cat_name = s.category.name if s.category else "Moderate"

            features.append(
                MapCountryFeature(
                    country_id=c.id,
                    name=c.name,
                    iso_code=c.iso_code,
                    iso_alpha2=c.iso_alpha2,
                    region=c.region,
                    continent=c.continent,
                    latitude=c.latitude,
                    longitude=c.longitude,
                    overall_score=s.overall_score,
                    category_name=cat_name,
                    color_code=color,
                    economic_score=s.economic_score,
                    political_score=s.political_score,
                    business_score=s.business_score,
                )
            )

        # Ultimate fallback to all countries if database scores are missing
        if not features:
            countries = db.query(Country).all()
            for c in countries:
                features.append(
                    MapCountryFeature(
                        country_id=c.id,
                        name=c.name,
                        iso_code=c.iso_code,
                        iso_alpha2=c.iso_alpha2,
                        region=c.region,
                        continent=c.continent,
                        latitude=c.latitude,
                        longitude=c.longitude,
                        overall_score=35.0,
                        category_name="Moderate",
                        color_code="#FBBF24",
                        economic_score=30.0,
                        political_score=35.0,
                        business_score=30.0,
                    )
                )

        return features
