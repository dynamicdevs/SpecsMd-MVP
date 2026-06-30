"""LocalNote AI — Procesador de texto con IA local via Ollama."""

import argparse
import sys

from src.ai_client import process_with_ai
from src.file_loader import load_text_file
from src.prompts import get_prompt


COMMANDS = ["summarize", "tasks", "clean", "professional", "ask"]


def create_parser() -> argparse.ArgumentParser:
    """Crea el parser de argumentos CLI."""
    parser = argparse.ArgumentParser(
        prog="localnote-ai",
        description="Procesa texto con IA local usando Ollama.",
    )
    parser.add_argument(
        "command",
        choices=COMMANDS,
        help="Acción a realizar: summarize, tasks, clean, professional, ask",
    )
    parser.add_argument(
        "--text",
        type=str,
        help="Texto a procesar (inline)",
    )
    parser.add_argument(
        "--file",
        type=str,
        help="Ruta a archivo de texto local para procesar",
    )
    parser.add_argument(
        "--question",
        type=str,
        help="Pregunta sobre el texto (solo para comando 'ask')",
    )
    return parser


def main():
    """Entry point principal de la aplicación."""
    parser = create_parser()
    args = parser.parse_args()

    # Validar que se proporcione texto
    if not args.text and not args.file:
        print("Error: Debes proporcionar --text o --file")
        sys.exit(1)

    # Validar que ask tenga --question
    if args.command == "ask" and not args.question:
        print("Error: El comando 'ask' requiere --question")
        sys.exit(1)

    # Obtener texto
    if args.file:
        text = load_text_file(args.file)
    else:
        text = args.text

    # Generar prompt y procesar
    prompt = get_prompt(args.command, text, args.question)
    result = process_with_ai(prompt)
    print(result)


if __name__ == "__main__":
    main()
