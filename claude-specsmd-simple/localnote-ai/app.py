"""LocalNote AI — CLI por consola.

Procesa una nota o texto largo con IA local (Ollama) según una acción elegida:
  summarize, tasks, clean, professional, ask.

Ejemplos:
    python app.py summarize --text "texto largo..."
    python app.py tasks --file ./examples/nota.txt
    python app.py ask --text "contexto..." --question "¿Qué debo hacer primero?"

Este módulo concentra toda la I/O (argparse, lectura de texto, impresión y manejo de
errores). La lógica vive en `src/`.
"""

from __future__ import annotations

import argparse
import sys

from src.ai_client import AIClientError, run_chat
from src.config import get_model
from src.file_loader import FileLoaderError, load_text_file
from src.prompts import MODES, build_messages


def build_parser() -> argparse.ArgumentParser:
    """Construye el parser de argumentos con un subcomando por modo."""
    parser = argparse.ArgumentParser(
        prog="app.py",
        description="LocalNote AI — procesa texto con IA local vía Ollama.",
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    descriptions = {
        "summarize": "Resumir el texto.",
        "tasks": "Extraer tareas pendientes del texto.",
        "clean": "Convertir notas desordenadas en una versión ordenada.",
        "professional": "Crear una respuesta profesional a partir de una idea informal.",
        "ask": "Hacer una pregunta libre sobre el texto (requiere --question).",
    }

    for mode in MODES:
        sub = subparsers.add_parser(mode, help=descriptions[mode])
        # --text y --file son alternativas; se valida manualmente para dar mensajes claros.
        sub.add_argument("--text", help="Texto de entrada a procesar.")
        sub.add_argument("--file", help="Ruta a un archivo de texto local (UTF-8).")
        if mode == "ask":
            sub.add_argument(
                "--question",
                help="Pregunta a responder sobre el texto.",
            )

    return parser


def resolve_text(args: argparse.Namespace) -> str:
    """Resuelve el texto de entrada a partir de --text o --file.

    Raises:
        FileLoaderError: si --file falla.
        ValueError: si no se proporciona ni --text ni --file.
    """
    if args.text is not None:
        return args.text
    if args.file is not None:
        return load_text_file(args.file)
    raise ValueError(
        "Debes proporcionar el texto con --text \"...\" o con --file ./ruta.txt."
    )


def run(args: argparse.Namespace) -> str:
    """Ejecuta el flujo completo y devuelve la respuesta de la IA."""
    text = resolve_text(args)
    question = getattr(args, "question", None)
    messages = build_messages(args.command, text, question)
    model = get_model()
    return run_chat(model, messages)


def main(argv: list[str] | None = None) -> int:
    """Punto de entrada. Devuelve el código de salida del proceso."""
    parser = build_parser()
    args = parser.parse_args(argv)

    try:
        result = run(args)
    except (FileLoaderError, AIClientError, ValueError) as exc:
        # Mensaje claro, sin stack trace para el usuario final.
        print(f"Error: {exc}", file=sys.stderr)
        return 1

    print(result)
    return 0


if __name__ == "__main__":
    sys.exit(main())
