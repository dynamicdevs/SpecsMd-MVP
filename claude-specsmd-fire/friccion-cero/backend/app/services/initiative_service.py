"""Lógica de negocio de iniciativas: CRUD + creación desde una fricción."""
from datetime import datetime, timezone

from sqlmodel import Session

from app.models.initiative import Initiative
from app.repositories.friction_repository import FrictionRepository
from app.repositories.initiative_repository import InitiativeRepository
from app.schemas.initiative import InitiativeCreate, InitiativeUpdate


class FrictionNotFoundError(Exception):
    """La fricción referenciada por la iniciativa no existe."""


class InitiativeService:
    def __init__(self, session: Session):
        self.repo = InitiativeRepository(session)
        self.friction_repo = FrictionRepository(session)

    def list(self) -> list[Initiative]:
        return self.repo.list()

    def get(self, initiative_id: int) -> Initiative | None:
        return self.repo.get(initiative_id)

    def create(self, data: InitiativeCreate) -> Initiative:
        friction = self.friction_repo.get(data.friction_id)
        if friction is None:
            raise FrictionNotFoundError(data.friction_id)

        initiative = Initiative(
            friction_id=data.friction_id,
            title=data.title,
            proposed_solution=data.proposed_solution,
            expected_reduction_percent=data.expected_reduction_percent,
            complexity=data.complexity,
            # Si no se envía prioridad, hereda la de la fricción asociada.
            priority=data.priority if data.priority is not None else friction.priority,
            status=data.status,
        )
        return self.repo.add(initiative)

    def update(self, initiative_id: int, data: InitiativeUpdate) -> Initiative | None:
        initiative = self.repo.get(initiative_id)
        if initiative is None:
            return None

        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(initiative, field, value)

        initiative.updated_at = datetime.now(timezone.utc)
        return self.repo.update(initiative)

    def delete(self, initiative_id: int) -> bool:
        initiative = self.repo.get(initiative_id)
        if initiative is None:
            return False
        self.repo.delete(initiative)
        return True
