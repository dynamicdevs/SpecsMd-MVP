---
id: dashboard-api
title: Dashboard Metrics API
intent: friccion-cero-mvp
complexity: low
mode: autopilot
status: pending
depends_on: [friction-api, initiative-api]
created: "2026-06-23T12:00:00Z"
---

# Work Item: Dashboard Metrics API

## Description

Endpoint que retorna métricas agregadas para el dashboard: total de fricciones, horas totales perdidas, costo total, distribución por categoría, ranking de fricciones más costosas, total de iniciativas por estado.

## Acceptance Criteria

- [ ] GET /api/v1/dashboard — retorna métricas completas
- [ ] Métricas incluyen: totalFrictions, totalMonthlyHoursLost, totalEstimatedMonthlyCost
- [ ] Distribución por categoría (count per category)
- [ ] Top 5 fricciones más costosas (ranking)
- [ ] Distribución por prioridad (high/medium/low count)
- [ ] Total de iniciativas por estado (proposed/inProgress/completed/cancelled)
- [ ] Response con DTO específico (DashboardDto)

## Technical Notes

Query directo con LINQ sobre el DbContext. No necesita repositorio dedicado — puede ser un DashboardService que consulta FrictionRepository.

## Dependencies

- friction-api
- initiative-api
