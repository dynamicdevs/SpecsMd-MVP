SUPPORTED_MODES = {"ideate", "compare", "mvp", "brief"}


def _clean_idea_text(text: str) -> str:
    cleaned = text.strip()
    if not cleaned:
        raise ValueError("El texto de entrada no puede estar vacio.")
    return cleaned


def _base_instruction(language: str) -> str:
    return (
        f"Responde en idioma '{language}'. Usa Markdown claro. "
        "No inventes integraciones externas. No propongas ejecutar codigo generado por IA. "
        "Mantente pragmatico, local y orientado a un MVP pequeno."
    )


def build_ideate_prompt(text: str, language: str = "es") -> str:
    idea = _clean_idea_text(text)
    return f"""Eres un asistente local de ideacion para proyectos pequenos.
{_base_instruction(language)}

Transforma la siguiente idea desordenada en una propuesta clara:

```text
{idea}
```

Devuelve exactamente esta estructura:

# Idea ordenada

## Resumen

## Problema que resuelve

## Usuario objetivo

## Propuesta de valor

## Funcionalidades posibles

## Riesgos

## MVP recomendado

## Proximos pasos
"""


def build_compare_prompt(text: str, language: str = "es") -> str:
    ideas = _clean_idea_text(text)
    return f"""Eres un asistente local de evaluacion de ideas.
{_base_instruction(language)}

Compara las ideas descritas a continuacion. Evalua valor practico, complejidad, claridad, riesgos y facilidad para crear un MVP local:

```text
{ideas}
```

Devuelve exactamente esta estructura:

# Comparacion de ideas

## Ideas detectadas

## Criterios de evaluacion

## Comparacion

## Idea recomendada

## Justificacion

## Riesgos
"""


def build_mvp_prompt(text: str, language: str = "es") -> str:
    idea = _clean_idea_text(text)
    return f"""Eres un asistente local experto en reducir alcance de producto.
{_base_instruction(language)}

Reduce esta idea a una primera version implementable y pequena:

```text
{idea}
```

Devuelve exactamente esta estructura:

# MVP recomendado

## Idea original

## Que problema minimo resolver

## Funcionalidades esenciales

## Funcionalidades que quedan fuera

## Primera version implementable

## Criterios de exito
"""


def build_brief_prompt(text: str, language: str = "es") -> str:
    idea = _clean_idea_text(text)
    return f"""Eres un asistente local que crea briefs tecnicos iniciales.
{_base_instruction(language)}

Convierte esta idea en un brief tecnico pequeno, implementable y sin sobreingenieria:

```text
{idea}
```

Devuelve exactamente esta estructura:

# Brief tecnico inicial

## Nombre tentativo

## Objetivo

## Usuario

## Flujo principal

## Modulos necesarios

## Restricciones

## Siguiente paso recomendado
"""


def build_prompt(mode: str, text: str, language: str = "es") -> str:
    builders = {
        "ideate": build_ideate_prompt,
        "compare": build_compare_prompt,
        "mvp": build_mvp_prompt,
        "brief": build_brief_prompt,
    }

    try:
        return builders[mode](text, language=language)
    except KeyError as exc:
        raise ValueError(f"Modo no soportado: {mode}") from exc
