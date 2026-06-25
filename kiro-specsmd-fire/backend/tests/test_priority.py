"""Tests for priority service."""

from app.models.enums import Priority
from app.services.priority import calculate_priority


def test_high_cost_returns_high():
    """Cost > 500 → high priority."""
    result = calculate_priority(600.0, 10.0, 3)
    assert result == Priority.HIGH


def test_high_hours_returns_high():
    """Hours > 20 → high priority."""
    result = calculate_priority(100.0, 25.0, 3)
    assert result == Priority.HIGH


def test_high_pain_returns_high():
    """Pain >= 4 → high priority."""
    result = calculate_priority(100.0, 5.0, 4)
    assert result == Priority.HIGH


def test_pain_5_returns_high():
    """Pain = 5 → high priority."""
    result = calculate_priority(50.0, 2.0, 5)
    assert result == Priority.HIGH


def test_low_everything_returns_low():
    """Low cost, low hours, low pain → low priority."""
    result = calculate_priority(50.0, 3.0, 2)
    assert result == Priority.LOW


def test_medium_values_returns_medium():
    """Medium values → medium priority."""
    result = calculate_priority(200.0, 10.0, 3)
    assert result == Priority.MEDIUM
