"""Carga de configuración desde variables de entorno / archivo .env."""

from dataclasses import dataclass

from dotenv import load_dotenv
import os

DEFAULT_MODEL = "minimax-m3:cloud"
DEFAULT_LANGUAGE = "es"


@dataclass(frozen=True)
class Config:
    """Configuración de la aplicación."""

    model: str
    language: str


def load_config() -> Config:
    """Lee la configuración desde el entorno (y .env si existe).

    El modelo se puede cambiar fácilmente con la variable OLLAMA_MODEL.
    """
    load_dotenv()
    model = os.getenv("OLLAMA_MODEL", DEFAULT_MODEL).strip() or DEFAULT_MODEL
    language = os.getenv("DEFAULT_LANGUAGE", DEFAULT_LANGUAGE).strip() or DEFAULT_LANGUAGE
    return Config(model=model, language=language)
