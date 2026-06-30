import pytest

from src.output_writer import OutputWriterError, write_output


def test_write_output_creates_file(tmp_path):
    target = tmp_path / "salida.md"
    path = write_output(str(target), "# Hola\ncontenido")
    assert target.exists()
    assert target.read_text(encoding="utf-8") == "# Hola\ncontenido"
    assert path == str(target)


def test_write_output_creates_missing_parent_dir(tmp_path):
    target = tmp_path / "sub" / "dir" / "salida.md"
    write_output(str(target), "contenido")
    assert target.exists()


def test_write_output_does_not_overwrite_by_default(tmp_path):
    target = tmp_path / "salida.md"
    target.write_text("original", encoding="utf-8")
    with pytest.raises(OutputWriterError) as exc:
        write_output(str(target), "nuevo")
    assert "ya existe" in str(exc.value).lower()
    assert target.read_text(encoding="utf-8") == "original"


def test_write_output_overwrite_true_replaces(tmp_path):
    target = tmp_path / "salida.md"
    target.write_text("original", encoding="utf-8")
    write_output(str(target), "nuevo", overwrite=True)
    assert target.read_text(encoding="utf-8") == "nuevo"


def test_write_output_preserves_utf8(tmp_path):
    target = tmp_path / "salida.md"
    write_output(str(target), "Ideación ñ áéí")
    assert target.read_text(encoding="utf-8") == "Ideación ñ áéí"
