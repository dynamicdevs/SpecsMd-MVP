"""Entidad Friction (fricción operativa)."""
from datetime import datetime, timezone

from sqlmodel import Field, SQLModel

from app.models.enums import (
    AutomationPotential,
    Category,
    FrictionStatus,
    Priority,
)


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Friction(SQLModel, table=True):
    __tablename__ = "frictions"

    id: int | None = Field(default=None, primary_key=True)
    title: str = Field(index=True)
    description: str = ""
    area: str = ""
    category: Category = Field(default=Category.OTRO)
    # Veces por mes que ocurre la fricción.
    frequency: int = Field(default=1, ge=0)
    time_lost_minutes: int = Field(default=0, ge=0)
    people_affected: int = Field(default=1, ge=0)
    # Nivel de dolor 1-5.
    pain_level: int = Field(default=1, ge=1, le=5)
    automation_potential: AutomationPotential = Field(default=AutomationPotential.MEDIO)

    # Campos calculados por el backend.
    monthly_hours_lost: float = Field(default=0.0)
    estimated_monthly_cost: float = Field(default=0.0)
    priority: Priority = Field(default=Priority.BAJA)

    status: FrictionStatus = Field(default=FrictionStatus.DETECTADA)

    created_at: datetime = Field(default_factory=_utcnow)
    updated_at: datetime = Field(default_factory=_utcnow)
