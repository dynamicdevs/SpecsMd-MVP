---
id: backend-domain-model
title: Modelos de dominio (Friction, Initiative) y enums
intent: friccion-cero
complexity: medium
mode: confirm
status: pending
depends_on: [backend-scaffold]
created: 2026-06-25
---

# Work Item: Modelos de dominio (Friction, Initiative) y enums

## Description

Definir las entidades SQLModel `Friction` e `Initiative` con todos sus campos, y los enums de
dominio (Category, Status, Priority, AutomationPotential, Complexity, InitiativeStatus).

## Acceptance Criteria

- [ ] Entidad `Friction`: Id, Title, Description, Area, Category, Frequency, TimeLostMinutes, PeopleAffected, PainLevel, AutomationPotential, MonthlyHoursLost, EstimatedMonthlyCost, Priority, Status, CreatedAt, UpdatedAt.
- [ ] Entidad `Initiative`: Id, FrictionId, Title, ProposedSolution, ExpectedReductionPercent, Complexity, Priority, Status, CreatedAt, UpdatedAt.
- [ ] Enums con los valores en español indicados en el spec.
- [ ] Campos calculados (MonthlyHoursLost, EstimatedMonthlyCost, Priority) presentes y poblados por servicios.

## Technical Notes

Category/Status/Priority/AutomationPotential/Complexity como Enum(str). FrictionId FK a Friction.

## Dependencies

- backend-scaffold
