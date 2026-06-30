"""Lectura de archivos locales de entrada (UTF-8)."""

from pathlib import Path


class FileLoaderError(Exception):
    """Error entendible al leer un archivo de entrada."""


def load_text(path: str) -> str:
    """Lee el archivo indicado en UTF-8 y devuelve su texto limpio.

    Solo accede a la ruta indicada explícitamente por el usuario.
    Lanza FileLoaderError si no existe, no es un archivo o está vacío.
    """
    file_path = Path(path)

    if not file_path.exists():
        raise FileLoaderError(f"El archivo no existe: {path}")
    if not file_path.is_file():
        raise FileLoaderError(f"La ruta no es un archivo: {path}")

    try:
        text = file_path.read_text(encoding="utf-8")
    except UnicodeDecodeError as exc:
        raise FileLoaderError(
            f"El archivo no está en UTF-8 o no es texto legible: {path}"
        ) from exc
    except OSError as exc:
        raise FileLoaderError(f"No se pudo leer el archivo: {path}. Detalle: {exc}") from exc

    text = text.strip()
    if not text:
        raise FileLoaderError(f"El archivo está vacío: {path}")
    return text
