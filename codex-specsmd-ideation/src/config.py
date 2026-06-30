import os
from dataclasses import dataclass

from dotenv import load_dotenv


DEFAULT_OLLAMA_MODEL = "minimax-m3:cloud"
DEFAULT_LANGUAGE = "es"


@dataclass(frozen=True)
class AppConfig:
    ollama_model: str = DEFAULT_OLLAMA_MODEL
    default_language: str = DEFAULT_LANGUAGE


def load_config() -> AppConfig:
    load_dotenv()

    return AppConfig(
        ollama_model=os.getenv("OLLAMA_MODEL", DEFAULT_OLLAMA_MODEL).strip()
        or DEFAULT_OLLAMA_MODEL,
        default_language=os.getenv("DEFAULT_LANGUAGE", DEFAULT_LANGUAGE).strip()
        or DEFAULT_LANGUAGE,
    )
