import argparse
import sys

from src.ai_client import AIClientError, generate_response
from src.config import load_config
from src.file_loader import FileLoadError, load_text_file
from src.output_writer import OutputWriteError, write_output
from src.prompts import SUPPORTED_MODES, build_prompt


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="IdeaForge Local",
        description="Convierte ideas desordenadas en propuestas claras usando Ollama local.",
    )
    subparsers = parser.add_subparsers(dest="mode", required=True)

    for mode in sorted(SUPPORTED_MODES):
        subparser = subparsers.add_parser(mode)
        subparser.add_argument("--text", help="Idea o ideas escritas directamente.")
        subparser.add_argument("--file", help="Ruta a un archivo local UTF-8 con la idea.")
        subparser.add_argument("--output", help="Ruta local donde guardar la respuesta.")
        subparser.add_argument(
            "--overwrite",
            action="store_true",
            help="Permite sobrescribir el archivo indicado en --output.",
        )

    return parser


def get_input_text(args: argparse.Namespace) -> str:
    has_text = bool(args.text and args.text.strip())
    has_file = bool(args.file and args.file.strip())

    if has_text and has_file:
        raise ValueError("Entrega solo una fuente de entrada: --text o --file, no ambas.")

    if not has_text and not has_file:
        raise ValueError("Debes entregar una idea usando --text o --file.")

    if has_file:
        return load_text_file(args.file)

    return args.text.strip()


def run(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)

    try:
        config = load_config()
        input_text = get_input_text(args)
        prompt = build_prompt(args.mode, input_text, language=config.default_language)
        result = generate_response(prompt, model=config.ollama_model)

        print(result)

        if args.output:
            output_path = write_output(args.output, result, overwrite=args.overwrite)
            print(f"\nResultado guardado en: {output_path}")

        return 0
    except (ValueError, FileLoadError, OutputWriteError, AIClientError) as exc:
        parser.exit(status=1, message=f"Error: {exc}\n")


if __name__ == "__main__":
    sys.exit(run())
