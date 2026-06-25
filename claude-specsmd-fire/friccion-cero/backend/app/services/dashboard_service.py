"""Cálculo de métricas agregadas para el dashboard."""
from collections import Counter

from sqlmodel import Session

from app.repositories.friction_repository import FrictionRepository
from app.repositories.initiative_repository import InitiativeRepository
from app.schemas.dashboard import (
    CountItem,
    DashboardSummary,
    InitiativeStatusItem,
)
from app.schemas.friction import FrictionRead


class DashboardService:
    def __init__(self, session: Session):
        self.frictions = FrictionRepository(session)
        self.initiatives = InitiativeRepository(session)

    def summary(self) -> DashboardSummary:
        frictions = self.frictions.list()
        initiatives = self.initiatives.list()

        total_hours = round(sum(f.monthly_hours_lost for f in frictions), 2)
        total_cost = round(sum(f.estimated_monthly_cost for f in frictions), 2)

        by_category = Counter(f.category.value for f in frictions)
        by_priority = Counter(f.priority.value for f in frictions)
        by_status = Counter(i.status.value for i in initiatives)

        top5 = sorted(
            frictions, key=lambda f: f.estimated_monthly_cost, reverse=True
        )[:5]

        return DashboardSummary(
            total_frictions=len(frictions),
            total_monthly_hours_lost=total_hours,
            total_estimated_monthly_cost=total_cost,
            frictions_by_category=[
                CountItem(label=label, count=count) for label, count in by_category.items()
            ],
            frictions_by_priority=[
                CountItem(label=label, count=count) for label, count in by_priority.items()
            ],
            top5_costly_frictions=[FrictionRead.model_validate(f) for f in top5],
            initiatives_by_status=[
                InitiativeStatusItem(status=label, count=count)
                for label, count in by_status.items()
            ],
        )
