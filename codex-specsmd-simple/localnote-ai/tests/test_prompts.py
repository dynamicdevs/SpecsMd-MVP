from __future__ import annotations

from src.prompts import (
    ask_prompt,
    clean_prompt,
    professional_prompt,
    summarize_prompt,
    tasks_prompt,
)


def test_summarize_prompt_contains_text_and_intent():
    prompt = summarize_prompt("Texto largo de prueba.")

    assert "Resume" in prompt
    assert "Texto largo de prueba." in prompt


def test_tasks_prompt_contains_text_and_intent():
    prompt = tasks_prompt("Juan debe llamar a Ana.")

    assert "tareas pendientes" in prompt
    assert "Juan debe llamar a Ana." in prompt


def test_clean_prompt_contains_text_and_intent():
    prompt = clean_prompt("idea 1; idea 2; pendiente")

    assert "notas desordenadas" in prompt
    assert "idea 1; idea 2; pendiente" in prompt


def test_professional_prompt_contains_text_and_intent():
    prompt = professional_prompt("dile que vamos tarde")

    assert "respuesta profesional" in prompt
    assert "dile que vamos tarde" in prompt


def test_ask_prompt_contains_text_question_and_intent():
    prompt = ask_prompt("Primero instalar Ollama.", "Que debo hacer primero?")

    assert "contexto" in prompt.lower()
    assert "Primero instalar Ollama." in prompt
    assert "Que debo hacer primero?" in prompt
