"""Seed inicial: crea fricciones de ejemplo si la DB está vacía."""
from sqlmodel import Session

from app.models.enums import AutomationPotential, FrictionStatus
from app.repositories.friction_repository import FrictionRepository
from app.schemas.friction import FrictionCreate
from app.services.friction_service import FrictionService

_SAMPLES: list[FrictionCreate] = [
    FrictionCreate(
        title="Copiar datos de Excel al ERP manualmente",
        description="El equipo copia pedidos desde una planilla Excel al sistema cada día.",
        area="Operaciones",
        frequency=20,
        time_lost_minutes=30,
        people_affected=3,
        pain_level=4,
        automation_potential=AutomationPotential.ALTO,
        status=FrictionStatus.DETECTADA,
    ),
    FrictionCreate(
        title="Esperar aprobación de gastos por correo",
        description="Las aprobaciones se piden por correo y demoran días.",
        area="Finanzas",
        frequency=15,
        time_lost_minutes=20,
        people_affected=2,
        pain_level=3,
        automation_potential=AutomationPotential.MEDIO,
        status=FrictionStatus.ANALIZADA,
    ),
    FrictionCreate(
        title="Reunión semanal sin decisiones",
        description="Reunión de status que no produce decisiones claras.",
        area="Producto",
        frequency=4,
        time_lost_minutes=60,
        people_affected=6,
        pain_level=2,
        automation_potential=AutomationPotential.BAJO,
        status=FrictionStatus.DETECTADA,
    ),
    FrictionCreate(
        title="Buscar información dispersa en documentos",
        description="El equipo pierde tiempo buscando documentos en distintos drives.",
        area="Soporte",
        frequency=40,
        time_lost_minutes=10,
        people_affected=4,
        pain_level=3,
        automation_potential=AutomationPotential.MEDIO,
        status=FrictionStatus.PRIORIZADA,
    ),
    FrictionCreate(
        title="Falta de integración entre CRM y facturación",
        description="Doble ingreso de datos entre el sistema CRM y el de facturación.",
        area="Ventas",
        frequency=25,
        time_lost_minutes=25,
        people_affected=2,
        pain_level=5,
        automation_potential=AutomationPotential.ALTO,
        status=FrictionStatus.ANALIZADA,
    ),
]


def seed_if_empty(session: Session) -> int:
    """Inserta fricciones de ejemplo solo si no hay ninguna. Devuelve cuántas creó."""
    repo = FrictionRepository(session)
    if repo.count() > 0:
        return 0

    service = FrictionService(session)
    for sample in _SAMPLES:
        service.create(sample)
    return len(_SAMPLES)
