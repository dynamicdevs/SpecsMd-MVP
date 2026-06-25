---
id: backend-seed-swagger
title: Seed inicial + Swagger + CORS + config
intent: friccion-cero
complexity: low
mode: autopilot
status: pending
depends_on: [backend-dashboard]
created: 2026-06-25
---

# Work Item: Seed, Swagger, CORS y configuración

## Description

Sembrar fricciones de ejemplo al iniciar (si la DB está vacía), confirmar Swagger y CORS, y exponer
la configuración del valor hora.

## Acceptance Criteria

- [ ] Seed opcional con 4-6 fricciones de ejemplo variadas (categorías y prioridades distintas).
- [ ] CORS permite el origen del frontend (http://localhost:4200).
- [ ] Swagger en /docs lista todos los endpoints.
- [ ] HourlyRate configurable por variable de entorno con valor por defecto.

## Technical Notes

El seed corre solo si la tabla Friction está vacía.

## Dependencies

- backend-dashboard
