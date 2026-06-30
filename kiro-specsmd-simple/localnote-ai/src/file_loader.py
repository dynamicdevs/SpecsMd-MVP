"""Carga de archivos de texto locales."""

import sys
from pathlib import Path


def load_text_file(file_path: str) -> str:
    """Lee un archivo de texto local con encoding UTF-8.

    Args:
        file_path: Ruta al archivo a leer.

    Returns:
        Contenido del archivo como string.

    Exits:
        Si el archivo no existe o no se puede leer.
    """
    path = Path(file_path)

    if not path.exists():
        print(f"Error: No se encontró el archivo: {file_path}")
        sys.exit(1)

    try:
        return path.read_text(encoding="utf-8")
    except (OSError, UnicodeDecodeError) as e:
        print(f"Error: No se pudo leer el archivo: {file_path}")
        sys.exit(1)
