---
id: frontend-initiatives
title: Pantallas de iniciativas
intent: friccion-cero
complexity: medium
mode: confirm
status: pending
depends_on: [frontend-frictions]
created: 2026-06-25
---

# Work Item: Pantallas de iniciativas

## Description

Pantallas para listar, ver detalle, editar y eliminar iniciativas, y crear una iniciativa desde
una fricción.

## Acceptance Criteria

- [ ] /initiatives: tabla con Title, fricción asociada, Complexity, Status, ExpectedReductionPercent.
- [ ] /initiatives/:id: detalle + edición.
- [ ] Crear iniciativa desde la pantalla de detalle de una fricción.
- [ ] Eliminar con confirmación.
- [ ] Consume la API real.

## Technical Notes

Selects para Complexity y Status con los valores del backend.

## Dependencies

- frontend-frictions
