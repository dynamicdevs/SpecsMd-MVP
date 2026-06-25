"""Endpoint REST del dashboard."""
from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.core.database import get_session
from app.schemas.dashboard import DashboardSummary
from app.services.dashboard_service import DashboardService

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("", response_model=DashboardSummary, summary="Métricas agregadas")
def get_dashboard(session: Session = Depends(get_session)) -> DashboardSummary:
    return DashboardService(session).summary()
