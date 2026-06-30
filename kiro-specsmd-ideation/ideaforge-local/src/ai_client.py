"""Cliente que encapsula la llamada a Ollama.

No contiene lógica de prompts; solo se ocupa de la conexión y la respuesta.
"""


class AIClientError(Exception):
    """Error entendible al usar el cliente de IA (conexión, modelo, etc.)."""


def generate(model: str, prompt: str) -> str:
    """Envía un único mensaje de usuario al modelo y devuelve su contenido.

    Lanza AIClientError con un mensaje claro si Ollama no está disponible,
    el modelo no existe, o la respuesta es inesperada.
    """
    try:
        from ollama import chat
    except ImportError as exc:
        raise AIClientError(
            "No se pudo importar la librería 'ollama'. "
            "Instálala con: pip install ollama"
        ) from exc

    try:
        response = chat(
            model=model,
            messages=[{"role": "user", "content": prompt}],
        )
    except Exception as exc:
        raise AIClientError(
            f"No se pudo obtener respuesta de Ollama con el modelo '{model}'. "
            "Verifica que Ollama esté instalado y en ejecución, y que el modelo "
            f"esté disponible. Detalle: {exc}"
        ) from exc

    content = getattr(getattr(response, "message", None), "content", None)
    if not content:
        raise AIClientError(
            "Ollama devolvió una respuesta vacía o con formato inesperado."
        )
    return content.strip()
