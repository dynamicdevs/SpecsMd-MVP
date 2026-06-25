"""Tests de la lógica de negocio: impacto, clasificación y priorización."""
from app.models.enums import AutomationPotential, Category, Priority
from app.services import (
    classification_service,
    impact_service,
    prioritization_service,
)


# --- Impacto ---------------------------------------------------------------

def test_monthly_hours_basic_calculation():
    # 30 min * 20 veces * 3 personas / 60 = 30 horas
    assert impact_service.calculate_monthly_hours_lost(30, 20, 3) == 30.0


def test_monthly_cost_uses_rate():
    assert impact_service.calculate_estimated_monthly_cost(30.0, hourly_rate=20.0) == 600.0


# --- Clasificación ---------------------------------------------------------

def test_classify_excel_returns_trabajo_manual():
    assert (
        classification_service.suggest_category("Copiar datos de Excel manualmente")
        == Category.TRABAJO_MANUAL
    )


def test_classify_aprobacion_returns_aprobaciones():
    assert (
        classification_service.suggest_category("Esperar la aprobación por correo")
        == Category.APROBACIONES
    )


def test_classify_reunion_returns_reuniones():
    assert (
        classification_service.suggest_category("Reunión semanal de status")
        == Category.REUNIONES
    )


def test_classify_buscar_returns_busqueda():
    assert (
        classification_service.suggest_category("Buscar información en documentos")
        == Category.BUSQUEDA_INFO
    )


def test_classify_integracion_returns_falta_integracion():
    assert (
        classification_service.suggest_category("Doble ingreso entre sistemas sin integración")
        == Category.FALTA_INTEGRACION
    )


def test_classify_unknown_returns_otro():
    assert classification_service.suggest_category("algo no clasificable") == Category.OTRO


# --- Priorización ----------------------------------------------------------

def test_priority_critica_high_impact_high_pain():
    assert (
        prioritization_service.determine_priority(
            monthly_hours_lost=50, estimated_monthly_cost=1500,
            pain_level=5, automation_potential=AutomationPotential.ALTO,
        )
        == Priority.CRITICA
    )


def test_priority_alta_high_automation():
    assert (
        prioritization_service.determine_priority(
            monthly_hours_lost=5, estimated_monthly_cost=100,
            pain_level=2, automation_potential=AutomationPotential.ALTO,
        )
        == Priority.ALTA
    )


def test_priority_media_moderate_impact():
    assert (
        prioritization_service.determine_priority(
            monthly_hours_lost=20, estimated_monthly_cost=500,
            pain_level=2, automation_potential=AutomationPotential.BAJO,
        )
        == Priority.MEDIA
    )


def test_priority_baja_low_impact():
    assert (
        prioritization_service.determine_priority(
            monthly_hours_lost=2, estimated_monthly_cost=40,
            pain_level=1, automation_potential=AutomationPotential.BAJO,
        )
        == Priority.BAJA
    )
