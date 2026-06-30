from __future__ import annotations

import argparse
import sys
from collections.abc import Sequence

from src.ai_client import OllamaClientError, run_chat
from src.config import get_model_name
from src.file_loader import load_text_file
from src import prompts


COMMANDS = ("summarize", "tasks", "clean", "professional", "ask")


def add_input_arguments(parser: argparse.ArgumentParser) -> None:
    input_group = parser.add_mutually_exclusive_group(required=True)
    input_group.add_argument("--text", help="Texto a procesar.")
    input_group.add_argument("--file", help="Ruta a un archivo local UTF-8.")


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="python app.py",
        description="LocalNote AI: procesa notas locales con Ollama.",
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    for command in COMMANDS:
        command_parser = subparsers.add_parser(command)
        add_input_arguments(command_parser)
        if command == "ask":
            command_parser.add_argument(
                "--question",
                required=True,
                help="Pregunta libre sobre el texto ingresado.",
            )

    return parser


def resolve_input(args: argparse.Namespace, parser: argparse.ArgumentParser) -> str:
    if args.text is not None:
        text = args.text
    else:
        try:
            text = load_text_file(args.file)
        except FileNotFoundError:
            parser.exit(1, f"Error: no se encontro el archivo: {args.file}\n")
        except UnicodeDecodeError:
            parser.exit(1, f"Error: el archivo debe estar codificado como UTF-8: {args.file}\n")
        except OSError as exc:
            parser.exit(1, f"Error: no se pudo leer el archivo {args.file}: {exc}\n")

    if not text.strip():
        parser.error("el texto de entrada no puede estar vacio")

    return text


def build_prompt(command: str, text: str, question: str | None = None) -> str:
    if command == "summarize":
        return prompts.summarize_prompt(text)
    if command == "tasks":
        return prompts.tasks_prompt(text)
    if command == "clean":
        return prompts.clean_prompt(text)
    if command == "professional":
        return prompts.professional_prompt(text)
    if command == "ask":
        if question is None or not question.strip():
            raise ValueError("la pregunta no puede estar vacia")
        return prompts.ask_prompt(text, question)

    raise ValueError(f"comando no soportado: {command}")


def main(argv: Sequence[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)

    text = resolve_input(args, parser)

    try:
        prompt = build_prompt(args.command, text, getattr(args, "question", None))
    except ValueError as exc:
        parser.error(str(exc))

    model = get_model_name()

    try:
        result = run_chat(prompt=prompt, model=model)
    except OllamaClientError as exc:
        print(f"Error de Ollama: {exc}", file=sys.stderr)
        return 1
    except Exception as exc:
        print(
            "Error de Ollama: no se pudo obtener respuesta. "
            f"Verifica que Ollama este disponible y que el modelo '{model}' exista. Detalle: {exc}",
            file=sys.stderr,
        )
        return 1

    print(result)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
