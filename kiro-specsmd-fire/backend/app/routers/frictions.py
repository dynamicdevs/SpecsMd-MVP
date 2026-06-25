"""Frictions CRUD router."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.comment import FrictionComment
from app.models.friction import Friction
from app.schemas.friction import (
    CommentCreate,
    CommentResponse,
    FrictionCreate,
    FrictionResponse,
    FrictionUpdate,
)
from app.services.calculation import (
    calculate_estimated_monthly_cost,
    calculate_monthly_hours_lost,
)
from app.services.classification import determine_automation_potential
from app.services.priority import calculate_priority

router = APIRouter(prefix="/api/v1/frictions", tags=["Frictions"])


def _apply_calculations(friction: Friction) -> None:
    """Apply all calculated fields to a friction instance."""
    friction.monthly_hours_lost = calculate_monthly_hours_lost(
        friction.time_lost_minutes, friction.frequency, friction.people_affected
    )
    friction.estimated_monthly_cost = calculate_estimated_monthly_cost(
        friction.monthly_hours_lost
    )
    friction.automation_potential = determine_automation_potential(
        friction.category
    ).value
    friction.priority = calculate_priority(
        friction.estimated_monthly_cost,
        friction.monthly_hours_lost,
        friction.pain_level,
    ).value


@router.get("", response_model=list[FrictionResponse])
def list_frictions(db: Session = Depends(get_db)):
    """List all frictions."""
    return db.query(Friction).order_by(Friction.created_at.desc()).all()


@router.get("/{friction_id}", response_model=FrictionResponse)
def get_friction(friction_id: int, db: Session = Depends(get_db)):
    """Get a friction by ID."""
    friction = db.query(Friction).filter(Friction.id == friction_id).first()
    if not friction:
        raise HTTPException(status_code=404, detail="Friction not found")
    return friction


@router.post("", response_model=FrictionResponse, status_code=201)
def create_friction(data: FrictionCreate, db: Session = Depends(get_db)):
    """Create a new friction with auto-calculated fields."""
    friction = Friction(**data.model_dump())
    _apply_calculations(friction)
    db.add(friction)
    db.commit()
    db.refresh(friction)
    return friction


@router.put("/{friction_id}", response_model=FrictionResponse)
def update_friction(
    friction_id: int, data: FrictionUpdate, db: Session = Depends(get_db)
):
    """Update a friction. Recalculates derived fields."""
    friction = db.query(Friction).filter(Friction.id == friction_id).first()
    if not friction:
        raise HTTPException(status_code=404, detail="Friction not found")

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(friction, field, value)

    _apply_calculations(friction)
    db.commit()
    db.refresh(friction)
    return friction


@router.delete("/{friction_id}", status_code=204)
def delete_friction(friction_id: int, db: Session = Depends(get_db)):
    """Delete a friction."""
    friction = db.query(Friction).filter(Friction.id == friction_id).first()
    if not friction:
        raise HTTPException(status_code=404, detail="Friction not found")
    db.delete(friction)
    db.commit()


# --- Initiatives sub-resource ---


@router.get("/{friction_id}/initiatives")
def list_friction_initiatives(friction_id: int, db: Session = Depends(get_db)):
    """List initiatives for a specific friction."""
    from app.models.initiative import Initiative
    from app.schemas.initiative import InitiativeResponse as InitResp

    friction = db.query(Friction).filter(Friction.id == friction_id).first()
    if not friction:
        raise HTTPException(status_code=404, detail="Friction not found")
    initiatives = (
        db.query(Initiative)
        .filter(Initiative.friction_id == friction_id)
        .order_by(Initiative.created_at.desc())
        .all()
    )
    return [InitResp.model_validate(i) for i in initiatives]


# --- Comments sub-resource ---


@router.get("/{friction_id}/comments", response_model=list[CommentResponse])
def list_comments(friction_id: int, db: Session = Depends(get_db)):
    """List comments for a friction."""
    friction = db.query(Friction).filter(Friction.id == friction_id).first()
    if not friction:
        raise HTTPException(status_code=404, detail="Friction not found")
    return (
        db.query(FrictionComment)
        .filter(FrictionComment.friction_id == friction_id)
        .order_by(FrictionComment.created_at.desc())
        .all()
    )


@router.post(
    "/{friction_id}/comments", response_model=CommentResponse, status_code=201
)
def create_comment(
    friction_id: int, data: CommentCreate, db: Session = Depends(get_db)
):
    """Add a comment to a friction."""
    friction = db.query(Friction).filter(Friction.id == friction_id).first()
    if not friction:
        raise HTTPException(status_code=404, detail="Friction not found")

    comment = FrictionComment(friction_id=friction_id, comment=data.comment)
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment
