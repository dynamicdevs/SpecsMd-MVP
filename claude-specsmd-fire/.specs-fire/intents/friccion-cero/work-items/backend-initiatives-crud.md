---
id: backend-initiatives-crud
title: CRUD de iniciativas + crear desde fricción
intent: friccion-cero
complexity: medium
mode: confirm
status: pending
depends_on: [backend-frictions-crud]
created: 2026-06-25
---

# Work Item: CRUD de iniciativas

## Description

Repositorio, servicio y router para iniciativas, incluyendo crear una iniciativa a partir de una
fricción existente.

## Acceptance Criteria

- [ ] `POST /api/initiatives` con FrictionId (crear desde fricción).
- [ ] `GET /api/initiatives` (listar), `GET /api/initiatives/{id}` (detalle).
- [ ] `PUT /api/initiatives/{id}` (editar), `DELETE /api/initiatives/{id}`.
- [ ] Enums Complexity (Baja/Media/Alta) y Status (Propuesta/En evaluación/En desarrollo/Implementada/Descartada).
- [ ] 404 si la fricción o la iniciativa no existe.

## Technical Notes

ExpectedReductionPercent entre 0 y 100. Priority puede derivar de la fricción.

## Dependencies

- backend-frictions-crud
