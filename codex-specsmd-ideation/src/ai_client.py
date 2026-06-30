from ollama import chat


class AIClientError(RuntimeError):
    """Raised when Ollama cannot return a usable response."""


def _extract_content(response: object) -> str:
    message = getattr(response, "message", None)
    content = getattr(message, "content", None)

    if content is None and isinstance(response, dict):
        message_dict = response.get("message", {})
        if isinstance(message_dict, dict):
            content = message_dict.get("content")

    if not isinstance(content, str) or not content.strip():
        raise AIClientError("Ollama no devolvio contenido de texto utilizable.")

    return content.strip()


def generate_response(prompt: str, model: str) -> str:
    try:
        response = chat(
            model=model,
            messages=[{"role": "user", "content": prompt}],
        )
        return _extract_content(response)
    except AIClientError:
        raise
    except Exception as exc:
        raise AIClientError(
            "No se pudo obtener respuesta de Ollama. "
            "Revisa que Ollama este instalado, corriendo y que el modelo "
            f"'{model}' este disponible. Detalle: {exc}"
        ) from exc
