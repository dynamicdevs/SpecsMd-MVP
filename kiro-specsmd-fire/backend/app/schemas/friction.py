"""Pydantic schemas for Friction."""

from datetime import datetime

from pydantic import BaseModel, Field

from app.models.enums import Category


class FrictionCreate(BaseModel):
    """Schema for creating a friction."""

    title: str = Field(..., min_length=1, max_length=255)
    description: str | None = None
    area: str | None = None
    category: Category
    frequency: int = Field(..., gt=0, description="Times per month")
    time_lost_minutes: int = Field(..., gt=0, description="Minutes lost per event")
    people_affected: int = Field(1, gt=0)
    pain_level: int = Field(3, ge=1, le=5)


class FrictionUpdate(BaseModel):
    """Schema for updating a friction."""

    title: str | None = Field(None, min_length=1, max_length=255)
    description: str | None = None
    area: str | None = None
    category: Category | None = None
    frequency: int | None = Field(None, gt=0)
    time_lost_minutes: int | None = Field(None, gt=0)
    people_affected: int | None = Field(None, gt=0)
    pain_level: int | None = Field(None, ge=1, le=5)
    status: str | None = None


class FrictionResponse(BaseModel):
    """Schema for friction response."""

    id: int
    title: str
    description: str | None
    area: str | None
    category: str
    frequency: int
    time_lost_minutes: int
    people_affected: int
    pain_level: int
    automation_potential: str
    monthly_hours_lost: float
    estimated_monthly_cost: float
    priority: str
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CommentCreate(BaseModel):
    """Schema for creating a comment."""

    comment: str = Field(..., min_length=1)


class CommentResponse(BaseModel):
    """Schema for comment response."""

    id: int
    friction_id: int
    comment: str
    created_at: datetime

    class Config:
        from_attributes = True
