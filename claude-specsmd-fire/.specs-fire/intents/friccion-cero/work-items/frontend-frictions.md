---
id: frontend-frictions
title: Pantallas de fricciones
intent: friccion-cero
complexity: medium
mode: confirm
status: pending
depends_on: [frontend-scaffold]
created: 2026-06-25
---

# Work Item: Pantallas de fricciones

## Description

Pantallas para listar, crear, ver detalle y editar fricciones usando PrimeNG y formularios reactivos.

## Acceptance Criteria

- [ ] /frictions: tabla PrimeNG con Title, Area, Category, Priority, MonthlyHoursLost, EstimatedMonthlyCost, Status y acciones.
- [ ] /frictions/new: formulario reactivo con todos los campos y selects para enums.
- [ ] /frictions/:id: detalle con impacto calculado y botón para convertir en iniciativa.
- [ ] /frictions/:id/edit: edición.
- [ ] Eliminar con confirmación.
- [ ] Consume la API real (sin mocks).

## Technical Notes

Campos calculados como solo lectura. Toasts con MessageService.

## Dependencies

- frontend-scaffold
