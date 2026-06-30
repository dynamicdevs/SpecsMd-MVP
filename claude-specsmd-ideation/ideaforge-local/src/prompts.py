"""Construcción de prompts para cada modo de ideación.

Funciones puras: reciben el texto del usuario y el idioma, devuelven el prompt
completo a enviar al modelo. No realizan I/O ni llamadas de red.
"""

_LANGUAGE_NAMES = {
    "es": "español",
    "en": "inglés",
    "pt": "portugués",
    "fr": "francés",
}


def _language_label(language: str) -> str:
    return _LANGUAGE_NAMES.get(language.lower(), language)


def _header(language: str, rol: str) -> str:
    idioma = _language_label(language)
    return (
        f"Actúa como {rol}. Responde íntegramente en {idioma}. "
        "Usa exactamente la estructura Markdown indicada, sin texto adicional "
        "antes ni después. Sé concreto y evita relleno.\n\n"
    )


def build_ideate_prompt(text: str, language: str) -> str:
    """Idea cruda -> propuesta clara y estructurada."""
    return (
        _header(language, "un facilitador de ideación de productos")
        + "A partir de la siguiente idea desordenada, genera una propuesta clara.\n\n"
        + "IDEA DEL USUARIO:\n"
        + f"{text}\n\n"
        + "Responde con esta estructura exacta:\n\n"
        + "# Idea ordenada\n\n"
        + "## Resumen\n...\n\n"
        + "## Problema que resuelve\n...\n\n"
        + "## Usuario objetivo\n...\n\n"
        + "## Propuesta de valor\n...\n\n"
        + "## Funcionalidades posibles\n...\n\n"
        + "## Riesgos\n...\n\n"
        + "## MVP recomendado\n...\n\n"
        + "## Próximos pasos\n...\n"
    )


def build_compare_prompt(text: str, language: str) -> str:
    """Varias ideas -> comparación y recomendación."""
    return (
        _header(language, "un evaluador de ideas de producto")
        + "A partir del siguiente texto que contiene varias ideas, compáralas y "
        + "recomienda una.\n\n"
        + "IDEAS DEL USUARIO:\n"
        + f"{text}\n\n"
        + "Responde con esta estructura exacta:\n\n"
        + "# Comparación de ideas\n\n"
        + "## Ideas detectadas\n...\n\n"
        + "## Criterios de evaluación\n...\n\n"
        + "## Comparación\n...\n\n"
        + "## Idea recomendada\n...\n\n"
        + "## Justificación\n...\n\n"
        + "## Riesgos\n...\n"
    )


def build_mvp_prompt(text: str, language: str) -> str:
    """Idea grande -> MVP mínimo viable."""
    return (
        _header(language, "un experto en definición de MVPs")
        + "A partir de la siguiente idea (posiblemente demasiado grande), define "
        + "un MVP pequeño y realista.\n\n"
        + "IDEA DEL USUARIO:\n"
        + f"{text}\n\n"
        + "Responde con esta estructura exacta:\n\n"
        + "# MVP recomendado\n\n"
        + "## Idea original\n...\n\n"
        + "## Qué problema mínimo resolver\n...\n\n"
        + "## Funcionalidades esenciales\n...\n\n"
        + "## Funcionalidades que quedan fuera\n...\n\n"
        + "## Primera versión implementable\n...\n\n"
        + "## Criterios de éxito\n...\n"
    )


def build_brief_prompt(text: str, language: str) -> str:
    """Idea inicial -> brief técnico inicial."""
    return (
        _header(language, "un líder técnico que redacta briefs iniciales")
        + "A partir de la siguiente idea, redacta un brief técnico inicial.\n\n"
        + "IDEA DEL USUARIO:\n"
        + f"{text}\n\n"
        + "Responde con esta estructura exacta:\n\n"
        + "# Brief técnico inicial\n\n"
        + "## Nombre tentativo\n...\n\n"
        + "## Objetivo\n...\n\n"
        + "## Usuario\n...\n\n"
        + "## Flujo principal\n...\n\n"
        + "## Módulos necesarios\n...\n\n"
        + "## Restricciones\n...\n\n"
        + "## Siguiente paso recomendado\n...\n"
    )


# Mapa modo -> función, usado por la CLI.
PROMPT_BUILDERS = {
    "ideate": build_ideate_prompt,
    "compare": build_compare_prompt,
    "mvp": build_mvp_prompt,
    "brief": build_brief_prompt,
}
