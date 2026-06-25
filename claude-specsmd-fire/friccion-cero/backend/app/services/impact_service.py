"""Cálculo automático de impacto de una fricción."""
from app.core.config import settings


def calculate_monthly_hours_lost(
    time_lost_minutes: int, frequency: int, people_affected: int
) -> float:
    """Horas mensuales perdidas.

    MonthlyHoursLost = TimeLostMinutes * Frequency * PeopleAffected / 60
    """
    return round(time_lost_minutes * frequency * people_affected / 60, 2)


def calculate_estimated_monthly_cost(
    monthly_hours_lost: float, hourly_rate: float | None = None
) -> float:
    """Costo mensual estimado.

    EstimatedMonthlyCost = MonthlyHoursLost * HourlyRate

    El valor hora es configurable; si no se pasa, se usa el de la configuración.
    """
    rate = settings.hourly_rate if hourly_rate is None else hourly_rate
    return round(monthly_hours_lost * rate, 2)
