"""Cliente de IA: encapsula la llamada a Ollama.

Este es el ÚNICO módulo que importa y usa la librería `ollama`. Aislarlo aquí permite:
  - cambiar el backend en un solo lugar si hiciera falta, y
  - testear el resto del código sin necesitar un servidor Ollama corriendo.

Llamada base (formato requerido por el proyecto):

    from ollama import chat

    response = chat(
        model='minimax-m3:cloud',
        messages=[{'role': 'user', 'content': 'Hello!'}],
    )
    print(response.message.content)
"""

from __future__ import annotations


class AIClientError(Exception):
    """Error legible al comunicarse con Ollama."""


def run_chat(model: str, messages: list[dict]) -> str:
    """Ejecuta una conversación con Ollama y devuelve el contenido de la respuesta.

    Args:
        model: nombre del modelo de Ollama (p. ej. `minimax-m3:cloud`).
        messages: lista de mensajes en formato `[{'role': ..., 'content': ...}]`.

    Returns:
        El texto de la respuesta (`response.message.content`).

    Raises:
        AIClientError: si la librería `ollama` no está instalada, si no se puede
            contactar con el servidor, o si ocurre cualquier otro fallo en la llamada.
    """
    try:
        from ollama import chat
    except ImportError as exc:
        raise AIClientError(
            "La librería 'ollama' no está instalada. Ejecuta: pip install -r requirements.txt"
        ) from exc

    try:
        response = chat(model=model, messages=messages)
    except Exception as exc:  # noqa: BLE001 - se traduce a un mensaje claro para el usuario
        raise AIClientError(
            "No se pudo contactar con Ollama. Verifica que el servicio esté corriendo "
            "(`ollama serve`) y que el modelo "
            f"'{model}' esté disponible.\nDetalle: {exc}"
        ) from exc

    content = getattr(getattr(response, "message", None), "content", None)
    if not content:
        raise AIClientError("Ollama devolvió una respuesta vacía.")

    return content
