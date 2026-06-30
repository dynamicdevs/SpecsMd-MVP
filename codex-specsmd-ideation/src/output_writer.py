from pathlib import Path


class OutputWriteError(ValueError):
    """Raised when a local output file cannot be written safely."""


def write_output(output_path: str, content: str, overwrite: bool = False) -> Path:
    path = Path(output_path).expanduser()

    if path.exists() and not overwrite:
        raise OutputWriteError(
            f"El archivo de salida ya existe: {output_path}. "
            "Usa --overwrite para sobrescribirlo."
        )

    try:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")
    except OSError as exc:
        raise OutputWriteError(f"No se pudo escribir el archivo: {output_path}") from exc

    return path
