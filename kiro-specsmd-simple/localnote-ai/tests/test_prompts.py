"""Tests para src/prompts.py"""

import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.prompts import (
    get_prompt,
    prompt_summarize,
    prompt_tasks,
    prompt_clean,
    prompt_professional,
    prompt_ask,
)


def test_prompt_summarize_contains_text():
    """El prompt de summarize debe incluir el texto proporcionado."""
    result = prompt_summarize("Mi texto de prueba")
    assert "Mi texto de prueba" in result
    assert "Resume" in result or "resume" in result.lower()


def test_prompt_tasks_contains_text():
    """El prompt de tasks debe incluir el texto proporcionado."""
    result = prompt_tasks("Tengo que hacer X y Y")
    assert "Tengo que hacer X y Y" in result
    assert "tarea" in result.lower()


def test_prompt_clean_contains_text():
    """El prompt de clean debe incluir el texto proporcionado."""
    result = prompt_clean("notas desordenadas aquí")
    assert "notas desordenadas aquí" in result


def test_prompt_professional_contains_text():
    """El prompt de professional debe incluir el texto proporcionado."""
    result = prompt_professional("oye necesito eso urgente")
    assert "oye necesito eso urgente" in result
    assert "profesional" in result.lower()


def test_prompt_ask_contains_text_and_question():
    """El prompt de ask debe incluir texto y pregunta."""
    result = prompt_ask("contexto importante", "¿Qué hago primero?")
    assert "contexto importante" in result
    assert "¿Qué hago primero?" in result


def test_get_prompt_summarize():
    """get_prompt debe rutear correctamente al modo summarize."""
    result = get_prompt("summarize", "texto")
    assert "texto" in result


def test_get_prompt_tasks():
    """get_prompt debe rutear correctamente al modo tasks."""
    result = get_prompt("tasks", "texto con tareas")
    assert "texto con tareas" in result


def test_get_prompt_clean():
    """get_prompt debe rutear correctamente al modo clean."""
    result = get_prompt("clean", "notas")
    assert "notas" in result


def test_get_prompt_professional():
    """get_prompt debe rutear correctamente al modo professional."""
    result = get_prompt("professional", "mensaje")
    assert "mensaje" in result


def test_get_prompt_ask_with_question():
    """get_prompt con ask debe incluir la pregunta."""
    result = get_prompt("ask", "contexto", "mi pregunta")
    assert "contexto" in result
    assert "mi pregunta" in result
