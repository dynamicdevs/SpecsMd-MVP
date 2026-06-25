---
id: domain-entities
title: Domain Models & Database Setup
intent: friccion-cero-mvp
complexity: medium
mode: confirm
status: pending
depends_on: [backend-scaffold]
created: "2026-06-23T12:00:00Z"
---

# Work Item: Domain Models & Database Setup

## Description

Definir los modelos SQLAlchemy (Friction, Initiative, FrictionComment) y los schemas Pydantic (create, update, response). Configurar Alembic para migrations. Generar migration inicial y verificar que la DB se crea.

## Acceptance Criteria

- [ ] Modelo Friction con todos los campos (id, title, description, area, category, frequency, time_lost_minutes, people_affected, pain_level, automation_potential, monthly_hours_lost, estimated_monthly_cost, priority, status, created_at, updated_at)
- [ ] Modelo Initiative con campos (id, friction_id, title, proposed_solution, expected_reduction_percent, complexity, priority, status, created_at, updated_at)
- [ ] Modelo FrictionComment con campos (id, friction_id, comment, created_at)
- [ ] Schemas Pydantic: FrictionCreate, FrictionUpdate, FrictionResponse, InitiativeCreate, InitiativeUpdate, InitiativeResponse
- [ ] Enums Python para: Category, Priority, Status, Complexity, PainLevel, AutomationPotential
- [ ] Alembic configurado, migration inicial generada
- [ ] DB se crea correctamente al correr la app

## Technical Notes

Enums como Python str enums para serialización JSON limpia. Timestamps con datetime (UTC). Relaciones: Friction has_many Initiatives, Friction has_many Comments.

## Dependencies

- backend-scaffold
