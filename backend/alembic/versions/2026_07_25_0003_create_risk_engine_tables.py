"""Create Risk Engine Tables

Revision ID: 0003_risk_engine_tables
Revises: 0002_etl_country_indicators
Create Date: 2026-07-25 00:02:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = '0003_risk_engine_tables'
down_revision: Union[str, None] = '0002_etl_country_indicators'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'risk_categories',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('name', sa.String(50), unique=True, nullable=False),
        sa.Column('min_score', sa.Float, nullable=False),
        sa.Column('max_score', sa.Float, nullable=False),
        sa.Column('color_code', sa.String(20), nullable=False),
        sa.Column('badge_style', sa.String(100), nullable=False),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now())
    )

    op.create_table(
        'risk_weights',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('dimension_name', sa.String(50), nullable=False, index=True),
        sa.Column('metric_code', sa.String(100), nullable=False, index=True),
        sa.Column('display_name', sa.String(100), nullable=False),
        sa.Column('weight_pct', sa.Float, nullable=False),
        sa.Column('min_value', sa.Float, nullable=True),
        sa.Column('max_value', sa.Float, nullable=True),
        sa.Column('is_inverted', sa.Boolean, default=False),
        sa.Column('version', sa.String(20), default='1.0'),
        sa.Column('is_active', sa.Boolean, default=True),
        sa.Column('created_by', sa.String(100), nullable=True),
        sa.Column('updated_by', sa.String(100), nullable=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime, server_default=sa.func.now(), onupdate=sa.func.now())
    )

    op.create_table(
        'score_versions',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('version_code', sa.String(20), unique=True, nullable=False),
        sa.Column('name', sa.String(100), nullable=False),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('is_active', sa.Boolean, default=True),
        sa.Column('activated_at', sa.DateTime, server_default=sa.func.now())
    )

    op.create_table(
        'risk_scores',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('country_id', sa.String(36), sa.ForeignKey('countries.id', ondelete='CASCADE'), nullable=False, index=True),
        sa.Column('year', sa.Integer, nullable=False, index=True),
        sa.Column('overall_score', sa.Float, nullable=False, index=True),
        sa.Column('risk_category_id', sa.String(36), sa.ForeignKey('risk_categories.id'), nullable=False),
        sa.Column('economic_score', sa.Float, default=0.0),
        sa.Column('political_score', sa.Float, default=0.0),
        sa.Column('business_score', sa.Float, default=0.0),
        sa.Column('social_score', sa.Float, default=0.0),
        sa.Column('trade_score', sa.Float, default=0.0),
        sa.Column('currency_score', sa.Float, default=0.0),
        sa.Column('external_score', sa.Float, default=0.0),
        sa.Column('conflict_score', sa.Float, default=0.0),
        sa.Column('global_rank', sa.Integer, nullable=True, index=True),
        sa.Column('regional_rank', sa.Integer, nullable=True, index=True),
        sa.Column('score_version', sa.String(20), default='1.0'),
        sa.Column('calculated_at', sa.DateTime, server_default=sa.func.now())
    )

    op.create_table(
        'risk_factors',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('risk_score_id', sa.String(36), sa.ForeignKey('risk_scores.id', ondelete='CASCADE'), nullable=False, index=True),
        sa.Column('dimension_name', sa.String(50), nullable=False),
        sa.Column('metric_code', sa.String(100), nullable=False),
        sa.Column('raw_value', sa.Float, nullable=True),
        sa.Column('normalized_score', sa.Float, nullable=False),
        sa.Column('weighted_score', sa.Float, nullable=False),
        sa.Column('contribution_pct', sa.Float, nullable=False),
        sa.Column('impact_type', sa.String(20), nullable=False)
    )

    op.create_table(
        'risk_histories',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('country_id', sa.String(36), sa.ForeignKey('countries.id', ondelete='CASCADE'), nullable=False, index=True),
        sa.Column('year', sa.Integer, nullable=False, index=True),
        sa.Column('overall_score', sa.Float, nullable=False),
        sa.Column('risk_category', sa.String(50), nullable=False),
        sa.Column('global_rank', sa.Integer, nullable=True),
        sa.Column('score_change_pct', sa.Float, nullable=True),
        sa.Column('recorded_at', sa.DateTime, server_default=sa.func.now())
    )

    op.create_table(
        'score_calculation_logs',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('job_type', sa.String(50), nullable=False),
        sa.Column('countries_processed', sa.Integer, default=0),
        sa.Column('execution_time_seconds', sa.Float, default=0.0),
        sa.Column('status', sa.String(20), nullable=False),
        sa.Column('log_details', sa.Text, nullable=True),
        sa.Column('calculated_at', sa.DateTime, server_default=sa.func.now())
    )


def downgrade() -> None:
    op.drop_table('score_calculation_logs')
    op.drop_table('risk_histories')
    op.drop_table('risk_factors')
    op.drop_table('risk_scores')
    op.drop_table('score_versions')
    op.drop_table('risk_weights')
    op.drop_table('risk_categories')
