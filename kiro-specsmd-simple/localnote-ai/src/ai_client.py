"""Cliente de IA que encapsula la comunicación con Ollama."""

import sys

from ollama import chat
from src.config import OLLAMA_MODEL


def process_with_ai(prompt: str) -> str:
    """Envía un prompt a Ollama y retorna la respuesta.

    Args:
        prompt: Texto del prompt a enviar.

    Returns:
        Respuesta del modelo como string.

    Exits:
        Si Ollama no está disponible o hay un error de conexión.
    """
    try:
        response = chat(
            model=OLLAMA_MODEL,
            messages=[{"role": "user", "content": prompt}],
        )
        return response.message.content
    except ConnectionError:
        print(
            "Error: No se pudo conectar con Ollama. "
            "Asegúrate de que esté corriendo (ollama serve)."
        )
        sys.exit(1)
    except Exception as e:
        error_msg = str(e).lower()
        if "connection" in error_msg or "refused" in error_msg:
            print(
                "Error: No se pudo conectar con Ollama. "
                "Asegúrate de que esté corriendo (ollama serve)."
            )
        else:
            print(f"Error al procesar con IA: {e}")
        sys.exit(1)
