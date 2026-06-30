"""Lectura de archivos de texto locales en UTF-8.

Aísla la lectura de disco para que `app.py` solo tenga que manejar `FileLoaderError`
y mostrar un mensaje claro al usuario.
"""

from __future__ import annotations

from pathlib import Path


class FileLoaderError(Exception):
    """Error legible al leer un archivo de texto local."""


def load_text_file(path: str) -> str:
    """Lee un archivo de texto local en UTF-8 y devuelve su contenido.

    Args:
        path: Ruta al archivo (relativa o absoluta).

    Returns:
        El contenido del archivo como `str`.

    Raises:
        FileLoaderError: si el archivo no existe, no es un archivo, no se puede leer
            como UTF-8, o está vacío (solo espacios en blanco).
    """
    file_path = Path(path)

    if not file_path.exists():
        raise FileLoaderError(f"No se pudo leer el archivo: no existe '{path}'.")

    if not file_path.is_file():
        raise FileLoaderError(f"No se pudo leer el archivo: '{path}' no es un archivo.")

    try:
        content = file_path.read_text(encoding="utf-8")
    except UnicodeDecodeError as exc:
        raise FileLoaderError(
            f"No se pudo leer el archivo: '{path}' no está codificado en UTF-8."
        ) from exc
    except OSError as exc:
        raise FileLoaderError(f"No se pudo leer el archivo '{path}': {exc}.") from exc

    if not content.strip():
        raise FileLoaderError(f"No se pudo leer el archivo: '{path}' está vacío.")

    return content
