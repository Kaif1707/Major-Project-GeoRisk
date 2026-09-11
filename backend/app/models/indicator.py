import uuid
from datetime import datetime
from typing import Optional
from sqlalchemy import String, Integer, Float, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.session import Base


class EconomicIndicator(Base):
    __tablename__ = "economic_indicators"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    country_id: Mapped[str] = mapped_column(String(36), ForeignKey("countries.id", ondelete="CASCADE"), nullable=False, index=True)
    year: Mapped[int] = mapped_column(Integer, nullable=False, index=True)

    gdp_usd: Mapped[Optional[float]] = mapped_column(Float, nullable=True)               # Total Nominal GDP in USD
    gdp_growth_pct: Mapped[Optional[float]] = mapped_column(Float, nullable=True)        # Real GDP Growth Annual %
    inflation_pct: Mapped[Optional[float]] = mapped_column(Float, nullable=True)         # Consumer Price Inflation Annual %
    interest_rate_pct: Mapped[Optional[float]] = mapped_column(Float, nullable=True)     # Central Bank Interest Rate %
    exchange_rate_usd: Mapped[Optional[float]] = mapped_column(Float, nullable=True)     # Local Currency per 1 USD
    fdi_usd: Mapped[Optional[float]] = mapped_column(Float, nullable=True)                # Foreign Direct Investment Inflows USD
    govt_debt_pct_gdp: Mapped[Optional[float]] = mapped_column(Float, nullable=True)     # Gross Government Debt as % GDP
    trade_balance_usd: Mapped[Optional[float]] = mapped_column(Float, nullable=True)     # Exports minus Imports USD
    exports_usd: Mapped[Optional[float]] = mapped_column(Float, nullable=True)           # Goods & Services Exports USD
    imports_usd: Mapped[Optional[float]] = mapped_column(Float, nullable=True)           # Goods & Services Imports USD
    current_account_usd: Mapped[Optional[float]] = mapped_column(Float, nullable=True)  # Current Account Balance USD
    foreign_reserves_usd: Mapped[Optional[float]] = mapped_column(Float, nullable=True) # Total Foreign Reserves USD
    unemployment_pct: Mapped[Optional[float]] = mapped_column(Float, nullable=True)     # Total Unemployment Rate %

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    country: Mapped["Country"] = relationship("Country", back_populates="economic_indicators")


class PoliticalIndicator(Base):
    __tablename__ = "political_indicators"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    country_id: Mapped[str] = mapped_column(String(36), ForeignKey("countries.id", ondelete="CASCADE"), nullable=False, index=True)
    year: Mapped[int] = mapped_column(Integer, nullable=False, index=True)

    political_stability: Mapped[Optional[float]] = mapped_column(Float, nullable=True)    # Percentile 0-100 or Z-score (-2.5 to 2.5)
    govt_effectiveness: Mapped[Optional[float]] = mapped_column(Float, nullable=True)     # Government Effectiveness Index
    rule_of_law: Mapped[Optional[float]] = mapped_column(Float, nullable=True)            # Rule of Law Index
    regulatory_quality: Mapped[Optional[float]] = mapped_column(Float, nullable=True)    # Regulatory Quality Index
    voice_accountability:Mapped[Optional[float]] = mapped_column(Float, nullable=True)   # Voice and Accountability Index
    control_of_corruption: Mapped[Optional[float]] = mapped_column(Float, nullable=True) # Corruption Control Index

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    country: Mapped["Country"] = relationship("Country", back_populates="political_indicators")


class SocialIndicator(Base):
    __tablename__ = "social_indicators"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    country_id: Mapped[str] = mapped_column(String(36), ForeignKey("countries.id", ondelete="CASCADE"), nullable=False, index=True)
    year: Mapped[int] = mapped_column(Integer, nullable=False, index=True)

    population: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    population_growth_pct: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    hdi_score: Mapped[Optional[float]] = mapped_column(Float, nullable=True)             # Human Development Index (0 to 1)
    education_index: Mapped[Optional[float]] = mapped_column(Float, nullable=True)      # Education Index
    life_expectancy_years: Mapped[Optional[float]] = mapped_column(Float, nullable=True)# Life Expectancy at birth
    urban_population_pct: Mapped[Optional[float]] = mapped_column(Float, nullable=True) # Urban Population %

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    country: Mapped["Country"] = relationship("Country", back_populates="social_indicators")


class BusinessIndicator(Base):
    __tablename__ = "business_indicators"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    country_id: Mapped[str] = mapped_column(String(36), ForeignKey("countries.id", ondelete="CASCADE"), nullable=False, index=True)
    year: Mapped[int] = mapped_column(Integer, nullable=False, index=True)

    ease_of_business_rank: Mapped[Optional[int]] = mapped_column(Integer, nullable=True) # Rank (1 to 190)
    corporate_tax_rate_pct: Mapped[Optional[float]] = mapped_column(Float, nullable=True)# Corporate Tax %
    startup_procedures_days: Mapped[Optional[float]] = mapped_column(Float, nullable=True)# Days to start business
    business_registration_time: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    infrastructure_index: Mapped[Optional[float]] = mapped_column(Float, nullable=True)  # Logistics / Infrastructure Score (1-5)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    country: Mapped["Country"] = relationship("Country", back_populates="business_indicators")


class IndicatorHistory(Base):
    __tablename__ = "indicator_histories"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    country_id: Mapped[str] = mapped_column(String(36), ForeignKey("countries.id", ondelete="CASCADE"), nullable=False, index=True)
    indicator_type: Mapped[str] = mapped_column(String(50), nullable=False)  # economic, political, social, business
    indicator_code: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    year: Mapped[int] = mapped_column(Integer, nullable=False, index=True)
    
    raw_value: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    normalized_value: Mapped[Optional[float]] = mapped_column(Float, nullable=True) # MinMax (0-100)
    unit: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    source_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("indicator_sources.id"), nullable=True)
    recorded_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class DataRefreshHistory(Base):
    __tablename__ = "data_refresh_histories"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    source_name: Mapped[str] = mapped_column(String(100), nullable=False)
    job_type: Mapped[str] = mapped_column(String(50), nullable=False) # Daily, Weekly, Manual
    status: Mapped[str] = mapped_column(String(20), nullable=False)   # success, failed, in_progress
    rows_imported: Mapped[int] = mapped_column(Integer, default=0)
    execution_time_seconds: Mapped[float] = mapped_column(Float, default=0.0)
    error_log: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    started_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)


class DataQualityLog(Base):
    __tablename__ = "data_quality_logs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    dataset_name: Mapped[str] = mapped_column(String(100), nullable=False)
    rule_violated: Mapped[str] = mapped_column(String(150), nullable=False)
    rejected_count: Mapped[int] = mapped_column(Integer, default=0)
    details: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    logged_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
