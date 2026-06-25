"""Schemas (DTOs) de iniciativas."""
from datetime import datetime

from pydantic import Field

from app.models.enums import Complexity, InitiativeStatus, Priority
from app.schemas.common import CamelModel


class InitiativeCreate(CamelModel):
    friction_id: int
    title: str = Field(min_length=1)
    proposed_solution: str = ""
    expected_reduction_percent: float = Field(default=0.0, ge=0, le=100)
    complexity: Complexity = Complexity.MEDIA
    # Priority opcional: si no se envía, se hereda de la fricción asociada.
    priority: Priority | None = None
    status: InitiativeStatus = InitiativeStatus.PROPUESTA


class InitiativeUpdate(CamelModel):
    title: str | None = Field(default=None, min_length=1)
    proposed_solution: str | None = None
    expected_reduction_percent: float | None = Field(default=None, ge=0, le=100)
    complexity: Complexity | None = None
    priority: Priority | None = None
    status: InitiativeStatus | None = None


class InitiativeRead(CamelModel):
    id: int
    friction_id: int
    title: str
    proposed_solution: str
    expected_reduction_percent: float
    complexity: Complexity
    priority: Priority
    status: InitiativeStatus
    created_at: datetime
    updated_at: datetime
