"""Generación de prompts según el modo de procesamiento."""


def prompt_summarize(text: str) -> str:
    """Genera prompt para resumir texto."""
    return (
        "Resume el siguiente texto en puntos clave, de forma clara y concisa. "
        "Responde en el mismo idioma del texto.\n\n"
        f"Texto:\n{text}"
    )


def prompt_tasks(text: str) -> str:
    """Genera prompt para extraer tareas pendientes."""
    return (
        "Extrae todas las tareas pendientes, acciones por hacer y compromisos "
        "del siguiente texto. Lista cada tarea como un item con checkbox. "
        "Responde en el mismo idioma del texto.\n\n"
        f"Texto:\n{text}"
    )


def prompt_clean(text: str) -> str:
    """Genera prompt para ordenar notas desordenadas."""
    return (
        "Toma las siguientes notas desordenadas y conviértelas en una versión "
        "limpia, bien estructurada y organizada por temas. Mantén toda la "
        "información importante. Responde en el mismo idioma del texto.\n\n"
        f"Notas:\n{text}"
    )


def prompt_professional(text: str) -> str:
    """Genera prompt para profesionalizar un mensaje."""
    return (
        "Convierte la siguiente idea o mensaje informal en una comunicación "
        "profesional, clara y bien redactada. Mantén la intención original. "
        "Responde en el mismo idioma del texto.\n\n"
        f"Mensaje informal:\n{text}"
    )


def prompt_ask(text: str, question: str) -> str:
    """Genera prompt para pregunta libre sobre el texto."""
    return (
        "Basándote en el siguiente contexto, responde la pregunta del usuario. "
        "Responde en el mismo idioma de la pregunta.\n\n"
        f"Contexto:\n{text}\n\n"
        f"Pregunta: {question}"
    )


def get_prompt(mode: str, text: str, question: str = None) -> str:
    """Retorna el prompt adecuado según el modo.

    Args:
        mode: Comando (summarize, tasks, clean, professional, ask).
        text: Texto a procesar.
        question: Pregunta (solo para modo ask).

    Returns:
        Prompt generado.
    """
    prompts = {
        "summarize": lambda: prompt_summarize(text),
        "tasks": lambda: prompt_tasks(text),
        "clean": lambda: prompt_clean(text),
        "professional": lambda: prompt_professional(text),
        "ask": lambda: prompt_ask(text, question),
    }
    return prompts[mode]()
