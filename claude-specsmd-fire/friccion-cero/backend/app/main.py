"""Punto de entrada de la API Fricción Cero (FastAPI)."""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session

from app.api import dashboard, frictions, initiatives
from app.core.config import settings
from app.core.database import create_db_and_tables, engine
from app.services.seed_service import seed_if_empty


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: crear tablas y sembrar datos de ejemplo si corresponde.
    create_db_and_tables()
    if settings.seed_on_startup:
        with Session(engine) as session:
            seed_if_empty(session)
    yield


app = FastAPI(
    title=settings.app_name,
    description="API para registrar, medir, clasificar y priorizar fricciones operativas.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(frictions.router)
app.include_router(initiatives.router)
app.include_router(dashboard.router)


@app.get("/", tags=["health"], summary="Health check")
def root() -> dict[str, str]:
    return {"status": "ok", "app": settings.app_name}
