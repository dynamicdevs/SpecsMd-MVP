"""Calculation services — hours lost and cost estimation."""

from app.config import settings


def calculate_monthly_hours_lost(
    time_lost_minutes: int,
    frequency: int,
    people_affected: int,
) -> float:
    """
    Calculate monthly hours lost.

    Formula: (minutes × frequency × people) / 60
    """
    return (time_lost_minutes * frequency * people_affected) / 60.0


def calculate_estimated_monthly_cost(monthly_hours_lost: float) -> float:
    """
    Calculate estimated monthly cost.

    Formula: monthly_hours × hourly_rate (from config)
    """
    return monthly_hours_lost * settings.hourly_rate
