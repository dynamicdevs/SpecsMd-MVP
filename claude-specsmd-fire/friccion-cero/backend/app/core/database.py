"""Engine y sesión de base de datos (SQLModel + SQLite)."""
from collections.abc import Generator

from sqlmodel import Session, SQLModel, create_engine

from app.core.config import settings

# check_same_thread=False es necesario para SQLite con FastAPI (varios hilos).
connect_args = {"check_same_thread": False} if settings.database_url.startswith("sqlite") else {}

engine = create_engine(settings.database_url, echo=False, connect_args=connect_args)


def create_db_and_tables() -> None:
    """Crea las tablas a partir de los modelos SQLModel (migración simple para el MVP)."""
    # Importar modelos para que queden registrados en SQLModel.metadata.
    from app import models  # noqa: F401

    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
    """Dependencia de FastAPI que provee una sesión de DB por request."""
    with Session(engine) as session:
        yield session
