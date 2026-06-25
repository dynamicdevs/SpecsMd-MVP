---
id: friction-api
title: Friction CRUD API
intent: friccion-cero-mvp
complexity: medium
mode: confirm
status: pending
depends_on: [calculation-services]
created: "2026-06-23T12:00:00Z"
---

# Work Item: Friction CRUD API

## Description

Implementar el router de fricciones con endpoints CRUD completos. Los campos calculados (monthly_hours_lost, estimated_monthly_cost, automation_potential, priority) se generan automáticamente al crear/actualizar.

## Acceptance Criteria

- [ ] GET /api/v1/frictions — lista todas las fricciones
- [ ] GET /api/v1/frictions/{id} — detalle de una fricción (404 si no existe)
- [ ] POST /api/v1/frictions — crear fricción (campos calculados automáticos)
- [ ] PUT /api/v1/frictions/{id} — actualizar fricción (recalcula campos)
- [ ] DELETE /api/v1/frictions/{id} — eliminar fricción
- [ ] POST /api/v1/frictions/{id}/comments — agregar comentario
- [ ] GET /api/v1/frictions/{id}/comments — listar comentarios
- [ ] Validación automática via Pydantic (title required, time > 0, etc.)
- [ ] Responses con schemas Pydantic (no modelos directamente)
- [ ] Dependency injection de db session via Depends()

## Technical Notes

Al crear/actualizar, invocar services de cálculo para generar campos calculados antes de persistir. Usar SQLAlchemy session directamente (sin repositorio separado para MVP).

## Dependencies

- calculation-services
