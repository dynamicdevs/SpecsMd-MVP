"""Priority service — automatic priority calculation."""

from app.config import settings
from app.models.enums import Priority


def calculate_priority(
    estimated_monthly_cost: float,
    monthly_hours_lost: float,
    pain_level: int,
) -> Priority:
    """
    Calculate priority based on cost, hours, and pain level.

    High if: cost > threshold OR hours > threshold OR pain_level >= 4
    Low if: cost < threshold/4 AND hours < threshold/4 AND pain_level <= 2
    Medium otherwise.
    """
    cost_threshold = settings.high_cost_threshold
    hours_threshold = settings.high_hours_threshold

    # High priority
    if (
        estimated_monthly_cost > cost_threshold
        or monthly_hours_lost > hours_threshold
        or pain_level >= 4
    ):
        return Priority.HIGH

    # Low priority
    if (
        estimated_monthly_cost < cost_threshold / 4
        and monthly_hours_lost < hours_threshold / 4
        and pain_level <= 2
    ):
        return Priority.LOW

    return Priority.MEDIUM
