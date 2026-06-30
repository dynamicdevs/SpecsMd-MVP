from pathlib import Path


class FileLoadError(ValueError):
    """Raised when a local input file cannot be read."""


def load_text_file(file_path: str) -> str:
    path = Path(file_path).expanduser()

    if not path.exists():
        raise FileLoadError(f"El archivo no existe: {file_path}")

    if not path.is_file():
        raise FileLoadError(f"La ruta indicada no es un archivo: {file_path}")

    try:
        content = path.read_text(encoding="utf-8")
    except UnicodeDecodeError as exc:
        raise FileLoadError(f"El archivo no esta en UTF-8: {file_path}") from exc
    except OSError as exc:
        raise FileLoadError(f"No se pudo leer el archivo: {file_path}") from exc

    cleaned = content.strip()
    if not cleaned:
        raise FileLoadError(f"El archivo esta vacio: {file_path}")

    return cleaned
