"""FrictionComment SQLAlchemy model."""

from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class FrictionComment(Base):
    __tablename__ = "friction_comments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    friction_id: Mapped[int] = mapped_column(Integer, ForeignKey("frictions.id"), nullable=False)
    comment: Mapped[str] = mapped_column(Text, nullable=False)

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    friction = relationship("Friction", back_populates="comments")
