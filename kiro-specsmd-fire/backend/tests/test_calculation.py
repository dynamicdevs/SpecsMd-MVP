"""Tests for calculation service."""

from app.services.calculation import (
    calculate_estimated_monthly_cost,
    calculate_monthly_hours_lost,
)


def test_calculate_monthly_hours_basic():
    """120 min * 4 freq * 3 people / 60 = 24 hours."""
    result = calculate_monthly_hours_lost(120, 4, 3)
    assert result == 24.0


def test_calculate_monthly_hours_single_person():
    """30 min * 20 freq * 1 person / 60 = 10 hours."""
    result = calculate_monthly_hours_lost(30, 20, 1)
    assert result == 10.0


def test_calculate_monthly_hours_minimal():
    """5 min * 1 freq * 1 person / 60 = 0.083 hours."""
    result = calculate_monthly_hours_lost(5, 1, 1)
    assert abs(result - 5 / 60) < 0.001


def test_calculate_cost_basic():
    """24 hours * 25.0 rate = 600.0."""
    result = calculate_estimated_monthly_cost(24.0)
    assert result == 600.0


def test_calculate_cost_zero_hours():
    """0 hours = $0."""
    result = calculate_estimated_monthly_cost(0.0)
    assert result == 0.0
