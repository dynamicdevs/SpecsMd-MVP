"""Friction SQLAlchemy model."""

from datetime import datetime, timezone

from sqlalchemy import DateTime, Float, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.enums import (
    AutomationPotential,
    Category,
    FrictionStatus,
    PainLevel,
    Priority,
)


class Friction(Base):
    __tablename__ = "frictions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    area: Mapped[str | None] = mapped_column(String(100), nullable=True)
    category: Mapped[str] = mapped_column(String(50), nullable=False)
    frequency: Mapped[int] = mapped_column(Integer, nullable=False)  # times per month
    time_lost_minutes: Mapped[int] = mapped_column(Integer, nullable=False)
    people_affected: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    pain_level: Mapped[int] = mapped_column(Integer, nullable=False, default=3)
    automation_potential: Mapped[str] = mapped_column(
        String(20), nullable=False, default=AutomationPotential.MEDIUM.value
    )

    # Calculated fields
    monthly_hours_lost: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    estimated_monthly_cost: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    priority: Mapped[str] = mapped_column(String(20), nullable=False, default=Priority.MEDIUM.value)
    status: Mapped[str] = mapped_column(
        String(20), nullable=False, default=FrictionStatus.ACTIVE.value
    )

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relationships
    initiatives = relationship("Initiative", back_populates="friction", cascade="all, delete-orphan")
    comments = relationship("FrictionComment", back_populates="friction", cascade="all, delete-orphan")
