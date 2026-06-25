"""Pydantic schemas for Initiative."""

from datetime import datetime

from pydantic import BaseModel, Field

from app.models.enums import Complexity, InitiativeStatus, Priority


class InitiativeCreate(BaseModel):
    """Schema for creating an initiative."""

    friction_id: int
    title: str = Field(..., min_length=1, max_length=255)
    proposed_solution: str | None = None
    expected_reduction_percent: int = Field(0, ge=0, le=100)
    complexity: Complexity = Complexity.MEDIUM
    priority: Priority = Priority.MEDIUM


class InitiativeUpdate(BaseModel):
    """Schema for updating an initiative."""

    title: str | None = Field(None, min_length=1, max_length=255)
    proposed_solution: str | None = None
    expected_reduction_percent: int | None = Field(None, ge=0, le=100)
    complexity: Complexity | None = None
    priority: Priority | None = None
    status: InitiativeStatus | None = None


class InitiativeResponse(BaseModel):
    """Schema for initiative response."""

    id: int
    friction_id: int
    title: str
    proposed_solution: str | None
    expected_reduction_percent: int | None
    complexity: str
    priority: str
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
