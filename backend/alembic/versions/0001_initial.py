"""initial schema

Revision ID: 0001
Revises:
Create Date: 2026-05-27
"""
from alembic import op
import sqlalchemy as sa


revision = "0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("username", sa.String(64), nullable=False, unique=True),
        sa.Column("password_hash", sa.String(255), nullable=False),
        sa.Column(
            "role",
            sa.Enum("admin", "user", name="user_role"),
            nullable=False,
            server_default="user",
        ),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
    )
    op.create_index("ix_users_username", "users", ["username"])

    op.create_table(
        "cars",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("brand_company", sa.String(128), nullable=False),
        sa.Column("brand_model", sa.String(128), nullable=False),
        sa.Column("body_type", sa.String(64), nullable=False),
        sa.Column("reg_number", sa.String(32), nullable=False, unique=True),
    )
    op.create_index("ix_cars_reg_number", "cars", ["reg_number"])

    op.create_table(
        "drivers",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("full_name", sa.String(255), nullable=False),
        sa.Column("experience", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("car_reg_number", sa.String(32), sa.ForeignKey("cars.reg_number"), nullable=True),
        sa.Column("license_number", sa.String(64), nullable=False, unique=True),
        sa.Column("license_date", sa.Date(), nullable=False),
        sa.Column("act_number", sa.String(64), nullable=True),
    )

    op.create_table(
        "accidents",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("department_name", sa.String(255), nullable=False),
        sa.Column("act_number", sa.String(64), nullable=False, unique=True),
        sa.Column("driver_id", sa.Integer(), sa.ForeignKey("drivers.id"), nullable=False),
        sa.Column("car_reg_number", sa.String(32), sa.ForeignKey("cars.reg_number"), nullable=True),
        sa.Column("accident_date", sa.Date(), nullable=False),
        sa.Column("location", sa.String(512), nullable=False),
        sa.Column("latitude", sa.Float(), nullable=True),
        sa.Column("longitude", sa.Float(), nullable=True),
        sa.Column("victims_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("accident_type", sa.String(64), nullable=False),
        sa.Column("accident_cause", sa.String(128), nullable=False),
    )
    op.create_index("ix_accidents_act_number", "accidents", ["act_number"])
    op.create_index("ix_accidents_date", "accidents", ["accident_date"])

    op.create_foreign_key(
        "fk_drivers_act_number",
        "drivers",
        "accidents",
        ["act_number"],
        ["act_number"],
    )

    op.create_table(
        "accident_cars",
        sa.Column(
            "accident_id",
            sa.Integer(),
            sa.ForeignKey("accidents.id", ondelete="CASCADE"),
            primary_key=True,
        ),
        sa.Column(
            "car_reg_number",
            sa.String(32),
            sa.ForeignKey("cars.reg_number"),
            primary_key=True,
        ),
    )


def downgrade() -> None:
    op.drop_table("accident_cars")
    op.drop_constraint("fk_drivers_act_number", "drivers", type_="foreignkey")
    op.drop_index("ix_accidents_date", table_name="accidents")
    op.drop_index("ix_accidents_act_number", table_name="accidents")
    op.drop_table("accidents")
    op.drop_table("drivers")
    op.drop_index("ix_cars_reg_number", table_name="cars")
    op.drop_table("cars")
    op.drop_index("ix_users_username", table_name="users")
    op.drop_table("users")
    op.execute("DROP TYPE IF EXISTS user_role")
