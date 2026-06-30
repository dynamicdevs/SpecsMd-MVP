from pathlib import Path

import pytest

from src.file_loader import FileLoadError, load_text_file


def test_load_text_file_reads_utf8_and_strips(tmp_path: Path) -> None:
    file_path = tmp_path / "idea.txt"
    file_path.write_text("\nIdea local\n", encoding="utf-8")

    assert load_text_file(str(file_path)) == "Idea local"


def test_load_text_file_missing_file_raises_error(tmp_path: Path) -> None:
    with pytest.raises(FileLoadError, match="no existe"):
        load_text_file(str(tmp_path / "missing.txt"))


def test_load_text_file_directory_raises_error(tmp_path: Path) -> None:
    with pytest.raises(FileLoadError, match="no es un archivo"):
        load_text_file(str(tmp_path))
