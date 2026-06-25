"""Entidad Initiative (iniciativa de mejora derivada de una fricción)."""
from datetime import datetime, timezone

from sqlmodel import Field, SQLModel

from app.models.enums import Complexity, InitiativeStatus, Priority


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Initiative(SQLModel, table=True):
    __tablename__ = "initiatives"

    id: int | None = Field(default=None, primary_key=True)
    friction_id: int = Field(foreign_key="frictions.id", index=True)
    title: str
    proposed_solution: str = ""
    # Reducción esperada del impacto, 0-100 %.
    expected_reduction_percent: float = Field(default=0.0, ge=0, le=100)
    complexity: Complexity = Field(default=Complexity.MEDIA)
    priority: Priority = Field(default=Priority.MEDIA)
    status: InitiativeStatus = Field(default=InitiativeStatus.PROPUESTA)

    created_at: datetime = Field(default_factory=_utcnow)
    updated_at: datetime = Field(default_factory=_utcnow)
