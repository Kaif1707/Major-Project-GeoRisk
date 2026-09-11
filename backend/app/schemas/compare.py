from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from app.schemas.risk import RiskScoreResponse


class CompareRequest(BaseModel):
    country_codes: List[str] = Field(..., min_items=2, max_items=5, description="List of 2 to 5 ISO codes")
    year: int = Field(default=2024, description="Evaluation year")


class ComparisonSummary(BaseModel):
    best_performing: Optional[str] = None
    highest_risk: Optional[str] = None
    strongest_economy: Optional[str] = None
    best_political_stability: Optional[str] = None
    lowest_inflation: Optional[str] = None
    highest_growth: Optional[str] = None


class CompareResponse(BaseModel):
    year: int
    countries_count: int
    summary: ComparisonSummary
    scores: List[RiskScoreResponse]
    indicator_matrix: List[Dict[str, Any]]
