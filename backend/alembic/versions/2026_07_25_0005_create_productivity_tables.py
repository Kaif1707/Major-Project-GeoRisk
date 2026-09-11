"""Create Productivity Tables

Revision ID: 0005_productivity_tables
Revises: 0004_news_forecast_tables
Create Date: 2026-07-25 00:35:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = '0005_productivity_tables'
down_revision: Union[str, None] = '0004_news_forecast_tables'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'watchlists',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('user_id', sa.String(36), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True),
        sa.Column('name', sa.String(100), nullable=False),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('is_pinned', sa.Boolean, default=False, index=True),
        sa.Column('is_archived', sa.Boolean, default=False, index=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime, server_default=sa.func.now())
    )

    op.create_table(
        'watchlist_countries',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('watchlist_id', sa.String(36), sa.ForeignKey('watchlists.id', ondelete='CASCADE'), nullable=False, index=True),
        sa.Column('country_id', sa.String(36), sa.ForeignKey('countries.id', ondelete='CASCADE'), nullable=False, index=True),
        sa.Column('added_at', sa.DateTime, server_default=sa.func.now())
    )

    op.create_table(
        'alert_rules',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('user_id', sa.String(36), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True),
        sa.Column('country_id', sa.String(36), sa.ForeignKey('countries.id', ondelete='CASCADE'), nullable=True, index=True),
        sa.Column('metric_code', sa.String(50), default='overall_georisk', nullable=False),
        sa.Column('condition', sa.String(20), default='gt', nullable=False),
        sa.Column('threshold_value', sa.Float, nullable=False),
        sa.Column('alert_type', sa.String(20), default='in_app', nullable=False),
        sa.Column('is_active', sa.Boolean, default=True, index=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now())
    )

    op.create_table(
        'alert_notifications',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('user_id', sa.String(36), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True),
        sa.Column('alert_rule_id', sa.String(36), sa.ForeignKey('alert_rules.id', ondelete='SET NULL'), nullable=True),
        sa.Column('title', sa.String(200), nullable=False),
        sa.Column('message', sa.Text, nullable=False),
        sa.Column('is_read', sa.Boolean, default=False, index=True),
        sa.Column('triggered_at', sa.DateTime, server_default=sa.func.now(), index=True)
    )

    op.create_table(
        'generated_reports',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('user_id', sa.String(36), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True),
        sa.Column('title', sa.String(200), nullable=False),
        sa.Column('report_type', sa.String(50), default='CountryRiskDossier', nullable=False),
        sa.Column('country_code', sa.String(10), nullable=True),
        sa.Column('format', sa.String(10), default='pdf'),
        sa.Column('content_text', sa.Text, nullable=True),
        sa.Column('file_url', sa.String(500), nullable=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now())
    )

    op.create_table(
        'bookmarks',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('user_id', sa.String(36), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True),
        sa.Column('item_type', sa.String(50), nullable=False, index=True),
        sa.Column('item_id', sa.String(100), nullable=False),
        sa.Column('title', sa.String(200), nullable=False),
        sa.Column('meta_json', sa.Text, nullable=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now())
    )


def downgrade() -> None:
    op.drop_table('bookmarks')
    op.drop_table('generated_reports')
    op.drop_table('alert_notifications')
    op.drop_table('alert_rules')
    op.drop_table('watchlist_countries')
    op.drop_table('watchlists')
