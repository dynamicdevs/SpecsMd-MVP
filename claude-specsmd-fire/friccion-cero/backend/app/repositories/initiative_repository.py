"""Acceso a datos para iniciativas."""
from sqlmodel import Session, select

from app.models.initiative import Initiative


class InitiativeRepository:
    def __init__(self, session: Session):
        self.session = session

    def list(self) -> list[Initiative]:
        return list(self.session.exec(select(Initiative).order_by(Initiative.id)).all())

    def get(self, initiative_id: int) -> Initiative | None:
        return self.session.get(Initiative, initiative_id)

    def add(self, initiative: Initiative) -> Initiative:
        self.session.add(initiative)
        self.session.commit()
        self.session.refresh(initiative)
        return initiative

    def update(self, initiative: Initiative) -> Initiative:
        self.session.add(initiative)
        self.session.commit()
        self.session.refresh(initiative)
        return initiative

    def delete(self, initiative: Initiative) -> None:
        self.session.delete(initiative)
        self.session.commit()
