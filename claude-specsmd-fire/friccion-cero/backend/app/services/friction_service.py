"""Lógica de negocio de fricciones: CRUD + recálculo de impacto, categoría y prioridad."""
from datetime import datetime, timezone

from sqlmodel import Session

from app.models.friction import Friction
from app.repositories.friction_repository import FrictionRepository
from app.schemas.friction import FrictionCreate, FrictionUpdate
from app.services import (
    classification_service,
    impact_service,
    prioritization_service,
)


class FrictionService:
    def __init__(self, session: Session):
        self.repo = FrictionRepository(session)

    def _recalculate(self, friction: Friction) -> None:
        """Recalcula campos derivados a partir de los datos actuales de la fricción."""
        friction.monthly_hours_lost = impact_service.calculate_monthly_hours_lost(
            friction.time_lost_minutes, friction.frequency, friction.people_affected
        )
        friction.estimated_monthly_cost = impact_service.calculate_estimated_monthly_cost(
            friction.monthly_hours_lost
        )
        friction.priority = prioritization_service.determine_priority(
            friction.monthly_hours_lost,
            friction.estimated_monthly_cost,
            friction.pain_level,
            friction.automation_potential,
        )

    def list(self) -> list[Friction]:
        return self.repo.list()

    def get(self, friction_id: int) -> Friction | None:
        return self.repo.get(friction_id)

    def create(self, data: FrictionCreate) -> Friction:
        friction = Friction(
            title=data.title,
            description=data.description,
            area=data.area,
            frequency=data.frequency,
            time_lost_minutes=data.time_lost_minutes,
            people_affected=data.people_affected,
            pain_level=data.pain_level,
            automation_potential=data.automation_potential,
            status=data.status,
        )
        # Si no se envía categoría, se sugiere por reglas sobre título + descripción.
        if data.category is not None:
            friction.category = data.category
        else:
            friction.category = classification_service.suggest_category(
                f"{data.title} {data.description}"
            )
        self._recalculate(friction)
        return self.repo.add(friction)

    def update(self, friction_id: int, data: FrictionUpdate) -> Friction | None:
        friction = self.repo.get(friction_id)
        if friction is None:
            return None

        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(friction, field, value)

        friction.updated_at = datetime.now(timezone.utc)
        self._recalculate(friction)
        return self.repo.update(friction)

    def delete(self, friction_id: int) -> bool:
        friction = self.repo.get(friction_id)
        if friction is None:
            return False
        self.repo.delete(friction)
        return True
