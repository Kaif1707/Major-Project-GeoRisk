import uuid
from datetime import datetime
from typing import Optional, List
from sqlalchemy import String, Integer, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.session import Base


class NewsCategory(Base):
    __tablename__ = "news_categories"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String(50), unique=True, nullable=False) # Conflict, Macroeconomic, Trade, Sanctions, Governance
    code: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class NewsArticle(Base):
    __tablename__ = "news_articles"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title: Mapped[str] = mapped_column(String(300), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    content: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    source_name: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    
    country_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("countries.id", ondelete="SET NULL"), nullable=True, index=True)
    region: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, index=True)
    published_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)
    language: Mapped[str] = mapped_column(String(10), default="en")
    category: Mapped[str] = mapped_column(String(50), default="General", index=True)
    
    sentiment_score: Mapped[float] = mapped_column(Float, default=0.0)             # -1.0 (Very Negative) to +1.0 (Very Positive)
    sentiment_label: Mapped[str] = mapped_column(String(20), default="Neutral")    # Positive, Neutral, Negative, etc.
    confidence_score: Mapped[float] = mapped_column(Float, default=0.85)
    ai_summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    impact_type: Mapped[str] = mapped_column(String(20), default="medium")         # high, medium, low
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    country: Mapped[Optional["Country"]] = relationship("Country")
    sentiments: Mapped[List["NewsSentiment"]] = relationship("NewsSentiment", back_populates="article", cascade="all, delete-orphan")


class NewsSentiment(Base):
    __tablename__ = "news_sentiments"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    article_id: Mapped[str] = mapped_column(String(36), ForeignKey("news_articles.id", ondelete="CASCADE"), nullable=False, index=True)
    positive_score: Mapped[float] = mapped_column(Float, default=0.0)
    neutral_score: Mapped[float] = mapped_column(Float, default=1.0)
    negative_score: Mapped[float] = mapped_column(Float, default=0.0)
    keywords: Mapped[Optional[str]] = mapped_column(Text, nullable=True) # Comma-separated key impact drivers

    article: Mapped["NewsArticle"] = relationship("NewsArticle", back_populates="sentiments")
