from typing import Optional
from datetime import datetime
from pydantic import BaseModel


class EconomicIndicatorResponse(BaseModel):
    id: str
    country_id: str
    year: int
    gdp_usd: Optional[float] = None
    gdp_growth_pct: Optional[float] = None
    inflation_pct: Optional[float] = None
    interest_rate_pct: Optional[float] = None
    exchange_rate_usd: Optional[float] = None
    fdi_usd: Optional[float] = None
    govt_debt_pct_gdp: Optional[float] = None
    trade_balance_usd: Optional[float] = None
    exports_usd: Optional[float] = None
    imports_usd: Optional[float] = None
    current_account_usd: Optional[float] = None
    foreign_reserves_usd: Optional[float] = None
    unemployment_pct: Optional[float] = None

    class Config:
        from_attributes = True


class PoliticalIndicatorResponse(BaseModel):
    id: str
    country_id: str
    year: int
    political_stability: Optional[float] = None
    govt_effectiveness: Optional[float] = None
    rule_of_law: Optional[float] = None
    regulatory_quality: Optional[float] = None
    voice_accountability: Optional[float] = None
    control_of_corruption: Optional[float] = None

    class Config:
        from_attributes = True


class SocialIndicatorResponse(BaseModel):
    id: str
    country_id: str
    year: int
    population: Optional[int] = None
    population_growth_pct: Optional[float] = None
    hdi_score: Optional[float] = None
    education_index: Optional[float] = None
    life_expectancy_years: Optional[float] = None
    urban_population_pct: Optional[float] = None

    class Config:
        from_attributes = True


class BusinessIndicatorResponse(BaseModel):
    id: str
    country_id: str
    year: int
    ease_of_business_rank: Optional[int] = None
    corporate_tax_rate_pct: Optional[float] = None
    startup_procedures_days: Optional[float] = None
    business_registration_time: Optional[float] = None
    infrastructure_index: Optional[float] = None

    class Config:
        from_attributes = True


class DataRefreshHistoryResponse(BaseModel):
    id: str
    source_name: str
    job_type: str
    status: str
    rows_imported: int
    execution_time_seconds: float
    error_log: Optional[str] = None
    started_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True
