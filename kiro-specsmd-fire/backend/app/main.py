"""Fricción Cero — FastAPI Application Entry Point."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, engine
from app.routers import dashboard, frictions, health, initiatives

# Import models so SQLAlchemy creates tables
import app.models  # noqa: F401

# Create database tables (dev mode — will use Alembic migrations later)
Base.metadata.create_all(bind=engine)

# FastAPI app
app = FastAPI(
    title="Fricción Cero API",
    description="API para detectar, registrar, medir y priorizar fricciones operativas",
    version="0.1.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router)
app.include_router(frictions.router)
app.include_router(initiatives.router)
app.include_router(dashboard.router)
