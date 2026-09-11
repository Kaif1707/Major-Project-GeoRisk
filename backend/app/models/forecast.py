import uuid
from datetime import datetime
from typing import Optional
from sqlalchemy import String, Integer, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.session import Base


class ForecastModel(Base):
    __tablename__ = "forecast_models"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    country_id: Mapped[str] = mapped_column(String(36), ForeignKey("countries.id", ondelete="CASCADE"), nullable=False, index=True)
    model_type: Mapped[str] = mapped_column(String(50), default="LinearRegression") # Prophet, LinearRegression, HoltWinters
    target_metric: Mapped[str] = mapped_column(String(50), default="overall_georisk")
    forecast_horizon_days: Mapped[int] = mapped_column(Integer, default=90)           # 30, 90, 180, 365
    
    predicted_value: Mapped[float] = mapped_column(Float, nullable=False)
    lower_bound: Mapped[float] = mapped_column(Float, nullable=False)
    upper_bound: Mapped[float] = mapped_column(Float, nullable=False)
    trend_direction: Mapped[str] = mapped_column(String(20), default="stable")         # improving, stable, escalating
    expected_change_pct: Mapped[float] = mapped_column(Float, default=0.0)
    confidence_interval: Mapped[float] = mapped_column(Float, default=95.0)           # 95% confidence corridor
    
    calculated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    country: Mapped["Country"] = relationship("Country")


class ScenarioSimulationLog(Base):
    __tablename__ = "scenario_simulation_logs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    country_id: Mapped[str] = mapped_column(String(36), ForeignKey("countries.id", ondelete="CASCADE"), nullable=False, index=True)
    scenario_name: Mapped[str] = mapped_column(String(100), nullable=False)
    input_params: Mapped[str] = mapped_column(Text, nullable=False)                  # JSON input parameters
    
    original_score: Mapped[float] = mapped_column(Float, nullable=False)
    predicted_score: Mapped[float] = mapped_column(Float, nullable=False)
    score_delta: Mapped[float] = mapped_column(Float, nullable=False)
    category_change: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    calculated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    country: Mapped["Country"] = relationship("Country")
