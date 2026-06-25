"""Acceso a datos para fricciones."""
from sqlmodel import Session, select

from app.models.friction import Friction


class FrictionRepository:
    def __init__(self, session: Session):
        self.session = session

    def list(self) -> list[Friction]:
        return list(self.session.exec(select(Friction).order_by(Friction.id)).all())

    def get(self, friction_id: int) -> Friction | None:
        return self.session.get(Friction, friction_id)

    def add(self, friction: Friction) -> Friction:
        self.session.add(friction)
        self.session.commit()
        self.session.refresh(friction)
        return friction

    def update(self, friction: Friction) -> Friction:
        self.session.add(friction)
        self.session.commit()
        self.session.refresh(friction)
        return friction

    def delete(self, friction: Friction) -> None:
        self.session.delete(friction)
        self.session.commit()

    def count(self) -> int:
        return len(self.list())
