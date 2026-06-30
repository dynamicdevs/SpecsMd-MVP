"""Tests para src.file_loader (lógica pura, sin Ollama)."""

import pytest

from src.file_loader import FileLoaderError, load_text_file


def test_load_existing_utf8_file(tmp_path):
    file_path = tmp_path / "nota.txt"
    content = "Hola, esto es una nota con acentos: áéíóú ñ."
    file_path.write_text(content, encoding="utf-8")

    assert load_text_file(str(file_path)) == content


def test_load_missing_file_raises(tmp_path):
    missing = tmp_path / "no_existe.txt"
    with pytest.raises(FileLoaderError):
        load_text_file(str(missing))


def test_load_empty_file_raises(tmp_path):
    empty = tmp_path / "vacio.txt"
    empty.write_text("   \n  ", encoding="utf-8")
    with pytest.raises(FileLoaderError):
        load_text_file(str(empty))


def test_load_directory_raises(tmp_path):
    with pytest.raises(FileLoaderError):
        load_text_file(str(tmp_path))
