"""Escritura de la salida en archivos locales (UTF-8)."""

from pathlib import Path


class OutputWriterError(Exception):
    """Error entendible al escribir el archivo de salida."""


def write_output(path: str, content: str, overwrite: bool = False) -> str:
    """Escribe el contenido en la ruta indicada (UTF-8).

    Crea la carpeta de salida si no existe. No sobrescribe un archivo
    existente salvo que overwrite=True. Devuelve la ruta escrita.
    """
    file_path = Path(path)

    if file_path.exists() and not overwrite:
        raise OutputWriterError(
            f"El archivo de salida ya existe: {path}. "
            "Usa --overwrite si deseas sobrescribirlo."
        )

    parent = file_path.parent
    if parent and not parent.exists():
        try:
            parent.mkdir(parents=True, exist_ok=True)
        except OSError as exc:
            raise OutputWriterError(
                f"No se pudo crear la carpeta de salida: {parent}. Detalle: {exc}"
            ) from exc

    try:
        file_path.write_text(content, encoding="utf-8")
    except OSError as exc:
        raise OutputWriterError(
            f"No se pudo escribir el archivo: {path}. Detalle: {exc}"
        ) from exc

    return str(file_path)
