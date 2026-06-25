"""Initiatives CRUD router."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.friction import Friction
from app.models.initiative import Initiative
from app.schemas.initiative import (
    InitiativeCreate,
    InitiativeResponse,
    InitiativeUpdate,
)

router = APIRouter(prefix="/api/v1/initiatives", tags=["Initiatives"])


@router.get("", response_model=list[InitiativeResponse])
def list_initiatives(db: Session = Depends(get_db)):
    """List all initiatives."""
    return db.query(Initiative).order_by(Initiative.created_at.desc()).all()


@router.get("/{initiative_id}", response_model=InitiativeResponse)
def get_initiative(initiative_id: int, db: Session = Depends(get_db)):
    """Get an initiative by ID."""
    initiative = db.query(Initiative).filter(Initiative.id == initiative_id).first()
    if not initiative:
        raise HTTPException(status_code=404, detail="Initiative not found")
    return initiative


@router.post("", response_model=InitiativeResponse, status_code=201)
def create_initiative(data: InitiativeCreate, db: Session = Depends(get_db)):
    """Create a new initiative (must reference an existing friction)."""
    # Verify friction exists
    friction = db.query(Friction).filter(Friction.id == data.friction_id).first()
    if not friction:
        raise HTTPException(status_code=404, detail="Referenced friction not found")

    initiative = Initiative(**data.model_dump())
    db.add(initiative)
    db.commit()
    db.refresh(initiative)
    return initiative


@router.put("/{initiative_id}", response_model=InitiativeResponse)
def update_initiative(
    initiative_id: int, data: InitiativeUpdate, db: Session = Depends(get_db)
):
    """Update an initiative."""
    initiative = db.query(Initiative).filter(Initiative.id == initiative_id).first()
    if not initiative:
        raise HTTPException(status_code=404, detail="Initiative not found")

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(initiative, field, value)

    db.commit()
    db.refresh(initiative)
    return initiative


@router.delete("/{initiative_id}", status_code=204)
def delete_initiative(initiative_id: int, db: Session = Depends(get_db)):
    """Delete an initiative."""
    initiative = db.query(Initiative).filter(Initiative.id == initiative_id).first()
    if not initiative:
        raise HTTPException(status_code=404, detail="Initiative not found")
    db.delete(initiative)
    db.commit()
