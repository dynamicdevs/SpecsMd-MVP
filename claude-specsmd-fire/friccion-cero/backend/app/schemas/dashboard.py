"""Schemas del dashboard (métricas agregadas)."""
from app.schemas.common import CamelModel
from app.schemas.friction import FrictionRead


class CountItem(CamelModel):
    label: str
    count: int


class InitiativeStatusItem(CamelModel):
    status: str
    count: int


class DashboardSummary(CamelModel):
    total_frictions: int
    total_monthly_hours_lost: float
    total_estimated_monthly_cost: float
    frictions_by_category: list[CountItem]
    frictions_by_priority: list[CountItem]
    top5_costly_frictions: list[FrictionRead]
    initiatives_by_status: list[InitiativeStatusItem]
