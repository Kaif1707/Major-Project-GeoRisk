import uuid
from datetime import datetime
from typing import Optional, List
from sqlalchemy import String, Integer, Float, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.session import Base


class Region(Base):
    __tablename__ = "regions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    code: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    countries: Mapped[List["Country"]] = relationship("Country", back_populates="region_rel")


class IndicatorSource(Base):
    __tablename__ = "indicator_sources"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    code: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    base_url: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    health_status: Mapped[str] = mapped_column(String(20), default="healthy")
    last_health_check: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class Country(Base):
    __tablename__ = "countries"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String(150), unique=True, index=True, nullable=False)
    iso_code: Mapped[str] = mapped_column(String(3), unique=True, index=True, nullable=False)  # Alpha-3
    iso_alpha2: Mapped[str] = mapped_column(String(2), unique=True, index=True, nullable=False) # Alpha-2
    country_code_numeric: Mapped[Optional[str]] = mapped_column(String(5), nullable=True)
    
    region_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("regions.id"), nullable=True)
    region: Mapped[str] = mapped_column(String(100), nullable=False)
    subregion: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    continent: Mapped[str] = mapped_column(String(50), nullable=False)
    capital: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    
    population: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    currency_code: Mapped[Optional[str]] = mapped_column(String(10), nullable=True)
    currency_name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    flag_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    latitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    longitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    region_rel: Mapped[Optional["Region"]] = relationship("Region", back_populates="countries")
    economic_indicators: Mapped[List["EconomicIndicator"]] = relationship("EconomicIndicator", back_populates="country")
    political_indicators: Mapped[List["PoliticalIndicator"]] = relationship("PoliticalIndicator", back_populates="country")
    social_indicators: Mapped[List["SocialIndicator"]] = relationship("SocialIndicator", back_populates="country")
    business_indicators: Mapped[List["BusinessIndicator"]] = relationship("BusinessIndicator", back_populates="country")
