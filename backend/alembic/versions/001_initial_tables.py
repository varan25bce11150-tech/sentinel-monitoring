"""Initial tables creation

Revision ID: 001_initial_tables
Revises: 
Create Date: 2026-09-30

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '001_initial_tables'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # users table
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('hashed_password', sa.String(length=255), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('is_superuser', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)

    # monitors table
    op.create_table(
        'monitors',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('url', sa.Text(), nullable=False),
        sa.Column('method', sa.String(length=10), nullable=False, server_default='GET'),
        sa.Column('interval_seconds', sa.Integer(), nullable=False, server_default='60'),
        sa.Column('timeout_seconds', sa.Integer(), nullable=False, server_default='10'),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('status', sa.String(length=20), nullable=False, server_default='unknown'),
        sa.Column('last_checked_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_monitors_id'), 'monitors', ['id'], unique=False)
    op.create_index(op.f('ix_monitors_user_id'), 'monitors', ['user_id'], unique=False)

    # checks table
    op.create_table(
        'checks',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('monitor_id', sa.Integer(), nullable=False),
        sa.Column('status_code', sa.Integer(), nullable=True),
        sa.Column('response_time_ms', sa.Float(), nullable=True),
        sa.Column('is_up', sa.Boolean(), nullable=False),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.Column('checked_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['monitor_id'], ['monitors.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_checks_checked_at'), 'checks', ['checked_at'], unique=False)
    op.create_index(op.f('ix_checks_id'), 'checks', ['id'], unique=False)
    op.create_index(op.f('ix_checks_monitor_id'), 'checks', ['monitor_id'], unique=False)

    # incidents table
    op.create_table(
        'incidents',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('monitor_id', sa.Integer(), nullable=False),
        sa.Column('started_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('resolved_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('cause', sa.Text(), nullable=True),
        sa.Column('is_resolved', sa.Boolean(), nullable=False, server_default='false'),
        sa.ForeignKeyConstraint(['monitor_id'], ['monitors.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_incidents_id'), 'incidents', ['id'], unique=False)
    op.create_index(op.f('ix_incidents_monitor_id'), 'incidents', ['monitor_id'], unique=False)


def downgrade() -> None:
    op.drop_table('incidents')
    op.drop_table('checks')
    op.drop_table('monitors')
    op.drop_table('users')