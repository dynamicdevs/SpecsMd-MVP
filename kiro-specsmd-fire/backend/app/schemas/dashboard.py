"""Pydantic schemas for Dashboard."""

from pydantic import BaseModel


class CategoryCount(BaseModel):
    category: str
    count: int


class PriorityCount(BaseModel):
    priority: str
    count: int


class InitiativeStatusCount(BaseModel):
    status: str
    count: int


class TopFriction(BaseModel):
    id: int
    title: str
    category: str
    monthly_hours_lost: float
    estimated_monthly_cost: float
    priority: str


class DashboardResponse(BaseModel):
    """Dashboard metrics."""

    total_frictions: int
    total_monthly_hours_lost: float
    total_estimated_monthly_cost: float
    by_category: list[CategoryCount]
    by_priority: list[PriorityCount]
    top_costly_frictions: list[TopFriction]
    initiatives_by_status: list[InitiativeStatusCount]
