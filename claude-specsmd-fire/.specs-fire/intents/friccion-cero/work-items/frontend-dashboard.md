---
id: frontend-dashboard
title: Pantalla dashboard
intent: friccion-cero
complexity: low
mode: autopilot
status: pending
depends_on: [frontend-initiatives]
created: 2026-06-25
---

# Work Item: Pantalla dashboard

## Description

Pantalla /dashboard que consume GET /api/dashboard y muestra las métricas en cards y tablas PrimeNG.

## Acceptance Criteria

- [ ] Cards: total fricciones, total horas mensuales perdidas, total costo mensual estimado.
- [ ] Tabla de fricciones por categoría y por prioridad.
- [ ] Tabla top 5 fricciones más costosas.
- [ ] Iniciativas por estado.
- [ ] Datos reales de la API.

## Technical Notes

p-card para cards; p-table para tablas. Charts opcionales.

## Dependencies

- frontend-initiatives
