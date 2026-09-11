from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel
from app.schemas.country import CountryResponse


class RiskCategoryResponse(BaseModel):
    id: str
    name: str
    min_score: float
    max_score: float
    color_code: str
    badge_style: str
    description: Optional[str] = None

    class Config:
        from_attributes = True


class RiskFactorResponse(BaseModel):
    id: str
    dimension_name: str
    metric_code: str
    raw_value: Optional[float] = None
    normalized_score: float
    weighted_score: float
    contribution_pct: float
    impact_type: str

    class Config:
        from_attributes = True


class RiskScoreResponse(BaseModel):
    id: str
    country_id: str
    year: int
    overall_score: float
    economic_score: float
    political_score: float
    business_score: float
    social_score: float
    trade_score: float
    currency_score: float
    external_score: float
    conflict_score: float
    global_rank: Optional[int] = None
    regional_rank: Optional[int] = None
    score_version: str
    calculated_at: datetime
    category: RiskCategoryResponse
    country: Optional[CountryResponse] = None

    class Config:
        from_attributes = True


class RiskHistoryResponse(BaseModel):
    id: str
    country_id: str
    year: int
    overall_score: float
    risk_category: str
    global_rank: Optional[int] = None
    score_change_pct: Optional[float] = None
    recorded_at: datetime

    class Config:
        from_attributes = True


class RankingsSummaryResponse(BaseModel):
    total_countries: int
    top_safest: List[RiskScoreResponse]
    top_highest_risk: List[RiskScoreResponse]
    regional_leaders: List[RiskScoreResponse]


class RiskBreakdownResponse(BaseModel):
    country_id: str
    country_name: str
    iso_code: str
    overall_score: float
    risk_category: str
    global_rank: Optional[int] = None
    dimension_scores: dict
    top_positive_factors: List[RiskFactorResponse]
    top_negative_factors: List[RiskFactorResponse]
    all_factors: List[RiskFactorResponse]


class RiskWeightResponse(BaseModel):
    id: str
    dimension_name: str
    metric_code: str
    weight_pct: float
    is_inverted: bool
    is_active: bool

    class Config:
        from_attributes = True

