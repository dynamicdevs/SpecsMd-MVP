"""Clasificación de fricciones por reglas simples sobre el texto (sin IA externa)."""
import unicodedata

from app.models.enums import Category


def _normalize(text: str) -> str:
    """Minúsculas y sin acentos para comparar palabras clave de forma robusta."""
    nfkd = unicodedata.normalize("NFKD", text.lower())
    return "".join(c for c in nfkd if not unicodedata.combining(c))


# Reglas ordenadas: la primera categoría cuyas palabras clave aparezcan, gana.
# Las palabras clave están normalizadas (sin acentos, minúsculas).
_RULES: list[tuple[Category, list[str]]] = [
    (Category.TRABAJO_MANUAL, ["copiar", "excel", "manual", "repetit"]),
    (Category.APROBACIONES, ["esperar", "aprobacion", "correo", "mail"]),
    (Category.REUNIONES, ["reunion", "meeting"]),
    (Category.BUSQUEDA_INFO, ["buscar", "informacion", "documento"]),
    (Category.FALTA_INTEGRACION, ["sistema", "integracion", "doble ingreso", "integrar"]),
]


def suggest_category(text: str) -> Category:
    """Sugiere una categoría según palabras clave en el texto. Por defecto, 'Otro'."""
    normalized = _normalize(text or "")
    for category, keywords in _RULES:
        if any(keyword in normalized for keyword in keywords):
            return category
    return Category.OTRO
