---
id: backend-tests
title: Backend Unit Tests
intent: friccion-cero-mvp
complexity: low
mode: autopilot
status: pending
depends_on: [friction-api, initiative-api, dashboard-api]
created: "2026-06-23T12:00:00Z"
---

# Work Item: Backend Unit Tests

## Description

Crear tests con pytest. Tests unitarios para servicios de cálculo/clasificación/priorización. Tests de integración con TestClient para endpoints principales.

## Acceptance Criteria

- [ ] Carpeta backend/tests/ con conftest.py (db in-memory, TestClient)
- [ ] Tests unitarios para calculation.py (horas y costo)
- [ ] Tests unitarios para classification.py (potencial de automatización)
- [ ] Tests unitarios para priority.py (prioridad alta/media/baja)
- [ ] Tests de integración: create friction, get frictions, create initiative
- [ ] Todos los tests pasan con pytest

## Technical Notes

Usar TestClient de FastAPI (httpx). SQLite in-memory para tests de integración. Naming: test_function_scenario_expected.

## Dependencies

- friction-api
- initiative-api
- dashboard-api
