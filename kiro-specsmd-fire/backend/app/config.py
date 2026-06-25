"""Application configuration via pydantic-settings."""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """App settings loaded from .env file."""

    database_url: str = "sqlite:///./friccion_cero.db"
    hourly_rate: float = 25.0
    high_cost_threshold: float = 500.0
    high_hours_threshold: float = 20.0

    # CORS
    cors_origins: list[str] = ["http://localhost:4200"]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
