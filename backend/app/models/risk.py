import uuid
from datetime import datetime
from typing import Optional, List
from sqlalchemy import String, Integer, Float, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.session import Base


class RiskCategory(Base):
    __tablename__ = "risk_categories"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String(50), unique=True, nullable=False) # Very Low, Low, Moderate, Elevated, High, Extreme
    min_score: Mapped[float] = mapped_column(Float, nullable=False)
    max_score: Mapped[float] = mapped_column(Float, nullable=False)
    color_code: Mapped[str] = mapped_column(String(20), nullable=False)       # Hex or Tailwind color class
    badge_style: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    scores: Mapped[List["RiskScore"]] = relationship("RiskScore", back_populates="category")


class RiskWeight(Base):
    __tablename__ = "risk_weights"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    dimension_name: Mapped[str] = mapped_column(String(50), nullable=False, index=True) # Economic, Political, Business, etc.
    metric_code: Mapped[str] = mapped_column(String(100), nullable=False, index=True)   # gdp_growth_pct, inflation_pct, etc.
    display_name: Mapped[str] = mapped_column(String(100), nullable=False)
    weight_pct: Mapped[float] = mapped_column(Float, nullable=False)                    # Weight % e.g. 30.0 for Economic
    min_value: Mapped[Optional[float]] = mapped_column(Float, nullable=True)            # Baseline min for scaling
    max_value: Mapped[Optional[float]] = mapped_column(Float, nullable=True)            # Baseline max for scaling
    is_inverted: Mapped[bool] = mapped_column(Boolean, default=False)                   # True if higher raw = safer (needs inversion)
    
    version: Mapped[str] = mapped_column(String(20), default="1.0")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_by: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    updated_by: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class ScoreVersion(Base):
    __tablename__ = "score_versions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    version_code: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    activated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class RiskScore(Base):
    __tablename__ = "risk_scores"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    country_id: Mapped[str] = mapped_column(String(36), ForeignKey("countries.id", ondelete="CASCADE"), nullable=False, index=True)
    year: Mapped[int] = mapped_column(Integer, nullable=False, index=True)

    overall_score: Mapped[float] = mapped_column(Float, nullable=False, index=True) # 0.0 to 100.0 (Higher = Risky)
    risk_category_id: Mapped[str] = mapped_column(String(36), ForeignKey("risk_categories.id"), nullable=False)

    # 8 Dimension Scores (0.0 to 100.0)
    economic_score: Mapped[float] = mapped_column(Float, default=0.0)
    political_score: Mapped[float] = mapped_column(Float, default=0.0)
    business_score: Mapped[float] = mapped_column(Float, default=0.0)
    social_score: Mapped[float] = mapped_column(Float, default=0.0)
    trade_score: Mapped[float] = mapped_column(Float, default=0.0)
    currency_score: Mapped[float] = mapped_column(Float, default=0.0)
    external_score: Mapped[float] = mapped_column(Float, default=0.0)
    conflict_score: Mapped[float] = mapped_column(Float, default=0.0)

    global_rank: Mapped[Optional[int]] = mapped_column(Integer, nullable=True, index=True)
    regional_rank: Mapped[Optional[int]] = mapped_column(Integer, nullable=True, index=True)
    score_version: Mapped[str] = mapped_column(String(20), default="1.0")
    calculated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    country: Mapped["Country"] = relationship("Country")
    category: Mapped["RiskCategory"] = relationship("RiskCategory", back_populates="scores")
    factors: Mapped[List["RiskFactor"]] = relationship("RiskFactor", back_populates="risk_score", cascade="all, delete-orphan")


class RiskFactor(Base):
    __tablename__ = "risk_factors"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    risk_score_id: Mapped[str] = mapped_column(String(36), ForeignKey("risk_scores.id", ondelete="CASCADE"), nullable=False, index=True)
    
    dimension_name: Mapped[str] = mapped_column(String(50), nullable=False)
    metric_code: Mapped[str] = mapped_column(String(100), nullable=False)
    raw_value: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    normalized_score: Mapped[float] = mapped_column(Float, nullable=False)   # 0 to 100
    weighted_score: Mapped[float] = mapped_column(Float, nullable=False)     # Portion of final score
    contribution_pct: Mapped[float] = mapped_column(Float, nullable=False)   # % of total risk score
    impact_type: Mapped[str] = mapped_column(String(20), nullable=False)      # positive (risk reducer) vs negative (risk driver)

    risk_score: Mapped["RiskScore"] = relationship("RiskScore", back_populates="factors")


class RiskHistory(Base):
    __tablename__ = "risk_histories"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    country_id: Mapped[str] = mapped_column(String(36), ForeignKey("countries.id", ondelete="CASCADE"), nullable=False, index=True)
    year: Mapped[int] = mapped_column(Integer, nullable=False, index=True)
    
    overall_score: Mapped[float] = mapped_column(Float, nullable=False)
    risk_category: Mapped[str] = mapped_column(String(50), nullable=False)
    global_rank: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    score_change_pct: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    recorded_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class ScoreCalculationLog(Base):
    __tablename__ = "score_calculation_logs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    job_type: Mapped[str] = mapped_column(String(50), nullable=False) # Automatic, Manual, RecalculateAll
    countries_processed: Mapped[int] = mapped_column(Integer, default=0)
    execution_time_seconds: Mapped[float] = mapped_column(Float, default=0.0)
    status: Mapped[str] = mapped_column(String(20), nullable=False)   # success, failed
    log_details: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    calculated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
