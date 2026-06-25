---
id: backend-frictions-crud
title: CRUD de fricciones
intent: friccion-cero
complexity: medium
mode: confirm
status: pending
depends_on: [backend-impact-classification-priority]
created: 2026-06-25
---

# Work Item: CRUD de fricciones

## Description

Repositorio, servicio y router REST para fricciones. Al crear/editar se recalculan impacto y
prioridad y, si no se envía Category, se sugiere por reglas.

## Acceptance Criteria

- [ ] `GET /api/frictions` (listar), `GET /api/frictions/{id}` (detalle).
- [ ] `POST /api/frictions` (crear) con recálculo de MonthlyHoursLost, EstimatedMonthlyCost, Priority y sugerencia de Category.
- [ ] `PUT /api/frictions/{id}` (editar) con recálculo.
- [ ] `DELETE /api/frictions/{id}`.
- [ ] Schemas de entrada/salida (camelCase en JSON). 404 si no existe.
- [ ] Endpoint auxiliar de clasificación: `POST /api/frictions/classify`.

## Technical Notes

CreatedAt/UpdatedAt gestionados por el servicio. Validaciones básicas (requeridos, números >= 0).

## Dependencies

- backend-impact-classification-priority
