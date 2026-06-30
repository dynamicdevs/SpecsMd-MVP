from __future__ import annotations

import os

from dotenv import load_dotenv


DEFAULT_MODEL = "minimax-m3:cloud"


def get_model_name() -> str:
    load_dotenv()
    return os.getenv("OLLAMA_MODEL", DEFAULT_MODEL).strip() or DEFAULT_MODEL
