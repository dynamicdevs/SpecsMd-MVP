"""Construcción de prompts según el modo de IA de LocalNote AI.

Cada modo (summarize, tasks, clean, professional, ask) tiene una función que genera el
contenido del prompt a partir del texto de entrada. `build_messages` empaqueta ese
contenido en la lista `messages` que espera `ollama.chat`.

Este módulo es lógica pura (sin Ollama ni I/O), por lo que se puede testear directamente.
"""

from __future__ import annotations

# Modos válidos soportados por la aplicación.
MODES = ("summarize", "tasks", "clean", "professional", "ask")


def summarize_prompt(text: str) -> str:
    """Prompt para resumir el texto."""
    return (
        "Eres un asistente que resume textos. Resume el siguiente texto en español, "
        "de forma clara y concisa, conservando los puntos clave:\n\n"
        f"{text}"
    )


def tasks_prompt(text: str) -> str:
    """Prompt para extraer tareas pendientes del texto."""
    return (
        "Eres un asistente que extrae tareas pendientes. A partir del siguiente texto, "
        "devuelve una lista clara de las tareas o acciones pendientes (una por línea, "
        "con guiones). Si no hay tareas, indícalo:\n\n"
        f"{text}"
    )


def clean_prompt(text: str) -> str:
    """Prompt para ordenar notas desordenadas."""
    return (
        "Eres un asistente que ordena notas. Reescribe las siguientes notas desordenadas "
        "en una versión ordenada, estructurada y legible (usa títulos o viñetas si ayuda), "
        "sin inventar información:\n\n"
        f"{text}"
    )


def professional_prompt(text: str) -> str:
    """Prompt para convertir una idea informal en una respuesta profesional."""
    return (
        "Eres un asistente de redacción profesional. Convierte la siguiente idea o mensaje "
        "informal en una respuesta profesional, cordial y bien redactada en español:\n\n"
        f"{text}"
    )


def ask_prompt(text: str, question: str) -> str:
    """Prompt para responder una pregunta libre sobre el texto."""
    return (
        "Eres un asistente que responde preguntas sobre un texto dado. Usa únicamente el "
        "contexto proporcionado para responder. Si la respuesta no está en el contexto, "
        "indícalo.\n\n"
        f"--- CONTEXTO ---\n{text}\n\n"
        f"--- PREGUNTA ---\n{question}"
    )


def build_messages(mode: str, text: str, question: str | None = None) -> list[dict]:
    """Construye la lista `messages` para `ollama.chat` según el modo.

    Args:
        mode: uno de `MODES`.
        text: texto de entrada a procesar.
        question: pregunta del usuario (obligatoria solo en modo `ask`).

    Returns:
        Lista con un único mensaje de rol `user`, lista para `ollama.chat`.

    Raises:
        ValueError: si el modo no es válido, si el texto está vacío, o si el modo es
            `ask` y falta la pregunta.
    """
    if mode not in MODES:
        raise ValueError(
            f"Modo inválido: '{mode}'. Modos válidos: {', '.join(MODES)}."
        )

    if not text or not text.strip():
        raise ValueError("El texto de entrada está vacío.")

    if mode == "ask":
        if not question or not question.strip():
            raise ValueError("El modo 'ask' requiere una pregunta (--question).")
        content = ask_prompt(text, question)
    elif mode == "summarize":
        content = summarize_prompt(text)
    elif mode == "tasks":
        content = tasks_prompt(text)
    elif mode == "clean":
        content = clean_prompt(text)
    else:  # mode == "professional"
        content = professional_prompt(text)

    return [{"role": "user", "content": content}]
