import argparse

import pytest

from app import get_input_text


def test_get_input_text_requires_text_or_file() -> None:
    args = argparse.Namespace(text=None, file=None)

    with pytest.raises(ValueError, match="--text o --file"):
        get_input_text(args)


def test_get_input_text_rejects_text_and_file_together() -> None:
    args = argparse.Namespace(text="Idea", file="idea.txt")

    with pytest.raises(ValueError, match="no ambas"):
        get_input_text(args)


def test_get_input_text_returns_stripped_text() -> None:
    args = argparse.Namespace(text="  Idea local  ", file=None)

    assert get_input_text(args) == "Idea local"
