import pytest

from src.file_loader import FileLoaderError, load_text


def test_load_text_reads_and_strips(tmp_path):
    f = tmp_path / "idea.txt"
    f.write_text("  Una idea local  \n", encoding="utf-8")
    assert load_text(str(f)) == "Una idea local"


def test_load_text_reads_utf8_accents(tmp_path):
    f = tmp_path / "idea.txt"
    f.write_text("Ideación con ñ y tildes áéí", encoding="utf-8")
    assert load_text(str(f)) == "Ideación con ñ y tildes áéí"


def test_load_text_missing_file_raises():
    with pytest.raises(FileLoaderError) as exc:
        load_text("ruta/que/no/existe.txt")
    assert "no existe" in str(exc.value).lower()


def test_load_text_directory_raises(tmp_path):
    with pytest.raises(FileLoaderError):
        load_text(str(tmp_path))


def test_load_text_empty_file_raises(tmp_path):
    f = tmp_path / "vacio.txt"
    f.write_text("   \n  ", encoding="utf-8")
    with pytest.raises(FileLoaderError) as exc:
        load_text(str(f))
    assert "vac" in str(exc.value).lower()
