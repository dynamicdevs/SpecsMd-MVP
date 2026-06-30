"""Tests para src/file_loader.py"""

import tempfile
import os
import pytest
from pathlib import Path

# Ajustar path para importar src
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.file_loader import load_text_file


def test_load_existing_file():
    """Debe leer correctamente un archivo existente UTF-8."""
    with tempfile.NamedTemporaryFile(
        mode="w", suffix=".txt", encoding="utf-8", delete=False
    ) as f:
        f.write("Hola mundo con ñ y acentos: á é í ó ú")
        f.flush()
        path = f.name

    try:
        content = load_text_file(path)
        assert content == "Hola mundo con ñ y acentos: á é í ó ú"
    finally:
        os.unlink(path)


def test_load_multiline_file():
    """Debe leer archivo con múltiples líneas."""
    with tempfile.NamedTemporaryFile(
        mode="w", suffix=".txt", encoding="utf-8", delete=False
    ) as f:
        f.write("Línea 1\nLínea 2\nLínea 3")
        f.flush()
        path = f.name

    try:
        content = load_text_file(path)
        assert "Línea 1" in content
        assert "Línea 2" in content
        assert "Línea 3" in content
    finally:
        os.unlink(path)


def test_load_nonexistent_file():
    """Debe salir con error si el archivo no existe."""
    with pytest.raises(SystemExit) as exc_info:
        load_text_file("/ruta/que/no/existe/archivo.txt")
    assert exc_info.value.code == 1


def test_load_empty_file():
    """Debe poder leer un archivo vacío."""
    with tempfile.NamedTemporaryFile(
        mode="w", suffix=".txt", encoding="utf-8", delete=False
    ) as f:
        f.write("")
        f.flush()
        path = f.name

    try:
        content = load_text_file(path)
        assert content == ""
    finally:
        os.unlink(path)
