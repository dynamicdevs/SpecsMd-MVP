from pathlib import Path

import pytest

from src.output_writer import OutputWriteError, write_output


def test_write_output_creates_parent_folder(tmp_path: Path) -> None:
    output_path = tmp_path / "outputs" / "idea.md"

    written_path = write_output(str(output_path), "# Resultado")

    assert written_path == output_path
    assert output_path.read_text(encoding="utf-8") == "# Resultado"


def test_write_output_does_not_overwrite_by_default(tmp_path: Path) -> None:
    output_path = tmp_path / "idea.md"
    output_path.write_text("original", encoding="utf-8")

    with pytest.raises(OutputWriteError, match="ya existe"):
        write_output(str(output_path), "nuevo")

    assert output_path.read_text(encoding="utf-8") == "original"


def test_write_output_overwrites_when_enabled(tmp_path: Path) -> None:
    output_path = tmp_path / "idea.md"
    output_path.write_text("original", encoding="utf-8")

    write_output(str(output_path), "nuevo", overwrite=True)

    assert output_path.read_text(encoding="utf-8") == "nuevo"
