from __future__ import annotations


def summarize_prompt(text: str) -> str:
    return (
        "Resume el siguiente texto en espanol claro. "
        "Incluye los puntos principales y evita inventar informacion.\n\n"
        f"Texto:\n{text}"
    )


def tasks_prompt(text: str) -> str:
    return (
        "Extrae las tareas pendientes del siguiente texto. "
        "Devuelve una lista accionable con responsables o fechas si aparecen.\n\n"
        f"Texto:\n{text}"
    )


def clean_prompt(text: str) -> str:
    return (
        "Convierte estas notas desordenadas en una version ordenada y facil de leer. "
        "Organiza por temas, conserva la informacion importante y no agregues datos nuevos.\n\n"
        f"Notas:\n{text}"
    )


def professional_prompt(text: str) -> str:
    return (
        "Convierte la siguiente idea informal en una respuesta profesional, clara y respetuosa. "
        "Mantiene la intencion original y evita sonar exagerado.\n\n"
        f"Idea informal:\n{text}"
    )


def ask_prompt(text: str, question: str) -> str:
    return (
        "Usa el contexto entregado para responder la pregunta. "
        "Si la respuesta no esta en el texto, dilo claramente y no inventes detalles.\n\n"
        f"Contexto:\n{text}\n\n"
        f"Pregunta:\n{question}"
    )
