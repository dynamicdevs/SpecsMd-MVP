"""Initiative SQLAlchemy model."""

from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.enums import Complexity, InitiativeStatus, Priority


class Initiative(Base):
    __tablename__ = "initiatives"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    friction_id: Mapped[int] = mapped_column(Integer, ForeignKey("frictions.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    proposed_solution: Mapped[str | None] = mapped_column(Text, nullable=True)
    expected_reduction_percent: Mapped[int] = mapped_column(Integer, nullable=True, default=0)
    complexity: Mapped[str] = mapped_column(
        String(20), nullable=False, default=Complexity.MEDIUM.value
    )
    priority: Mapped[str] = mapped_column(
        String(20), nullable=False, default=Priority.MEDIUM.value
    )
    status: Mapped[str] = mapped_column(
        String(20), nullable=False, default=InitiativeStatus.PROPOSED.value
    )

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relationships
    friction = relationship("Friction", back_populates="initiatives")
