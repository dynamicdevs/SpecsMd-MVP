"""Configuración de la aplicación.

El valor hora (HourlyRate) usado para estimar el costo mensual es configurable por
variable de entorno. Si no se define, se usa un valor por defecto simple para el MVP.
"""
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="FRICCION_", env_file=".env", extra="ignore")

    app_name: str = "Fricción Cero API"
    database_url: str = "sqlite:///./friccion_cero.db"

    # Valor hora por defecto (moneda local) usado para EstimatedMonthlyCost.
    hourly_rate: float = 20.0

    # Origen permitido para CORS (frontend Angular en desarrollo).
    cors_origins: list[str] = ["http://localhost:4200", "http://127.0.0.1:4200"]

    # Sembrar datos de ejemplo al iniciar si la DB está vacía.
    seed_on_startup: bool = True


settings = Settings()
