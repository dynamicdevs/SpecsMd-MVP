"""Configuración de LocalNote AI."""

import os
from dotenv import load_dotenv

load_dotenv()

OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "minimax-m3:cloud")
