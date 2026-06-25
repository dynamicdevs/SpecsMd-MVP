"""Schemas (DTOs) de fricciones."""
from datetime import datetime

from pydantic import Field

from app.models.enums import (
    AutomationPotential,
    Category,
    FrictionStatus,
    Priority,
)
from app.schemas.common import CamelModel


class FrictionCreate(CamelModel):
    title: str = Field(min_length=1)
    description: str = ""
    area: str = ""
    # Category es opcional: si no se envía, el backend la sugiere por reglas.
    category: Category | None = None
    frequency: int = Field(default=1, ge=0)
    time_lost_minutes: int = Field(default=0, ge=0)
    people_affected: int = Field(default=1, ge=0)
    pain_level: int = Field(default=1, ge=1, le=5)
    automation_potential: AutomationPotential = AutomationPotential.MEDIO
    status: FrictionStatus = FrictionStatus.DETECTADA


class FrictionUpdate(CamelModel):
    title: str | None = Field(default=None, min_length=1)
    description: str | None = None
    area: str | None = None
    category: Category | None = None
    frequency: int | None = Field(default=None, ge=0)
    time_lost_minutes: int | None = Field(default=None, ge=0)
    people_affected: int | None = Field(default=None, ge=0)
    pain_level: int | None = Field(default=None, ge=1, le=5)
    automation_potential: AutomationPotential | None = None
    status: FrictionStatus | None = None


class FrictionRead(CamelModel):
    id: int
    title: str
    description: str
    area: str
    category: Category
    frequency: int
    time_lost_minutes: int
    people_affected: int
    pain_level: int
    automation_potential: AutomationPotential
    monthly_hours_lost: float
    estimated_monthly_cost: float
    priority: Priority
    status: FrictionStatus
    created_at: datetime
    updated_at: datetime


class ClassifyRequest(CamelModel):
    text: str = Field(min_length=1)


class ClassifyResponse(CamelModel):
    category: Category
