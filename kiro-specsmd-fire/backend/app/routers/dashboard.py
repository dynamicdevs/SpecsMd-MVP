"""Dashboard metrics router."""

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.friction import Friction
from app.models.initiative import Initiative
from app.schemas.dashboard import (
    CategoryCount,
    DashboardResponse,
    InitiativeStatusCount,
    PriorityCount,
    TopFriction,
)

router = APIRouter(prefix="/api/v1/dashboard", tags=["Dashboard"])


@router.get("", response_model=DashboardResponse)
def get_dashboard(db: Session = Depends(get_db)):
    """Get dashboard metrics."""

    # Total frictions
    total_frictions = db.query(func.count(Friction.id)).scalar() or 0

    # Totals
    total_hours = (
        db.query(func.sum(Friction.monthly_hours_lost)).scalar() or 0.0
    )
    total_cost = (
        db.query(func.sum(Friction.estimated_monthly_cost)).scalar() or 0.0
    )

    # By category
    category_rows = (
        db.query(Friction.category, func.count(Friction.id))
        .group_by(Friction.category)
        .all()
    )
    by_category = [CategoryCount(category=r[0], count=r[1]) for r in category_rows]

    # By priority
    priority_rows = (
        db.query(Friction.priority, func.count(Friction.id))
        .group_by(Friction.priority)
        .all()
    )
    by_priority = [PriorityCount(priority=r[0], count=r[1]) for r in priority_rows]

    # Top 5 most costly frictions
    top_frictions = (
        db.query(Friction)
        .order_by(Friction.estimated_monthly_cost.desc())
        .limit(5)
        .all()
    )
    top_costly = [
        TopFriction(
            id=f.id,
            title=f.title,
            category=f.category,
            monthly_hours_lost=f.monthly_hours_lost,
            estimated_monthly_cost=f.estimated_monthly_cost,
            priority=f.priority,
        )
        for f in top_frictions
    ]

    # Initiatives by status
    initiative_rows = (
        db.query(Initiative.status, func.count(Initiative.id))
        .group_by(Initiative.status)
        .all()
    )
    initiatives_by_status = [
        InitiativeStatusCount(status=r[0], count=r[1]) for r in initiative_rows
    ]

    return DashboardResponse(
        total_frictions=total_frictions,
        total_monthly_hours_lost=round(total_hours, 2),
        total_estimated_monthly_cost=round(total_cost, 2),
        by_category=by_category,
        by_priority=by_priority,
        top_costly_frictions=top_costly,
        initiatives_by_status=initiatives_by_status,
    )
