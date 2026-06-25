---
id: backend-dashboard
title: Endpoints de dashboard
intent: friccion-cero
complexity: low
mode: autopilot
status: pending
depends_on: [backend-initiatives-crud]
created: 2026-06-25
---

# Work Item: Endpoints de dashboard

## Description

Endpoint que devuelve métricas agregadas para el dashboard.

## Acceptance Criteria

- [ ] `GET /api/dashboard` devuelve: totalFrictions, totalMonthlyHoursLost, totalEstimatedMonthlyCost, frictionsByCategory, frictionsByPriority, top5CostlyFrictions, initiativesByStatus.
- [ ] Agregaciones correctas leyendo todas las fricciones e iniciativas.

## Technical Notes

Cálculos en un dashboard_service; respuesta tipada con schema.

## Dependencies

- backend-initiatives-crud
