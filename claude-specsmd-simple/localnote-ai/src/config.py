"""Configuración de LocalNote AI.

Carga el modelo de Ollama desde el archivo `.env` (variable `OLLAMA_MODEL`).
Si no está definido, usa el modelo por defecto `minimax-m3:cloud`.

Cambiar de modelo no requiere tocar código: basta editar `.env` (o la variable de
entorno `OLLAMA_MODEL`).
"""

from __future__ import annotations

import os

from dotenv import load_dotenv

# Modelo por defecto (requisito exacto del proyecto).
DEFAULT_MODEL = "minimax-m3:cloud"

# Carga las variables de `.env` al entorno una sola vez al importar el módulo.
# `load_dotenv` no falla si el archivo no existe.
load_dotenv()


def get_model() -> str:
    """Devuelve el nombre del modelo de Ollama a usar.

    Orden de resolución:
      1. Variable de entorno / `.env`: `OLLAMA_MODEL`.
      2. Valor por defecto: `minimax-m3:cloud`.

    Un valor vacío o solo espacios se trata como no definido.
    """
    value = os.environ.get("OLLAMA_MODEL", "").strip()
    return value or DEFAULT_MODEL
