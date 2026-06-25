"""Endpoints REST de fricciones."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from app.core.database import get_session
from app.schemas.friction import (
    ClassifyRequest,
    ClassifyResponse,
    FrictionCreate,
    FrictionRead,
    FrictionUpdate,
)
from app.services import classification_service
from app.services.friction_service import FrictionService

router = APIRouter(prefix="/api/frictions", tags=["frictions"])


def get_service(session: Session = Depends(get_session)) -> FrictionService:
    return FrictionService(session)


@router.post("/classify", response_model=ClassifyResponse, summary="Sugerir categoría por texto")
def classify(payload: ClassifyRequest) -> ClassifyResponse:
    return ClassifyResponse(category=classification_service.suggest_category(payload.text))


@router.get("", response_model=list[FrictionRead], summary="Listar fricciones")
def list_frictions(service: FrictionService = Depends(get_service)) -> list[FrictionRead]:
    return [FrictionRead.model_validate(f) for f in service.list()]


@router.get("/{friction_id}", response_model=FrictionRead, summary="Ver detalle de fricción")
def get_friction(
    friction_id: int, service: FrictionService = Depends(get_service)
) -> FrictionRead:
    friction = service.get(friction_id)
    if friction is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Fricción no encontrada")
    return FrictionRead.model_validate(friction)


@router.post(
    "",
    response_model=FrictionRead,
    status_code=status.HTTP_201_CREATED,
    summary="Crear fricción (calcula impacto, prioridad y sugiere categoría)",
)
def create_friction(
    payload: FrictionCreate, service: FrictionService = Depends(get_service)
) -> FrictionRead:
    return FrictionRead.model_validate(service.create(payload))


@router.put("/{friction_id}", response_model=FrictionRead, summary="Editar fricción")
def update_friction(
    friction_id: int,
    payload: FrictionUpdate,
    service: FrictionService = Depends(get_service),
) -> FrictionRead:
    friction = service.update(friction_id, payload)
    if friction is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Fricción no encontrada")
    return FrictionRead.model_validate(friction)


@router.delete(
    "/{friction_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Eliminar fricción",
)
def delete_friction(
    friction_id: int, service: FrictionService = Depends(get_service)
) -> None:
    if not service.delete(friction_id):
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Fricción no encontrada")
