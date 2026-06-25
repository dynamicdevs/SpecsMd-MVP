"""Priorización automática de fricciones según impacto y dolor."""
from app.models.enums import AutomationPotential, Priority

# Umbrales (ajustables) para clasificar el impacto.
HOURS_HIGH = 40.0      # horas mensuales perdidas consideradas "muchas"
HOURS_MEDIUM = 15.0
COST_HIGH = 1000.0     # costo mensual considerado "mucho"
COST_MEDIUM = 400.0
PAIN_HIGH = 4          # PainLevel (1-5) considerado alto


def determine_priority(
    monthly_hours_lost: float,
    estimated_monthly_cost: float,
    pain_level: int,
    automation_potential: AutomationPotential,
) -> Priority:
    """Determina la prioridad (Baja/Media/Alta/Crítica).

    Reglas:
    - Crítica: mucho costo o muchas horas Y dolor alto.
    - Alta: impacto importante (costo/horas altos) o potencial de automatización alto.
    - Media: impacto moderado.
    - Baja: impacto menor.
    """
    high_impact = monthly_hours_lost >= HOURS_HIGH or estimated_monthly_cost >= COST_HIGH
    medium_impact = monthly_hours_lost >= HOURS_MEDIUM or estimated_monthly_cost >= COST_MEDIUM
    high_pain = pain_level >= PAIN_HIGH
    high_automation = automation_potential == AutomationPotential.ALTO

    if high_impact and high_pain:
        return Priority.CRITICA
    if high_impact or high_automation:
        return Priority.ALTA
    if medium_impact:
        return Priority.MEDIA
    return Priority.BAJA
