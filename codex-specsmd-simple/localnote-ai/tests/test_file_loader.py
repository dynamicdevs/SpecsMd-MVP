from __future__ import annotations

import pytest

from src.file_loader import load_text_file


def test_load_text_file_reads_utf8_content(tmp_path):
    note_path = tmp_path / "nota.txt"
    note_path.write_text("Texto con acentos: accion, reunion, manana.", encoding="utf-8")

    assert load_text_file(note_path) == "Texto con acentos: accion, reunion, manana."


def test_load_text_file_raises_for_missing_file(tmp_path):
    missing_path = tmp_path / "missing.txt"

    with pytest.raises(FileNotFoundError):
        load_text_file(missing_path)


def test_load_text_file_raises_for_invalid_utf8(tmp_path):
    bad_path = tmp_path / "bad.txt"
    bad_path.write_bytes(b"\xff\xfe\x00")

    with pytest.raises(UnicodeDecodeError):
        load_text_file(bad_path)
