"""IdeaForge Local — CLI de ideación con IA local (Ollama).

Modos:
    ideate   Idea desordenada -> propuesta clara.
    compare  Varias ideas -> comparación y recomendación.
    mvp      Idea grande -> MVP pequeño.
    brief    Idea inicial -> brief técnico inicial.

Ejemplos:
    python app.py ideate --text "Quiero una app para ordenar mis ideas"
    python app.py ideate --file ./examples/idea.txt
    python app.py compare --file ./examples/multiple_ideas.txt
    python app.py mvp --text "Idea gigante de plataforma de productividad"
    python app.py brief --text "Una app local para transformar ideas"
    python app.py ideate --text "Idea..." --output ./outputs/idea.md --overwrite
"""

import argparse
import sys

from src.ai_client import AIClientError, generate
from src.config import load_config
from src.file_loader import FileLoaderError, load_text
from src.output_writer import OutputWriterError, write_output
from src.prompts import PROMPT_BUILDERS

MODES = list(PROMPT_BUILDERS.keys())


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="app.py",
        description="IdeaForge Local — convierte ideas desordenadas en propuestas claras (IA local con Ollama).",
    )
    subparsers = parser.add_subparsers(dest="mode", required=True)

    descripciones = {
        "ideate": "Transforma una idea desordenada en una propuesta clara.",
        "compare": "Compara varias ideas y recomienda una.",
        "mvp": "Reduce una idea grande a un MVP pequeño.",
        "brief": "Genera un brief técnico inicial.",
    }

    for mode in MODES:
        sub = subparsers.add_parser(mode, help=descripciones[mode], description=descripciones[mode])
        source = sub.add_mutually_exclusive_group(required=True)
        source.add_argument("--text", help="Texto de la idea entregado directamente.")
        source.add_argument("--file", help="Ruta a un archivo local con la idea (UTF-8).")
        sub.add_argument("--output", help="Ruta del archivo donde guardar la salida.")
        sub.add_argument(
            "--overwrite",
            action="store_true",
            help="Permite sobrescribir el archivo de salida si ya existe.",
        )

    return parser


def resolve_input_text(args: argparse.Namespace) -> str:
    """Devuelve el texto de entrada desde --text o --file.

    El grupo mutuamente excluyente y requerido de argparse garantiza que se
    entregue exactamente una de las dos opciones.
    """
    if args.text is not None:
        text = args.text.strip()
        if not text:
            raise FileLoaderError("El texto entregado con --text está vacío.")
        return text
    return load_text(args.file)


def run(args: argparse.Namespace) -> int:
    config = load_config()
    text = resolve_input_text(args)

    build_prompt = PROMPT_BUILDERS[args.mode]
    prompt = build_prompt(text, config.language)

    result = generate(config.model, prompt)

    print(result)

    if args.output:
        saved_path = write_output(args.output, result, overwrite=args.overwrite)
        print(f"\n[OK] Resultado guardado en: {saved_path}", file=sys.stderr)

    return 0


def main(argv=None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    try:
        return run(args)
    except (FileLoaderError, OutputWriterError, AIClientError) as exc:
        print(f"[ERROR] {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
