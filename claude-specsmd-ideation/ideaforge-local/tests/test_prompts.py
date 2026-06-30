import pytest

from src.prompts import (
    PROMPT_BUILDERS,
    build_brief_prompt,
    build_compare_prompt,
    build_ideate_prompt,
    build_mvp_prompt,
)

IDEA = "Una app local para ordenar ideas con IA"


def test_prompt_builders_map_has_four_modes():
    assert set(PROMPT_BUILDERS) == {"ideate", "compare", "mvp", "brief"}


def test_ideate_prompt_includes_text_and_template():
    prompt = build_ideate_prompt(IDEA, "es")
    assert IDEA in prompt
    assert "# Idea ordenada" in prompt
    assert "## MVP recomendado" in prompt


def test_compare_prompt_includes_template():
    prompt = build_compare_prompt(IDEA, "es")
    assert "# Comparación de ideas" in prompt
    assert "## Idea recomendada" in prompt


def test_mvp_prompt_includes_template():
    prompt = build_mvp_prompt(IDEA, "es")
    assert "# MVP recomendado" in prompt
    assert "## Funcionalidades esenciales" in prompt


def test_brief_prompt_includes_template():
    prompt = build_brief_prompt(IDEA, "es")
    assert "# Brief técnico inicial" in prompt
    assert "## Módulos necesarios" in prompt


def test_prompt_respects_language_es():
    prompt = build_ideate_prompt(IDEA, "es")
    assert "español" in prompt.lower()


def test_prompt_respects_language_en():
    prompt = build_ideate_prompt(IDEA, "en")
    assert "inglés" in prompt.lower()


@pytest.mark.parametrize("builder", list(PROMPT_BUILDERS.values()))
def test_all_builders_embed_user_text(builder):
    prompt = builder(IDEA, "es")
    assert IDEA in prompt
