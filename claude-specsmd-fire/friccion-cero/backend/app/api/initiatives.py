"""Endpoints REST de iniciativas."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from app.core.database import get_session
from app.schemas.initiative import (
    InitiativeCreate,
    InitiativeRead,
    InitiativeUpdate,
)
from app.services.initiative_service import (
    FrictionNotFoundError,
    InitiativeService,
)

router = APIRouter(prefix="/api/initiatives", tags=["initiatives"])


def get_service(session: Session = Depends(get_session)) -> InitiativeService:
    return InitiativeService(session)


@router.get("", response_model=list[InitiativeRead], summary="Listar iniciativas")
def list_initiatives(
    service: InitiativeService = Depends(get_service),
) -> list[InitiativeRead]:
    return [InitiativeRead.model_validate(i) for i in service.list()]


@router.get("/{initiative_id}", response_model=InitiativeRead, summary="Ver detalle")
def get_initiative(
    initiative_id: int, service: InitiativeService = Depends(get_service)
) -> InitiativeRead:
    initiative = service.get(initiative_id)
    if initiative is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Iniciativa no encontrada")
    return InitiativeRead.model_validate(initiative)


@router.post(
    "",
    response_model=InitiativeRead,
    status_code=status.HTTP_201_CREATED,
    summary="Crear iniciativa (desde una fricción)",
)
def create_initiative(
    payload: InitiativeCreate, service: InitiativeService = Depends(get_service)
) -> InitiativeRead:
    try:
        return InitiativeRead.model_validate(service.create(payload))
    except FrictionNotFoundError:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND, detail="Fricción asociada no encontrada"
        )


@router.put("/{initiative_id}", response_model=InitiativeRead, summary="Editar iniciativa")
def update_initiative(
    initiative_id: int,
    payload: InitiativeUpdate,
    service: InitiativeService = Depends(get_service),
) -> InitiativeRead:
    initiative = service.update(initiative_id, payload)
    if initiative is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Iniciativa no encontrada")
    return InitiativeRead.model_validate(initiative)


@router.delete(
    "/{initiative_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Eliminar iniciativa",
)
def delete_initiative(
    initiative_id: int, service: InitiativeService = Depends(get_service)
) -> None:
    if not service.delete(initiative_id):
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Iniciativa no encontrada")
