from __future__ import annotations

from ollama import chat


class OllamaClientError(RuntimeError):
    """Raised when Ollama does not return usable content."""


def run_chat(prompt: str, model: str) -> str:
    response = chat(
        model=model,
        messages=[{"role": "user", "content": prompt}],
    )

    content = response.message.content
    if not content:
        raise OllamaClientError(
            "Ollama no devolvio contenido. Revisa el modelo configurado y vuelve a intentar."
        )

    return content
