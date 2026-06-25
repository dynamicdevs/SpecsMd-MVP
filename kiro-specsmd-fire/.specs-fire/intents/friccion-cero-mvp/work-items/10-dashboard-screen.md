---
id: dashboard-screen
title: Dashboard Screen
intent: friccion-cero-mvp
complexity: medium
mode: confirm
status: pending
depends_on: [frontend-scaffold, dashboard-api]
created: "2026-06-23T12:00:00Z"
---

# Work Item: Dashboard Screen

## Description

Implementar la pantalla de dashboard con métricas generales, gráficos de distribución y ranking de fricciones más costosas usando PrimeNG Charts y componentes de datos.

## Acceptance Criteria

- [ ] DashboardService en Angular consumiendo GET /api/v1/dashboard
- [ ] Cards con métricas principales: total fricciones, horas mensuales perdidas, costo mensual total
- [ ] Chart de distribución por categoría (PrimeNG Chart - pie o bar)
- [ ] Chart de distribución por prioridad (donut)
- [ ] Tabla ranking top 5 fricciones más costosas (con link al detalle)
- [ ] Resumen de iniciativas por estado
- [ ] Responsive layout con PrimeNG Grid

## Technical Notes

Usar PrimeNG Chart component (wrapper de Chart.js). Cards con PrimeNG Card component. Grid con PrimeNG responsive utilities.

## Dependencies

- frontend-scaffold
- dashboard-api
