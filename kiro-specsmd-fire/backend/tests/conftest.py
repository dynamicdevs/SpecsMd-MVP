"""Test configuration and fixtures."""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database import Base, get_db
from app.main import app

# In-memory SQLite for tests
TEST_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(autouse=True)
def setup_db():
    """Create tables before each test, drop after."""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def client():
    """Test client for API tests."""
    return TestClient(app)


@pytest.fixture
def sample_friction_data():
    """Sample friction data for tests."""
    return {
        "title": "Reporte manual de ventas",
        "description": "Se genera copiando datos de 3 sistemas",
        "area": "Ventas",
        "category": "repetitive_work",
        "frequency": 4,
        "time_lost_minutes": 120,
        "people_affected": 3,
        "pain_level": 4,
    }
