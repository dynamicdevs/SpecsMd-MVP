import pytest

from src.prompts import (
    build_brief_prompt,
    build_compare_prompt,
    build_ideate_prompt,
    build_mvp_prompt,
    build_prompt,
)


def test_ideate_prompt_contains_required_sections() -> None:
    prompt = build_ideate_prompt("Una app local para ordenar ideas")

    assert "# Idea ordenada" in prompt
    assert "## Resumen" in prompt
    assert "## MVP recomendado" in prompt
    assert "Una app local para ordenar ideas" in prompt


def test_compare_prompt_contains_required_sections() -> None:
    prompt = build_compare_prompt("Idea A: una CLI. Idea B: una web.")

    assert "# Comparacion de ideas" in prompt
    assert "## Ideas detectadas" in prompt
    assert "## Idea recomendada" in prompt


def test_mvp_prompt_contains_required_sections() -> None:
    prompt = build_mvp_prompt("Una plataforma gigante")

    assert "# MVP recomendado" in prompt
    assert "## Funcionalidades esenciales" in prompt
    assert "## Funcionalidades que quedan fuera" in prompt


def test_brief_prompt_contains_required_sections() -> None:
    prompt = build_brief_prompt("Una app local")

    assert "# Brief tecnico inicial" in prompt
    assert "## Flujo principal" in prompt
    assert "## Modulos necesarios" in prompt


def test_build_prompt_rejects_unknown_mode() -> None:
    with pytest.raises(ValueError, match="Modo no soportado"):
        build_prompt("otro", "Idea")


def test_prompt_rejects_empty_text() -> None:
    with pytest.raises(ValueError, match="no puede estar vacio"):
        build_ideate_prompt("   ")
