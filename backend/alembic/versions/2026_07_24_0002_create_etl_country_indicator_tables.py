"""Create ETL Country and Indicator Tables

Revision ID: 0002_etl_country_indicators
Revises: 0001_initial_auth_rbac
Create Date: 2026-07-24 23:59:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = '0002_etl_country_indicators'
down_revision: Union[str, None] = '0001_initial_auth_rbac'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'regions',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('name', sa.String(100), unique=True, nullable=False),
        sa.Column('code', sa.String(50), unique=True, nullable=False, index=True),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now())
    )

    op.create_table(
        'indicator_sources',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('name', sa.String(100), nullable=False),
        sa.Column('code', sa.String(50), unique=True, nullable=False, index=True),
        sa.Column('base_url', sa.String(255), nullable=True),
        sa.Column('is_active', sa.Boolean, default=True),
        sa.Column('health_status', sa.String(20), default='healthy'),
        sa.Column('last_health_check', sa.DateTime, nullable=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now())
    )

    op.create_table(
        'countries',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('name', sa.String(150), unique=True, nullable=False, index=True),
        sa.Column('iso_code', sa.String(3), unique=True, nullable=False, index=True),
        sa.Column('iso_alpha2', sa.String(2), unique=True, nullable=False, index=True),
        sa.Column('country_code_numeric', sa.String(5), nullable=True),
        sa.Column('region_id', sa.String(36), sa.ForeignKey('regions.id'), nullable=True),
        sa.Column('region', sa.String(100), nullable=False),
        sa.Column('subregion', sa.String(100), nullable=True),
        sa.Column('continent', sa.String(50), nullable=False),
        sa.Column('capital', sa.String(100), nullable=True),
        sa.Column('population', sa.Integer, nullable=True),
        sa.Column('currency_code', sa.String(10), nullable=True),
        sa.Column('currency_name', sa.String(100), nullable=True),
        sa.Column('flag_url', sa.String(500), nullable=True),
        sa.Column('latitude', sa.Float, nullable=True),
        sa.Column('longitude', sa.Float, nullable=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime, server_default=sa.func.now(), onupdate=sa.func.now())
    )

    op.create_table(
        'economic_indicators',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('country_id', sa.String(36), sa.ForeignKey('countries.id', ondelete='CASCADE'), nullable=False, index=True),
        sa.Column('year', sa.Integer, nullable=False, index=True),
        sa.Column('gdp_usd', sa.Float, nullable=True),
        sa.Column('gdp_growth_pct', sa.Float, nullable=True),
        sa.Column('inflation_pct', sa.Float, nullable=True),
        sa.Column('interest_rate_pct', sa.Float, nullable=True),
        sa.Column('exchange_rate_usd', sa.Float, nullable=True),
        sa.Column('fdi_usd', sa.Float, nullable=True),
        sa.Column('govt_debt_pct_gdp', sa.Float, nullable=True),
        sa.Column('trade_balance_usd', sa.Float, nullable=True),
        sa.Column('exports_usd', sa.Float, nullable=True),
        sa.Column('imports_usd', sa.Float, nullable=True),
        sa.Column('current_account_usd', sa.Float, nullable=True),
        sa.Column('foreign_reserves_usd', sa.Float, nullable=True),
        sa.Column('unemployment_pct', sa.Float, nullable=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime, server_default=sa.func.now(), onupdate=sa.func.now())
    )

    op.create_table(
        'political_indicators',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('country_id', sa.String(36), sa.ForeignKey('countries.id', ondelete='CASCADE'), nullable=False, index=True),
        sa.Column('year', sa.Integer, nullable=False, index=True),
        sa.Column('political_stability', sa.Float, nullable=True),
        sa.Column('govt_effectiveness', sa.Float, nullable=True),
        sa.Column('rule_of_law', sa.Float, nullable=True),
        sa.Column('regulatory_quality', sa.Float, nullable=True),
        sa.Column('voice_accountability', sa.Float, nullable=True),
        sa.Column('control_of_corruption', sa.Float, nullable=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime, server_default=sa.func.now(), onupdate=sa.func.now())
    )

    op.create_table(
        'social_indicators',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('country_id', sa.String(36), sa.ForeignKey('countries.id', ondelete='CASCADE'), nullable=False, index=True),
        sa.Column('year', sa.Integer, nullable=False, index=True),
        sa.Column('population', sa.Integer, nullable=True),
        sa.Column('population_growth_pct', sa.Float, nullable=True),
        sa.Column('hdi_score', sa.Float, nullable=True),
        sa.Column('education_index', sa.Float, nullable=True),
        sa.Column('life_expectancy_years', sa.Float, nullable=True),
        sa.Column('urban_population_pct', sa.Float, nullable=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime, server_default=sa.func.now(), onupdate=sa.func.now())
    )

    op.create_table(
        'business_indicators',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('country_id', sa.String(36), sa.ForeignKey('countries.id', ondelete='CASCADE'), nullable=False, index=True),
        sa.Column('year', sa.Integer, nullable=False, index=True),
        sa.Column('ease_of_business_rank', sa.Integer, nullable=True),
        sa.Column('corporate_tax_rate_pct', sa.Float, nullable=True),
        sa.Column('startup_procedures_days', sa.Float, nullable=True),
        sa.Column('business_registration_time', sa.Float, nullable=True),
        sa.Column('infrastructure_index', sa.Float, nullable=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime, server_default=sa.func.now(), onupdate=sa.func.now())
    )

    op.create_table(
        'indicator_histories',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('country_id', sa.String(36), sa.ForeignKey('countries.id', ondelete='CASCADE'), nullable=False, index=True),
        sa.Column('indicator_type', sa.String(50), nullable=False),
        sa.Column('indicator_code', sa.String(100), nullable=False, index=True),
        sa.Column('year', sa.Integer, nullable=False, index=True),
        sa.Column('raw_value', sa.Float, nullable=True),
        sa.Column('normalized_value', sa.Float, nullable=True),
        sa.Column('unit', sa.String(50), nullable=True),
        sa.Column('source_id', sa.String(36), sa.ForeignKey('indicator_sources.id'), nullable=True),
        sa.Column('recorded_at', sa.DateTime, server_default=sa.func.now())
    )

    op.create_table(
        'data_refresh_histories',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('source_name', sa.String(100), nullable=False),
        sa.Column('job_type', sa.String(50), nullable=False),
        sa.Column('status', sa.String(20), nullable=False),
        sa.Column('rows_imported', sa.Integer, default=0),
        sa.Column('execution_time_seconds', sa.Float, default=0.0),
        sa.Column('error_log', sa.Text, nullable=True),
        sa.Column('started_at', sa.DateTime, server_default=sa.func.now()),
        sa.Column('completed_at', sa.DateTime, nullable=True)
    )

    op.create_table(
        'data_quality_logs',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('dataset_name', sa.String(100), nullable=False),
        sa.Column('rule_violated', sa.String(150), nullable=False),
        sa.Column('rejected_count', sa.Integer, default=0),
        sa.Column('details', sa.Text, nullable=True),
        sa.Column('logged_at', sa.DateTime, server_default=sa.func.now())
    )


def downgrade() -> None:
    op.drop_table('data_quality_logs')
    op.drop_table('data_refresh_histories')
    op.drop_table('indicator_histories')
    op.drop_table('business_indicators')
    op.drop_table('social_indicators')
    op.drop_table('political_indicators')
    op.drop_table('economic_indicators')
    op.drop_table('countries')
    op.drop_table('indicator_sources')
    op.drop_table('regions')
