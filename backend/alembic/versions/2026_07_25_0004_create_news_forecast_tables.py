"""Create News and Forecast Tables

Revision ID: 0004_news_forecast_tables
Revises: 0003_risk_engine_tables
Create Date: 2026-07-25 00:26:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = '0004_news_forecast_tables'
down_revision: Union[str, None] = '0003_risk_engine_tables'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'news_categories',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('name', sa.String(50), unique=True, nullable=False),
        sa.Column('code', sa.String(50), unique=True, nullable=False, index=True),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now())
    )

    op.create_table(
        'news_articles',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('title', sa.String(300), nullable=False),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('content', sa.Text, nullable=True),
        sa.Column('source_name', sa.String(100), nullable=False, index=True),
        sa.Column('url', sa.String(500), nullable=True),
        sa.Column('country_id', sa.String(36), sa.ForeignKey('countries.id', ondelete='SET NULL'), nullable=True, index=True),
        sa.Column('region', sa.String(100), nullable=True, index=True),
        sa.Column('published_at', sa.DateTime, server_default=sa.func.now(), index=True),
        sa.Column('language', sa.String(10), default='en'),
        sa.Column('category', sa.String(50), default='General', index=True),
        sa.Column('sentiment_score', sa.Float, default=0.0),
        sa.Column('sentiment_label', sa.String(20), default='Neutral'),
        sa.Column('confidence_score', sa.Float, default=0.85),
        sa.Column('ai_summary', sa.Text, nullable=True),
        sa.Column('impact_type', sa.String(20), default='medium'),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now())
    )

    op.create_table(
        'news_sentiments',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('article_id', sa.String(36), sa.ForeignKey('news_articles.id', ondelete='CASCADE'), nullable=False, index=True),
        sa.Column('positive_score', sa.Float, default=0.0),
        sa.Column('neutral_score', sa.Float, default=1.0),
        sa.Column('negative_score', sa.Float, default=0.0),
        sa.Column('keywords', sa.Text, nullable=True)
    )

    op.create_table(
        'forecast_models',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('country_id', sa.String(36), sa.ForeignKey('countries.id', ondelete='CASCADE'), nullable=False, index=True),
        sa.Column('model_type', sa.String(50), default='LinearRegression'),
        sa.Column('target_metric', sa.String(50), default='overall_georisk'),
        sa.Column('forecast_horizon_days', sa.Integer, default=90),
        sa.Column('predicted_value', sa.Float, nullable=False),
        sa.Column('lower_bound', sa.Float, nullable=False),
        sa.Column('upper_bound', sa.Float, nullable=False),
        sa.Column('trend_direction', sa.String(20), default='stable'),
        sa.Column('expected_change_pct', sa.Float, default=0.0),
        sa.Column('confidence_interval', sa.Float, default=95.0),
        sa.Column('calculated_at', sa.DateTime, server_default=sa.func.now())
    )

    op.create_table(
        'scenario_simulation_logs',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('country_id', sa.String(36), sa.ForeignKey('countries.id', ondelete='CASCADE'), nullable=False, index=True),
        sa.Column('scenario_name', sa.String(100), nullable=False),
        sa.Column('input_params', sa.Text, nullable=False),
        sa.Column('original_score', sa.Float, nullable=False),
        sa.Column('predicted_score', sa.Float, nullable=False),
        sa.Column('score_delta', sa.Float, nullable=False),
        sa.Column('category_change', sa.String(100), nullable=True),
        sa.Column('calculated_at', sa.DateTime, server_default=sa.func.now())
    )


def downgrade() -> None:
    op.drop_table('scenario_simulation_logs')
    op.drop_table('forecast_models')
    op.drop_table('news_sentiments')
    op.drop_table('news_articles')
    op.drop_table('news_categories')
