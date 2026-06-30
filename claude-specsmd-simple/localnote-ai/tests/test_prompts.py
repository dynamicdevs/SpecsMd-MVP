"""Tests para src.prompts (lógica pura, sin Ollama)."""

import pytest

from src.prompts import MODES, build_messages


SAMPLE = "Esta es una nota de ejemplo con varias ideas y pendientes."


@pytest.mark.parametrize("mode", ["summarize", "tasks", "clean", "professional"])
def test_build_messages_includes_text(mode):
    messages = build_messages(mode, SAMPLE)
    assert isinstance(messages, list)
    assert len(messages) == 1
    assert messages[0]["role"] == "user"
    assert SAMPLE in messages[0]["content"]


def test_ask_includes_text_and_question():
    question = "¿Qué debo hacer primero?"
    messages = build_messages("ask", SAMPLE, question)
    content = messages[0]["content"]
    assert SAMPLE in content
    assert question in content


def test_ask_without_question_raises():
    with pytest.raises(ValueError):
        build_messages("ask", SAMPLE)


def test_ask_with_blank_question_raises():
    with pytest.raises(ValueError):
        build_messages("ask", SAMPLE, "   ")


def test_invalid_mode_raises():
    with pytest.raises(ValueError):
        build_messages("translate", SAMPLE)


def test_empty_text_raises():
    with pytest.raises(ValueError):
        build_messages("summarize", "   ")


def test_all_modes_are_supported():
    assert set(MODES) == {"summarize", "tasks", "clean", "professional", "ask"}
