---
id: initiative-api
title: Initiative CRUD API
intent: friccion-cero-mvp
complexity: low
mode: autopilot
status: pending
depends_on: [friction-api]
created: "2026-06-23T12:00:00Z"
---

# Work Item: Initiative CRUD API

## Description

Implementar el router de iniciativas. Una iniciativa se crea desde una fricción existente. CRUD básico con validación.

## Acceptance Criteria

- [ ] GET /api/v1/initiatives — lista todas
- [ ] GET /api/v1/initiatives/{id} — detalle
- [ ] GET /api/v1/frictions/{friction_id}/initiatives — por fricción
- [ ] POST /api/v1/initiatives — crear (friction_id requerido y debe existir)
- [ ] PUT /api/v1/initiatives/{id} — actualizar
- [ ] DELETE /api/v1/initiatives/{id} — eliminar
- [ ] Validación: friction_id debe existir, title required

## Technical Notes

Patrón idéntico al de fricciones pero más simple (sin campos calculados). Status: proposed, in_progress, completed, cancelled.

## Dependencies

- friction-api
